import { RefreshCw, Phone } from "lucide-react"

const PROXIMOS = [
  { id: "1", dias: 5, nome: "Claudiomar", status: "Ativo", plano: "Mensal", telefone: "(55) •••••-6172", valor: "R$ 0", restante: "5d restantes" },
  { id: "2", dias: 6, nome: "Dario Leite", status: "Ativo", plano: "Mensal", telefone: "(55) •••••-6150", valor: "R$ 25", restante: "6d restantes" },
]

const MAIS_TARDE = [
  { id: "3", dias: 12, nome: "Robson Lins", status: "Ativo", plano: "Mensal", telefone: "(55) •••••-4188", valor: "R$ 25", restante: "12d restantes" },
  { id: "4", dias: 14, nome: "Dario Leite", status: "Ativo", plano: "Mensal", telefone: "(55) •••••-6150", valor: "R$ 25", restante: "14d restantes" },
]

function RenovacaoCard({ item }: { item: typeof PROXIMOS[0] }) {
  return (
    <div className="flex items-center gap-4 rounded-xl px-4 py-3"
      style={{ backgroundColor: "#0f1623", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex flex-col items-center min-w-[44px] text-center">
        <span className="text-2xl font-bold text-foreground">{item.dias}</span>
        <span className="text-[10px] tracking-widest text-muted-foreground">DIAS</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{item.nome}</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
            {item.status}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
          <RefreshCw className="h-3 w-3" />
          {item.plano}
          <Phone className="h-3 w-3 ml-1" />
          {item.telefone}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-sm font-bold text-foreground">{item.valor}</span>
        <span className="text-[11px] text-muted-foreground">{item.restante}</span>
        <button className="mt-1 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium"
          style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.25)" }}>
          ··· Acoes
        </button>
      </div>
    </div>
  )
}

export default function RenovacoesPage() {
  const urgentes = 0
  const em7dias = PROXIMOS.length
  const aReceber = "R$ 315"

  return (
    <div className="px-6 py-6 max-w-[800px] mx-auto">
      {/* Header */}
      <div className="text-center mb-7">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase mb-1.5"
          style={{ color: "#818cf8" }}>
          <RefreshCw className="h-3.5 w-3.5" />
          Agenda de Cobranca
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Renovacoes</h1>
        <p className="text-sm text-muted-foreground">{urgentes} urgentes · {aReceber} a receber</p>
        <span className="inline-block mt-2 text-xs font-medium px-3 py-0.5 rounded-full"
          style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
          Fonte: Supabase
        </span>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-0 mb-8">
        <div className="flex-1 text-center py-4" style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-3xl font-bold" style={{ color: "#9ca3af" }}>{urgentes}</p>
          <p className="text-[10px] tracking-widest text-muted-foreground mt-1">URGENTES</p>
        </div>
        <div className="flex-1 text-center py-4" style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-3xl font-bold" style={{ color: "#f59e0b" }}>{em7dias}</p>
          <p className="text-[10px] tracking-widest text-muted-foreground mt-1">EM 7 DIAS</p>
        </div>
        <div className="flex-1 text-center py-4">
          <p className="text-3xl font-bold" style={{ color: "#10b981" }}>{aReceber}</p>
          <p className="text-[10px] tracking-widest text-muted-foreground mt-1">A RECEBER</p>
        </div>
      </div>

      {/* Proximos 7 dias */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: "#f59e0b" }} />
            <span className="text-xs font-semibold tracking-widest uppercase text-foreground">
              Proximos 7 dias ({PROXIMOS.length})
            </span>
          </div>
          <span className="text-sm font-bold text-foreground">$ 25</span>
        </div>
        <div className="space-y-2">
          {PROXIMOS.map((item) => <RenovacaoCard key={item.id} item={item} />)}
        </div>
      </div>

      {/* Mais tarde */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: "#818cf8" }} />
            <span className="text-xs font-semibold tracking-widest uppercase text-foreground">
              Mais tarde ({MAIS_TARDE.length})
            </span>
          </div>
          <span className="text-sm font-bold text-foreground">$ 300</span>
        </div>
        <div className="space-y-2">
          {MAIS_TARDE.map((item) => <RenovacaoCard key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  )
}
