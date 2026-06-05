"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Kanban,
  HeadphonesIcon,
  Pencil,
  Users,
  Folder,
  RefreshCw,
  DollarSign,
  AlertTriangle,
  Settings,
  Terminal,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pipeline", label: "Pipeline", icon: Kanban },
  { href: "/gerar-teste", label: "Gerar Teste", icon: HeadphonesIcon },
  { href: "/testes", label: "Testes", icon: Pencil },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/contas", label: "Contas", icon: Folder },
  { href: "/renovacoes", label: "Renovacoes", icon: RefreshCw },
  { href: "/financeiro", label: "Financeiro", icon: DollarSign },
  { href: "/problemas", label: "Problemas", icon: AlertTriangle },
  { href: "/configuracoes", label: "Configuracoes", icon: Settings },
  { href: "/debug", label: "Debug", icon: Terminal },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[58px] flex-col items-center py-2 gap-1"
      style={{ background: "#0d1117", borderRight: "1px solid rgba(255,255,255,0.06)" }}>

      {/* Logo */}
      <button
        onClick={() => router.push("/")}
        className="flex h-9 w-9 items-center justify-center rounded-lg mb-1 transition-all"
        style={{ background: "rgba(99,102,241,0.2)" }}
        title="Central Play Plus"
        aria-label="Central Play Plus"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <polygon points="5,3 19,12 5,21" fill="white" />
        </svg>
      </button>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col items-center gap-0.5 w-full px-1.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href))
          return (
            <button
              key={href}
              title={label}
              aria-label={label}
              onClick={() => router.push(href)}
              className={cn(
                "group relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200",
                active
                  ? "text-white"
                  : "text-[color:var(--sidebar-foreground)] hover:text-white"
              )}
              style={active ? { background: "rgba(99,102,241,0.25)" } : undefined}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              {/* Tooltip */}
              <span
                className="pointer-events-none absolute left-[calc(100%+10px)] z-50 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                style={{
                  background: "#1e2230",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#e2e8f0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Sair */}
      <button
        title="Sair"
        aria-label="Sair"
        className="group relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 text-[color:var(--sidebar-foreground)] hover:text-white mt-1"
      >
        <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
        <span
          className="pointer-events-none absolute left-[calc(100%+10px)] z-50 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{
            background: "#1e2230",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#e2e8f0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          Sair
        </span>
      </button>
    </aside>
  )
}
