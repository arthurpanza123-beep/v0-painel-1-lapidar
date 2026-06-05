'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  TestTube2, Users, Zap, UserPlus,
  ArrowUpRight, Activity, Clock, AlertTriangle, Info
} from 'lucide-react'
import type { NavPage } from '@/app/page'
import {
  MOCK_TESTES, MOCK_CLIENTES, MOCK_PIPELINE, MOCK_CREDITOS, MOCK_RENOVACOES,
  calcularMetricasFinanceiro, calcularMetricasPipeline,
} from '@/lib/mock-data'
import type { DashboardMetrics } from '@/lib/supabase/types'

interface DashboardPageProps {
  onNavigate: (p: NavPage) => void
  metrics?: DashboardMetrics
}

export function DashboardPage({ onNavigate, metrics }: DashboardPageProps) {
  const [remoteMetrics, setRemoteMetrics] = useState<DashboardMetrics | undefined>(metrics)
  const [showProjecaoTooltip, setShowProjecaoTooltip] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/dashboard')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: DashboardMetrics | null) => {
        if (!cancelled && data) setRemoteMetrics(data)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  const dashboardMetrics = remoteMetrics ?? metrics
  const fin  = calcularMetricasFinanceiro()
  const pipe = calcularMetricasPipeline()

  // Métricas principais ajustadas
  const hoje = new Date().toLocaleDateString('pt-BR')
  const leadsHoje = dashboardMetrics?.leads_today ?? MOCK_PIPELINE.filter(l => l.criadoEm.startsWith(hoje.split('/').reverse().join('-').substring(0, 10)) || l.criadoEm.includes(hoje)).length || MOCK_PIPELINE.filter(l => l.etapa === 'novo_lead' || l.etapa === 'contato').length
  const testesHoje = dashboardMetrics?.total_tests ?? MOCK_TESTES.length
  const ativacoesHoje = dashboardMetrics?.activations_today ?? MOCK_PIPELINE.filter(l => l.etapa === 'ativado').length
  const clientesAtivos = dashboardMetrics?.active_clients ?? MOCK_CLIENTES.filter(c => c.status === 'ativo').length

  // Receita prevista 30 dias - soma dos vencimentos próximos 30 dias
  const clientesComValor = MOCK_CLIENTES.filter(c => c.status === 'ativo' && c.valor > 0)
  const clientesSemValor = MOCK_CLIENTES.filter(c => c.status === 'ativo' && (!c.valor || c.valor <= 0)).length
  const receitaPrevista = dashboardMetrics?.revenue_forecast_30d ?? clientesComValor.reduce((acc, c) => acc + c.valor, 0)
  const projecaoComPerda = receitaPrevista * 0.7 // 30% de perda estimada

  // Créditos como telas/ativações, não R$
  const painelCreditos = dashboardMetrics?.panel_credits
    ? dashboardMetrics.panel_credits.map(c => ({ id: c.id, painel: c.panel, creditos: Math.floor(c.balance / 8), alertaBaixo: c.low_balance }))
    : MOCK_CREDITOS.map(c => ({ id: c.id, painel: c.painel, creditos: c.ativacoesRestantes, alertaBaixo: c.alertaBaixo }))

  // Funil do dia - simplificado
  const vencemHoje = MOCK_RENOVACOES.filter(r => r.diasRestantes === 0).length
  const problemasAbertos = dashboardMetrics?.open_problems ?? 2

  const funil = [
    { label: 'Leads',        value: leadsHoje,       color: '#3b82f6' },
    { label: 'Testes',       value: testesHoje,      color: '#f59e0b' },
    { label: 'Ativaram',     value: ativacoesHoje,   color: '#22c55e' },
    { label: 'Vencem hoje',  value: vencemHoje,      color: '#f97316' },
    { label: 'Problemas',    value: problemasAbertos, color: '#ef4444' },
  ]

  const kpis = [
    { label: 'Leads hoje',       value: leadsHoje,       icon: UserPlus,  color: '#3b82f6', page: 'pipeline' as NavPage },
    { label: 'Testes hoje',      value: testesHoje,      icon: TestTube2, color: '#f59e0b', page: 'testes'   as NavPage },
    { label: 'Ativações hoje',   value: ativacoesHoje,   icon: Zap,       color: '#22c55e', page: 'contas'   as NavPage },
    { label: 'Clientes ativos',  value: clientesAtivos,  icon: Users,     color: '#a78bfa', page: 'clientes' as NavPage },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BgGlow />
      <div className="relative px-6 py-10 max-w-5xl mx-auto w-full" style={{ zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4" style={{ color: '#3b82f6' }} />
            <span className="text-xs text-slate-500 uppercase tracking-widest font-medium">Central de comando</span>
          </div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Central Play Plus
          </h1>
          <p className="text-slate-500 text-sm mt-1">Visão geral da operação · {new Date().toLocaleDateString('pt-BR')}</p>
        </motion.div>

        {/* KPIs grandes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {kpis.map((k, i) => (
            <motion.button
              key={k.label}
              onClick={() => onNavigate(k.page)}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className="text-left rounded-2xl p-5 group relative overflow-hidden"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div
                className="absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-20 transition-opacity group-hover:opacity-40"
                style={{ background: `radial-gradient(circle, ${k.color}, transparent 70%)` }}
              />
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl mb-4"
                style={{ background: `${k.color}1f`, border: `1px solid ${k.color}40` }}
              >
                <k.icon className="h-5 w-5" style={{ color: k.color }} />
              </div>
              <p className="text-3xl font-bold text-white leading-none mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>
                {k.value}
              </p>
              <p className="text-xs text-slate-500">{k.label}</p>
            </motion.button>
          ))}
        </div>

        {/* Receita prevista + créditos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-2xl p-6 relative overflow-hidden"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div
              className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #22c55e, transparent 70%)' }}
            />
            <div className="relative flex items-start justify-between mb-5">
              <div>
                <p className="text-xs text-slate-500 mb-1">Receita prevista (30 dias)</p>
                <div className="flex items-center gap-2">
                  <p className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    R$ {receitaPrevista.toFixed(0)}
                  </p>
                  <button
                    onClick={() => setShowProjecaoTooltip(!showProjecaoTooltip)}
                    onMouseEnter={() => setShowProjecaoTooltip(true)}
                    onMouseLeave={() => setShowProjecaoTooltip(false)}
                    className="relative"
                  >
                    <Info className="h-4 w-4 text-slate-500 hover:text-slate-300 transition-colors" />
                    {showProjecaoTooltip && (
                      <div
                        className="absolute left-6 top-0 z-50 w-64 p-3 rounded-xl text-left"
                        style={{ background: '#1e2230', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
                      >
                        <p className="text-xs text-slate-300 mb-2">Como calculamos:</p>
                        <div className="space-y-1.5 text-[11px] text-slate-400">
                          <p>Previsto: R$ {receitaPrevista.toFixed(0)}</p>
                          <p>Estimativa com perda de 30%: R$ {projecaoComPerda.toFixed(0)}</p>
                          {clientesSemValor > 0 && (
                            <p className="flex items-center gap-1 text-amber-400">
                              <AlertTriangle className="h-3 w-3" />
                              {clientesSemValor} clientes sem valor cadastrado
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </button>
                </div>
                <p className="text-xs flex items-center gap-1 mt-1.5" style={{ color: '#22c55e' }}>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Projeção: R$ {projecaoComPerda.toFixed(0)} (com 30% de perda)
                </p>
                {clientesSemValor > 0 && (
                  <p className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {clientesSemValor} clientes sem valor cadastrado
                  </p>
                )}
              </div>
              <button
                onClick={() => onNavigate('financeiro')}
                className="text-xs px-3 h-8 rounded-lg font-medium transition-colors"
                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}
              >
                Financeiro
              </button>
            </div>
          </motion.div>

          <motion.button
            onClick={() => onNavigate('financeiro')}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="text-left rounded-2xl p-6 relative overflow-hidden"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4" style={{ color: '#a78bfa' }} />
              <span className="text-xs text-slate-500">Créditos disponíveis</span>
            </div>
            <div className="space-y-2.5">
              {painelCreditos.slice(0, 4).map(c => (
                <div key={c.id} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    {c.alertaBaixo && <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#f59e0b' }} />}
                    {c.painel}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: c.alertaBaixo ? '#f59e0b' : '#4ade80' }}>
                    {c.creditos} {c.creditos === 1 ? 'tela' : 'telas'}
                  </span>
                </div>
              ))}
            </div>
          </motion.button>
        </div>

        {/* Funil - Hoje na operação */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" style={{ color: '#3b82f6' }} />
              <h2 className="text-sm font-semibold text-white">Hoje na operação</h2>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: dashboardMetrics?.data_source === 'supabase' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                  color:      dashboardMetrics?.data_source === 'supabase' ? '#4ade80' : '#fbbf24',
                  border:     `1px solid ${dashboardMetrics?.data_source === 'supabase' ? 'rgba(34,197,94,0.25)' : 'rgba(245,158,11,0.25)'}`,
                }}
              >
                {dashboardMetrics?.data_source === 'supabase' ? 'Supabase' : 'Mock'}
              </span>
              <button
                onClick={() => onNavigate('pipeline')}
                className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1"
              >
                Ver pipeline <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {funil.map(f => (
              <div
                key={f.label}
                className="rounded-xl p-4 relative overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}
              >
                <div className="h-1 w-8 rounded-full mb-3" style={{ background: f.color }} />
                <p className="text-2xl font-bold text-white leading-none mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                  {f.value}
                </p>
                <p className="text-[11px] text-slate-500">{f.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function BgGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600, top: '-15%', left: '-10%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 65%)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500, top: '20%', right: '-12%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 65%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.015) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  )
}
