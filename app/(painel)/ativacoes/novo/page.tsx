"use client"

import { useState } from "react"
import { Zap, CheckCircle2, Loader2, ChevronRight, Server, Info } from "lucide-react"
import { Badge } from "@/components/badge"

// Simulação de dados — em produção vêm de /api/activations/recommendation
const RECOMENDACAO = {
  contaId: "4821",
  telaDisponivel: "Tela 02",
  app: "XCloud",
  painel: "Yellow Box",
  vagasLivres: 1,
}

const PLANOS = [
  { id: "mensal", label: "Mensal", valor: "R$ 25,00" },
  { id: "trimestral", label: "Trimestral", valor: "R$ 65,00" },
  { id: "semestral", label: "Semestral", valor: "R$ 120,00" },
  { id: "anual", label: "Anual", valor: "R$ 200,00" },
]

export default function AtivacoesNovaPage() {
  const [etapa, setEtapa] = useState<"form" | "confirmar" | "sucesso">("form")
  const [plano, setPlano] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resultado, setResultado] = useState<{ id: string } | null>(null)

  const planoDados = PLANOS.find((p) => p.id === plano)
  const temVaga = RECOMENDACAO.vagasLivres > 0

  async function confirmarAtivacao() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/activations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plano,
          contaId: RECOMENDACAO.contaId,
          tela: RECOMENDACAO.telaDisponivel,
        }),
      })
      if (!res.ok) throw new Error(`Erro ${res.status}`)
      const data = await res.json()
      setResultado(data)
      setEtapa("sucesso")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido"
      setError(`Falha na ativação: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  if (etapa === "sucesso") {
    return (
      <div className="max-w-md space-y-4">
        <div className="flex items-center gap-2 rounded-lg border border-[oklch(0.62_0.18_155)]/30 bg-[oklch(0.62_0.18_155)]/5 px-4 py-3">
          <CheckCircle2 className="h-4 w-4 text-[oklch(0.62_0.18_155)]" />
          <span className="text-sm font-medium text-[oklch(0.62_0.18_155)]">Cliente ativado com sucesso</span>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ativação</span>
            <span className="text-foreground font-mono">#{resultado?.id ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Conta</span>
            <span className="text-foreground">#{RECOMENDACAO.contaId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tela</span>
            <span className="text-foreground">{RECOMENDACAO.telaDisponivel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plano</span>
            <span className="text-foreground">{planoDados?.label} — {planoDados?.valor}</span>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-[oklch(0.72_0.18_65)] flex items-center gap-1">
              <Info className="h-3 w-3" />
              Tela agora ocupada. Teste não ocupa tela.
            </p>
          </div>
        </div>
        <button
          onClick={() => { setEtapa("form"); setPlano(""); setResultado(null) }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Nova ativação
        </button>
      </div>
    )
  }

  if (etapa === "confirmar") {
    return (
      <div className="max-w-md space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Confirmar Ativação
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Revise antes de ativar</p>
        </div>

        {/* Resumo */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-3 text-xs">
          {/* Recomendação de conta */}
          <div
            className={`rounded border px-3 py-2.5 ${
              temVaga
                ? "border-[oklch(0.62_0.18_155)]/30 bg-[oklch(0.62_0.18_155)]/5"
                : "border-[oklch(0.72_0.18_65)]/30 bg-[oklch(0.72_0.18_65)]/5"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5 text-muted-foreground" />
              {temVaga ? (
                <span className="font-medium text-[oklch(0.62_0.18_155)]">
                  Melhor opção: usar vaga livre na conta #{RECOMENDACAO.contaId}
                </span>
              ) : (
                <span className="font-medium text-[oklch(0.72_0.18_65)]">
                  Nenhuma vaga livre. Será necessário criar nova conta.
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-muted-foreground">App</span>
              <p className="text-foreground mt-0.5">{RECOMENDACAO.app}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Painel</span>
              <p className="text-foreground mt-0.5">{RECOMENDACAO.painel}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Tela</span>
              <p className="text-foreground mt-0.5">{RECOMENDACAO.telaDisponivel}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Plano</span>
              <p className="text-foreground mt-0.5">{planoDados?.label} — {planoDados?.valor}</p>
            </div>
          </div>

          <div className="border-t border-border pt-2">
            <p className="flex items-center gap-1.5 text-[oklch(0.72_0.18_65)]">
              <Info className="h-3 w-3" />
              Ativação paga ocupa tela. Teste não ocupa tela.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setEtapa("form")}
            className="flex-1 rounded border border-border px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={confirmarAtivacao}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 rounded bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Ativando…
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Confirmar Ativação
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Ativar Cliente
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Ativação paga ocupa tela. Teste não ocupa tela.
        </p>
      </div>

      {/* Recomendação automática */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Conta recomendada</p>
          <Badge variant="success">Automático</Badge>
        </div>
        <div
          className={`rounded border px-3 py-2.5 text-xs ${
            temVaga
              ? "border-[oklch(0.62_0.18_155)]/30 bg-[oklch(0.62_0.18_155)]/5"
              : "border-[oklch(0.72_0.18_65)]/30 bg-[oklch(0.72_0.18_65)]/5"
          }`}
        >
          {temVaga ? (
            <p className="font-medium text-[oklch(0.62_0.18_155)]">
              Melhor opção: usar vaga livre na conta #{RECOMENDACAO.contaId}
            </p>
          ) : (
            <p className="font-medium text-[oklch(0.72_0.18_65)]">
              Nenhuma vaga livre. Será necessário criar nova conta.
            </p>
          )}
          <div className="flex gap-3 mt-2 text-muted-foreground">
            <span>Tela: <span className="text-foreground">{RECOMENDACAO.telaDisponivel}</span></span>
            <span>App: <span className="text-foreground">{RECOMENDACAO.app}</span></span>
            <span>Painel: <span className="text-foreground">{RECOMENDACAO.painel}</span></span>
          </div>
        </div>
      </div>

      {/* Seleção de plano */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Plano</p>
        <div className="grid grid-cols-2 gap-2">
          {PLANOS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlano(p.id)}
              className={`rounded border px-3 py-2.5 text-left transition-colors ${
                plano === p.id
                  ? "border-primary bg-primary/15"
                  : "border-border bg-muted/30 hover:border-border"
              }`}
            >
              <p className={`text-xs font-medium ${plano === p.id ? "text-primary" : "text-foreground"}`}>{p.label}</p>
              <p className={`text-[11px] mt-0.5 ${plano === p.id ? "text-primary/70" : "text-muted-foreground"}`}>{p.valor}</p>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          if (!plano) { setError("Selecione um plano."); return }
          setError("")
          setEtapa("confirmar")
        }}
        className="flex w-full items-center justify-center gap-2 rounded bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Revisar e Ativar
        <ChevronRight className="h-4 w-4" />
      </button>

      {error && (
        <div className="rounded border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}
    </div>
  )
}
