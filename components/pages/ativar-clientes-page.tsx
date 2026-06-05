'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, UserPlus, Users, CheckCircle, Zap, DollarSign,
  Phone, Server, Package, ChevronRight, AlertCircle, Copy
} from 'lucide-react'
import { MOCK_CLIENTES, type Cliente } from '@/lib/mock-data'
import { useToast } from '@/components/ui/toast'

// Planos oficiais
const PLANOS = [
  { id: 'mensal', label: 'Mensal', valor: 20, dias: 30 },
  { id: 'trimestral', label: 'Trimestral', valor: 50, dias: 90 },
  { id: 'semestral', label: 'Semestral', valor: 90, dias: 180 },
  { id: 'anual', label: 'Anual', valor: 150, dias: 365 },
]

// Apps disponíveis
const APPS = [
  { id: 'xcloud', label: 'XCloud', color: '#14b8a6' },
  { id: 'blessed', label: 'Blessed Player', color: '#ef4444' },
  { id: 'playsim', label: 'PlaySim', color: '#f97316' },
  { id: 'funplay', label: 'FunPlay', color: '#8b5cf6' },
  { id: 'smart_stb', label: 'Smart STB', color: '#3b82f6' },
]

// Painéis geradores
const PAINEIS = [
  { id: 'yellow', label: 'Yellow Box' },
  { id: 'ninety', label: 'Ninety' },
  { id: 'cinemax', label: 'CineMax' },
]

// Tipo para conta/vaga
interface ContaVaga {
  id: string
  painel: string
  usuario: string
  senha: string
  telasUsadas: number
  telasTotal: number
}

// Simular vagas disponíveis
const MOCK_VAGAS: ContaVaga[] = [
  { id: '1', painel: 'yellow', usuario: 'user_conta1', senha: '***', telasUsadas: 1, telasTotal: 2 },
  { id: '2', painel: 'ninety', usuario: 'user_conta2', senha: '***', telasUsadas: 0, telasTotal: 1 },
]

type Step = 'busca' | 'cliente' | 'app_plano' | 'confirmar'

