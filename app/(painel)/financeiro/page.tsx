import { DollarSign } from "lucide-react"
import { Badge } from "@/components/badge"

const FINANCEIRO_DEMO = [
  { id: "F-001", cliente: "João Silva", plano: "Mensal", valor: "R$ 25,00", data: "2025-06-05", status: "pago" },
  { id: "F-002", cliente: "Maria Oliveira", plano: "Trimestral", valor: "R$ 65,00", data: "2025-06-04", status: "pago" },
  { id: "F-003", cliente: "Ana Costa", plano: "Mensal", valor: "R$ 25,00", data: "2025-05-28", status: "pendente" },
]

export default function FinanceiroPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          Financeiro
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Registro de pagamentos e pendências</p>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Cliente</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Plano</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Valor</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Data</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {FINANCEIRO_DEMO.map((f) => (
              <tr key={f.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 text-xs font-medium text-foreground">{f.cliente}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{f.plano}</td>
                <td className="px-4 py-3 text-xs text-foreground font-mono">{f.valor}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(f.data).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3">
                  {f.status === "pago" ? <Badge variant="success">Pago</Badge> : <Badge variant="warning">Pendente</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
