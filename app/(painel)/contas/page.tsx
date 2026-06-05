"use client"

import { useState } from "react"
import { Search, FolderOpen, Plus, CheckCircle2 } from "lucide-react"

interface Tela {
  nome: string
  vencimento?: string
  vazia?: boolean
}

interface Conta {
  id: string
  num: string
  app: string
  servidor: string
  status: "Livre" | "Cheio" | "Disponivel"
  cor: string
  corBg: string
  telas: Tela[]
  totalTelas: number
  ocupadas: number
}

const CONTAS_DEMO: Conta[] = [
  { id: "1", num: "#5689", app: "XCloud", servidor: "Brasil / Yellow Box", status: "Livre", cor: "#10b981", corBg: "rgba(16,185,129,0.15)", telas: [{ nome: "Cliente 1: Jessy Margareth", vencimento: "vence em breve" }, { vazia: true, nome: "" }], totalTelas: 2, ocupadas: 1 },
  { id: "2", num: "#9641", app: "XCloud", servidor: "Brasil / Yellow Box", status: "Livre", cor: "#10b981", corBg: "rgba(16,185,129,0.15)", telas: [{ nome: "Cliente 1: Luis Henrique" }, { vazia: true, nome: "" }], totalTelas: 2, ocupadas: 1 },
  { id: "3", num: "#430", app: "XCloud", servidor: "Servidor", status: "Cheio", cor: "#f59e0b", corBg: "rgba(245,158,11,0.15)", telas: [{ nome: "Cliente 1: Slevaldo Santos" }, { vazia: true, nome: "" }], totalTelas: 2, ocupadas: 1 },
  { id: "4", num: "#7833", app: "XCloud", servidor: "Ninety", status: "Cheio", cor: "#f59e0b", corBg: "rgba(245,158,11,0.15)", telas: [{ nome: "Cliente 1: PauloHenrique" }, { vazia: true, nome: "" }], totalTelas: 2, ocupadas: 1 },
  { id: "5", num: "#8541", app: "Fun Play", servidor: "DeckTop / Magic", status: "Cheio", cor: "#f59e0b", corBg: "rgba(245,158,11,0.15)", telas: [{ nome: "Cliente 1: Cristina Sousa" }, { vazia: true, nome: "" }], totalTelas: 2, ocupadas: 1 },
  { id: "6", num: "#0313", app: "XCloud", servidor: "Brasil / Yellow Box", status: "Livre", cor: "#10b981", corBg: "rgba(16,185,129,0.15)", telas: [{ nome: "Cliente 1: Donize Falcao" }, { vazia: true, nome: "" }], totalTelas: 2, ocupadas: 1 },
  { id: "7", num: "#2454", app: "XCloud", servidor: "Brasil / Yellow Box", status: "Disponivel", cor: "#6b7280", corBg: "rgba(107,114,128,0.1)", telas: [{ nome: "Cliente 1: Fabricio" }, { vazia: true, nome: "" }], totalTelas: 2, ocupadas: 1 },
  { id: "8", num: "#3621", app: "XCloud", servidor: "AnaPlay", status: "Livre", cor: "#10b981", corBg: "rgba(16,185,129,0.15)", telas: [{ nome: "Cliente 1: Carlos" }, { vazia: true, nome: "" }], totalTelas: 2, ocupadas: 1 },
  { id: "9", num: "#4539", app: "XCloud", servidor: "Brasil / Yellow Box", status: "Livre", cor: "#10b981", corBg: "rgba(16,185,129,0.15)", telas: [{ nome: "Cliente 1: Juan" }, { vazia: true, nome: "" }], totalTelas: 2, ocupadas: 1 },
  { id: "10", num: "#7543", app: "XCloud", servidor: "Brasil / Yellow Box", status: "Cheio", cor: "#f59e0b", corBg: "rgba(245,158,11,0.15)", telas: [{ nome: "Cliente 1: Cloves" }, { nome: "Cliente 2: Yuri Italo" }], totalTelas: 2, ocupadas: 2 },
]