export function AtivarClientesPage() {
  const [step, setStep] = useState<Step>('busca')
  const [search, setSearch] = useState('')
  const [clientes, setClientes] = useState<Cliente[]>(MOCK_CLIENTES)
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null)
  const [appSelecionado, setAppSelecionado] = useState('')
  const [painelSelecionado, setPainelSelecionado] = useState('')
  const [planoSelecionado, setPlanoSelecionado] = useState('')
  const [vagaDisponivel, setVagaDisponivel] = useState<ContaVaga | null>(null)
  const [usarVaga, setUsarVaga] = useState(false)
  const [ativando, setAtivando] = useState(false)
  const { addToast } = useToast()

  // Carregar clientes
  useEffect(() => {
    let alive = true
    async function load() {
      try {
        const res = await fetch('/api/clients', { cache: 'no-store' })
        if (!res.ok) throw new Error('Falha ao carregar clientes')
        const payload = await res.json()
        if (!alive) return
        setClientes(Array.isArray(payload.items) ? payload.items : MOCK_CLIENTES)
      } catch {
        if (!alive) return
        setClientes(MOCK_CLIENTES)
      }
    }
    load()
    return () => { alive = false }
  }, [])

  // Verificar vaga disponível quando app/painel mudar
  useEffect(() => {
    if (appSelecionado && painelSelecionado) {
      const vaga = MOCK_VAGAS.find(v => 
        v.painel === painelSelecionado && v.telasUsadas < v.telasTotal
      )
      setVagaDisponivel(vaga || null)
      setUsarVaga(false)
    } else {
      setVagaDisponivel(null)
      setUsarVaga(false)
    }
  }, [appSelecionado, painelSelecionado])

  // Filtrar clientes
  const clientesFiltrados = clientes.filter(c => {
    const s = search.toLowerCase()
    return c.nome.toLowerCase().includes(s) || 
           c.telefone.includes(search) ||
           (c.usuario && c.usuario.toLowerCase().includes(s))
  })

  // Handlers
  const handleSelecionarCliente = (cliente: Cliente) => {
    setClienteSelecionado(cliente)
    // Se cliente já tem app/plano, pré-selecionar
    if (cliente.app) {
      const appKey = cliente.app.toLowerCase().replace(/\s+/g, '_')
      setAppSelecionado(APPS.find(a => a.id === appKey)?.id || '')
    }
    if (cliente.servidor) {
      const painelKey = cliente.servidor.toLowerCase().replace(/\s+/g, '')
      setPainelSelecionado(PAINEIS.find(p => p.id === painelKey)?.id || '')
    }
    if (cliente.plano) {
      setPlanoSelecionado(cliente.plano.toLowerCase())
    }
    setStep('app_plano')
  }

  const handleCriarNovoCliente = () => {
    setClienteSelecionado(null)
    setStep('cliente')
  }

  const handleAvancarConfirmacao = () => {
    if (!appSelecionado || !painelSelecionado || !planoSelecionado) {
      addToast('error', 'Selecione app, painel e plano')
      return
    }
    setStep('confirmar')
  }

  const handleAtivarCliente = async () => {
    setAtivando(true)
    try {
      const res = await fetch('/api/activations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clienteSelecionado?.id,
          client_name: clienteSelecionado?.nome || search,
          client_phone: clienteSelecionado?.telefone || '',
          app_key: appSelecionado,
          panel_key: painelSelecionado,
          plan_key: planoSelecionado,
          use_existing_slot: usarVaga,
          slot_id: usarVaga ? vagaDisponivel?.id : undefined,
        }),
      })
      const data = await res.json().catch(() => null)
      if (data?.success) {
        addToast('success', 'Cliente ativado com sucesso!')
        // Enviar contexto para Painel 2
        const params = new URLSearchParams({
          source: 'painel1',
          client_id: clienteSelecionado?.id || '',
          flow: 'client_activated',
        })
        window.open(`https://painel2.centralplayplus.com.br?${params.toString()}`, '_blank')
        // Resetar
        setStep('busca')
        setSearch('')
        setClienteSelecionado(null)
        setAppSelecionado('')
        setPainelSelecionado('')
        setPlanoSelecionado('')
      } else {
        addToast('error', data?.error || 'Falha ao ativar cliente')
      }
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Erro ao ativar')
    } finally {
      setAtivando(false)
    }
  }

  const planoInfo = PLANOS.find(p => p.id === planoSelecionado)
  const appInfo = APPS.find(a => a.id === appSelecionado)
  const painelInfo = PAINEIS.find(p => p.id === painelSelecionado)

  // Usar valor do cliente se existir, senão usar valor do plano
  const valorFinal = clienteSelecionado?.valor || planoInfo?.valor || 0

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8 max-w-xl">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Zap className="h-4 w-4" style={{ color: '#22c55e' }} />
          <span className="text-xs text-slate-500 uppercase tracking-widest font-medium">Ativacao</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Ativar clientes
        </h1>
        <p className="text-slate-500 text-sm">
          Ative clientes pagos com acesso completo
        </p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {['Busca', 'App/Plano', 'Confirmar'].map((label, i) => {
          const stepIndex = ['busca', 'app_plano', 'confirmar'].indexOf(step)
          const isActive = i === stepIndex || (step === 'cliente' && i === 0)
          const isDone = i < stepIndex || (step === 'cliente' && i === 0)
          return (
            <div key={label} className="flex items-center">
              <div
                className="flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold"
                style={{
                  background: isDone ? '#22c55e' : isActive ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
                  color: isDone ? 'white' : isActive ? '#60a5fa' : '#64748b',
                  border: isActive ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {isDone ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              {i < 2 && (
                <div className="w-12 h-0.5 mx-2 rounded-full" style={{ background: isDone ? '#22c55e' : 'rgba(255,255,255,0.1)' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Content */}
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {/* Step: Busca */}
          {(step === 'busca' || step === 'cliente') && (
            <motion.div
              key="busca"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Campo de busca grande */}
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar cliente por nome, telefone ou usuario..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-14 pl-14 pr-4 rounded-2xl text-base text-white placeholder:text-slate-600 outline-none"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                  autoFocus
                />
              </div>

              {/* Resultados */}
              {search.length > 0 && (
                <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  {clientesFiltrados.length > 0 ? (
                    <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                      {clientesFiltrados.slice(0, 5).map(cliente => (
                        <button
                          key={cliente.id}
                          onClick={() => handleSelecionarCliente(cliente)}
                          className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.03] transition-colors"
                        >
                          <div className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                               style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>
                            {cliente.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{cliente.nome}</p>
                            <p className="text-xs text-slate-500">{cliente.telefone} · {cliente.app}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-slate-600" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Users className="h-10 w-10 mx-auto mb-3" style={{ color: '#1e293b' }} />
                      <p className="text-slate-500 text-sm mb-4">Nenhum cliente encontrado</p>
                    </div>
                  )}

                  {/* Botão criar novo cliente */}
                  <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <button
                      onClick={handleCriarNovoCliente}
                      className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-medium transition-all"
                      style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}
                    >
                      <UserPlus className="h-4 w-4" />
                      Criar novo cliente
                    </button>
                  </div>
                </div>
              )}

              {/* Estado inicial */}
              {search.length === 0 && (
                <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <Search className="h-10 w-10 mx-auto mb-3" style={{ color: '#1e293b' }} />
                  <p className="text-slate-500 text-sm mb-2">Pesquise um cliente existente</p>
                  <p className="text-slate-600 text-xs">ou crie um novo cliente para ativar</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Step: App/Plano */}
          {step === 'app_plano' && (
            <motion.div
              key="app_plano"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Cliente selecionado */}
              {clienteSelecionado && (
                <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center text-sm font-bold"
                         style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>
                      {clienteSelecionado.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{clienteSelecionado.nome}</p>
                      <p className="text-xs text-slate-500">{clienteSelecionado.telefone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Selecionar App */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Aplicativo
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {APPS.map(app => (
                    <button
                      key={app.id}
                      onClick={() => setAppSelecionado(app.id)}
                      className="p-4 rounded-xl text-center transition-all"
                      style={{
                        background: appSelecionado === app.id ? `${app.color}15` : 'var(--card)',
                        border: appSelecionado === app.id ? `2px solid ${app.color}` : '1px solid var(--border)',
                      }}
                    >
                      <p className="text-sm font-semibold" style={{ color: appSelecionado === app.id ? app.color : '#94a3b8' }}>
                        {app.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selecionar Painel */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Painel gerador
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {PAINEIS.map(painel => (
                    <button
                      key={painel.id}
                      onClick={() => setPainelSelecionado(painel.id)}
                      className="p-4 rounded-xl text-center transition-all"
                      style={{
                        background: painelSelecionado === painel.id ? 'rgba(59,130,246,0.15)' : 'var(--card)',
                        border: painelSelecionado === painel.id ? '2px solid #3b82f6' : '1px solid var(--border)',
                      }}
                    >
                      <p className="text-sm font-semibold" style={{ color: painelSelecionado === painel.id ? '#60a5fa' : '#94a3b8' }}>
                        {painel.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vaga disponível */}
              {vagaDisponivel && (
                <div className="rounded-xl p-4" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(34,197,94,0.2)' }}>
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-emerald-200">Existe uma vaga livre nesta conta!</p>
                      <p className="text-xs text-emerald-300/70 mt-1">
                        {vagaDisponivel.telasTotal - vagaDisponivel.telasUsadas} vaga disponivel. Economize credito usando estas credenciais.
                      </p>
                      <button
                        onClick={() => setUsarVaga(!usarVaga)}
                        className="mt-3 h-9 px-4 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          background: usarVaga ? '#22c55e' : 'rgba(34,197,94,0.15)',
                          color: usarVaga ? 'white' : '#4ade80',
                          border: usarVaga ? 'none' : '1px solid rgba(34,197,94,0.3)',
                        }}
                      >
                        {usarVaga ? 'Vaga selecionada' : 'Usar esta vaga'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Selecionar Plano */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Plano
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {PLANOS.map(plano => (
                    <button
                      key={plano.id}
                      onClick={() => setPlanoSelecionado(plano.id)}
                      className="p-4 rounded-xl text-left transition-all"
                      style={{
                        background: planoSelecionado === plano.id ? 'rgba(34,197,94,0.15)' : 'var(--card)',
                        border: planoSelecionado === plano.id ? '2px solid #22c55e' : '1px solid var(--border)',
                      }}
                    >
                      <p className="text-sm font-semibold" style={{ color: planoSelecionado === plano.id ? '#4ade80' : '#94a3b8' }}>
                        {plano.label}
                      </p>
                      <p className="text-lg font-bold mt-1" style={{ color: planoSelecionado === plano.id ? '#22c55e' : '#64748b' }}>
                        R$ {plano.valor}
                      </p>
                    </button>
                  ))}
                </div>
                {clienteSelecionado?.valor && clienteSelecionado.valor !== planoInfo?.valor && (
                  <p className="mt-2 text-xs text-amber-400">
                    Cliente tem valor salvo: R$ {clienteSelecionado.valor}
                  </p>
                )}
              </div>

              {/* Botões */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  onClick={() => { setStep('busca'); setClienteSelecionado(null) }}
                  className="h-12 rounded-xl text-sm font-medium"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}
                >
                  Voltar
                </button>
                <button
                  onClick={handleAvancarConfirmacao}
                  disabled={!appSelecionado || !painelSelecionado || !planoSelecionado}
                  className="h-12 rounded-xl text-sm font-bold text-white disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 4px 16px rgba(34,197,94,0.3)' }}
                >
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {/* Step: Confirmar */}
          {step === 'confirmar' && (
            <motion.div
              key="confirmar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="p-6 text-center" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center"
                       style={{ background: 'rgba(34,197,94,0.15)' }}>
                    <Zap className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Confirmar ativacao</h2>
                  <p className="text-sm text-slate-500 mt-1">Revise os dados antes de ativar</p>
                </div>

                <div className="p-6 space-y-4">
                  {clienteSelecionado && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Cliente</span>
                      <span className="text-sm font-semibold text-white">{clienteSelecionado.nome}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Aplicativo</span>
                    <span className="text-sm font-semibold" style={{ color: appInfo?.color }}>{appInfo?.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Painel</span>
                    <span className="text-sm font-semibold text-white">{painelInfo?.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Plano</span>
                    <span className="text-sm font-semibold text-white">{planoInfo?.label}</span>
                  </div>
                  {usarVaga && vagaDisponivel && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Vaga existente</span>
                      <span className="text-sm font-semibold text-emerald-400">Usando vaga livre</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <span className="text-sm font-semibold text-slate-400">Valor</span>
                    <span className="text-2xl font-bold text-emerald-400">R$ {valorFinal}</span>
                  </div>
                </div>
              </div>

              {/* Aviso XCloud */}
              {appSelecionado === 'xcloud' && (
                <div className="rounded-xl p-4" style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)' }}>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-teal-200">Ativacao XCloud</p>
                      <p className="text-xs text-teal-300/70 mt-1">
                        O sistema vai ativar a device XCloud automaticamente com as credenciais corretas.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botões */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setStep('app_plano')}
                  disabled={ativando}
                  className="h-12 rounded-xl text-sm font-medium disabled:opacity-50"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}
                >
                  Voltar
                </button>
                <button
                  onClick={handleAtivarCliente}
                  disabled={ativando}
                  className="h-12 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 4px 16px rgba(34,197,94,0.3)' }}
                >
                  {ativando ? 'Ativando...' : 'Ativar cliente'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
