"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  Mail,
  Settings,
  Truck,
  Users,
  ImageIcon,
  Factory,
  LogOut,
  Shield,
  BarChart3,
  HelpCircle,
  Tag,
  Receipt,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AdminHeader } from "@/components/admin/admin-header"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background font-montserrat">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card shadow-lg min-h-screen">
          <div className="flex h-20 items-center justify-center border-b border-border px-6 bg-gradient-to-br from-purple-600 via-purple-700 to-violet-700">
            <Link href="/admin" className="flex items-center gap-2">
              <Image
                src="/images/design-mode/logo.png"
                alt="STARDUST"
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>
          </div>
          <nav className="flex flex-col gap-1 p-3">
            <Link href="/admin">
              <Button
                variant={pathname === "/admin" ? "default" : "ghost"}
                className="w-full justify-start text-sm font-medium hover:bg-primary/10 transition-all"
              >
                <LayoutDashboard className="mr-3 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/reportes">
              <Button
                variant={pathname.startsWith("/admin/reportes") ? "default" : "ghost"}
                className="w-full justify-start text-sm font-medium hover:bg-primary/10 transition-all"
              >
                <BarChart3 className="mr-3 h-4 w-4" />
                Reportes
              </Button>
            </Link>
            <Link href="/admin/productos">
              <Button
                variant={pathname.startsWith("/admin/productos") ? "default" : "ghost"}
                className="w-full justify-start text-sm font-medium hover:bg-primary/10 transition-all"
              >
                <Package className="mr-3 h-4 w-4" />
                Productos
              </Button>
            </Link>
            <Link href="/admin/categorias">
              <Button
                variant={pathname.startsWith("/admin/categorias") ? "default" : "ghost"}
                className="w-full justify-start text-sm font-medium hover:bg-primary/10 transition-all"
              >
                <Tag className="mr-3 h-4 w-4" />
                Categorías
              </Button>
            </Link>
            <Link href="/admin/impuestos">
              <Button
                variant={pathname.startsWith("/admin/impuestos") ? "default" : "ghost"}
                className="w-full justify-start text-sm font-medium hover:bg-primary/10 transition-all"
              >
                <Receipt className="mr-3 h-4 w-4" />
                Impuestos
              </Button>
            </Link>
            <Link href="/admin/pedidos">
              <Button
                variant={pathname.startsWith("/admin/pedidos") ? "default" : "ghost"}
                className="w-full justify-start text-sm font-medium hover:bg-primary/10 transition-all"
              >
                <ShoppingCart className="mr-3 h-4 w-4" />
                Pedidos
              </Button>
            </Link>
            <Link href="/admin/clientes">
              <Button
                variant={pathname.startsWith("/admin/clientes") ? "default" : "ghost"}
                className="w-full justify-start text-sm font-medium hover:bg-primary/10 transition-all"
              >
                <Users className="mr-3 h-4 w-4" />
                Clientes
              </Button>
            </Link>
            <Link href="/admin/resenas">
              <Button
                variant={pathname.startsWith("/admin/resenas") ? "default" : "ghost"}
                className="w-full justify-start text-sm font-medium hover:bg-primary/10 transition-all"
              >
                <Star className="mr-3 h-4 w-4" />
                Reseñas
              </Button>
            </Link>
            <Link href="/admin/newsletter">
              <Button
                variant={pathname.startsWith("/admin/newsletter") ? "default" : "ghost"}
                className="w-full justify-start text-sm font-medium hover:bg-primary/10 transition-all"
              >
                <Mail className="mr-3 h-4 w-4" />
                Newsletter
              </Button>
            </Link>

            <Collapsible className="space-y-1">
              <CollapsibleTrigger asChild>
                <Button
                  variant={pathname.startsWith("/admin/configuracion") ? "default" : "ghost"}
                  className="w-full justify-start text-sm font-medium hover:bg-primary/10 transition-all"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Configuración
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pl-4 mt-1">
                <Link href="/admin/configuracion/general">
                  <Button
                    variant={pathname === "/admin/configuracion/general" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs hover:bg-primary/10 transition-all"
                  >
                    General
                  </Button>
                </Link>
                <Link href="/admin/configuracion/pagos">
                  <Button
                    variant={pathname === "/admin/configuracion/pagos" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs hover:bg-primary/10 transition-all"
                  >
                    Pagos
                  </Button>
                </Link>
                <Link href="/admin/configuracion/email">
                  <Button
                    variant={pathname === "/admin/configuracion/email" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs hover:bg-primary/10 transition-all"
                  >
                    Email
                  </Button>
                </Link>
                <Link href="/admin/configuracion/redes-sociales">
                  <Button
                    variant={pathname === "/admin/configuracion/redes-sociales" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs hover:bg-primary/10 transition-all"
                  >
                    Redes Sociales
                  </Button>
                </Link>
                <Link href="/admin/configuracion/notificaciones">
                  <Button
                    variant={pathname === "/admin/configuracion/notificaciones" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs hover:bg-primary/10 transition-all"
                  >
                    Notificaciones
                  </Button>
                </Link>
                <Link href="/admin/configuracion/contenido">
                  <Button
                    variant={pathname === "/admin/configuracion/contenido" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs hover:bg-primary/10 transition-all"
                  >
                    Contenido
                  </Button>
                </Link>
                <Link href="/admin/configuracion/app-movil">
                  <Button
                    variant={pathname === "/admin/configuracion/app-movil" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs hover:bg-primary/10 transition-all"
                  >
                    App Móvil
                  </Button>
                </Link>
                <Link href="/admin/configuracion/cupones">
                  <Button
                    variant={pathname.startsWith("/admin/configuracion/cupones") ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs hover:bg-primary/10 transition-all"
                  >
                    Cupones
                  </Button>
                </Link>
                <Link href="/admin/configuracion/faqs">
                  <Button
                    variant={pathname === "/admin/configuracion/faqs" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs hover:bg-primary/10 transition-all"
                  >
                    <HelpCircle className="mr-2 h-3 w-3" />
                    FAQs
                  </Button>
                </Link>
              </CollapsibleContent>
            </Collapsible>

            <Link href="/admin/zonas-entrega">
              <Button
                variant={pathname.startsWith("/admin/zonas-entrega") ? "default" : "ghost"}
                className="w-full justify-start text-sm font-medium hover:bg-primary/10 transition-all"
              >
                <Truck className="mr-3 h-4 w-4" />
                Zonas de Entrega
              </Button>
            </Link>
            <Link href="/admin/proveedores">
              <Button
                variant={pathname.startsWith("/admin/proveedores") ? "default" : "ghost"}
                className="w-full justify-start text-sm font-medium hover:bg-primary/10 transition-all"
              >
                <Factory className="mr-3 h-4 w-4" />
                Proveedores
              </Button>
            </Link>
            <Link href="/admin/banners">
              <Button
                variant={pathname.startsWith("/admin/banners") ? "default" : "ghost"}
                className="w-full justify-start text-sm font-medium hover:bg-primary/10 transition-all"
              >
                <ImageIcon className="mr-3 h-4 w-4" />
                Banners
              </Button>
            </Link>

            <Link href="/admin/usuarios-admin">
              <Button
                variant={pathname.startsWith("/admin/usuarios-admin") ? "default" : "ghost"}
                className="w-full justify-start text-sm font-medium hover:bg-primary/10 transition-all"
              >
                <Shield className="mr-3 h-4 w-4" />
                Usuarios Admin
              </Button>
            </Link>

            <div className="mt-4 pt-4 border-t border-border">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm font-medium hover:bg-primary/10 transition-all"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Volver al sitio
                </Button>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gradient-to-br from-background via-background to-primary/5">
          <AdminHeader />
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
