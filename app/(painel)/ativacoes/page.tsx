"use client"

import Link from "next/link"
import { Zap, Plus, RefreshCw, ExternalLink } from "lucide-react"
import { Badge } from "@/components/badge"

const ATIVACOES_DEMO = [
  { id: "A-0021", cliente: "João Silva", app: "XCloud", painel: "Yellow Box", plano: "Mensal", status: "ativo", vencimento: "2025-07-05" },
  { id: "A-0020", cliente: "Maria Oliveira", app: "Blessed Player", painel: "CineMax", plano: "Trimestral", status: "ativo", vencimento: "2025-09-04" },
  { id: "A-0019", cliente: "Pedro Santos", app: "XCloud", painel: "Yellow Box", plano: "Semestral", status: "expirado", vencimento: "2025-05-03" },
]

export default function AtivacoesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Ativações
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Clientes ativos e histórico de ativações</p>
        </div>
        <Link
          href="/ativacoes/novo"
          className="flex items-center gap-1.5 rounded bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Nova Ativação
        </Link>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Cliente</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">App / Painel</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Plano</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Status</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Vencimento</th>
              <th className="px-4 py-2.5 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ATIVACOES_DEMO.map((a) => (
              <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 text-xs font-medium text-foreground">{a.cliente}</td>
                <td className="px-4 py-3">
                  <p className="text-xs text-foreground">{a.app}</p>
                  <p className="text-[11px] text-muted-foreground">{a.painel}</p>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{a.plano}</td>
                <td className="px-4 py-3">
                  {a.status === "ativo" ? <Badge variant="success">Ativo</Badge> : <Badge variant="muted">Expirado</Badge>}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(a.vencimento).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href="/renovacoes" className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                      <RefreshCw className="h-3 w-3" />
                      Renovar
                    </Link>
                    <a
                      href={`https://painel2.centralplayplus.com.br?activation_id=${a.id}&source=painel1`}
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
      </div>
    </div>
  )
}
