import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  Home,
  Clock,
  FileText,
  DollarSign,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/business',
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: 'Agendamentos',
    href: '/business/appointments',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: 'Clientes',
    href: '/business/clients',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Horários',
    href: '/business/schedule',
    icon: <Clock className="h-5 w-5" />,
  },
  {
    title: 'Relatórios',
    href: '/business/reports',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: 'Financeiro',
    href: '/business/finance',
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    title: 'Configurações',
    href: '/business/settings',
    icon: <Settings className="h-5 w-5" />,
  },
]

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-card shadow-lg transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/business" className="text-xl font-bold">
            Painel da Empresa
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-2 text-sm font-medium rounded-md',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {item.icon}
              <span className="ml-3">{item.title}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4">
          <Button variant="outline" className="w-full" onClick={() => {}}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <div className="sticky top-0 z-40 h-16 bg-card/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="ml-auto flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Empresa: Barbearia Exemplo
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 