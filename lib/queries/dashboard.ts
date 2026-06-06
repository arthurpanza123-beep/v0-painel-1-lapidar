/**
 * lib/queries/dashboard.ts
 *
 * Camada de dados read-only para o Dashboard.
 *
 * COMPORTAMENTO:
 *   - Se NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY estiverem
 *     configuradas → tenta buscar dados reais.
 *   - Caso contrário (ou se a query falhar) → usa os mocks de lib/mock-data.ts.
 *   - NUNCA faz mutations, nunca chama API externa, nunca gera teste.
 *
 * SEGURANÇA:
 *   - Este arquivo pode ser importado em Server Components.
 *   - Não expor no client-side queries que usem service role.
 *
 * MIGRAÇÃO FUTURA:
 *   1. Criar views agregadas para reduzir queries.
 *   2. Remover o fallback de mock depois de validar staging/produção.
 */

import type { DashboardMetrics } from '@/lib/supabase/types'
import { operationWindows, isOperationalNoise } from '@/lib/services/operational-window'
import { getSupabaseServerClient, isSupabaseServerConfigured } from '@/lib/supabase/server'
import {
  MOCK_TESTES,
  MOCK_CLIENTES,
  MOCK_PIPELINE,
  MOCK_CREDITOS,
  calcularMetricasFinanceiro,
  calcularMetricasPipeline,
} from '@/lib/mock-data'

// ─── Fallback: monta DashboardMetrics a partir dos mocks ────────────────────

function getDashboardFromMock(): DashboardMetrics {
  const fin  = calcularMetricasFinanceiro()
  const pipe = calcularMetricasPipeline()

  const leadsHoje = MOCK_PIPELINE.filter(l => l.etapa === 'novo_lead' || l.etapa === 'contato').length
  const ativacoesHoje = MOCK_PIPELINE.filter(l => l.etapa === 'ativado').length

  return {
    // KPIs — MOCK
    active_tests:       MOCK_TESTES.filter(t => t.status === 'ativo').length,
    total_tests:        MOCK_TESTES.length,
    active_clients:     MOCK_CLIENTES.filter(c => c.status === 'ativo').length,
    leads_in_progress:  MOCK_PIPELINE.filter(
      l => l.etapa !== 'ativado' && l.etapa !== 'renovacao'
    ).length,
    leads_today:        leadsHoje,
    activations_today:  ativacoesHoje,
    open_problems:      2, // Mock fixo

    // Financeiro — MOCK
    available_credits:        fin.creditosDisponiveis,
    revenue_current_month:    fin.receitaMesAtual,
    revenue_forecast_30d:     fin.receitaPrevista30d,
    revenue_forecast_60d:     fin.receitaPrevista60d,
    revenue_forecast_90d:     fin.receitaPrevista90d,

    // Funil — MOCK
    funnel: [
      { stage: 'novo_lead',    label: 'Leads',     count: pipe.novo_lead + pipe.contato,           color: '#3b82f6' },
      { stage: 'testando',     label: 'Testando',  count: pipe.teste_gerado + pipe.testando,        color: '#f59e0b' },
      { stage: 'interessado',  label: 'Interesse', count: pipe.interessado,                         color: '#a78bfa' },
      { stage: 'pagou',        label: 'Pagaram',   count: pipe.pagou,                               color: '#22c55e' },
      { stage: 'ativado',      label: 'Ativados',  count: pipe.ativado,                             color: '#14b8a6' },
    ],

    // Créditos por painel — MOCK
    panel_credits: MOCK_CREDITOS.slice(0, 4).map(c => ({
      id:          c.id,
      panel:       c.painel,
      balance:     c.saldo,
      low_balance: c.alertaBaixo,
    })),

    data_source: 'mock',
  }
}

// ─── SUPABASE REAL (read-only) ───────────────────────────────────────────────

type CountResult = { count: number | null; error: { message?: string } | null }

function getCount(result: CountResult) {
  if (result.error) throw new Error(result.error.message || 'Falha ao consultar Supabase')
  return result.count || 0
}

