"use client"

import { useState } from "react"
import { Search, Users, ArrowUpRight } from "lucide-react"

interface Cliente {
  id: string
  iniciais: string
  nome: string
  telefone: string
  status: "Ativo" | "Pendente" | "Expirado"
  app: string
  servidor: string
  plano: string
  mensal: string
  vencimento: string
}

const CLIENTES_DEMO: Cliente[] = [
  { id: "1", iniciais: "LS", nome: "Leudimar Saraiva", telefone: "(55) •••••-6999", status: "Ativo", app: "Blessed Player", servidor: "Brasil / Yellow Box", plano: "Mensal", mensal: "R$ 0", vencimento: "10/06/2026" },
  { id: "2", iniciais: "CS", nome: "Cristina Sousa", telefone: "(55) •••••-1199", status: "Ativo", app: "Fun Play", servidor: "DeckTop / Magic", plano: "Mensal", mensal: "R$ 0", vencimento: "17/06/2026" },
  { id: "3", iniciais: "MH", nome: "Micke Heggerth", telefone: "(55) •••••-8599", status: "Ativo", app: "Fun Play", servidor: "DeckTop / Magic", plano: "Manual", mensal: "R$ 0", vencimento: "17/06/2026" },
  { id: "4", iniciais: "E", nome: "Edvaldo", telefone: "(55) •••••-2751", status: "Ativo", app: "Fun Play", servidor: "DeckTop / Magic", plano: "Manual", mensal: "R$ 0", vencimento: "17/06/2026" },
  { id: "5", iniciais: "PH", nome: "PauloHenrique", telefone: "(55) •••••-8011", status: "Ativo", app: "XCloud", servidor: "Ninety", plano: "Trimestral", mensal: "R$ 0", vencimento: "19/06/2026" },
  { id: "6", iniciais: "SS", nome: "Slevaldo Santos", telefone: "(55) •••••-2199", status: "Ativo", app: "XCloud", servidor: "Servidor", plano: "Manual", mensal: "R$ 0", vencimento: "21/06/2026" },
  { id: "7", iniciais: "JM", nome: "Jessy Margareth", telefone: "(55) •••••-3045", status: "Ativo", app: "XCloud", servidor: "Brasil / Yellow Box", plano: "Manual", mensal: "R$ 0", vencimento: "30/06/2026" },
  { id: "8", iniciais: "LH", nome: "Luis Henrique", telefone: "(55) •••••-3304", status: "Ativo", app: "XCloud", servidor: "Brasil / Yellow Box", plano: "Manual", mensal: "R$ 0", vencimento: "23/06/2026" },
  { id: "9", iniciais: "DF", nome: "Donize Falcao", telefone: "(55) •••••-7699", status: "Ativo", app: "XCloud", servidor: "Brasil / Yellow Box", plano: "Manual", mensal: "R$ 0", vencimento: "28/06/2026" },
  { id: "10", iniciais: "F", nome: "Fabricio", telefone: "(55) •••••-0000", status: "Ativo", app: "XCloud", servidor: "Brasil / Yellow Box", plano: "Manual", mensal: "R$ 0", vencimento: "26/06/2026" },
  { id: "11", iniciais: "J", nome: "Juan", telefone: "(55) •••••-3007", status: "Ativo", app: "XCloud", servidor: "Brasil / Yellow Box", plano: "Manual", mensal: "R$ 0", vencimento: "28/06/2026" },
  { id: "12", iniciais: "C", nome: "Carlos", telefone: "(55) •••••-9888", status: "Ativo", app: "XCloud", servidor: "Ninety", plano: "Manual", mensal: "R$ 0", vencimento: "30/06/2026" },
]

const FILTROS = ["Todos", "Ativo", "Expirado", "Pendente"] as const
type Filtro = (typeof FILTROS)[number]

function getInitialsColor(iniciais: string) {
  const colors = [
    { bg: "rgba(99,102,241,0.2)", text: "#818cf8" },
    { bg: "rgba(16,185,129,0.2)", text: "#10b981" },
    { bg: "rgba(245,158,11,0.2)", text: "#f59e0b" },
    { bg: "rgba(239,68,68,0.2)", text: "#f87171" },
    { bg: "rgba(59,130,246,0.2)", text: "#60a5fa" },
  ]
  return colors[iniciais.charCodeAt(0) % colors.length]
}

export default function ClientesPage() {
  const [filtro, setFiltro] = useState<Filtro>("Todos")
  const [busca, setBusca] = useState("")

  const total = CLIENTES_DEMO.length
  const ativos = CLIENTES_DEMO.filter((c) => c.status === "Ativo").length
  const expirados = CLIENTES_DEMO.filter((c) => c.status === "Expirado").length

  const filtrados = CLIENTES_DEMO.filter((c) => {
    const matchF = filtro === "Todos" || c.status === filtro
    const matchB = busca === "" || c.nome.toLowerCase().includes(busca.toLowerCase()) || c.telefone.includes(busca)
    return matchF && matchB
  })

  return (
    <div className="px-6 py-6 max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="text-center mb-7">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase mb-1.5"
          style={{ color: "#818cf8" }}>
          <Users className="h-3.5 w-3.5" />
          CRM
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Clientes</h1>
        <p className="text-sm text-muted-foreground">
          {total} clientes · {ativos} ativos · {expirados} expirados
        </p>
        <span className="inline-block mt-2 text-xs font-medium px-3 py-0.5 rounded-full"
          style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
          Fonte: Supabase
        </span>
      </div>

      {/* Search + filtros */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex flex-1 items-center gap-2.5 rounded-xl px-4 py-2.5"
          style={{ background: "#141c2b", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            placeholder="Buscar por nome, telefone ou app..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5">
          {FILTROS.map((f) => (
            <button key={f} onClick={() => setFiltro(f)}
              className="rounded-lg px-3 py-2 text-xs font-medium transition-all"
              style={{
                background: filtro === f ? "rgba(99,102,241,0.25)" : "#141c2b",
                color: filtro === f ? "#a5b4fc" : "#6b7280",
                border: filtro === f ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.07)",
              }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtrados.map((c) => {
          const color = getInitialsColor(c.iniciais)
          return (
            <div key={c.id} className="rounded-xl p-4"
              style={{ backgroundColor: "#0f1623", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold shrink-0"
                    style={{ background: color.bg, color: color.text }}>
                    {c.iniciais}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{c.nome}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: c.status === "Ativo" ? "rgba(16,185,129,0.15)" : c.status === "Expirado" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)",
                          color: c.status === "Ativo" ? "#10b981" : c.status === "Expirado" ? "#f87171" : "#9ca3af",
                          border: c.status === "Ativo" ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.08)",
                        }}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{c.telefone}</p>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Acesso
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div>
                  <p className="text-muted-foreground mb-0.5">Aplicativo</p>
                  <p className="text-foreground font-medium">{c.app}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Servidor</p>
                  <p className="text-foreground font-medium">{c.servidor}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Vencimento</p>
                  <p className="text-foreground font-medium">{c.vencimento}</p>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-white/5 text-[11px] text-muted-foreground">
                Mensal: {c.mensal}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
