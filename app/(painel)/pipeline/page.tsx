import { Kanban } from "lucide-react"

export default function PipelinePage() {
  return (
    <div className="px-6 py-6 max-w-[1100px] mx-auto">
      <div className="text-center mb-7">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase mb-1.5"
          style={{ color: "#818cf8" }}>
          <Kanban className="h-3.5 w-3.5" />
          Funil de Vendas
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Pipeline</h1>
        <p className="text-sm text-muted-foreground">Acompanhe leads do primeiro contato até a conversão</p>
      </div>
      <div className="rounded-xl p-8 text-center text-muted-foreground text-sm"
        style={{ backgroundColor: "#141c2b", border: "1px solid rgba(255,255,255,0.07)" }}>
        Pipeline em desenvolvimento — dados via Supabase
      </div>
    </div>
  )
}