type ClientRow = { id: string; name: string | null; status: string | null; created_at: string | null }
type TestRow = { id: string; client_id: string | null; status: string | null; created_at: string | null; expires_at: string | null }

async function getDashboardFromSupabase(): Promise<DashboardMetrics | null> {
  const db = getSupabaseServerClient()
  if (!db) return null

  try {
    const now = new Date()
    const nowIso = now.toISOString()
    const { todayStartIso, in30dIso, in60dIso, in90dIso } = operationWindows(now)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [
      clientsRes,
      testsTodayRes,
      activeTestsRes,
      activeClientsRes,
      paidTodayRes,
      revenueMonthRes,
      renewalsRes,
      forecast30Res,
      forecast60Res,
      forecast90Res,
      creditsRes,
    ] = await Promise.all([
      // clientes (com nome p/ filtrar ruído de QA)
      db.from('clients').select('id,name,status,created_at'),
      // testes gerados hoje (com nome do cliente p/ filtrar ruído)
      db.from('tests').select('id,client_id,status,created_at,expires_at').gte('created_at', todayStartIso),
      // testes ativos agora (válidos)
      db.from('tests').select('id,client_id,status,created_at,expires_at').eq('status', 'active').gt('expires_at', nowIso),
      db.from('clients').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      db.from('payments').select('id', { count: 'exact', head: true }).eq('status', 'paid').gte('paid_at', todayStartIso),
      db.from('payments').select('amount_cents').eq('status', 'paid').gte('paid_at', monthStart),
      db.from('renewals').select('client_id,plan_key,amount_cents,created_at'),
      db.from('renewals').select('amount_cents').not('amount_cents', 'is', null).gte('due_at', nowIso).lte('due_at', in30dIso),
      db.from('renewals').select('amount_cents').not('amount_cents', 'is', null).gte('due_at', nowIso).lte('due_at', in60dIso),
      db.from('renewals').select('amount_cents').not('amount_cents', 'is', null).gte('due_at', nowIso).lte('due_at', in90dIso),
      db
        .from('panel_credit_snapshots')
        .select('id, credits_available, estimated_activations, status, checked_at, panels(name)')
        .order('checked_at', { ascending: false })
        .limit(12),
    ])

    if (
      clientsRes.error || testsTodayRes.error || activeTestsRes.error ||
      revenueMonthRes.error || renewalsRes.error ||
      forecast30Res.error || forecast60Res.error || forecast90Res.error || creditsRes.error
    ) {
      throw new Error('Falha ao consultar métricas do dashboard')
    }

    const activeClients = getCount(activeClientsRes)
    const paidToday = getCount(paidTodayRes)

    // Mapa de clientes p/ filtrar ruído de QA (nomes sintéticos)
    const clients = (clientsRes.data || []) as ClientRow[]
    const clientById = new Map(clients.map((c) => [c.id, c]))
    const isRealTest = (test: TestRow) => {
      const client = test.client_id ? clientById.get(test.client_id) : undefined
      return !isOperationalNoise(client?.name)
    }

    // Gerados hoje (sem ruído)
    const generatedToday = ((testsTodayRes.data || []) as TestRow[]).filter(isRealTest)
    const generatedTodayCount = generatedToday.length

    // Testes ativos agora (sem ruído)
    const activeTestsCount = ((activeTestsRes.data || []) as TestRow[]).filter(isRealTest).length

    // Funil do dia (todos derivados dos testes reais de hoje)
    const testingToday = generatedToday.filter((t) => ['pending', 'generating', 'active'].includes(String(t.status))).length
    const finishedToday = generatedToday.filter((t) => ['expired', 'failed', 'cancelled', 'archived', 'converted'].includes(String(t.status))).length

    // Leads reais criados hoje (status lead, sem ruído)
    const leadsToday = clients.filter(
      (c) => c.status === 'lead' && String(c.created_at || '') >= todayStartIso && !isOperationalNoise(c.name)
    ).length

    const totalOperacaoHoje = leadsToday + generatedTodayCount + paidToday

    const sumCents = (rows: { amount_cents: number | null }[] | null) =>
      (rows || []).reduce((acc, row) => acc + (row.amount_cents || 0), 0) / 100

    // Renovação mensal prevista (clientes ativos reais, plano mensal)
    const renewals = (renewalsRes.data || []) as { client_id: string | null; plan_key: string | null; amount_cents: number | null; created_at: string | null }[]
    const latestRenewal = new Map<string, typeof renewals[number]>()
    for (const r of renewals) {
      if (!r.client_id) continue
      const cur = latestRenewal.get(r.client_id)
      if (!cur || String(r.created_at || '') > String(cur.created_at || '')) latestRenewal.set(r.client_id, r)
    }
    const monthlyRenewalForecast = clients.reduce((total, c) => {
      if (c.status !== 'active' || isOperationalNoise(c.name)) return total
      const r = latestRenewal.get(c.id)
      if (String(r?.plan_key || '').toLowerCase() !== 'mensal') return total
      return total + (r?.amount_cents || 0) / 100
    }, 0)

    const rawCredits = creditsRes.data || []
    const seenPanels = new Set<string>()
    const panelCredits = rawCredits
      .map((row) => {
        const panel = Array.isArray(row.panels) ? row.panels[0] : row.panels
        const panelName = panel && typeof panel === 'object' && 'name' in panel ? String(panel.name) : 'Painel'
        return {
          id: String(row.id),
          panel: panelName,
          balance: Number(row.credits_available || 0),
          low_balance: String(row.status || 'ok') !== 'ok',
        }
      })
      .filter((row) => {
        if (seenPanels.has(row.panel)) return false
        seenPanels.add(row.panel)
        return true
      })

    const availableCredits = panelCredits.reduce((acc, row) => acc + row.balance, 0)

    // Projeções: 30d = renovação mensal; 60d/90d progressivo (× 1.6)
    const due30 = sumCents(forecast30Res.data)
    const forecast30 = monthlyRenewalForecast || due30
    const forecast60 = forecast30 * 1.6
    const forecast90 = forecast60 * 1.6

    return {
      active_tests: activeTestsCount,
      total_tests: generatedTodayCount,
      active_clients: activeClients,
      leads_in_progress: totalOperacaoHoje,
      leads_today: leadsToday,
      activations_today: paidToday,
      open_problems: 0,
      available_credits: availableCredits,
      revenue_current_month: sumCents(revenueMonthRes.data),
      monthly_renewal_forecast: monthlyRenewalForecast,
      revenue_due_30d: due30,
      revenue_forecast_30d: forecast30,
      revenue_forecast_60d: forecast60,
      revenue_forecast_90d: forecast90,
      funnel: [
        { stage: 'novo_lead', label: 'Lead', count: leadsToday, color: '#3b82f6' },
        { stage: 'teste_gerado', label: 'Testando', count: testingToday, color: '#f59e0b' },
        { stage: 'testando', label: 'Finalizou', count: finishedToday, color: '#eab308' },
        { stage: 'pagou', label: 'Pagou', count: paidToday, color: '#22c55e' },
        { stage: 'ativado', label: 'Ativos', count: activeClients, color: '#14b8a6' },
      ],
      panel_credits: panelCredits,
      data_source: 'supabase',
    }
  } catch {
    return null
  }
}

// ─── Função pública ──────────────────────────────────────────────────────────

/**
 * Retorna os dados do Dashboard.
 *
 * Tenta usar Supabase se configurado; caso contrário (ou em erro),
 * usa os dados mockados de lib/mock-data.ts.
 *
 * Esta função é SAFE para Server Components e nunca expõe service role
 * ao browser.
 */
export async function getDashboardData(): Promise<DashboardMetrics> {
  if (isSupabaseServerConfigured) {
    const real = await getDashboardFromSupabase()
    if (real) return real
  }

  // Fallback garantido: mock sempre funciona
  return getDashboardFromMock()
}
