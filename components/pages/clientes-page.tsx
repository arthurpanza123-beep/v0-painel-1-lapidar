'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Search, Phone, Package, Server, Calendar, DollarSign,
  RefreshCw, Eye, Copy, ExternalLink, Tv2, X, Key, Sparkles, Edit3
} from 'lucide-react'
import {
  MOCK_CLIENTES,
  type Cliente,
  type StatusCliente,
} from '@/lib/mock-data'
import { StatusBadge } from '@/components/shared/status-badge'
import { ActionMenu, type ActionItem } from '@/components/shared/action-menu'
import { ClientDrawer } from '@/components/shared/client-drawer'
import { useToast } from '@/components/ui/toast'

function diasParaVencer(vencimento: string): number {
  const [d, m, a] = vencimento.split('/').map(Number)
  const alvo = new Date(a, m - 1, d)
  return Math.ceil((alvo.getTime() - Date.now()) / 86400000)
}

function Info({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1 text-[10px] text-slate-600 uppercase tracking-wider">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <p className="text-xs text-slate-300 truncate mt-0.5">{value}</p>
    </div>
  )
}

// ——— Card operacional do cliente ———
function ClienteCard({
  cliente,
  onVer,
  actions,
}: {
  cliente: Cliente
  onVer: () => void
  actions: ActionItem[]
}) {
  const dias = diasParaVencer(cliente.vencimento)
  const venceLabel =
    dias < 0 ? `Venceu ha ${Math.abs(dias)}d` : dias === 0 ? 'Vence hoje' : `Vence em ${dias}d`
  const venceColor = dias < 0 ? '#ef4444' : dias <= 3 ? '#f59e0b' : '#64748b'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 transition-all"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {/* Topo: avatar + nome + status */}
      <div className="flex items-start gap-3 mb-4">
        <button
          onClick={onVer}
          className="h-11 w-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}
        >
          {cliente.nome.split(' ').map((n) => n[0]).slice(0, 2).join('')}
        </button>
        <div className="flex-1 min-w-0">
          <button onClick={onVer} className="text-left">
            <h3 className="text-sm font-semibold text-white truncate hover:text-blue-400 transition-colors">
              {cliente.nome}
            </h3>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
            <Phone className="h-3 w-3" /> {cliente.telefone}
          </div>
        </div>
        <StatusBadge status={cliente.status} dot />
      </div>

      {/* Grid de dados */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-4">
        <Info icon={Package} label="App" value={cliente.app} />
        <Info icon={Server} label="Servidor" value={cliente.servidor} />
        <Info icon={DollarSign} label="Plano" value={`${cliente.plano} · R$ ${cliente.valor.toFixed(0)}`} />
        <Info icon={Calendar} label="Vencimento" value={cliente.vencimento} />
      </div>

      {/* Rodape: status rapido + acoes */}
      <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        <span className="text-[11px] font-medium" style={{ color: venceColor }}>{venceLabel}</span>
        <ActionMenu items={actions} />
      </div>
    </motion.div>
  )
}

