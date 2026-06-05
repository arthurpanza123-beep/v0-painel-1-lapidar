"use client"

import { Users, Plus, ExternalLink } from "lucide-react"
import { Badge } from "@/components/badge"

const CLIENTES_DEMO = [
  { id: "C-001", nome: "João Silva", telefone: "(11) 98765-4321", status: "ativo", app: "XCloud", plano: "Mensal" },
  { id: "C-002", nome: "Maria Oliveira", telefone: "(21) 97654-3210", status: "ativo", app: "Blessed Player", plano: "Trimestral" },
  { id: "C-003", nome: "Pedro Santos", telefone: "(31) 96543-2109", status: "teste", app: "XCloud", plano: "—" },
  { id: "C-004", nome: "Ana Costa", telefone: "(41) 95432-1098", status: "expirado", app: "PlaySim", plano: "Mensal" },
]

export default function ClientesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Clientes
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Cadastro de clientes e status de uso</p>
        </div>
        <button className="flex items-center gap-1.5 rounded bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" />
          Novo Cliente
        </button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Cliente</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">App</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Plano</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Status</th>
              <th className="px-4 py-2.5 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {CLIENTES_DEMO.map((c) => (
              <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-xs font-medium text-foreground">{c.nome}</p>
                  <p className="text-[11px] text-muted-foreground">{c.telefone}</p>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{c.app}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{c.plano}</td>
                <td className="px-4 py-3">
                  {c.status === "ativo" && <Badge variant="success">Ativo</Badge>}
                  {c.status === "teste" && <Badge variant="blue">Teste</Badge>}
                  {c.status === "expirado" && <Badge variant="muted">Expirado</Badge>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`https://painel2.centralplayplus.com.br?client_id=${c.id}&source=painel1`}
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
