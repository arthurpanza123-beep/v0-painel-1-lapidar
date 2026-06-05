"use client"

import { usePathname } from "next/navigation"

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/gerar-teste": "Gerar Teste",
  "/testes": "Testes",
  "/clientes": "Clientes",
  "/contas": "Contas",
  "/ativacoes": "Ativações",
  "/renovacoes": "Renovações",
  "/financeiro": "Financeiro",
  "/problemas": "Problemas",
  "/logs": "Logs",
}

export function Header() {
  const pathname = usePathname()
  const title = TITLES[pathname] ?? "Painel 1"

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6">
      <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.62_0.18_155)]" />
          Online
        </span>
      </div>
    </header>
  )
}
