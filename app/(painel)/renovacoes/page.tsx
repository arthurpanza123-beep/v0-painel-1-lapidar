import { RefreshCw } from "lucide-react"
import { Badge } from "@/components/badge"

const RENOVACOES_DEMO = [
  { id: "R-001", cliente: "João Silva", app: "XCloud", vencimento: "2025-07-05", diasRestantes: 0 },
  { id: "R-002", cliente: "Ana Costa", app: "PlaySim", vencimento: "2025-07-07", diasRestantes: 2 },
  { id: "R-003", cliente: "Carlos Lima", app: "XCloud", vencimento: "2025-07-10", diasRestantes: 5 },
]

export default function RenovacoesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-primary" />
          Renovações
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Clientes com vencimento próximo</p>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Cliente</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">App</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Vencimento</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Urgência</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {RENOVACOES_DEMO.map((r) => (
              <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 text-xs font-medium text-foreground">{r.cliente}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{r.app}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(r.vencimento).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3">
                  {r.diasRestantes === 0 ? (
                    <Badge variant="danger">Vencido</Badge>
                  ) : r.diasRestantes <= 3 ? (
                    <Badge variant="warning">Vence em {r.diasRestantes}d</Badge>
                  ) : (
                    <Badge variant="muted">Vence em {r.diasRestantes}d</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
