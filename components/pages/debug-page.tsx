'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  XCircle,
  Copy,
  Trash2,
  FileText,
  TestTube2,
  Zap,
  RefreshCw,
  Cloud,
  Search
} from 'lucide-react'
import { 
  MOCK_LOGS, 
  type LogEntry 
} from '@/lib/mock-data'
import { useToast } from '@/components/ui/toast'

// Tipos de log expandidos
const LOG_TYPE: Record<string, { icon: React.FC<{ className?: string; style?: React.CSSProperties }>; color: string; label: string }> = {
  info:    { icon: Info,          color: '#3b82f6', label: 'INFO' },
  success: { icon: CheckCircle2,  color: '#22c55e', label: 'OK' },
  warning: { icon: AlertTriangle, color: '#f59e0b', label: 'AVISO' },
  erro:    { icon: XCircle,       color: '#ef4444', label: 'ERRO' },
}

// Categorias de filtro
const CATEGORIAS = [
  { id: 'todos', label: 'Todos', icon: FileText, color: '#94a3b8' },
  { id: 'erro', label: 'Erros', icon: XCircle, color: '#ef4444' },
  { id: 'warning', label: 'Avisos', icon: AlertTriangle, color: '#f59e0b' },
  { id: 'success', label: 'Sucessos', icon: CheckCircle2, color: '#22c55e' },
  { id: 'xcloud', label: 'XCloud', icon: Cloud, color: '#14b8a6' },
  { id: 'testes', label: 'Testes', icon: TestTube2, color: '#3b82f6' },
  { id: 'ativacoes', label: 'Ativacoes', icon: Zap, color: '#f59e0b' },
  { id: 'renovacoes', label: 'Renovacoes', icon: RefreshCw, color: '#8b5cf6' },
]

// ——— Linha de log estilo operacional ———
function LogLine({ log }: { log: LogEntry }) {
  const cfg = LOG_TYPE[log.tipo] || LOG_TYPE.info
  const Icon = cfg.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 py-2.5 px-4 hover:bg-white/[0.02] rounded-lg transition-colors"
    >
      <span className="text-slate-600 shrink-0 w-16 text-xs tabular-nums">{log.timestamp}</span>
      <span
        className="text-[10px] font-bold shrink-0 px-1.5 py-0.5 rounded w-12 text-center"
        style={{ color: cfg.color, background: `${cfg.color}12` }}
      >
        {cfg.label}
      </span>
      <Icon className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: cfg.color }} />
      <span className="text-sm text-slate-300 flex-1">{log.mensagem}</span>
      {log.detalhes && (
        <span className="text-xs text-slate-600 truncate max-w-[200px]">{log.detalhes}</span>
      )}
    </motion.div>
  )
}

