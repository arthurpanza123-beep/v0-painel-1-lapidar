import { DollarSign, TrendingUp, Target, Wallet, Layers } from "lucide-react"

const RECEITA_PLANO = [
  { nome: "Mensal", valor: "R$ 175", pct: 55, cor: "#10b981" },
  { nome: "Semestral", valor: "R$ 90", pct: 28, cor: "#818cf8" },
  { nome: "Trimestral", valor: "R$ 50", pct: 16, cor: "#a855f7" },
]

const CONVERSOES = [
  { label: "Conversão hoje", valor: "0%", cor: "#9ca3af" },
  { label: "Testes → pagos", valor: "0%", cor: "#9ca3af" },
]

export default function FinanceiroPage() {
  return (
    <div className="px-6 py-6 max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="text-center mb-7">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase mb-1.5"
          style={{ color: "#818cf8" }}>
          <DollarSign className="h-3.5 w-3.5" />
          Controle Financeiro
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Financeiro</h1>
        <p className="text-sm text-muted-foreground">Receita, conversões e saúde dos painéis</p>
        <span className="inline-block mt-2 text-xs font-medium px-3 py-0.5 rounded-full"
          style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
          Fonte: Supabase
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Receita atual", value: "R$ 0", sub: "↗ +12% este mês", subColor: "#10b981", icon: DollarSign, iconBg: "rgba(16,185,129,0.2)", iconColor: "#10b981", grad: "rgba(16,185,129,0.1)" },
          { label: "Prevista (30d)", value: "R$ 155", sub: "↗ próximos 30 dias", subColor: "#818cf8", icon: TrendingUp, iconBg: "rgba(99,102,241,0.2)", iconColor: "#818cf8", grad: "rgba(99,102,241,0.08)" },
          { label: "Lucro estimado", value: "R$ 0", sub: "", subColor: "", icon: Target, iconBg: "rgba(99,102,241,0.2)", iconColor: "#818cf8", grad: "rgba(99,102,241,0.08)" },
          { label: "Ticket médio", value: "R$ 0", sub: "", subColor: "", icon: Wallet, iconBg: "rgba(245,158,11,0.2)", iconColor: "#f59e0b", grad: "rgba(245,158,11,0.08)" },
        ].map((c) => (
          <div key={c.label} className="rounded-xl p-5"
            style={{ background: `linear-gradient(135deg, ${c.grad} 0%, transparent 60%), #141c2b`, border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg mb-3"
              style={{ background: c.iconBg }}>
              <c.icon className="h-5 w-5" style={{ color: c.iconColor }} />
            </div>
            <p className="text-2xl font-bold text-foreground">{c.value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{c.label}</p>
            {c.sub && <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: c.subColor }}>{c.sub}</p>}
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Receita por plano */}
        <div className="rounded-xl p-5"
          style={{ backgroundColor: "#141c2b", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Receita por plano</span>
          </div>
          <div className="space-y-3">
            {RECEITA_PLANO.map((p) => (
              <div key={p.nome}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{p.nome}</span>
                  <span className="font-semibold" style={{ color: p.cor }}>{p.valor}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.cor }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversões */}
        <div className="rounded-xl p-5"
          style={{ backgroundColor: "#141c2b", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">{"Conversões"}</span>
          </div>
          <div className="space-y-3">
            {CONVERSOES.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{c.label}</span>
                  <span className="font-semibold text-muted-foreground">{c.valor}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full bg-muted-foreground/30" style={{ width: "0%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
