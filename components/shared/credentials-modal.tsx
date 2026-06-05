'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Copy, ExternalLink, KeyRound, Server, Monitor, Tv2, Smartphone,
  Globe, Download, Hash, ChevronRight, Check, Tv,
} from 'lucide-react'
import type { Cliente } from '@/lib/mock-data'
import {
  buildClientCredentials, listClientCompatibleApps, resolveProvider, isXCloud,
} from '@/lib/services/client-credentials'
import { buildProviderCredentials, type ProviderApp } from '@/lib/config/provider-catalog'
import { useToast } from '@/components/ui/toast'

// ——— Linha de credencial copiavel ———
function CopyRow({
  label, value, mono = true, accent = '#94a3b8',
}: {
  label: string
  value?: string
  mono?: boolean
  accent?: string
}) {
  const { addToast } = useToast()
  const [copied, setCopied] = useState(false)
  if (!value) return null

  const copy = () => {
    navigator.clipboard.writeText(value)
    addToast('success', `${label} copiado`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <button
      onClick={copy}
      className="w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-white/[0.04]"
      style={{ background: 'rgba(255,255,255,0.02)' }}
    >
      <div className="min-w-0">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
        <p className={`text-xs text-slate-200 truncate ${mono ? 'font-mono' : ''}`}>{value}</p>
      </div>
      {copied ? (
        <Check className="h-3.5 w-3.5 shrink-0" style={{ color: '#4ade80' }} />
      ) : (
        <Copy className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
      )}
    </button>
  )
}

// ——— Card de app compativel ———
function AppCard({
  cliente, app, providerKey, defaultOpen = false,
}: {
  cliente: Cliente
  app: ProviderApp
  providerKey: string
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const { addToast } = useToast()

  const cred = useMemo(() => {
    try {
      return buildProviderCredentials({
        provider: providerKey,
        app: app.key,
        username: cliente.usuario,
        password: cliente.senha,
      })
    } catch {
      return undefined
    }
  }, [providerKey, app.key, cliente.usuario, cliente.senha])

  if (!cred) return null

  const copyAll = () => {
    const linhas = [
      `App: ${cred.app}`,
      cred.providerCode ? `Provider: ${cred.providerCode}` : '',
      cred.code ? `Codigo: ${cred.code}` : '',
      cred.dns ? `DNS: ${cred.dns}` : '',
      cred.host ? `Host: ${cred.host}` : '',
      cred.username ? `Usuario: ${cred.username}` : '',
      cred.password ? `Senha: ${cred.password}` : '',
    ].filter(Boolean).join('\n')
    navigator.clipboard.writeText(linhas)
    addToast('success', `Credenciais ${cred.app} copiadas`)
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: app.recommended ? 'rgba(34,197,94,0.12)' : 'rgba(59,130,246,0.1)' }}
        >
          <Tv className="h-4 w-4" style={{ color: app.recommended ? '#4ade80' : '#60a5fa' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-white truncate">{cred.app}</p>
            {app.recommended && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0"
                    style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>
                Recomendado
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {cred.providerCode ? `Provider ${cred.providerCode}` : cred.code ? `Codigo ${cred.code}` : cred.dns ? `DNS ${cred.dns}` : 'Usuario e senha'}
          </p>
        </div>
        <ChevronRight
          className="h-4 w-4 text-slate-600 shrink-0 transition-transform"
          style={{ transform: open ? 'rotate(90deg)' : 'none' }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-1.5">
              {cred.providerCode && <CopyRow label="Provider" value={cred.providerCode} accent="#60a5fa" />}
              {cred.code && <CopyRow label="Codigo" value={cred.code} accent="#60a5fa" />}
              {cred.dns && <CopyRow label="DNS" value={cred.dns} accent="#f59e0b" />}
              {cred.host && <CopyRow label="Host" value={cred.host} accent="#f59e0b" />}
              <CopyRow label="Usuario" value={cred.username} accent="#14b8a6" />
              <CopyRow label="Senha" value={cred.password} accent="#14b8a6" />
              {cred.m3uUrl && <CopyRow label="M3U" value={cred.m3uUrl} accent="#a78bfa" />}
              {cred.hlsUrl && <CopyRow label="HLS" value={cred.hlsUrl} accent="#a78bfa" />}
              {cred.link && <CopyRow label="Download" value={cred.link} mono={false} accent="#94a3b8" />}
              {cred.downloader && <CopyRow label="Downloader" value={cred.downloader} accent="#94a3b8" />}

              <button
                onClick={copyAll}
                className="w-full h-9 mt-1 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
                style={{ background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.2)', color: '#5eead4' }}
              >
                <Copy className="h-3.5 w-3.5" /> Copiar dados do {cred.app}
              </button>
              {cred.installHint && (
                <p className="text-[10px] text-slate-500 leading-relaxed px-1 pt-1">{cred.installHint}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function CredentialsModal({
  cliente,
  onClose,
  segundaTela = false,
}: {
  cliente: Cliente | null
  onClose: () => void
  segundaTela?: boolean
}) {
  const { addToast } = useToast()

  const provider = useMemo(() => (cliente ? resolveProvider(cliente.servidor) : undefined), [cliente])
  const baseCred = useMemo(() => (cliente ? buildClientCredentials(cliente) : undefined), [cliente])
  const { apps } = useMemo(
    () => (cliente ? listClientCompatibleApps(cliente) : { apps: [] }),
    [cliente],
  )
  const xcloud = cliente ? isXCloud(cliente.app) : false

  const abrirPainelProvedor = () => {
    const url = provider?.panelUrl
    if (url) {
      window.open(url, '_blank')
      addToast('success', `Abrindo painel ${provider?.name}`)
    } else {
      addToast('info', 'Painel do provedor nao mapeado para este servidor')
    }
  }

  const confirmarSegundaTela = () => {
    if (!cliente) return
    if (cliente.usuario) navigator.clipboard.writeText(cliente.usuario)
    const params = new URLSearchParams({
      source: 'painel1',
      client_id: cliente.id,
      flow: 'second_screen_activated',
    })
    window.open(`https://painel2.centralplayplus.com.br?${params.toString()}`, '_blank')
    addToast('success', 'Segunda tela enviada para o Painel 2')
    onClose()
  }

  const accent = segundaTela ? '#f59e0b' : '#14b8a6'
  const accentBg = segundaTela ? 'rgba(245,158,11,0.12)' : 'rgba(20,184,166,0.12)'

  return (
    <AnimatePresence>
      {cliente && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(5,7,12,0.78)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            className="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
            style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                       style={{ background: accentBg }}>
                    {segundaTela ? <Tv2 className="h-5 w-5" style={{ color: accent }} /> : <KeyRound className="h-5 w-5" style={{ color: accent }} />}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                      {segundaTela ? 'Ativar segunda tela' : 'Playlist / Credenciais'}
                    </h2>
                    <p className="text-xs text-slate-500">{cliente.nome}</p>
                  </div>
                </div>
                <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Conteudo */}
            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Resumo do cliente */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1"><Smartphone className="h-3 w-3" /> App atual</p>
                  <p className="text-xs text-slate-200 truncate mt-0.5">{cliente.app}</p>
                </div>
                <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1"><Server className="h-3 w-3" /> Servidor</p>
                  <p className="text-xs text-slate-200 truncate mt-0.5">{provider?.name || cliente.servidor}</p>
                </div>
              </div>

              {segundaTela && (
                <div className="rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <p className="text-xs font-medium text-amber-200">Use esta vaga para a segunda tela</p>
                  <p className="text-[11px] text-amber-300/70 mt-0.5">
                    Copie o usuario, abra o painel do provedor e confirme. O Painel 2 envia a mensagem ao cliente.
                  </p>
                </div>
              )}

              {/* Credenciais principais */}
              <div className="rounded-xl p-4" style={{ background: accentBg, border: `1px solid ${accent}33` }}>
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound className="h-4 w-4" style={{ color: accent }} />
                  <span className="text-sm font-semibold" style={{ color: accent }}>Acesso principal</span>
                </div>
                <div className="space-y-1.5">
                  <CopyRow label="Usuario" value={cliente.usuario} accent={accent} />
                  <CopyRow label="Senha" value={cliente.senha} accent={accent} />
                  {baseCred?.host && <CopyRow label="Host / DNS" value={baseCred.host} accent={accent} />}
                  {baseCred?.m3uUrl && <CopyRow label="M3U / HLS" value={baseCred.m3uUrl} accent={accent} />}
                </div>
              </div>

              {/* XCloud aviso */}
              {xcloud && (
                <div className="rounded-xl p-3 flex items-start gap-2" style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)' }}>
                  <Monitor className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#5eead4' }} />
                  <p className="text-[11px] text-teal-200/90 leading-relaxed">
                    Cliente XCloud: a ativacao do device e feita pelo Worker controlado. As credenciais abaixo servem para apps alternativos no mesmo provedor.
                  </p>
                </div>
              )}

              {/* Apps compativeis */}
              {apps.length > 0 && (
                <div>
                  <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2">
                    Apps compativeis · {provider?.name}
                  </p>
                  <div className="space-y-2">
                    {apps.slice(0, 8).map((app, i) => (
                      <AppCard
                        key={app.key}
                        cliente={cliente}
                        app={app}
                        providerKey={provider!.key}
                        defaultOpen={i === 0}
                      />
                    ))}
                  </div>
                </div>
              )}

              {apps.length === 0 && (
                <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                  <Globe className="h-7 w-7 mx-auto mb-2" style={{ color: '#334155' }} />
                  <p className="text-xs text-slate-500">Servidor sem catalogo de apps mapeado.</p>
                  <p className="text-[11px] text-slate-600 mt-1">Use o acesso principal acima.</p>
                </div>
              )}
            </div>

            {/* Acoes */}
            <div className="p-4 flex gap-2 shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
              <button
                onClick={abrirPainelProvedor}
                className="flex-1 h-11 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa' }}
              >
                <ExternalLink className="h-4 w-4" /> Abrir painel
              </button>
              {segundaTela ? (
                <button
                  onClick={confirmarSegundaTela}
                  className="flex-1 h-11 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  style={{ background: '#f59e0b', color: '#1a1205' }}
                >
                  <Tv2 className="h-4 w-4" /> Confirmar segunda tela
                </button>
              ) : (
                <button
                  onClick={() => { if (cliente.usuario) { navigator.clipboard.writeText(cliente.usuario); addToast('success', 'Usuario copiado') } }}
                  className="flex-1 h-11 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                  style={{ background: accentBg, border: `1px solid ${accent}33`, color: accent }}
                >
                  <Copy className="h-4 w-4" /> Copiar usuario
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
