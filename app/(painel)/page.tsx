import { TrendingUp, Pencil, Zap, BarChart2, Users, Wallet } from "lucide-react"

const STAT_CARDS = [
  {
    label: "Testes ativos",
    value: "3",
    icon: Pencil,
    iconBg: "rgba(99,102,241,0.2)",
    iconColor: "#818cf8",
    gradientFrom: "rgba(99,102,241,0.12)",
  },
  {
    label: "Gerados hoje",
    value: "6",
    icon: Zap,
    iconBg: "rgba(245,158,11,0.2)",
    iconColor: "#f59e0b",
    gradientFrom: "rgba(245,158,11,0.12)",
  },
  {
    label: "Leads em andamento",
    value: "16",
    icon: BarChart2,
    iconBg: "rgba(99,102,241,0.2)",
    iconColor: "#818cf8",
    gradientFrom: "rgba(99,102,241,0.12)",
  },
  {
    label: "Clientes ativos",
    value: "4",
    icon: Users,
    iconBg: "rgba(16,185,129,0.2)",
    iconColor: "#10b981",
    gradientFrom: "rgba(16,185,129,0.12)",
  },
]

const REVENUE_BARS = [
  { label: "Hoje", value: "R$ 0", pct: 0 },
  { label: "30d", value: "R$ 155", pct: 55 },
  { label: "60d", value: "R$ 155", pct: 55 },
  { label: "90d", value: "R$ 225", pct: 80 },
]

const CREDITS = [
  { name: "Ninety", value: "R$ 146", alert: false },
  { name: "Brasil", value: "R$ 52", alert: true },
  { name: "Yellow Box", value: "R$ 230", alert: false },
  { name: "Uniplay", value: "R$ 18", alert: true },
]

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div
          className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-1.5"
          style={{ color: "#818cf8" }}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Central de Comando
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-1">Central Play Plus</h1>
        <p className="text-sm text-muted-foreground">
          {"Visão geral da operação · "}{today}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {STAT_CARDS.map((card) => (
          <button
            key={card.label}
            className="rounded-xl p-5 text-left transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${card.gradientFrom} 0%, transparent 60%), #141c2b`,
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg mb-3"
              style={{ background: card.iconBg }}
            >
              <card.icon className="h-5 w-5" style={{ color: card.iconColor }} />
            </div>
            <p className="text-3xl font-bold text-foreground">{card.value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{card.label}</p>
          </button>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div
          className="lg:col-span-2 rounded-xl p-5"
          style={{ backgroundColor: "#141c2b", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Receita prevista (30 dias)</p>
              <p className="text-3xl font-bold text-foreground">R$ 1059</p>
              <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#10b981" }}>
                <span>↗</span>
                Projeção crescente nos próximos 90 dias
              </p>
            </div>
            <a
              href="/financeiro"
              className="text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
              style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8" }}
            >
              Financeiro
            </a>
          </div>

          <div className="flex items-end gap-4 mt-8 h-24">
            {REVENUE_BARS.map((bar) => (
              <div key={bar.label} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-[10px] text-muted-foreground">{bar.value}</span>
                <div
                  className="w-full rounded-t-sm"
                  style={{
                    height: bar.pct === 0 ? "4px" : `${bar.pct}px`,
                    background: "linear-gradient(to top, #10b981, rgba(16,185,129,0.4))",
                  }}
                />
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-sm w-full text-center"
                  style={{
                    background: bar.label === "Hoje" ? "rgba(99,102,241,0.25)" : "transparent",
                    color: bar.label === "Hoje" ? "#818cf8" : "#6b7280",
                  }}
                >
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Credits */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "#141c2b", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Créditos disponíveis</span>
          </div>
          <p className="text-3xl font-bold text-foreground mb-5">R$ 526</p>
          <div className="space-y-2.5">
            {CREDITS.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {c.alert && (
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: "#f59e0b" }} />
                  )}
                  <span style={{ color: c.alert ? "#e2e8f0" : "#6b7280" }}>{c.name}</span>
                </div>
                <span
                  className="font-medium tabular-nums"
                  style={{ color: c.alert ? "#f59e0b" : "#9ca3af" }}
                >
                  {c.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
