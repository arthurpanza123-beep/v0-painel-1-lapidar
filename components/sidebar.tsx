"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FlaskConical,
  Users,
  CreditCard,
  Server,
  Zap,
  RefreshCw,
  DollarSign,
  AlertTriangle,
  ScrollText,
  LayoutDashboard,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/gerar-teste", label: "Gerar Teste", icon: FlaskConical },
  { href: "/testes", label: "Testes", icon: FlaskConical, sub: true },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/contas", label: "Contas", icon: Server },
  { href: "/ativacoes", label: "Ativações", icon: Zap },
  { href: "/renovacoes", label: "Renovações", icon: RefreshCw },
  { href: "/financeiro", label: "Financeiro", icon: DollarSign },
  { href: "/problemas", label: "Problemas", icon: AlertTriangle },
  { href: "/logs", label: "Logs", icon: ScrollText },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col bg-sidebar border-r border-border">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-4 border-b border-border">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-primary">
          <CreditCard className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="leading-tight">
          <p className="text-xs font-semibold text-foreground">Central Play Plus</p>
          <p className="text-[10px] text-muted-foreground">Painel 1 — Operacional</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, sub }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded px-3 py-2 text-sm transition-colors",
                sub && "pl-7",
                active
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Painel 2 link */}
      <div className="p-3 border-t border-border">
        <a
          href="https://painel2.centralplayplus.com.br"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          Abrir Painel 2
        </a>
      </div>
    </aside>
  )
}
