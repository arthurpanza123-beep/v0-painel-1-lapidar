import { AlertTriangle } from "lucide-react"
import { Badge } from "@/components/badge"

const PROBLEMAS_DEMO = [
  { id: "P-001", cliente: "João Silva", descricao: "Sem sinal no XCloud após ativação", status: "aberto", data: "2025-06-04" },
  { id: "P-002", cliente: "Pedro Santos", descricao: "Erro de autenticação no Blessed Player", status: "resolvido", data: "2025-06-01" },
]

export default function ProblemasPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          Problemas
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Ocorrências abertas e resolvidas</p>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Cliente</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Descrição</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Data</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PROBLEMAS_DEMO.map((p) => (
              <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 text-xs font-medium text-foreground">{p.cliente}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs">{p.descricao}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(p.data).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3">
                  {p.status === "aberto" ? <Badge variant="danger">Aberto</Badge> : <Badge variant="success">Resolvido</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
