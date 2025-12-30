"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface AdminUser {
  email: string
  full_name: string
  role: string
}

export function AdminHeader() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadAdminUser()
  }, [])

  const loadAdminUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: adminData } = await supabase
          .from("admin_users")
          .select("email, full_name, role")
          .eq("id", user.id)
          .single()

        if (adminData) {
          setAdminUser(adminData)
        }
      }
    } catch (error) {
      console.error("Error loading admin user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="h-16 border-b bg-background flex items-center justify-end px-6">
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
      </div>
    )
  }

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Panel de Administración</h2>
      </div>

      <div className="flex items-center gap-4">
        {adminUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{adminUser.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {adminUser.role === "super_admin" ? "Super Admin" : "Admin"}
                  </p>
                </div>
                <Avatar>
                  <AvatarFallback>{getInitials(adminUser.full_name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{adminUser.full_name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{adminUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/admin/usuarios-admin")}>
                <User className="mr-2 h-4 w-4" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/admin/configuracion/general")}>
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
