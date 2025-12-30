"use client"

import type React from "react"
import { db, type DeliveryZone } from "@/lib/database"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DeliveryZonesPage() {
  const [zones, setZones] = useState<DeliveryZone[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    postal_codes: "",
    city: "",
    state: "",
    delivery_cost: 0,
    free_delivery_amount: 0,
    estimated_days: "3-5",
    active: true,
  })

  useEffect(() => {
    loadZones()
  }, [])

  const loadZones = async () => {
    try {
      const data = await db.getAllDeliveryZones()
      setZones(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las zonas de entrega",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const zoneData = {
        ...formData,
        postal_codes: formData.postal_codes.split(",").map((pc) => pc.trim()),
      }

      if (editingZone) {
        await db.updateDeliveryZone(editingZone.id, zoneData)
        toast({ title: "Zona actualizada exitosamente" })
      } else {
        await db.createDeliveryZone(zoneData)
        toast({ title: "Zona creada exitosamente" })
      }

      setDialogOpen(false)
      resetForm()
      loadZones()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la zona",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (zone: DeliveryZone) => {
    setEditingZone(zone)
    setFormData({
      name: zone.name,
      postal_codes: zone.postal_codes.join(", "),
      city: zone.city,
      state: zone.state,
      delivery_cost: zone.delivery_cost,
      free_delivery_amount: zone.free_delivery_amount,
      estimated_days: zone.estimated_days,
      active: zone.active,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta zona?")) return

    try {
      await db.deleteDeliveryZone(id)
      toast({ title: "Zona eliminada exitosamente" })
      loadZones()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la zona",
        variant: "destructive",
      })
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await db.updateDeliveryZone(id, { active })
      toast({ title: `Zona ${active ? "activada" : "desactivada"}` })
      loadZones()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      postal_codes: "",
      city: "",
      state: "",
      delivery_cost: 0,
      free_delivery_amount: 0,
      estimated_days: "3-5",
      active: true,
    })
    setEditingZone(null)
  }

  const filteredZones = zones.filter(
    (zone) =>
      zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.state.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <div className="p-8">Cargando...</div>
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Zonas de Entrega</h1>
          <p className="text-muted-foreground">Configura las áreas donde realizas entregas</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Zona
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingZone ? "Editar Zona" : "Nueva Zona de Entrega"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Zona</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Zona Centro"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ej: Ciudad de México"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Ej: CDMX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_codes">Códigos Postales</Label>
                  <Input
                    id="postal_codes"
                    value={formData.postal_codes}
                    onChange={(e) => setFormData({ ...formData, postal_codes: e.target.value })}
                    placeholder="Ej: 01000, 01010, 01020"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Separados por comas</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery_cost">Costo de Envío (MXN)</Label>
                  <Input
                    id="delivery_cost"
                    type="number"
                    value={formData.delivery_cost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        delivery_cost: Number.parseFloat(e.target.value),
                      })
                    }
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="free_delivery_amount">Envío Gratis Desde (MXN)</Label>
                  <Input
                    id="free_delivery_amount"
                    type="number"
                    value={formData.free_delivery_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        free_delivery_amount: Number.parseFloat(e.target.value),
                      })
                    }
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated_days">Días de Entrega</Label>
                  <Input
                    id="estimated_days"
                    value={formData.estimated_days}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimated_days: e.target.value,
                      })
                    }
                    placeholder="Ej: 3-5"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label htmlFor="active">Zona Activa</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{editingZone ? "Actualizar" : "Crear"} Zona</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zonas Configuradas</CardTitle>
          <Input
            placeholder="Buscar por nombre, ciudad o estado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zona</TableHead>
                <TableHead>Ciudad/Estado</TableHead>
                <TableHead>Códigos Postales</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>Envío Gratis</TableHead>
                <TableHead>Días</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredZones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {zone.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {zone.city}, {zone.state}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {zone.postal_codes.slice(0, 3).map((pc) => (
                        <Badge key={pc} variant="secondary">
                          {pc}
                        </Badge>
                      ))}
                      {zone.postal_codes.length > 3 && (
                        <Badge variant="secondary">+{zone.postal_codes.length - 3}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>${zone.delivery_cost.toFixed(2)}</TableCell>
                  <TableCell>${zone.free_delivery_amount.toFixed(2)}</TableCell>
                  <TableCell>{zone.estimated_days} días</TableCell>
                  <TableCell>
                    <Switch checked={zone.active} onCheckedChange={(checked) => toggleActive(zone.id, checked)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(zone)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(zone.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
