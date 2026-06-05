import Link from "next/link"
import {
  FlaskConical,
  Users,
  Server,
  Zap,
  RefreshCw,
  DollarSign,
  AlertTriangle,
  ScrollText,
  Monitor,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"

const CARDS = [
  { label: "Testes ativos", valor: "8", icon: FlaskConical, href: "/testes", cor: "text-primary" },
  { label: "Clientes", valor: "34", icon: Users, href: "/clientes", cor: "text-foreground" },
  { label: "Contas", valor: "12", icon: Server, href: "/contas", cor: "text-foreground" },
  { label: "Ativações ativas", valor: "27", icon: Zap, href: "/ativacoes", cor: "text-[oklch(0.62_0.18_155)]" },
  { label: "Renovações pendentes", valor: "3", icon: RefreshCw, href: "/renovacoes", cor: "text-[oklch(0.72_0.18_65)]" },
  { label: "Problemas abertos", valor: "1", icon: AlertTriangle, href: "/problemas", cor: "text-destructive" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground">Visão geral</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Central Play Plus — Painel 1 Operacional</p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {CARDS.map(({ label, valor, icon: Icon, href, cor }) => (
          <Link
            key={href}
            href={href}
            className="rounded-lg border border-border bg-card p-4 hover:bg-accent transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className={`h-4 w-4 ${cor}`} />
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">{valor}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* XCloud pendentes */}
      <div className="rounded-lg border border-[oklch(0.72_0.18_65)]/30 bg-[oklch(0.72_0.18_65)]/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-[oklch(0.72_0.18_65)]" />
          <span className="text-xs font-medium text-[oklch(0.72_0.18_65)]">XCloud pendente de execução</span>
        </div>
        <div className="space-y-2">
          {[
            { id: "T-0042", cliente: "João Silva", painel: "Yellow Box" },
          ].map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded border border-border bg-card px-3 py-2">
              <div className="flex items-center gap-2">
                <Monitor className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs text-foreground">{t.cliente}</span>
                <span className="text-[11px] text-muted-foreground">{t.painel}</span>
              </div>
              <Link
                href={`/testes/${t.id}`}
                className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Executar XCloud
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Ações rápidas */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Ações rápidas</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/gerar-teste" className="flex items-center gap-1.5 rounded border border-border bg-card px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors">
            <FlaskConical className="h-3.5 w-3.5 text-primary" />
            Gerar Teste
          </Link>
          <Link href="/ativacoes/novo" className="flex items-center gap-1.5 rounded border border-border bg-card px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors">
            <Zap className="h-3.5 w-3.5 text-[oklch(0.62_0.18_155)]" />
            Ativar Cliente
          </Link>
          <Link href="/contas" className="flex items-center gap-1.5 rounded border border-border bg-card px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors">
            <CheckCircle2 className="h-3.5 w-3.5 text-[oklch(0.62_0.18_155)]" />
            Ver vagas livres
          </Link>
          <Link href="/logs" className="flex items-center gap-1.5 rounded border border-border bg-card px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors">
            <ScrollText className="h-3.5 w-3.5 text-muted-foreground" />
            Logs
          </Link>
          <a
            href="https://painel2.centralplayplus.com.br?source=painel1"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded border border-border bg-card px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            Abrir Painel 2
          </a>
        </div>
      </div>
    </div>
  )
}