// ——— Page ———
export function ClientesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusCliente | 'todos'>('todos')
  const [selecionado, setSelecionado] = useState<Cliente | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>(MOCK_CLIENTES)
  const [dataSource, setDataSource] = useState<'mock' | 'supabase'>('mock')
  const [modalCredenciais, setModalCredenciais] = useState<Cliente | null>(null)
  const [modalCodex, setModalCodex] = useState<Cliente | null>(null)
  const [codexPrompt, setCodexPrompt] = useState('')
  const { addToast } = useToast()

  useEffect(() => {
    let alive = true
    async function load() {
      try {
        const res = await fetch('/api/clients', { cache: 'no-store' })
        if (!res.ok) throw new Error('Falha ao carregar clientes')
        const payload = await res.json()
        if (!alive) return
        setClientes(Array.isArray(payload.items) ? payload.items : MOCK_CLIENTES)
        setDataSource(payload.data_source === 'supabase' ? 'supabase' : 'mock')
      } catch {
        if (!alive) return
        setClientes(MOCK_CLIENTES)
        setDataSource('mock')
      }
    }
    load()
    return () => { alive = false }
  }, [])

  const filtrados = clientes.filter((c) => {
    const s = search.toLowerCase()
    const matchSearch =
      !s || c.nome.toLowerCase().includes(s) || c.telefone.includes(search) || c.app.toLowerCase().includes(s)
    const matchStatus = statusFilter === 'todos' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const metricas = {
    total: clientes.length,
    ativos: clientes.filter((c) => c.status === 'ativo').length,
    expirados: clientes.filter((c) => c.status === 'expirado').length,
    receita: clientes.filter((c) => c.status === 'ativo').reduce((s, c) => s + c.valor, 0),
  }

  const abrirPainel2 = (c: Cliente) => {
    window.open(`https://painel2.centralplayplus.com.br?source=painel1&client_id=${c.id}&flow=client_action`, '_blank')
    addToast('success', 'Abrindo Painel 2...')
  }

  // Ações refinadas conforme especificação
  const buildActions = (c: Cliente): ActionItem[] => [
    { label: 'Renovar', icon: RefreshCw, onClick: () => handleRenovar(c), color: '#60a5fa' },
    { label: 'Playlist / Credenciais', icon: Key, onClick: () => setModalCredenciais(c), color: '#14b8a6' },
    { label: 'Ativar segunda tela', icon: Tv2, onClick: () => handleAtivarSegundaTela(c), color: '#f59e0b' },
    { label: 'Codex IA', icon: Sparkles, onClick: () => setModalCodex(c), color: '#a78bfa' },
    { label: 'Editar dados', icon: Edit3, onClick: () => setSelecionado(c), color: '#64748b' },
  ]

  // Handler renovar
  const handleRenovar = (c: Cliente) => {
    addToast('success', `Renovacao de ${c.nome} iniciada`)
    // Enviar contexto para Painel 2 enviar mensagem
    const params = new URLSearchParams({
      source: 'painel1',
      client_id: c.id,
      flow: 'client_renewed',
    })
    window.open(`https://painel2.centralplayplus.com.br?${params.toString()}`, '_blank')
  }

  // Handler ativar segunda tela
  const handleAtivarSegundaTela = (c: Cliente) => {
    // Copiar usuário
    if (c.usuario) {
      navigator.clipboard.writeText(c.usuario)
      addToast('info', `Usuario "${c.usuario}" copiado. Renove/libere no painel do provedor.`)
    }
    // Abrir painel do provedor
    const painelKey = c.servidor?.toLowerCase().replace(/\s+/g, '') || 'yellow'
    const painelUrl: Record<string, string> = {
      'yellowbox': 'https://yellowbox.com/painel',
      'yellow': 'https://yellowbox.com/painel',
      'ninety': 'https://ninety.com/admin',
      'cinemax': 'https://cinemax.com/painel',
    }
    window.open(painelUrl[painelKey] || painelUrl['yellow'], '_blank')
    // Enviar contexto para Painel 2
    const params = new URLSearchParams({
      source: 'painel1',
      client_id: c.id,
      flow: 'second_screen_activated',
    })
    window.open(`https://painel2.centralplayplus.com.br?${params.toString()}`, '_blank')
  }

  // Handler Codex IA
  const handleEnviarCodex = () => {
    if (!modalCodex || !codexPrompt.trim()) {
      addToast('error', 'Digite uma pergunta ou problema')
      return
    }
    // Gerar prompt completo para Codex
    const promptCompleto = `Cliente: ${modalCodex.nome}
Telefone: ${modalCodex.telefone}
App: ${modalCodex.app}
Servidor: ${modalCodex.servidor}
Plano: ${modalCodex.plano}
Vencimento: ${modalCodex.vencimento}

Problema/Pergunta: ${codexPrompt}`
    
    navigator.clipboard.writeText(promptCompleto)
    addToast('success', 'Contexto copiado para Codex IA')
    setModalCodex(null)
    setCodexPrompt('')
  }

  return (
    <>
      <div className="flex-1 flex flex-col items-center px-6 py-10 min-h-screen">
        {/* Header */}
        <div className="text-center mb-8 max-w-xl">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Users className="h-4 w-4" style={{ color: '#60a5fa' }} />
            <span className="text-xs text-slate-500 uppercase tracking-widest font-medium">CRM</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>Clientes</h1>
          <p className="text-slate-500 text-sm">
            {metricas.total} clientes · {metricas.ativos} ativos · R$ {metricas.receita.toFixed(0)} ativos/mes
          </p>
          <p className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium"
             style={{ background: dataSource === 'supabase' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', color: dataSource === 'supabase' ? '#4ade80' : '#fbbf24' }}>
            Fonte: {dataSource === 'supabase' ? 'Supabase' : 'Mock'}
          </p>
        </div>

        {/* KPIs */}
        <div className="flex items-center gap-8 mb-8">
          {[
            { label: 'Total', value: metricas.total, color: '#60a5fa' },
            { label: 'Ativos', value: metricas.ativos, color: '#22c55e' },
            { label: 'Expirados', value: metricas.expirados, color: '#ef4444' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-bold" style={{ color, fontFamily: 'var(--font-display)' }}>{value}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>

        {/* Busca + filtros */}
        <div className="w-full max-w-4xl mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar por nome, telefone ou app..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(['todos', 'ativo', 'expirado', 'pendente'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className="px-3 h-12 rounded-xl text-xs font-medium transition-all capitalize"
                  style={
                    statusFilter === s
                      ? { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)', color: '#93c5fd' }
                      : { background: 'var(--card)', border: '1px solid var(--border)', color: '#64748b' }
                  }
                >
                  {s === 'todos' ? 'Todos' : s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de cards */}
        <div className="w-full max-w-4xl">
          {filtrados.length === 0 ? (
            <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <Users className="h-10 w-10 mx-auto mb-3" style={{ color: '#1e293b' }} />
              <p className="text-slate-500 text-sm">Nenhum cliente encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtrados.map((c) => (
                <ClienteCard key={c.id} cliente={c} onVer={() => setSelecionado(c)} actions={buildActions(c)} />
              ))}
            </div>
          )}
        </div>
      </div>

      <ClientDrawer
        cliente={selecionado}
        onClose={() => setSelecionado(null)}
        onPainel2={abrirPainel2}
        onRenovar={(c) => addToast('success', `Renovacao de ${c.nome} iniciada`)}
      />

      {/* Modal Playlist / Credenciais */}
      <AnimatePresence>
        {modalCredenciais && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)' }}
            onClick={() => setModalCredenciais(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl overflow-hidden"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Playlist / Credenciais</h2>
                  <button onClick={() => setModalCredenciais(null)} className="p-1 rounded-lg hover:bg-white/10">
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">{modalCredenciais.nome}</p>
              </div>

              <div className="p-5 space-y-4">
                {/* Credenciais do app atual */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Key className="h-4 w-4 text-teal-400" />
                    <span className="text-sm font-semibold text-teal-200">Credenciais {modalCredenciais.app}</span>
                  </div>
                  <div className="space-y-2">
                    {modalCredenciais.app.toLowerCase().includes('xcloud') && (
                      <>
                        <CredencialRow label="Host" value="http://yellowbox.dns.com:8080" />
                        <CredencialRow label="Usuario" value={modalCredenciais.usuario || 'user_' + modalCredenciais.id} />
                        <CredencialRow label="Senha" value={modalCredenciais.senha || '***'} />
                        <CredencialRow label="Device Key" value="XXXX-XXXX-XXXX" masked />
                      </>
                    )}
                    {!modalCredenciais.app.toLowerCase().includes('xcloud') && (
                      <>
                        <CredencialRow label="Codigo" value={`#${Math.floor(Math.random() * 9000) + 1000}`} />
                        <CredencialRow label="Usuario" value={modalCredenciais.usuario || 'user_' + modalCredenciais.id} />
                        <CredencialRow label="Senha" value={modalCredenciais.senha || '***'} />
                      </>
                    )}
                  </div>
                </div>

                {/* Opção trocar servidor/app */}
                <button
                  onClick={() => {
                    setModalCredenciais(null)
                    addToast('info', 'Selecione o novo app/servidor')
                  }}
                  className="w-full h-11 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Trocar servidor/app
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Codex IA */}
      <AnimatePresence>
        {modalCodex && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)' }}
            onClick={() => { setModalCodex(null); setCodexPrompt('') }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl overflow-hidden"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-violet-400" />
                    <h2 className="text-lg font-bold text-white">Codex IA</h2>
                  </div>
                  <button onClick={() => { setModalCodex(null); setCodexPrompt('') }} className="p-1 rounded-lg hover:bg-white/10">
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Gerar contexto para Codex sobre {modalCodex.nome}</p>
              </div>

              <div className="p-5 space-y-4">
                {/* Info do cliente */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)' }}>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500">Cliente:</span>
                      <span className="text-slate-200 ml-2">{modalCodex.nome}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Telefone:</span>
                      <span className="text-slate-200 ml-2">{modalCodex.telefone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">App:</span>
                      <span className="text-slate-200 ml-2">{modalCodex.app}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Servidor:</span>
                      <span className="text-slate-200 ml-2">{modalCodex.servidor}</span>
                    </div>
                  </div>
                </div>

                {/* Campo de pergunta/problema */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Pergunta ou problema
                  </label>
                  <textarea
                    value={codexPrompt}
                    onChange={(e) => setCodexPrompt(e.target.value)}
                    placeholder="Ex: Cliente relata que app trava ao abrir. O que pode ser?"
                    className="w-full h-32 rounded-xl p-4 text-sm text-white placeholder:text-slate-600 outline-none resize-none"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>

                {/* Ações rápidas */}
                <div className="flex gap-2 flex-wrap">
                  {['App travando', 'Sem canais', 'Erro de login', 'Tela preta', 'Lentidão'].map(sugestao => (
                    <button
                      key={sugestao}
                      onClick={() => setCodexPrompt(sugestao)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
                    >
                      {sugestao}
                    </button>
                  ))}
                </div>

                {/* Botões */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => { setModalCodex(null); setCodexPrompt('') }}
                    className="h-11 rounded-xl text-sm font-medium"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleEnviarCodex}
                    className="h-11 rounded-xl text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', boxShadow: '0 4px 16px rgba(139,92,246,0.3)' }}
                  >
                    Copiar para Codex
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Componente auxiliar para credenciais
function CredencialRow({ label, value, masked }: { label: string; value: string; masked?: boolean }) {
  const { addToast } = useToast()
  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    addToast('success', `${label} copiado!`)
  }
  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <div>
        <span className="text-[10px] text-slate-500 uppercase">{label}</span>
        <p className="text-sm font-mono text-slate-200">{masked ? '••••••••' : value}</p>
      </div>
      <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-white/10">
        <Copy className="h-4 w-4 text-slate-500" />
      </button>
    </div>
  )
}
