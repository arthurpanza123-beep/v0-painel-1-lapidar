"use client"

import { useState } from "react"
import Link from "next/link"
import {
  FlaskConical,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  ExternalLink,
  Plus,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@/components/badge"
import { cn } from "@/lib/utils"

interface Teste {
  id: string
  cliente: string
  telefone: string
  app: string
  painel: string
  status: "ativo" | "expirado" | "pendente"
  validade: string
  xcloudStatus?: "pendente" | "ativado" | "falhou"
}

// Dados de demonstração — em produção vêm da API
const TESTES_DEMO: Teste[] = [
  {
    id: "T-0042",
    cliente: "João Silva",
    telefone: "(11) 98765-4321",
    app: "xcloud",
    painel: "Yellow Box",
    status: "ativo",
    validade: "2025-07-05",
    xcloudStatus: "pendente",
  },
  {
    id: "T-0041",
    cliente: "Maria Oliveira",
    telefone: "(21) 97654-3210",
    app: "blessed",
    painel: "CineMax",
    status: "ativo",
    validade: "2025-07-04",
  },
  {
    id: "T-0040",
    cliente: "Pedro Santos",
    telefone: "(31) 96543-2109",
    app: "xcloud",
    painel: "Yellow Box",
    status: "ativo",
    validade: "2025-07-03",
    xcloudStatus: "ativado",
  },
  {
    id: "T-0039",
    cliente: "Ana Costa",
    telefone: "(41) 95432-1098",
    app: "playsim",
    painel: "Ninety",
    status: "expirado",
    validade: "2025-06-28",
  },
  {
    id: "T-0038",
    cliente: "Carlos Lima",
    telefone: "(51) 94321-0987",
    app: "xcloud",
    painel: "CineMax",
    status: "ativo",
    validade: "2025-07-06",
    xcloudStatus: "falhou",
  },
]

function XCloudStatusIcon({ status }: { status?: "pendente" | "ativado" | "falhou" }) {
  if (!status) return null
  if (status === "ativado") return <CheckCircle2 className="h-3.5 w-3.5 text-[oklch(0.62_0.18_155)]" />
  if (status === "falhou") return <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
  return <Clock className="h-3.5 w-3.5 text-[oklch(0.72_0.18_65)]" />
}

function xcloudLabel(status?: "pendente" | "ativado" | "falhou") {
  if (status === "ativado") return "Ativado"
  if (status === "falhou") return "Falhou"
  return "Pendente"
}

export default function TestesPage() {
  const [filtro, setFiltro] = useState<"todos" | "ativo" | "expirado" | "xcloud-pendente">("todos")

  const filtrados = TESTES_DEMO.filter((t) => {
    if (filtro === "ativo") return t.status === "ativo"
    if (filtro === "expirado") return t.status === "expirado"
    if (filtro === "xcloud-pendente") return t.app === "xcloud" && t.xcloudStatus === "pendente"
    return true
  })

  const pendentesXCloud = TESTES_DEMO.filter((t) => t.app === "xcloud" && t.xcloudStatus === "pendente").length

  return (
    <div className="space-y-5">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-primary" />
            Testes
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Testes ativos e histórico. Teste não ocupa tela.
          </p>
        </div>
        <Link
          href="/gerar-teste"
          className="flex items-center gap-1.5 rounded bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Novo Teste
        </Link>
      </div>

      {/* Alerta XCloud pendentes */}
      {pendentesXCloud > 0 && (
        <div
          className="flex items-center justify-between rounded-lg border border-[oklch(0.72_0.18_65)]/30 bg-[oklch(0.72_0.18_65)]/5 px-4 py-3 cursor-pointer hover:bg-[oklch(0.72_0.18_65)]/10 transition-colors"
          onClick={() => setFiltro("xcloud-pendente")}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[oklch(0.72_0.18_65)]" />
            <span className="text-xs font-medium text-[oklch(0.72_0.18_65)]">
              {pendentesXCloud} XCloud{pendentesXCloud > 1 ? "s" : ""} pendente{pendentesXCloud > 1 ? "s" : ""} de execução
            </span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-[oklch(0.72_0.18_65)]" />
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2">
        {[
          { key: "todos", label: "Todos" },
          { key: "ativo", label: "Ativos" },
          { key: "expirado", label: "Expirados" },
          { key: "xcloud-pendente", label: "XCloud pendente" },
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

      {/* Lista */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Cliente</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">App / Painel</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Status</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Validade</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">XCloud</th>
              <th className="px-4 py-2.5 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtrados.map((t) => (
              <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-xs font-medium text-foreground">{t.cliente}</p>
                  <p className="text-[11px] text-muted-foreground">{t.telefone}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {t.app === "xcloud" && <Monitor className="h-3 w-3 text-primary" />}
                    <span className="text-xs text-foreground capitalize">{t.app}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{t.painel}</p>
                </td>
                <td className="px-4 py-3">
                  {t.status === "ativo" ? (
                    <Badge variant="success">Ativo</Badge>
                  ) : (
                    <Badge variant="muted">Expirado</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(t.validade).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3">
                  {t.app === "xcloud" ? (
                    <span className="flex items-center gap-1 text-xs">
                      <XCloudStatusIcon status={t.xcloudStatus} />
                      <span
                        className={cn(
                          t.xcloudStatus === "ativado" && "text-[oklch(0.62_0.18_155)]",
                          t.xcloudStatus === "falhou" && "text-destructive",
                          t.xcloudStatus === "pendente" && "text-[oklch(0.72_0.18_65)]"
                        )}
                      >
                        {xcloudLabel(t.xcloudStatus)}
                      </span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/testes/${t.id}`}
                      className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Detalhes
                    </Link>
                    {t.app === "xcloud" && t.xcloudStatus === "pendente" && (
                      <Link
                        href={`/testes/${t.id}`}
                        className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        <Monitor className="h-3 w-3" />
                        Executar XCloud
                      </Link>
                    )}
                    <Link
                      href={`/ativacoes/novo?clienteId=${t.id}`}
                      className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Zap className="h-3 w-3" />
                      Ativar
                    </Link>
                    <a
                      href={`https://painel2.centralplayplus.com.br?test_id=${t.id}&source=painel1`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Painel 2
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrados.length === 0 && (
          <div className="px-4 py-8 text-center text-xs text-muted-foreground">
            Nenhum teste encontrado para o filtro selecionado.
          </div>
        )}
      </div>
    </div>
  )
}
