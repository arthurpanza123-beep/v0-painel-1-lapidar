"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  CheckCircle2,
  Circle,
  XCircle,
  Loader2,
  Monitor,
  Copy,
  ExternalLink,
  AlertTriangle,
  Wrench,
  ScrollText,
  RefreshCw,
} from "lucide-react"
import { Badge } from "@/components/badge"
import { cn } from "@/lib/utils"

interface TestResult {
  id: string
  cliente: string
  telefone: string
  app: string
  painel: string
  host: string
  usuario: string
  senha: string
  codigo?: string
  provedor?: string
  validade: string
  deviceKey?: string
  xcloudStatus?: "pendente" | "ativado" | "falhou"
  xcloudErro?: string
}

// Dados mock apenas para preview — backend real retorna via API
const MOCK: TestResult = {
  id: "T-0042",
  cliente: "João Silva",
  telefone: "(11) 98765-4321",
  app: "xcloud",
  painel: "Yellow Box",
  host: "br01.playhost.tv",
  usuario: "joao_silva_2025",
  senha: "K8xP2#mN",
  codigo: "XCL-8821",
  provedor: "BR-NORTE",
  validade: "2025-07-05",
  deviceKey: "A1B2-C3D4-E5F6-G7H8",
  xcloudStatus: "pendente",
}

function maskDeviceKey(key: string) {
  if (key.length <= 8) return key.replace(/./g, "*")
  return key.slice(0, 4) + "-****-****-" + key.slice(-4)
}

function XCloudBadges({ status }: { status?: "pendente" | "ativado" | "falhou" }) {
  const steps = [
    { label: "Acesso gerado", done: true },
    { label: "Device adicionado", done: status === "ativado" },
    { label: "Xtream vinculado", done: status === "ativado" },
    { label: "RELOAD confirmado", done: status === "ativado" },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((step) => (
        <span
          key={step.label}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border",
            step.done
              ? "bg-[oklch(0.62_0.18_155)]/10 text-[oklch(0.62_0.18_155)] border-[oklch(0.62_0.18_155)]/20"
              : "bg-muted text-muted-foreground border-border"
          )}
        >
          {step.done ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <Circle className="h-3 w-3" />
          )}
          {step.label}
        </span>
      ))}
    </div>
  )
}

