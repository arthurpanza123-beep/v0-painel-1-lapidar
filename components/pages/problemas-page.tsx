'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle, CheckCircle2, Terminal, ChevronRight, X, Clock,
  Plus, Copy, Save, Lightbulb, Search
} from 'lucide-react'
import {
  MOCK_PROBLEMAS,
  TIPOS_PROBLEMA,
  type Problema,
  type StatusProblema,
  type TipoProblema,
} from '@/lib/mock-data'
import { useToast } from '@/components/ui/toast'

const STATUS: Record<StatusProblema, { label: string; color: string; tag: string }> = {
  aberto: { label: 'Aberto', color: '#ef4444', tag: 'ABERTO' },
  em_analise: { label: 'Em analise', color: '#f59e0b', tag: 'ANALISE' },
  resolvido: { label: 'Resolvido', color: '#22c55e', tag: 'OK' },
}

// Severidade derivada do tipo de problema
function severidade(tipo: string): { label: string; color: string } {
  const criticos = ['app_nao_abre', 'login_invalido', 'renovacao_nao_entrou', 'senha_incorreta']
  const medios = ['travando', 'lista_nao_carrega']
  if (criticos.includes(tipo)) return { label: 'Critica', color: '#ef4444' }
  if (medios.includes(tipo)) return { label: 'Media', color: '#f59e0b' }
  return { label: 'Baixa', color: '#60a5fa' }
}