export default function ContasPage() {
  const [busca, setBusca] = useState("")

  const totalContas = CONTAS_DEMO.length
  const livres = CONTAS_DEMO.filter((c) => c.status === "Livre").length
  const cheias = CONTAS_DEMO.filter((c) => c.status === "Cheio").length
  const totalVagas = CONTAS_DEMO.reduce((acc, c) => acc + (c.totalTelas - c.ocupadas), 0)

  const filtradas = CONTAS_DEMO.filter((c) =>
    busca === "" ||
    c.num.toLowerCase().includes(busca.toLowerCase()) ||
    c.app.toLowerCase().includes(busca.toLowerCase()) ||
    c.servidor.toLowerCase().includes(busca.toLowerCase()) ||
    c.telas.some((t) => t.nome.toLowerCase().includes(busca.toLowerCase()))
  )

  return (
    <div className="px-6 py-6 max-w-[900px] mx-auto">
      {/* Header */}
      <div className="text-center mb-7">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase mb-1.5"
          style={{ color: "#818cf8" }}>
          <FolderOpen className="h-3.5 w-3.5" />
          Contas e Vagas
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Contas</h1>
        <p className="text-sm text-muted-foreground">{totalContas} contas · {totalVagas} vagas livres de 33</p>
        <span className="inline-block mt-2 text-xs font-medium px-3 py-0.5 rounded-full"
          style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
          Fonte: Supabase
        </span>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-8 mb-6 text-center">
        {[
          { label: "TOTAL", value: String(totalContas), color: "#e2e8f0" },
          { label: "LIVRE", value: String(livres), color: "#10b981" },
          { label: "CHEIO", value: String(cheias), color: "#f59e0b" },
          { label: "VAGAS", value: String(totalVagas), color: "#818cf8" },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center">
            <span className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</span>
            <span className="text-[10px] tracking-widest text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Search + New */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex flex-1 items-center gap-2.5 rounded-xl px-4 py-2.5"
          style={{ background: "#141c2b", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            placeholder="Buscar por código, cliente, servidor ou app..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)} />
        </div>
        <button className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
          style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}>
          <Plus className="h-4 w-4" />
          Nova conta
        </button>
      </div>

      {/* Contas */}
      <div className="space-y-2">
        {filtradas.map((c) => {
          const vagasLivres = c.totalTelas - c.ocupadas
          return (
            <div key={c.id} className="rounded-xl overflow-hidden"
              style={{ backgroundColor: "#0f1623", border: "1px solid rgba(255,255,255,0.06)" }}>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold"
                    style={{ background: c.corBg, color: c.cor }}>
                    {c.num.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{c.num}</span>
                      <span className="text-xs text-muted-foreground">{c.app}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: c.corBg, color: c.cor, border: `1px solid ${c.cor}30` }}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{c.servidor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {vagasLivres > 0 && (
                    <span className="flex items-center gap-1" style={{ color: "#10b981" }}>
                      <CheckCircle2 className="h-3 w-3" />
                      {vagasLivres} vaga{vagasLivres > 1 ? "s" : ""} livre{vagasLivres > 1 ? "s" : ""}
                    </span>
                  )}
                  <button className="rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all"
                    style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.25)" }}>
                    Ver condições
                  </button>
                </div>
              </div>

              {/* Barra de ocupação */}
              <div className="h-0.5 mx-4 mb-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="h-full rounded-full transition-all"
                  style={{
                    width: `${(c.ocupadas / c.totalTelas) * 100}%`,
                    background: c.ocupadas === c.totalTelas ? "#f59e0b" : "#10b981",
                  }} />
              </div>

              {/* Telas */}
              <div className="px-4 pb-3 space-y-1.5">
                {c.telas.map((tela, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ background: tela.vazia ? "rgba(255,255,255,0.15)" : "#818cf8" }} />
                    {tela.vazia ? (
                      <span className="text-xs text-muted-foreground italic">Aloca cliente nesta vaga</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">{tela.nome}
                        {tela.vencimento && <span className="ml-1 text-[10px]">· {tela.vencimento}</span>}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
