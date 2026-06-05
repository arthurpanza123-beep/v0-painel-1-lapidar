"use client"

import { useState } from "react"
import { Server, CheckCircle2, XCircle, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// Regras de telas:
// Yellow Box = 2 telas
// CineMax = 2 telas
// Ninety = 1 tela

interface Tela {
  numero: number
  cliente?: string
  vencimento?: string
}

interface Conta {
  id: string
  app: string
  painel: "Yellow Box" | "CineMax" | "Ninety"
  telas: Tela[]
  vencimento: string
}

const maxTelas = (painel: string) => painel === "Ninety" ? 1 : 2

const CONTAS_DEMO: Conta[] = [
  {
    id: "4821",
    app: "XCloud",
    painel: "Yellow Box",
    vencimento: "2025-08-15",
    telas: [
      { numero: 1, cliente: "João Silva", vencimento: "2025-07-05" },
      { numero: 2 },
    ],
  },
  {
    id: "4820",
    app: "XCloud",
    painel: "CineMax",
    vencimento: "2025-08-10",
    telas: [
      { numero: 1, cliente: "Maria Oliveira", vencimento: "2025-09-04" },
      { numero: 2, cliente: "Pedro Santos", vencimento: "2025-07-20" },
    ],
  },
  {
    id: "4819",
    app: "Blessed Player",
    painel: "Ninety",
    vencimento: "2025-07-30",
    telas: [
      { numero: 1 },
    ],
  },
  {
    id: "4818",
    app: "PlaySim",
    painel: "Yellow Box",
    vencimento: "2025-08-01",
    telas: [
      { numero: 1, cliente: "Ana Costa", vencimento: "2025-07-15" },
      { numero: 2, cliente: "Carlos Lima", vencimento: "2025-08-01" },
    ],
  },
  {
    id: "4817",
    app: "FunPlay",
    painel: "CineMax",
    vencimento: "2025-09-01",
    telas: [
      { numero: 1 },
      { numero: 2 },
    ],
  },
]

function ContaCard({ conta }: { conta: Conta }) {
  const max = maxTelas(conta.painel)
  const vagasLivres = conta.telas.filter((t) => !t.cliente).length
  const cheia = vagasLivres === 0

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 space-y-3 transition-colors",
        !cheia
          ? "border-[oklch(0.62_0.18_155)]/30 hover:border-[oklch(0.62_0.18_155)]/50"
          : "border-border hover:border-border/80"
      )}
    >
      {/* Header da conta */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Server className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">#{conta.id}</span>
            <span className="text-[11px] text-muted-foreground">{conta.app}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">{conta.painel} · vence {new Date(conta.vencimento).toLocaleDateString("pt-BR")}</p>
        </div>
        <div>
          {cheia ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-destructive/20 bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">
              <XCircle className="h-3 w-3" />
              Conta cheia
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-[oklch(0.62_0.18_155)]/20 bg-[oklch(0.62_0.18_155)]/10 px-2 py-0.5 text-[11px] font-medium text-[oklch(0.62_0.18_155)]">
              <CheckCircle2 className="h-3 w-3" />
              Vaga livre — economize crédito
            </span>
          )}
        </div>
      </div>

      {/* Telas */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${max}, 1fr)` }}>
        {Array.from({ length: max }).map((_, i) => {
          const tela = conta.telas[i]
          const ocupada = !!tela?.cliente
          return (
            <div
              key={i}
              className={cn(
                "rounded border px-3 py-2.5 text-xs",
                ocupada
                  ? "border-border bg-muted/20"
                  : "border-dashed border-[oklch(0.62_0.18_155)]/40 bg-[oklch(0.62_0.18_155)]/5"
              )}
            >
              <p className={cn("text-[10px] font-medium uppercase tracking-wide mb-1", ocupada ? "text-muted-foreground" : "text-[oklch(0.62_0.18_155)]/70")}>
                Tela 0{i + 1}
              </p>
              {ocupada ? (
                <>
                  <p className="font-medium text-foreground text-[11px]">{tela.cliente}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Vence {new Date(tela.vencimento!).toLocaleDateString("pt-BR")}
                  </p>
                </>
              ) : (
                <p className="text-[11px] text-[oklch(0.62_0.18_155)]/80">Vaga disponivel</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ContasPage() {
  const [filtro, setFiltro] = useState<"todas" | "com-vaga" | "cheias">("todas")

  const filtradas = CONTAS_DEMO.filter((c) => {
    const vagasLivres = c.telas.filter((t) => !t.cliente).length
    if (filtro === "com-vaga") return vagasLivres > 0
    if (filtro === "cheias") return vagasLivres === 0
    return true
  })

  const totalVagas = CONTAS_DEMO.reduce((acc, c) => acc + c.telas.filter((t) => !t.cliente).length, 0)

  return (
    <div className="space-y-5">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            Contas
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Gestão de contas e telas. Yellow Box e CineMax = 2 telas. Ninety = 1 tela.
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" />
          Nova Conta
        </button>
      </div>

      {/* Alerta vagas */}
      {totalVagas > 0 && (
        <div
          className="flex items-center gap-2 rounded-lg border border-[oklch(0.62_0.18_155)]/30 bg-[oklch(0.62_0.18_155)]/5 px-4 py-3 cursor-pointer hover:bg-[oklch(0.62_0.18_155)]/10 transition-colors"
          onClick={() => setFiltro("com-vaga")}
        >
          <CheckCircle2 className="h-4 w-4 text-[oklch(0.62_0.18_155)]" />
          <span className="text-xs font-medium text-[oklch(0.62_0.18_155)]">
            {totalVagas} vaga{totalVagas > 1 ? "s" : ""} livre{totalVagas > 1 ? "s" : ""} — economize crédito ao ativar
          </span>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2">
        {[
          { key: "todas", label: "Todas" },
          { key: "com-vaga", label: "Com vaga" },
          { key: "cheias", label: "Cheias" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFiltro(key as typeof filtro)}
            className={cn(
              "rounded border px-3 py-1.5 text-xs font-medium transition-colors",
              filtro === key
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid de contas */}
      <div className="grid gap-3 md:grid-cols-2">
        {filtradas.map((conta) => (
          <ContaCard key={conta.id} conta={conta} />
        ))}
      </div>
    </div>
  )
}
