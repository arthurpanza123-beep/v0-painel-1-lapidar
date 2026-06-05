import { Terminal } from "lucide-react"

export default function DebugPage() {
  return (
    <div className="px-6 py-6 max-w-[800px] mx-auto">
      <div className="text-center mb-7">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase mb-1.5"
          style={{ color: "#818cf8" }}>
          <Terminal className="h-3.5 w-3.5" />
          Dev Tools
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Debug</h1>
        <p className="text-sm text-muted-foreground">Ferramentas de diagnóstico e logs internos</p>
      </div>
      <div className="rounded-xl p-8 text-center text-muted-foreground text-sm font-mono"
        style={{ backgroundColor: "#0a0f1a", border: "1px solid rgba(255,255,255,0.07)" }}>
        {"$ aguardando dados..."}
      </div>
    </div>
  )
}
