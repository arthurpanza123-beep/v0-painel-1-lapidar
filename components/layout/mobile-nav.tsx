'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { NavPage } from '@/app/page'
import {
  Headphones, TestTube2, Users, Wallet, RefreshCw, DollarSign,
  AlertTriangle, Sparkles, Terminal, LogOut, Kanban, LayoutDashboard,
  Zap, MoreVertical, X,
} from 'lucide-react'

const NAV_ITEMS: { id: NavPage; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: 'dashboard',       label: 'Dashboard',       Icon: ({ className }) => <LayoutDashboard className={className} /> },
  { id: 'pipeline',        label: 'Pipeline',        Icon: ({ className }) => <Kanban className={className} /> },
  { id: 'gerar-teste',     label: 'Gerar Teste',     Icon: ({ className }) => <Headphones className={className} /> },
  { id: 'testes',          label: 'Testes',          Icon: ({ className }) => <TestTube2 className={className} /> },
  { id: 'ativar-clientes', label: 'Ativar Clientes', Icon: ({ className }) => <Zap className={className} /> },
  { id: 'clientes',        label: 'Clientes',        Icon: ({ className }) => <Users className={className} /> },
  { id: 'contas',          label: 'Contas',          Icon: ({ className }) => <Wallet className={className} /> },
  { id: 'renovacoes',      label: 'Renovacoes',      Icon: ({ className }) => <RefreshCw className={className} /> },
  { id: 'financeiro',      label: 'Financeiro',      Icon: ({ className }) => <DollarSign className={className} /> },
  { id: 'problemas',       label: 'Problemas',       Icon: ({ className }) => <AlertTriangle className={className} /> },
  { id: 'codex',           label: 'Codex',           Icon: ({ className }) => <Sparkles className={className} /> },
  { id: 'debug',           label: 'Logs',            Icon: ({ className }) => <Terminal className={className} /> },
]

interface MobileNavProps {
  activePage: NavPage
  onNavigate: (page: NavPage) => void
}

export function MobileNav({ activePage, onNavigate }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const activeLabel = NAV_ITEMS.find((item) => item.id === activePage)?.label ?? 'Painel'

  const handleNavigate = (page: NavPage) => {
    onNavigate(page)
    setOpen(false)
  }

  return (
    <>
      {/* Barra superior mobile */}
      <header
        className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 shrink-0"
        style={{ background: 'var(--sidebar)', borderBottom: '1px solid var(--sidebar-border)' }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg overflow-hidden"
            style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.28)' }}
          >
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" aria-label="Central Play Plus">
              <path d="M14 11L30 20L14 29V11Z" fill="#3b82f6" />
              <rect x="26" y="7" width="2" height="8" rx="1" fill="#60a5fa" opacity="0.7" />
              <rect x="23" y="10" width="8" height="2" rx="1" fill="#60a5fa" opacity="0.7" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: 'var(--font-display)' }}>{activeLabel}</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </header>

      {/* Gaveta de navegação */}
      <AnimatePresence>
        {open && (
          <div className="md:hidden">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(7,10,18,0.65)' }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 max-w-[80vw] flex flex-col overflow-y-auto"
              style={{ background: 'var(--background)', borderLeft: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between px-4 h-14 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Navegação</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Fechar menu"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-1 p-3 flex-1">
                {NAV_ITEMS.map(({ id, label, Icon }) => {
                  const isActive = activePage === id
                  return (
                    <button
                      key={id}
                      onClick={() => handleNavigate(id)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-medium transition-all',
                        isActive ? 'text-white' : 'text-slate-400 hover:text-white',
                      )}
                      style={isActive ? {
                        background: 'rgba(59,130,246,0.16)',
                        border: '1px solid rgba(59,130,246,0.32)',
                      } : { border: '1px solid transparent' }}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      {label}
                    </button>
                  )
                })}
              </div>

              <div className="p-3 shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
                <button
                  className="flex items-center gap-3 rounded-xl px-3 h-11 w-full text-sm font-medium text-slate-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-[18px] w-[18px] shrink-0" />
                  Sair
                </button>
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
