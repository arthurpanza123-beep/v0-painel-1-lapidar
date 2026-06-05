import { ScrollText } from "lucide-react"

const LOGS_DEMO = [
  { id: 1, ts: "2025-06-05T14:32:11Z", nivel: "info", msg: "Teste T-0042 criado — XCloud / João Silva" },
  { id: 2, ts: "2025-06-05T14:31:05Z", nivel: "info", msg: "Ativação A-0021 confirmada — conta #4821 / Tela 01" },
  { id: 3, ts: "2025-06-05T13:55:42Z", nivel: "error", msg: "XCloud falhou para T-0038 — timeout ao adicionar device" },
  { id: 4, ts: "2025-06-05T13:40:20Z", nivel: "info", msg: "Recomendação de conta: #4821 com vaga livre (Tela 02)" },
  { id: 5, ts: "2025-06-05T12:10:00Z", nivel: "warn", msg: "Cliente Ana Costa com vencimento em 2 dias" },
]

const nivelCor: Record<string, string> = {
  info: "text-muted-foreground",
  warn: "text-[oklch(0.72_0.18_65)]",
  error: "text-destructive",
}

export default function LogsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <ScrollText className="h-4 w-4 text-primary" />
          Logs
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Registro de operações do painel</p>
      </div>
      <div className="rounded-lg border border-border bg-card divide-y divide-border">
        {LOGS_DEMO.map((log) => (
          <div key={log.id} className="flex items-start gap-3 px-4 py-3">
            <span className={`text-[10px] font-mono uppercase shrink-0 w-8 ${nivelCor[log.nivel]}`}>
              {log.nivel}
            </span>
            <span className="text-[11px] text-muted-foreground font-mono shrink-0">
              {new Date(log.ts).toLocaleTimeString("pt-BR")}
            </span>
            <span className="text-xs text-foreground">{log.msg}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
