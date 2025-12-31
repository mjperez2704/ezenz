"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CouponService, type Coupon } from "@/lib/coupon-service"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Edit, Copy, Tag, Calendar, TrendingUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function CuponesPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percentage" as "percentage" | "fixed" | "free_shipping",
    discount_value: 0,
    min_purchase_amount: 0,
    max_discount_amount: null as number | null,
    usage_limit: null as number | null,
    per_user_limit: 1,
    valid_until: "",
    is_active: true,
  })

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    setLoading(true)
    const data = await CouponService.getAllCoupons()
    setCoupons(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = editingCoupon
      ? await CouponService.updateCoupon(editingCoupon.id, formData)
      : await CouponService.createCoupon(formData)

    if (result.success) {
      toast({
        title: editingCoupon ? "Cupón actualizado" : "Cupón creado",
        description: "El cupón ha sido guardado exitosamente",
      })
      setIsDialogOpen(false)
      resetForm()
      loadCoupons()
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este cupón?")) return

    const result = await CouponService.deleteCoupon(id)
    if (result.success) {
      toast({
        title: "Cupón eliminado",
        description: "El cupón ha sido eliminado exitosamente",
      })
      loadCoupons()
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_purchase_amount: coupon.min_purchase_amount,
      max_discount_amount: coupon.max_discount_amount,
      usage_limit: coupon.usage_limit,
      per_user_limit: coupon.per_user_limit,
      valid_until: coupon.valid_until ? new Date(coupon.valid_until).toISOString().split("T")[0] : "",
      is_active: coupon.is_active,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingCoupon(null)
    setFormData({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: 0,
      min_purchase_amount: 0,
      max_discount_amount: null,
      usage_limit: null,
      per_user_limit: 1,
      valid_until: "",
      is_active: true,
    })
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Código copiado",
      description: `El código ${code} ha sido copiado al portapapeles`,
    })
  }

  const getDiscountDisplay = (coupon: Coupon) => {
    if (coupon.discount_type === "percentage") {
      return `${coupon.discount_value}%`
    } else if (coupon.discount_type === "fixed") {
      return `$${coupon.discount_value}`
    } else {
      return "Envío gratis"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cupones y Descuentos</h1>
          <p className="text-gray-500 mt-1">Gestiona cupones promocionales y códigos de descuento</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-black hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cupón
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCoupon ? "Editar Cupón" : "Crear Nuevo Cupón"}</DialogTitle>
              <DialogDescription>Configura los detalles del cupón de descuento</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código del Cupón</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="DESCUENTO10"
                    required
                    disabled={!!editingCoupon}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount_type">Tipo de Descuento</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value: any) => setFormData({ ...formData, discount_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentaje</SelectItem>
                      <SelectItem value="fixed">Cantidad Fija</SelectItem>
                      <SelectItem value="free_shipping">Envío Gratis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción del cupón..."
                  rows={2}
                />
              </div>

              {formData.discount_type !== "free_shipping" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount_value">
                      Valor del Descuento {formData.discount_type === "percentage" ? "(%)" : "($)"}
                    </Label>
                    <Input
                      id="discount_value"
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                      min="0"
                      step={formData.discount_type === "percentage" ? "1" : "0.01"}
                      required
                    />
                  </div>
                  {formData.discount_type === "percentage" && (
                    <div className="space-y-2">
                      <Label htmlFor="max_discount">Descuento Máximo ($)</Label>
                      <Input
                        id="max_discount"
                        type="number"
                        value={formData.max_discount_amount || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            max_discount_amount: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        placeholder="Sin límite"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_purchase">Compra Mínima ($)</Label>
                  <Input
                    id="min_purchase"
                    type="number"
                    value={formData.min_purchase_amount}
                    onChange={(e) => setFormData({ ...formData, min_purchase_amount: Number(e.target.value) })}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valid_until">Válido Hasta</Label>
                  <Input
                    id="valid_until"
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usage_limit">Límite de Usos Totales</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    value={formData.usage_limit || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usage_limit: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="Ilimitado"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="per_user_limit">Usos por Usuario</Label>
                  <Input
                    id="per_user_limit"
                    type="number"
                    value={formData.per_user_limit}
                    onChange={(e) => setFormData({ ...formData, per_user_limit: Number(e.target.value) })}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active">Cupón Activo</Label>
                  <p className="text-sm text-gray-500">El cupón estará disponible para usar</p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-black hover:bg-gray-800">
                  {editingCoupon ? "Actualizar" : "Crear"} Cupón
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cupones</CardTitle>
            <Tag className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coupons.length}</div>
            <p className="text-xs text-gray-500 mt-1">{coupons.filter((c) => c.is_active).length} activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usos Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coupons.reduce((sum, c) => sum + c.usage_count, 0)}</div>
            <p className="text-xs text-gray-500 mt-1">Todos los cupones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos a Expirar</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                coupons.filter((c) => {
                  if (!c.valid_until) return false
                  const days = Math.floor((new Date(c.valid_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  return days <= 7 && days >= 0
                }).length
              }
            </div>
            <p className="text-xs text-gray-500 mt-1">Expiran en 7 días</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cupones</CardTitle>
          <CardDescription>Gestiona todos los cupones y códigos promocionales</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando cupones...</div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay cupones creados. Crea tu primer cupón usando el botón de arriba.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Usos</TableHead>
                  <TableHead>Validez</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">{coupon.code}</code>
                        <Button variant="ghost" size="sm" onClick={() => copyCode(coupon.code)} className="h-6 w-6 p-0">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      {coupon.description && <p className="text-xs text-gray-500 mt-1">{coupon.description}</p>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getDiscountDisplay(coupon)}</Badge>
                      {coupon.min_purchase_amount > 0 && (
                        <p className="text-xs text-gray-500 mt-1">Min: ${coupon.min_purchase_amount}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {coupon.usage_count}
                        {coupon.usage_limit && ` / ${coupon.usage_limit}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      {coupon.valid_until ? (
                        <div className="text-sm">{new Date(coupon.valid_until).toLocaleDateString()}</div>
                      ) : (
                        <span className="text-gray-400 text-sm">Sin límite</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={coupon.is_active ? "default" : "secondary"}>
                        {coupon.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(coupon)} className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(coupon.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
