"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowLeft, Loader2, Plus, MapPin, Trash2, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Address {
  id: string
  address_name: string
  full_name: string
  phone: string
  street_address: string
  city: string
  state: string
  zip_code: string
  is_default: boolean
}

export default function DireccionesPage() {
  const [loading, setLoading] = useState(true)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newAddress, setNewAddress] = useState({
    address_name: "",
    full_name: "",
    phone: "",
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
  })
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const loadAddresses = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false })

      if (data) {
        setAddresses(data)
      }
    } catch (error) {
      console.error("Error loading addresses:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAddresses()
  }, [])

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("No user found")

      const { error } = await supabase.from("user_addresses").insert({
        user_id: user.id,
        ...newAddress,
        is_default: addresses.length === 0,
      })

      if (error) throw error

      toast({
        title: "Dirección guardada",
        description: "La dirección ha sido agregada exitosamente",
      })

      setDialogOpen(false)
      setNewAddress({
        address_name: "",
        full_name: "",
        phone: "",
        street_address: "",
        city: "",
        state: "",
        zip_code: "",
      })

      await loadAddresses()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar la dirección",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAddress = async (id: string) => {
    try {
      const { error } = await supabase.from("user_addresses").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Dirección eliminada",
        description: "La dirección ha sido eliminada exitosamente",
      })

      await loadAddresses()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la dirección",
        variant: "destructive",
      })
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Quitar default de todas
      await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", user.id)

      // Establecer nueva default
      const { error } = await supabase.from("user_addresses").update({ is_default: true }).eq("id", id)

      if (error) throw error

      toast({
        title: "Dirección predeterminada",
        description: "Esta dirección se usará por defecto en tus pedidos",
      })

      await loadAddresses()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo establecer como predeterminada",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[rgb(15,15,35)]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Loader2 className="h-12 w-12 text-[rgb(170,151,196)] animate-spin" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[rgb(15,15,35)]">
      <Navbar />

      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/cuenta"
            className="inline-flex items-center text-[rgb(170,151,196)] hover:text-[rgb(201,18,64)] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Mi Cuenta
          </Link>

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Mis Direcciones</h1>
              <p className="text-white/60">Gestiona tus direcciones de envío</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:opacity-90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Dirección
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[rgb(15,15,35)] border-[rgb(74,34,86)] text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Agregar Nueva Dirección</DialogTitle>
                  <DialogDescription className="text-white/60">
                    Completa los datos de tu dirección de envío
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="address_name" className="text-white/90">
                        Nombre de la dirección
                      </Label>
                      <Input
                        id="address_name"
                        value={newAddress.address_name}
                        onChange={(e) => setNewAddress({ ...newAddress, address_name: e.target.value })}
                        placeholder="Casa, Oficina, etc."
                        required
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="full_name" className="text-white/90">
                        Nombre completo
                      </Label>
                      <Input
                        id="full_name"
                        value={newAddress.full_name}
                        onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                        required
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white/90">
                        Teléfono
                      </Label>
                      <Input
                        id="phone"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        required
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="street_address" className="text-white/90">
                        Dirección
                      </Label>
                      <Input
                        id="street_address"
                        value={newAddress.street_address}
                        onChange={(e) => setNewAddress({ ...newAddress, street_address: e.target.value })}
                        required
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city" className="text-white/90">
                        Ciudad
                      </Label>
                      <Input
                        id="city"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        required
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-white/90">
                        Estado
                      </Label>
                      <Input
                        id="state"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        required
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip_code" className="text-white/90">
                        Código Postal
                      </Label>
                      <Input
                        id="zip_code"
                        value={newAddress.zip_code}
                        onChange={(e) => setNewAddress({ ...newAddress, zip_code: e.target.value })}
                        required
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:opacity-90"
                  >
                    {saving ? "Guardando..." : "Guardar Dirección"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {addresses.length === 0 ? (
            <Card className="bg-white/5 border-[rgb(74,34,86)]">
              <CardContent className="py-12 text-center">
                <MapPin className="h-16 w-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-white text-xl font-bold mb-2">No hay direcciones guardadas</h3>
                <p className="text-white/60">Agrega una dirección para facilitar tus compras futuras</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {addresses.map((address) => (
                <Card key={address.id} className="bg-white/5 border-[rgb(74,34,86)]">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white font-bold text-lg">{address.address_name}</h3>
                          {address.is_default && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[rgb(170,151,196)]/20 text-[rgb(170,151,196)] border border-[rgb(170,151,196)]/30">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              Predeterminada
                            </span>
                          )}
                        </div>
                        <p className="text-white/80">{address.full_name}</p>
                        <p className="text-white/60 text-sm">{address.street_address}</p>
                        <p className="text-white/60 text-sm">
                          {address.city}, {address.state} {address.zip_code}
                        </p>
                        <p className="text-white/60 text-sm">{address.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        {!address.is_default && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSetDefault(address.id)}
                            className="border-[rgb(170,151,196)] text-[rgb(170,151,196)] hover:bg-[rgb(170,151,196)]/10"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteAddress(address.id)}
                          className="border-red-500 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