// ——— Linha de problema ———
function ProblemaRow({
  problema, onExpand, expanded, onResolver, onGerarPrompt, onSalvarConhecimento,
}: {
  problema: Problema
  onExpand: () => void
  expanded: boolean
  onResolver: () => void
  onGerarPrompt: () => void
  onSalvarConhecimento: () => void
}) {
  const cfg = STATUS[problema.status]
  const sev = severidade(problema.tipo)
  const tipoLabel = TIPOS_PROBLEMA.find((t) => t.id === problema.tipo)?.label || problema.tipo
  const resolvido = problema.status === 'resolvido'

  return (
    <div
      className="transition-colors"
      style={{ borderBottom: '1px solid var(--border)', opacity: resolvido ? 0.55 : 1 }}
    >
      <button
        onClick={onExpand}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <ChevronRight
          className="h-3.5 w-3.5 text-slate-600 shrink-0 transition-transform"
          style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}
        />
        <span className="text-[11px] text-slate-600 tabular-nums shrink-0 w-14">{problema.criadoEm.split(' ')[1] ?? problema.criadoEm}</span>
        <span
          className="text-[10px] font-bold shrink-0 px-1.5 py-0.5 rounded w-14 text-center"
          style={{ color: cfg.color, background: `${cfg.color}12` }}
        >
          {cfg.tag}
        </span>
        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: sev.color }} title={sev.label} />
        <span className="text-xs text-slate-200 truncate flex-1">
          {problema.cliente} <span className="text-slate-600">·</span> {tipoLabel}
        </span>
        <span className="text-[10px] text-slate-600 shrink-0 hidden sm:inline">
          {problema.app}/{problema.servidor}
        </span>
      </button>

      {/* Detalhes expandidos */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pl-[5rem]">
              <div className="rounded-lg p-3 mb-3 text-xs leading-relaxed" style={{ background: 'rgba(0,0,0,0.3)', color: '#94a3b8' }}>
                <span className="text-slate-600">Descricao:</span> {problema.descricao}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-[11px]">
                <KV label="cliente" value={problema.cliente} />
                <KV label="telefone" value={problema.telefone} />
                <KV label="app" value={problema.app} />
                <KV label="servidor" value={problema.servidor} />
                <KV label="severidade" value={sev.label} color={sev.color} />
                <KV label="status" value={cfg.label} color={cfg.color} />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={onGerarPrompt}
                  className="h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5"
                  style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}
                >
                  <Terminal className="h-3.5 w-3.5" /> Gerar prompt para Codex
                </button>
                <button
                  onClick={onSalvarConhecimento}
                  className="h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5"
                  style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}
                >
                  <Lightbulb className="h-3.5 w-3.5" /> Salvar conhecimento
                </button>
                {!resolvido && (
                  <button
                    onClick={onResolver}
                    className="h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5"
                    style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Marcar resolvido
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function KV({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p className="text-slate-600">{label}</p>
      <p className="truncate" style={{ color: color ?? '#cbd5e1' }}>{value}</p>
    </div>
  )
}

// ——— Modal Novo Problema ———
function NovoProblemaModal({
  onClose, onSave,
}: {
  onClose: () => void
  onSave: (problema: Omit<Problema, 'id' | 'criadoEm' | 'status'>) => void
}) {
  const [cliente, setCliente] = useState('')
  const [telefone, setTelefone] = useState('')
  const [app, setApp] = useState('')
  const [servidor, setServidor] = useState('')
  const [tipo, setTipo] = useState<TipoProblema>('outro')
  const [descricao, setDescricao] = useState('')
  const [solucao, setSolucao] = useState('')

  const handleSave = () => {
    if (!cliente || !descricao) return
    onSave({ cliente, telefone, app, servidor, tipo, descricao })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(7,10,18,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Novo problema</h3>
              <p className="text-xs text-slate-500">Registrar ocorrencia</p>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Cliente</label>
              <input
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Nome do cliente"
                className="w-full h-10 px-3 rounded-lg text-sm text-white placeholder:text-slate-600 outline-none"
                style={{ background: 'var(--input)', border: '1px solid var(--border)' }}
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Telefone</label>
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full h-10 px-3 rounded-lg text-sm text-white placeholder:text-slate-600 outline-none"
                style={{ background: 'var(--input)', border: '1px solid var(--border)' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">App</label>
              <input
                value={app}
                onChange={(e) => setApp(e.target.value)}
                placeholder="Ex: XCloud, Blessed..."
                className="w-full h-10 px-3 rounded-lg text-sm text-white placeholder:text-slate-600 outline-none"
                style={{ background: 'var(--input)', border: '1px solid var(--border)' }}
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Servidor</label>
              <input
                value={servidor}
                onChange={(e) => setServidor(e.target.value)}
                placeholder="Ex: Yellow Box, Ninety..."
                className="w-full h-10 px-3 rounded-lg text-sm text-white placeholder:text-slate-600 outline-none"
                style={{ background: 'var(--input)', border: '1px solid var(--border)' }}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Tipo de problema</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoProblema)}
              className="w-full h-10 px-3 rounded-lg text-sm text-white outline-none appearance-none"
              style={{ background: 'var(--input)', border: '1px solid var(--border)' }}
            >
              {TIPOS_PROBLEMA.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">O que aconteceu?</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              placeholder="Descreva o problema..."
              className="w-full p-3 rounded-lg text-sm text-white placeholder:text-slate-600 outline-none resize-none"
              style={{ background: 'var(--input)', border: '1px solid var(--border)' }}
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Solucao aplicada (opcional)</label>
            <textarea
              value={solucao}
              onChange={(e) => setSolucao(e.target.value)}
              rows={2}
              placeholder="Se ja aplicou alguma solucao..."
              className="w-full p-3 rounded-lg text-sm text-white placeholder:text-slate-600 outline-none resize-none"
              style={{ background: 'var(--input)', border: '1px solid var(--border)' }}
            />
          </div>
        </div>

        <div className="p-5 flex gap-2" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={handleSave}
            disabled={!cliente || !descricao}
            className="flex-1 h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: '#ef4444', color: '#fff' }}
          >
            <Save className="h-4 w-4" /> Registrar problema
          </button>
          <button onClick={onClose} className="h-10 px-4 rounded-xl text-sm font-medium" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: '#94a3b8' }}>
            Cancelar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ——— Modal Gerar Prompt Codex ———
function CodexPromptModal({
  problema, onClose,
}: {
  problema: Problema
  onClose: () => void
}) {
  const { addToast } = useToast()
  const [obs, setObs] = useState('')
  const sev = severidade(problema.tipo)
  const tipoLabel = TIPOS_PROBLEMA.find((t) => t.id === problema.tipo)?.label || problema.tipo

  const prompt = `Continuar trabalhando no projeto existente:

https://github.com/arthurpanza123-beep/v0-painel-1-lapidar

Esse é o projeto de lapidação do Painel 1 da Central Play Plus.

NÃO recriar do zero.
NÃO fazer deploy.
NÃO mexer no Painel 2.
NÃO criar WhatsApp/Evolution aqui.
NÃO voltar backend para mock.
NÃO remover chamadas reais.
NÃO trocar \`/api/tests/create\` por \`/api/tests/create-mock\`.

==================================================
PROBLEMA REPORTADO
==================================================

Cliente: ${problema.cliente}
Telefone: ${problema.telefone}
App: ${problema.app}
Servidor: ${problema.servidor}
Tipo: ${tipoLabel}
Severidade: ${sev.label}
Data/Hora: ${problema.criadoEm}

Descricao do problema:
${problema.descricao}

${obs ? `Observacao adicional do operador:\n${obs}` : ''}

==================================================
REGRAS DE SEGURANCA
==================================================

- Não enviar WhatsApp pelo Painel 1 (isso é Painel 2)
- Teste não ocupa tela
- Cliente pago ocupa tela somente ao ativar
- Não remover chamadas reais
- Não mexer em .env ou arquivos sensíveis

==================================================
O QUE VERIFICAR
==================================================

1. Verificar logs relacionados ao cliente
2. Verificar se o problema é de frontend ou backend
3. Verificar se há erro na integração com o painel ${problema.servidor}
4. Propor solução que não quebre outras funcionalidades

==================================================`

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt)
    addToast('success', 'Prompt copiado para o Codex!')
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(7,10,18,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa' }}>
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Prompt para Codex</h3>
              <p className="text-xs text-slate-500">Copie e cole no Codex para resolver</p>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Observacao adicional (opcional)</label>
            <textarea
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              rows={2}
              placeholder="Adicionar contexto extra para o Codex..."
              className="w-full p-3 rounded-lg text-sm text-white placeholder:text-slate-600 outline-none resize-none"
              style={{ background: 'var(--input)', border: '1px solid var(--border)' }}
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 block">Prompt gerado</label>
            <pre className="p-4 rounded-lg text-[11px] leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.3)', color: '#94a3b8', border: '1px solid var(--border)' }}>
              {prompt}
            </pre>
          </div>
        </div>

        <div className="p-5 flex gap-2" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={handleCopy}
            className="flex-1 h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{ background: '#a78bfa', color: '#1a0b2e' }}
          >
            <Copy className="h-4 w-4" /> Copiar prompt
          </button>
          <button onClick={onClose} className="h-10 px-4 rounded-xl text-sm font-medium" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: '#94a3b8' }}>
            Fechar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ——— Page ———
export function ProblemasPage() {
  const [filter, setFilter] = useState<StatusProblema | 'todos'>('todos')
  const [search, setSearch] = useState('')
  const [problemas, setProblemas] = useState(MOCK_PROBLEMAS)
  const [dataSource, setDataSource] = useState<'mock' | 'supabase'>('mock')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [codexTarget, setCodexTarget] = useState<Problema | null>(null)
  const [showNovoProblema, setShowNovoProblema] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    let alive = true
    async function load() {
      try {
        const res = await fetch('/api/problems', { cache: 'no-store' })
        if (!res.ok) throw new Error('Falha ao carregar problemas')
        const payload = await res.json()
        if (!alive) return
        setProblemas(Array.isArray(payload.items) ? payload.items : MOCK_PROBLEMAS)
        setDataSource(payload.data_source === 'supabase' ? 'supabase' : 'mock')
      } catch {
        if (!alive) return
        setProblemas(MOCK_PROBLEMAS)
        setDataSource('mock')
      }
    }
    load()
    return () => { alive = false }
  }, [])

  const metricas = {
    abertos: problemas.filter((p) => p.status === 'aberto').length,
    emAnalise: problemas.filter((p) => p.status === 'em_analise').length,
    resolvidos: problemas.filter((p) => p.status === 'resolvido').length,
  }

  const filtrados = problemas
    .filter((p) => {
      const matchStatus = filter === 'todos' || p.status === filter
      const matchSearch = !search || p.cliente.toLowerCase().includes(search.toLowerCase()) || p.descricao.toLowerCase().includes(search.toLowerCase())
      return matchStatus && matchSearch
    })
    .sort((a, b) => {
      const ordem: Record<StatusProblema, number> = { aberto: 0, em_analise: 1, resolvido: 2 }
      return ordem[a.status] - ordem[b.status]
    })

  const handleResolver = (id: string) => {
    setProblemas((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'resolvido' as StatusProblema } : p)))
    addToast('success', 'Problema resolvido')
  }

  const handleNovoProblema = (data: Omit<Problema, 'id' | 'criadoEm' | 'status'>) => {
    const novo: Problema = {
      ...data,
      id: String(Date.now()),
      criadoEm: new Date().toLocaleString('pt-BR'),
      status: 'aberto',
    }
    setProblemas(prev => [novo, ...prev])
    setShowNovoProblema(false)
    addToast('success', 'Problema registrado')
  }

  return (
    <>
      <div className="flex-1 flex flex-col items-center px-6 py-10 min-h-screen">
        {/* Header */}
        <div className="text-center mb-8 max-w-xl">
          <div className="flex items-center justify-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4" style={{ color: '#ef4444' }} />
            <span className="text-xs text-slate-500 uppercase tracking-widest font-medium">Central de suporte</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>Problemas</h1>
          <p className="text-slate-500 text-sm">
            {metricas.abertos} abertos · {metricas.emAnalise} em analise · {metricas.resolvidos} resolvidos
          </p>
          <p className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium"
             style={{ background: dataSource === 'supabase' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', color: dataSource === 'supabase' ? '#4ade80' : '#fbbf24' }}>
            Fonte: {dataSource === 'supabase' ? 'Supabase' : 'Mock'}
          </p>
        </div>

        {/* KPIs */}
        <div className="flex items-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: metricas.abertos > 0 ? '#ef4444' : '#22c55e', fontFamily: 'var(--font-display)' }}>{metricas.abertos}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Abertos</p>
          </div>
          <div className="h-10 w-px" style={{ background: 'var(--border)' }} />
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#f59e0b', fontFamily: 'var(--font-display)' }}>{metricas.emAnalise}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Em analise</p>
          </div>
          <div className="h-10 w-px" style={{ background: 'var(--border)' }} />
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#22c55e', fontFamily: 'var(--font-display)' }}>{metricas.resolvidos}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Resolvidos</p>
          </div>
        </div>

        {/* Busca + Filtros + Novo */}
        <div className="w-full max-w-3xl mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar por cliente ou descricao..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              />
            </div>
            <button
              onClick={() => setShowNovoProblema(true)}
              className="h-10 px-4 rounded-xl text-sm font-medium flex items-center gap-2 shrink-0"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}
            >
              <Plus className="h-4 w-4" /> Novo problema
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'aberto', label: 'Abertos' },
              { id: 'em_analise', label: 'Em analise' },
              { id: 'resolvido', label: 'Resolvidos' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as typeof filter)}
                className="px-3 h-8 rounded-lg text-xs font-medium transition-all"
                style={
                  filter === f.id
                    ? { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }
                    : { background: 'var(--card)', border: '1px solid var(--border)', color: '#64748b' }
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de problemas */}
        <div className="w-full max-w-3xl rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {/* Barra do terminal */}
          <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'rgba(0,0,0,0.25)', borderBottom: '1px solid var(--border)' }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#ef4444' }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#f59e0b' }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#22c55e' }} />
            <span className="text-[11px] text-slate-500 ml-2 flex items-center gap-1.5">
              <Clock className="h-3 w-3" /> suporte@centralplay — {filtrados.length} ocorrencias
            </span>
          </div>

          {filtrados.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 className="h-10 w-10 mx-auto mb-3" style={{ color: '#22c55e' }} />
              <p className="text-slate-400 text-sm">Nenhuma ocorrencia encontrada</p>
            </div>
          ) : (
            filtrados.map((p) => (
              <ProblemaRow
                key={p.id}
                problema={p}
                expanded={expanded === p.id}
                onExpand={() => setExpanded(expanded === p.id ? null : p.id)}
                onResolver={() => handleResolver(p.id)}
                onGerarPrompt={() => setCodexTarget(p)}
                onSalvarConhecimento={() => addToast('success', 'Conhecimento salvo localmente')}
              />
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {codexTarget && (
          <CodexPromptModal
            problema={codexTarget}
            onClose={() => setCodexTarget(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNovoProblema && (
          <NovoProblemaModal
            onClose={() => setShowNovoProblema(false)}
            onSave={handleNovoProblema}
          />
        )}
      </AnimatePresence>
    </>
  )
}
