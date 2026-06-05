"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FlaskConical, Monitor, Loader2, ChevronRight, Info } from "lucide-react"
import { Badge } from "@/components/badge"

const APPS = [
  { id: "xcloud", label: "XCloud", needsDevice: true },
  { id: "blessed", label: "Blessed Player", needsDevice: false },
  { id: "playsim", label: "PlaySim", needsDevice: false },
  { id: "funplay", label: "FunPlay", needsDevice: false },
  { id: "smartstb", label: "Smart STB", needsDevice: false },
  { id: "manual", label: "Manual", needsDevice: false },
]

const PAINEIS = ["Yellow Box", "CineMax", "Ninety"]

export default function GerarTestePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    app: "",
    painel: "",
    deviceKey: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const selectedApp = APPS.find((a) => a.id === form.app)
  const isXCloud = selectedApp?.id === "xcloud"

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    setError("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome || !form.telefone || !form.app || !form.painel) {
      setError("Preencha todos os campos obrigatórios.")
      return
    }
    if (isXCloud && !form.deviceKey) {
      setError("Device Key é obrigatória para XCloud.")
      return
    }
    setLoading(true)
    try {
      const body: Record<string, string> = {
        nome: form.nome,
        telefone: form.telefone,
        app: form.app,
        painel: form.painel,
      }
      if (isXCloud) body.deviceKey = form.deviceKey

      const res = await fetch("/api/tests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`Erro ${res.status}`)
      const data = await res.json()
      const testId = data?.id ?? data?.testId ?? "novo"
      router.push(`/testes/${testId}?success=1`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido"
      setError(`Falha ao criar teste: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-primary" />
          Novo Teste
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Teste não ocupa tela. Cliente pago ocupa tela apenas via ativação.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Dados do cliente */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cliente</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Nome *</label>
              <input
                className="w-full rounded border border-border bg-input/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Nome completo"
                value={form.nome}
                onChange={(e) => set("nome", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Telefone *</label>
              <input
                className="w-full rounded border border-border bg-input/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="(11) 99999-9999"
                value={form.telefone}
                onChange={(e) => set("telefone", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* App */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Aplicativo</p>
          <div className="grid grid-cols-3 gap-2">
            {APPS.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => set("app", app.id)}
                className={`rounded border px-3 py-2 text-xs font-medium transition-colors text-left ${
                  form.app === app.id
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                {app.id === "xcloud" && (
                  <Monitor className="h-3 w-3 mb-1 opacity-70" />
                )}
                {app.label}
              </button>
            ))}
          </div>
        </div>

        {/* Painel */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Painel Gerador</p>
          <div className="flex gap-2">
            {PAINEIS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => set("painel", p)}
                className={`rounded border px-3 py-2 text-xs font-medium transition-colors ${
                  form.painel === p
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Device Key — só para XCloud */}
        {isXCloud && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-primary">XCloud — Device Key</p>
              <Badge variant="blue">Obrigatório</Badge>
            </div>
            <input
              className="w-full rounded border border-border bg-input/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
              placeholder="Ex: A1B2-C3D4-E5F6-G7H8"
              value={form.deviceKey}
              onChange={(e) => set("deviceKey", e.target.value)}
            />
            <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
              <Info className="h-3 w-3 mt-0.5 shrink-0" />
              Após gerar o acesso, o botão XCloud real ficará disponível na tela de sucesso.
            </p>
          </div>
        )}

        {error && (
          <div className="rounded border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        {/* Resumo antes de enviar */}
        {form.nome && form.app && form.painel && (
          <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground text-[11px] uppercase tracking-wide mb-2">Resumo</p>
            <div className="flex gap-4 flex-wrap">
              <span>Cliente: <span className="text-foreground">{form.nome || "—"}</span></span>
              <span>App: <span className="text-foreground">{selectedApp?.label || "—"}</span></span>
              <span>Painel: <span className="text-foreground">{form.painel || "—"}</span></span>
              {isXCloud && <span>Device: <span className="text-foreground font-mono">{form.deviceKey || "—"}</span></span>}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Gerando teste…
            </>
          ) : (
            <>
              Gerar Teste
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