// ——— Page ———
export function DebugPage() {
  const [logs, setLogs] = useState(MOCK_LOGS)
  const [dataSource, setDataSource] = useState<'mock' | 'supabase'>('mock')
  const [filter, setFilter] = useState<string>('todos')
  const [search, setSearch] = useState('')
  const { addToast } = useToast()

  useEffect(() => {
    let alive = true
    async function load() {
      try {
        const res = await fetch('/api/logs', { cache: 'no-store' })
        if (!res.ok) throw new Error('Falha ao carregar logs')
        const payload = await res.json()
        if (!alive) return
        setLogs(Array.isArray(payload.items) ? payload.items : MOCK_LOGS)
        setDataSource(payload.data_source === 'supabase' ? 'supabase' : 'mock')
      } catch {
        if (!alive) return
        setLogs(MOCK_LOGS)
        setDataSource('mock')
      }
    }
    load()
    return () => { alive = false }
  }, [])

  // Filtrar logs por tipo e categoria
  const logsFiltrados = logs.filter(l => {
    // Filtro de busca
    if (search) {
      const s = search.toLowerCase()
      if (!l.mensagem.toLowerCase().includes(s) && !(l.detalhes?.toLowerCase().includes(s))) {
        return false
      }
    }
    
    // Filtro de categoria
    if (filter === 'todos') return true
    if (filter === 'erro') return l.tipo === 'erro'
    if (filter === 'warning') return l.tipo === 'warning'
    if (filter === 'success') return l.tipo === 'success'
    if (filter === 'xcloud') return l.mensagem.toLowerCase().includes('xcloud') || l.mensagem.toLowerCase().includes('device')
    if (filter === 'testes') return l.mensagem.toLowerCase().includes('teste') || l.mensagem.toLowerCase().includes('test')
    if (filter === 'ativacoes') return l.mensagem.toLowerCase().includes('ativ') || l.mensagem.toLowerCase().includes('client')
    if (filter === 'renovacoes') return l.mensagem.toLowerCase().includes('renov')
    return true
  })

  const metricas = {
    total: logs.length,
    erros: logs.filter(l => l.tipo === 'erro').length,
    warnings: logs.filter(l => l.tipo === 'warning').length,
    success: logs.filter(l => l.tipo === 'success').length,
    xcloud: logs.filter(l => l.mensagem.toLowerCase().includes('xcloud') || l.mensagem.toLowerCase().includes('device')).length,
    testes: logs.filter(l => l.mensagem.toLowerCase().includes('teste') || l.mensagem.toLowerCase().includes('test')).length,
    ativacoes: logs.filter(l => l.mensagem.toLowerCase().includes('ativ') || l.mensagem.toLowerCase().includes('client')).length,
    renovacoes: logs.filter(l => l.mensagem.toLowerCase().includes('renov')).length,
  }

  const handleCopy = () => {
    const txt = logsFiltrados.map(l => `[${l.timestamp}] [${LOG_TYPE[l.tipo]?.label || l.tipo.toUpperCase()}] ${l.mensagem}${l.detalhes ? ` - ${l.detalhes}` : ''}`).join('\n')
    navigator.clipboard.writeText(txt)
    addToast('success', 'Logs copiados!')
  }

  const handleClear = () => {
    setLogs([])
    addToast('info', 'Logs limpos localmente')
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div className="shrink-0 px-6 py-5 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div 
            className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}
          >
            <FileText className="h-5 w-5" style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Logs</h1>
            <p className="text-xs text-slate-500">{metricas.total} registros · {metricas.erros} erros</p>
            <p className="mt-1 inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-[10px] font-medium"
               style={{ background: dataSource === 'supabase' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', color: dataSource === 'supabase' ? '#4ade80' : '#fbbf24' }}>
              Fonte: {dataSource === 'supabase' ? 'Supabase' : 'Mock'}
            </p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: '#94a3b8' }}
          >
            <Copy className="h-3.5 w-3.5" />
            Copiar
          </button>
          <button
            onClick={handleClear}
            className="h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171' }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Limpar
          </button>
        </div>
      </div>

      {/* Busca */}
      <div className="shrink-0 px-6 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nos logs..."
            className="w-full h-9 rounded-lg pl-9 pr-3 text-sm text-white placeholder:text-slate-600 outline-none"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}
          />
        </div>
      </div>

      {/* Filtros por categoria */}
      <div className="shrink-0 px-6 py-3 border-b flex items-center gap-2 overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {CATEGORIAS.map((cat) => {
          const count = cat.id === 'todos' ? metricas.total
            : cat.id === 'erro' ? metricas.erros
            : cat.id === 'warning' ? metricas.warnings
            : cat.id === 'success' ? metricas.success
            : cat.id === 'xcloud' ? metricas.xcloud
            : cat.id === 'testes' ? metricas.testes
            : cat.id === 'ativacoes' ? metricas.ativacoes
            : cat.id === 'renovacoes' ? metricas.renovacoes
            : 0
          const ativo = filter === cat.id
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className="px-3 h-8 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 shrink-0"
              style={
                ativo
                  ? { background: `${cat.color}22`, border: `1px solid ${cat.color}44`, color: cat.color }
                  : { background: 'transparent', border: '1px solid transparent', color: '#64748b' }
              }
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.label}
              <span
                className="px-1.5 py-0.5 rounded text-[9px] font-semibold"
                style={{ background: 'rgba(255,255,255,0.05)', color: ativo ? cat.color : '#94a3b8' }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Lista de logs */}
      <div 
        className="flex-1 overflow-y-auto p-4"
      >
        {logsFiltrados.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-10 w-10 mx-auto mb-3" style={{ color: '#1e293b' }} />
              <p className="text-slate-600 text-sm">Nenhum log encontrado</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {logsFiltrados.map((log) => (
              <LogLine key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div 
        className="shrink-0 px-4 py-2 flex items-center justify-between text-[10px] border-t"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-4 text-slate-600">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#22c55e' }} />
            Sistema online
          </span>
        </div>
        <span className="text-slate-600">{new Date().toLocaleString('pt-BR')}</span>
      </div>
    </div>
  )
}
