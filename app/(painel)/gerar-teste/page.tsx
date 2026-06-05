"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Phone, ChevronRight, Loader2, Monitor } from "lucide-react"

const STEPS = ["Dados", "App", "Servidor", "Gerar"]

const APPS = [
  { id: "XCloud", label: "XCloud", needsDevice: true },
  { id: "Blessed Player", label: "Blessed Player", needsDevice: false },
  { id: "PlaySim", label: "PlaySim", needsDevice: false },
  { id: "FunPlay", label: "FunPlay", needsDevice: false },
  { id: "Smart STB", label: "Smart STB", needsDevice: false },
  { id: "Aplicativo", label: "Aplicativo", needsDevice: false },
  { id: "Manual", label: "Manual", needsDevice: false },
  { id: "DeckTop / Magic", label: "DeckTop / Magic", needsDevice: false },
]

const SERVIDORES = ["Brasil / Yellow Box", "Ninety", "AnaPlay", "Servidor", "Manual"]

export default function GerarTestePage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [app, setApp] = useState("")
  const [servidor, setServidor] = useState("")
  const [deviceKey, setDeviceKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isXCloud = app === "XCloud"

  function nextStep() {
    setError("")
    if (step === 0 && (!nome.trim() || !telefone.trim())) {
      setError("Preencha nome e telefone.")
      return
    }
    if (step === 1 && !app) {
      setError("Selecione um aplicativo.")
      return
    }
    if (step === 2 && !servidor) {
      setError("Selecione um servidor.")
      return
    }
    setStep((s) => s + 1)
  }

  async function handleGerar() {
    if (isXCloud && !deviceKey.trim()) {
      setError("Device Key é obrigatória para XCloud.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const body: Record<string, string> = { nome, telefone, app, servidor }
      if (isXCloud) body.deviceKey = deviceKey
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
      setError(err instanceof Error ? err.message : "Erro ao gerar teste.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen pt-10 px-4">
      {/* Stepper */}
      <div className="flex items-center gap-0 mb-10">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all"
                style={{
                  background: i === step
                    ? "linear-gradient(135deg, #6366f1, #818cf8)"
                    : i < step
                    ? "rgba(99,102,241,0.3)"
                    : "rgba(255,255,255,0.06)",
                  color: i <= step ? "#fff" : "#6b7280",
                  boxShadow: i === step ? "0 0 0 3px rgba(99,102,241,0.3)" : "none",
                }}
              >
                {i + 1}
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: i === step ? "#e2e8f0" : "#6b7280" }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="w-24 h-px mb-4 mx-1"
                style={{ background: i < step ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div
        className="w-full max-w-[480px] rounded-2xl p-7"
        style={{ backgroundColor: "#141c2b", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Step 0 — Dados */}
        {step === 0 && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: "rgba(99,102,241,0.15)" }}
              >
                <User className="h-5 w-5" style={{ color: "#818cf8" }} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Novo teste</h2>
                <p className="text-sm text-muted-foreground">Informe os dados para gerar o acesso.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                  Nome do cliente
                </label>
                <div
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <User className="h-4 w-4 shrink-0" style={{ color: "#4b5563" }} />
                  <input
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    placeholder="João Silva"
                    value={nome}
                    onChange={(e) => { setNome(e.target.value); setError("") }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                  Telefone / WhatsApp
                </label>
                <div
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(99,102,241,0.5)",
                    boxShadow: "0 0 0 2px rgba(99,102,241,0.1)",
                  }}
                >
                  <Phone className="h-4 w-4 shrink-0" style={{ color: "#818cf8" }} />
                  <input
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    placeholder="(22) 99999-9999"
                    value={telefone}
                    onChange={(e) => { setTelefone(e.target.value); setError("") }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 1 — App */}
        {step === 1 && (
          <>
            <h2 className="text-lg font-bold text-foreground mb-1">Selecionar App</h2>
            <p className="text-sm text-muted-foreground mb-5">Escolha o aplicativo para o teste.</p>
            <div className="grid grid-cols-2 gap-2">
              {APPS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => { setApp(a.id); setError("") }}
                  className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium text-left transition-all"
                  style={{
                    background: app === a.id ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
                    border: app === a.id ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.07)",
                    color: app === a.id ? "#a5b4fc" : "#9ca3af",
                  }}
                >
                  {a.needsDevice && <Monitor className="h-3.5 w-3.5 shrink-0" style={{ color: "#818cf8" }} />}
                  {a.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 2 — Servidor */}
        {step === 2 && (
          <>
            <h2 className="text-lg font-bold text-foreground mb-1">Selecionar Servidor</h2>
            <p className="text-sm text-muted-foreground mb-5">Escolha o servidor para gerar o teste.</p>
            <div className="space-y-2">
              {SERVIDORES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setServidor(s); setError("") }}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all"
                  style={{
                    background: servidor === s ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
                    border: servidor === s ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.07)",
                    color: servidor === s ? "#a5b4fc" : "#9ca3af",
                  }}
                >
                  {s}
                  {servidor === s && (
                    <span className="h-2 w-2 rounded-full" style={{ background: "#818cf8" }} />
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 3 — Gerar */}
        {step === 3 && (
          <>
            <h2 className="text-lg font-bold text-foreground mb-1">Confirmar e Gerar</h2>
            <p className="text-sm text-muted-foreground mb-5">Revise os dados antes de gerar o acesso.</p>

            <div
              className="rounded-xl p-4 space-y-2.5 mb-5 text-sm"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cliente</span>
                <span className="text-foreground font-medium">{nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telefone</span>
                <span className="text-foreground font-medium">{telefone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">App</span>
                <span className="text-foreground font-medium">{app}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Servidor</span>
                <span className="text-foreground font-medium">{servidor}</span>
              </div>
            </div>

            {isXCloud && (
              <div className="mb-4">
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                  Device Key (XCloud)
                </label>
                <div
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.4)" }}
                >
                  <Monitor className="h-4 w-4 shrink-0" style={{ color: "#818cf8" }} />
                  <input
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-mono"
                    placeholder="A1B2-C3D4-E5F6"
                    value={deviceKey}
                    onChange={(e) => { setDeviceKey(e.target.value); setError("") }}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {error && (
          <p className="mt-3 text-xs rounded-lg px-3 py-2"
            style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
            {error}
          </p>
        )}

        {/* Action button */}
        <div className="mt-6">
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all"
              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "#fff" }}
            >
              Continuar
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGerar}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "#fff" }}
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Gerando…</>
              ) : (
                <>Gerar Acesso<ChevronRight className="h-4 w-4" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
