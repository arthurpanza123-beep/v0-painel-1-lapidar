import { cn } from "@/lib/utils"

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "danger" | "muted" | "blue"
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border",
        variant === "default" && "bg-primary/10 text-primary border-primary/20",
        variant === "success" && "bg-[oklch(0.62_0.18_155)]/10 text-[oklch(0.62_0.18_155)] border-[oklch(0.62_0.18_155)]/20",
        variant === "warning" && "bg-[oklch(0.72_0.18_65)]/10 text-[oklch(0.72_0.18_65)] border-[oklch(0.72_0.18_65)]/20",
        variant === "danger" && "bg-destructive/10 text-destructive border-destructive/20",
        variant === "muted" && "bg-muted text-muted-foreground border-border",
        variant === "blue" && "bg-primary/10 text-primary border-primary/20",
        className
      )}
    >
      {children}
    </span>
  )
}
