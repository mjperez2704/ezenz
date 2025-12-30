"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { User, Package, Settings, LogOut, MapPin, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  created_at: string
}

interface Order {
  id: string
  created_at: string
  total: number
  status: string
  items: any[]
  customer_name: string
}

export default function CuentaPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (!authUser) {
          router.push("/auth/login")
          return
        }

        setUser(authUser)

        // Cargar perfil del usuario
        const { data: profileData } = await supabase.from("users").select("*").eq("id", authUser.id).single()

        if (profileData) {
          setProfile(profileData)
        }

        // Cargar órdenes del usuario
        const { data: ordersData } = await supabase
          .from("orders")
          .select("*")
          .eq("authenticated_user_id", authUser.id)
          .order("created_at", { ascending: false })

        if (ordersData) {
          setOrders(ordersData)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[rgb(15,15,35)]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          <Loader2 className="h-12 w-12 text-[rgb(170,151,196)] animate-spin" />
          <p className="text-white/60 mt-4">Cargando...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return null
  }

  const userData = {
    name: profile?.full_name || user.email?.split("@")[0] || "Usuario",
    email: user.email || "",
    phone: profile?.phone || "No especificado",
    joinDate: new Date(profile?.created_at || user.created_at).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
    }),
  }

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0)

  return (
    <main className="min-h-screen bg-[rgb(15,15,35)]">
      <Navbar />

      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 font-condor">Mi Cuenta</h1>
            <p className="text-white/60 font-montserrat">Bienvenido de vuelta, {userData.name}</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-white/5 border border-[rgb(74,34,86)] p-1">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[rgb(170,151,196)] data-[state=active]:to-[rgb(201,18,64)] data-[state=active]:text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Resumen
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[rgb(170,151,196)] data-[state=active]:to-[rgb(201,18,64)] data-[state=active]:text-white"
              >
                <Package className="h-4 w-4 mr-2" />
                Pedidos
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[rgb(170,151,196)] data-[state=active]:to-[rgb(201,18,64)] data-[state=active]:text-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/5 border-[rgb(74,34,86)]">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Total de Pedidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] bg-clip-text text-transparent">
                      {orders.length}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-[rgb(74,34,86)]">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Gasto Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] bg-clip-text text-transparent">
                      ${totalSpent.toFixed(2)}
                    </p>
                    <p className="text-white/40 text-sm">MXN</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-[rgb(74,34,86)]">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Último Pedido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-white">
                      {orders.length > 0
                        ? new Date(orders[0].created_at).toLocaleDateString("es-MX", {
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                    <p className="text-white/40 text-sm">
                      {orders.length > 0 ? `$${Number(orders[0].total).toFixed(2)} MXN` : "Sin pedidos"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/5 border-[rgb(74,34,86)]">
                <CardHeader>
                  <CardTitle className="text-white">Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-[rgb(74,34,86)]">
                    <span className="text-white/60">Nombre</span>
                    <span className="text-white font-medium">{userData.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[rgb(74,34,86)]">
                    <span className="text-white/60">Email</span>
                    <span className="text-white font-medium">{userData.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[rgb(74,34,86)]">
                    <span className="text-white/60">Teléfono</span>
                    <span className="text-white font-medium">{userData.phone}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white/60">Miembro desde</span>
                    <span className="text-white font-medium">{userData.joinDate}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              {orders.length === 0 ? (
                <Card className="bg-white/5 border-[rgb(74,34,86)]">
                  <CardContent className="py-12 text-center">
                    <Package className="h-16 w-16 text-white/20 mx-auto mb-4" />
                    <h3 className="text-white text-xl font-bold mb-2">No hay pedidos aún</h3>
                    <p className="text-white/60 mb-6">Comienza a comprar para ver tu historial de pedidos aquí</p>
                    <Link href="/productos">
                      <Button className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:opacity-90 text-white">
                        Explorar Productos
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} className="bg-white/5 border-[rgb(74,34,86)]">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white text-lg">Pedido #{order.id.slice(0, 8)}</CardTitle>
                          <p className="text-white/60 text-sm">
                            {new Date(order.created_at).toLocaleDateString("es-MX", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <Badge
                          className={
                            order.status === "completed"
                              ? "bg-green-500/20 text-green-400 border-green-500"
                              : order.status === "processing"
                                ? "bg-blue-500/20 text-blue-400 border-blue-500"
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500"
                          }
                        >
                          {order.status === "completed"
                            ? "Completado"
                            : order.status === "processing"
                              ? "Procesando"
                              : "Pendiente"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {Array.isArray(order.items) &&
                        order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-white/70">
                              {item.name} x{item.quantity}
                            </span>
                            <span className="text-white">${(item.price * item.quantity).toFixed(2)} MXN</span>
                          </div>
                        ))}
                      <div className="flex justify-between font-bold text-lg pt-3 border-t border-[rgb(74,34,86)]">
                        <span className="text-white">Total</span>
                        <span className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] bg-clip-text text-transparent">
                          ${Number(order.total).toFixed(2)} MXN
                        </span>
                      </div>
                      <Link href={`/confirmacion/${order.id}`} className="block mt-3">
                        <Button
                          variant="outline"
                          className="w-full border-[rgb(170,151,196)] text-[rgb(170,151,196)] hover:bg-[rgb(170,151,196)]/10 bg-transparent"
                        >
                          Ver Detalles
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-white/5 border-[rgb(74,34,86)]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-[rgb(170,151,196)]" />
                    Editar Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/60 mb-4">Actualiza tu información personal</p>
                  <Link href="/cuenta/editar">
                    <Button
                      variant="outline"
                      className="border-[rgb(170,151,196)] text-[rgb(170,151,196)] hover:bg-[rgb(170,151,196)]/10 bg-transparent"
                    >
                      Editar Información
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-[rgb(74,34,86)]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[rgb(170,151,196)]" />
                    Direcciones de Envío
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/60 mb-4">Gestiona tus direcciones de envío guardadas</p>
                  <Link href="/cuenta/direcciones">
                    <Button
                      variant="outline"
                      className="border-[rgb(170,151,196)] text-[rgb(170,151,196)] hover:bg-[rgb(170,151,196)]/10 bg-transparent"
                    >
                      Gestionar Direcciones
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-[rgb(74,34,86)]">
                <CardHeader>
                  <CardTitle className="text-white">Cerrar Sesión</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/60 mb-4">Cerrar tu sesión en este dispositivo</p>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </main>
  )
}
