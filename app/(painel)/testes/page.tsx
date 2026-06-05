"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, RefreshCw, MessageCircle, ArrowRightLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface Teste {
  id: string
  cliente: string
  telefone: string
  app: string
  servidor: string
  statusTeste: "Expirado" | "Ativo" | "Aguardando"
  statusCliente: "Ativo" | "Aguardando" | "Expirado" | "Pago"
  restante: string
}

const TESTES_DEMO: Teste[] = [
  { id: "1", cliente: "Arthur", telefone: "(55) •••••-3304", app: "XCloud", servidor: "Brasil / Yellow Box", statusTeste: "Expirado", statusCliente: "Ativo", restante: "RESTANTE" },
  { id: "2", cliente: "XCloud Worker Real 1780613238245", telefone: "(55) •••••-8245", app: "XCloud", servidor: "Brasil / Yellow Box", statusTeste: "Expirado", statusCliente: "Ativo", restante: "RESTANTE" },
  { id: "3", cliente: "Blessed Worker Reject 1780612748471", telefone: "(55) •••••-8471", app: "Blessed Player", servidor: "Brasil / Yellow Box", statusTeste: "Expirado", statusCliente: "Ativo", restante: "RESTANTE" },
  { id: "4", cliente: "Worker Disabled 1780612735839", telefone: "(55) •••••-5839", app: "XCloud", servidor: "Brasil / Yellow Box", statusTeste: "Expirado", statusCliente: "Ativo", restante: "RESTANTE" },
  { id: "5", cliente: "Real PlaySim 1780612092199", telefone: "(55) •••••-2199", app: "PlaySim", servidor: "Brasil / Yellow Box", statusTeste: "Expirado", statusCliente: "Ativo", restante: "RESTANTE" },
  { id: "6", cliente: "Real Blessed 1780612092199", telefone: "(55) •••••-2199", app: "Blessed Player", servidor: "Brasil / Yellow Box", statusTeste: "Expirado", statusCliente: "Ativo", restante: "RESTANTE" },
  { id: "7", cliente: "Real XCloud 1780612092199", telefone: "(55) •••••-2199", app: "XCloud", servidor: "Brasil / Yellow Box", statusTeste: "Expirado", statusCliente: "Ativo", restante: "RESTANTE" },
  { id: "8", cliente: "Codex Blessed 1780611801112", telefone: "(55) •••••-1112", app: "XCloud", servidor: "Brasil / Yellow Box", statusTeste: "Expirado", statusCliente: "Ativo", restante: "RESTANTE" },
]

const FILTROS = ["Todos", "Ativo", "Aguardando", "Expirado", "Pago"] as const
type Filtro = (typeof FILTROS)[number]

export default function TestesPage() {
  const [filtro, setFiltro] = useState<Filtro>("Todos")
  const [busca, setBusca] = useState("")

  const ativos = TESTES_DEMO.filter((t) => t.statusCliente === "Ativo").length
  const expirando = TESTES_DEMO.filter((t) => t.statusTeste === "Expirado").length
  const pagos = 0
  const conversao = "0%"

  const filtrados = TESTES_DEMO.filter((t) => {
    const matchFiltro = filtro === "Todos" || t.statusCliente === filtro || t.statusTeste === filtro
    const matchBusca =
      busca === "" ||
      t.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      t.app.toLowerCase().includes(busca.toLowerCase()) ||
      t.telefone.includes(busca)
    return matchFiltro && matchBusca
  })

  return (
    <div className="px-6 py-6 max-w-[900px] mx-auto">
      {/* Header */}
      <div className="text-center mb-7">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase mb-1.5"
          style={{ color: "#818cf8" }}>
          <RefreshCw className="h-3.5 w-3.5" />
          Monitoramento ao vivo
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Testes em tempo real</h1>
        <p className="text-sm text-muted-foreground">
          {ativos} testes ativos · {expirando} expirando em breve
        </p>
        <span
          className="inline-block mt-2 text-xs font-medium px-3 py-0.5 rounded-full"
          style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}
        >
          Fonte: Supabase
        </span>
      </div>

      {/* Counters */}
      <div className="flex items-center justify-center gap-8 mb-7 text-center">
        {[
          { label: "ATIVOS", value: String(ativos), color: "#10b981" },
          { label: "EXPIRANDO", value: String(expirando), color: "#f59e0b" },
          { label: "PAGOS", value: String(pagos), color: "#9ca3af" },
          { label: "CONVERSAO", value: conversao, color: "#9ca3af" },
        ].map((c) => (
          <div key={c.label} className="flex flex-col items-center">
            <span className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</span>
            <span className="text-[10px] tracking-widest text-muted-foreground">{c.label}</span>
          </div>
        ))}
      </div>

      {/* Search + filtros */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex flex-1 items-center gap-2.5 rounded-xl px-4 py-2.5"
          style={{ background: "#141c2b", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            placeholder="Buscar cliente, telefone ou app..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5">
          {FILTROS.map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className="rounded-lg px-3 py-2 text-xs font-medium transition-all"
              style={{
                background: filtro === f ? "rgba(99,102,241,0.25)" : "#141c2b",
                color: filtro === f ? "#a5b4fc" : "#6b7280",
                border: filtro === f ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {filtrados.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-4 rounded-xl px-4 py-3"
            style={{ backgroundColor: "#0f1623", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Status esquerdo */}
            <div className="flex flex-col items-center min-w-[72px]">
              <span
                className="text-xs font-bold uppercase"
                style={{ color: t.statusTeste === "Expirado" ? "#ef4444" : "#10b981" }}
              >
                {t.statusTeste === "Expirado" ? "•Expirado" : "•Ativo"}
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">{t.restante}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-foreground truncate">{t.cliente}</span>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: t.statusCliente === "Ativo" ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)",
                    color: t.statusCliente === "Ativo" ? "#10b981" : "#9ca3af",
                    border: t.statusCliente === "Ativo" ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {t.statusCliente}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t.app} · {t.servidor} · {t.telefone}
              </p>
              {/* Actions */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all"
                  style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.25)" }}
                >
                  <RefreshCw className="h-3 w-3" />
                  Reenviar
                </button>
                <button
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all"
                  style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}
                >
                  <MessageCircle className="h-3 w-3" />
                  WhatsApp
                </button>
                <Link
                  href={`/testes/${t.id}`}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <ArrowRightLeft className="h-3 w-3" />
                  Converter
                </Link>
              </div>
            </div>

            {/* Imagem de fundo (desfocada à direita) */}
            <div
              className="hidden sm:block h-12 w-12 rounded-lg shrink-0 opacity-40"
              style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(16,185,129,0.2))" }}
            />
          </div>
        ))}

        {filtrados.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Nenhum teste encontrado.
          </div>
        )}
      </div>
    </div>
  )
}