export function TestSuccessCard({ test }: { test: TestResult }) {
  const isXCloud = test.app === "xcloud"
  const [xStatus, setXStatus] = useState<"pendente" | "running" | "ativado" | "falhou">(
    test.xcloudStatus === "ativado" ? "ativado" : "pendente"
  )
  const [xErro, setXErro] = useState(test.xcloudErro ?? "")
  const [copied, setCopied] = useState("")

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(""), 1500)
  }

  async function executarXCloud() {
    setXStatus("running")
    setXErro("")
    try {
      const res = await fetch("/api/xcloud/activate-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId: test.id, deviceKey: test.deviceKey }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message ?? `Erro ${res.status}`)
      }
      setXStatus("ativado")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido"
      setXErro(msg)
      setXStatus("falhou")
    }
  }

  return (
    <div className="space-y-4 max-w-xl">
      {/* Header do card */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-foreground">{test.cliente}</p>
            <p className="text-xs text-muted-foreground">{test.telefone}</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <Badge variant="blue">{test.app === "xcloud" ? "XCloud" : test.app}</Badge>
            <Badge variant="muted">{test.painel}</Badge>
          </div>
        </div>

        {/* Credenciais */}
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          {[
            { label: "Host/DNS", value: test.host },
            { label: "Usuário", value: test.usuario },
            { label: "Senha", value: test.senha },
            ...(test.codigo ? [{ label: "Código", value: test.codigo }] : []),
            ...(test.provedor ? [{ label: "Provedor", value: test.provedor }] : []),
            { label: "Validade", value: new Date(test.validade).toLocaleDateString("pt-BR") },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">{label}</span>
              <span className="flex items-center gap-1 font-mono text-foreground">
                {value}
                <button
                  onClick={() => copyText(value, label)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Copiar ${label}`}
                >
                  <Copy className="h-3 w-3" />
                </button>
                {copied === label && <span className="text-[10px] text-[oklch(0.62_0.18_155)]">Copiado</span>}
              </span>
            </div>
          ))}

          {isXCloud && test.deviceKey && (
            <div className="col-span-2 flex items-center justify-between gap-2 border-t border-border pt-2 mt-1">
              <span className="text-muted-foreground">Device Key</span>
              <span className="font-mono text-foreground text-[11px]">
                {maskDeviceKey(test.deviceKey)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bloco XCloud */}
      {isXCloud && (
        <div
          className={cn(
            "rounded-lg border p-4 space-y-3",
            xStatus === "ativado"
              ? "border-[oklch(0.62_0.18_155)]/30 bg-[oklch(0.62_0.18_155)]/5"
              : xStatus === "falhou"
              ? "border-destructive/30 bg-destructive/5"
              : "border-primary/30 bg-primary/5"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-foreground">XCloud</span>
            </div>
            {xStatus === "pendente" && <Badge variant="warning">Pendente</Badge>}
            {xStatus === "running" && <Badge variant="muted">Executando…</Badge>}
            {xStatus === "ativado" && <Badge variant="success">Ativado</Badge>}
            {xStatus === "falhou" && <Badge variant="danger">Falhou</Badge>}
          </div>

          {/* Badges de progresso */}
          <XCloudBadges status={xStatus === "running" ? "pendente" : xStatus === "ativado" ? "ativado" : xStatus === "falhou" ? "pendente" : "pendente"} />

          {/* Erro */}
          {xStatus === "falhou" && xErro && (
            <div className="flex items-start gap-2 rounded border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              <XCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              {xErro}
            </div>
          )}

          {/* Botão principal */}
          {xStatus !== "ativado" && (
            <button
              onClick={executarXCloud}
              disabled={xStatus === "running"}
              className="flex w-full items-center justify-center gap-2 rounded bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {xStatus === "running" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Executando XCloud real…
                </>
              ) : xStatus === "falhou" ? (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Tentar novamente
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4" />
                  Executar XCloud real
                </>
              )}
            </button>
          )}

          {xStatus === "ativado" && (
            <div className="flex items-center gap-1.5 text-xs text-[oklch(0.62_0.18_155)]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              XCloud ativado com sucesso
            </div>
          )}
        </div>
      )}

      {/* Ações secundárias */}
      <div className="flex flex-wrap gap-2">
        <button className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <Wrench className="h-3.5 w-3.5" />
          Modo manual
        </button>
        {isXCloud && (
          <button className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />
            Recriar device XCloud
          </button>
        )}
        <button className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <ScrollText className="h-3.5 w-3.5" />
          Ver log
        </button>
        <a
          href={`https://painel2.centralplayplus.com.br?test_id=${test.id}&source=painel1`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Abrir no Painel 2
        </a>
      </div>
    </div>
  )
}

// Página standalone de detalhe de teste
export default function TesteDetalhePage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const isSuccess = searchParams.get("success") === "1"

  // Em produção, buscaria via API com o params.id
  const test = { ...MOCK, id: params.id }

  return (
    <div className="max-w-xl space-y-4">
      {isSuccess && (
        <div className="flex items-center gap-2 rounded-lg border border-[oklch(0.62_0.18_155)]/30 bg-[oklch(0.62_0.18_155)]/5 px-4 py-3">
          <CheckCircle2 className="h-4 w-4 text-[oklch(0.62_0.18_155)]" />
          <span className="text-sm text-[oklch(0.62_0.18_155)] font-medium">Teste criado com sucesso</span>
        </div>
      )}
      <div className="mb-2">
        <h2 className="text-base font-semibold text-foreground">Teste #{test.id}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Detalhes e controle XCloud</p>
      </div>
      <TestSuccessCard test={test} />
    </div>
  )
}
