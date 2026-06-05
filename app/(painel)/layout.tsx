import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-56">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
