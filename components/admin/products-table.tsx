"use client"

import { useState } from "react"
import type { Product } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Search, Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import { ProductDialog } from "./product-dialog"
import { StockDialog } from "./stock-dialog"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products: initialProducts }: ProductsTableProps) {
  const [products, setProducts] = useState(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false)

  const categories = Array.from(new Set(products.map(p => p.category)))

  const filteredProducts = products.filter(
    (product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
      
      const matchesStock = 
        stockFilter === "all" ||
        (stockFilter === "low" && product.stock > 0 && product.stock <= 10) ||
        (stockFilter === "out" && product.stock === 0) ||
        (stockFilter === "available" && product.stock > 10)
      
      return matchesSearch && matchesCategory && matchesStock
    }
  )

  const stats = {
    total: products.length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return

    const response = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      setProducts(products.filter((p) => p.id !== id))
      toast.success("Producto eliminado exitosamente")
    } else {
      toast.error("Error al eliminar el producto")
    }
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedProduct(null)
    setIsDialogOpen(true)
  }

  const handleManageStock = (product: Product) => {
    setSelectedProduct(product)
    setIsStockDialogOpen(true)
  }

  const handleSave = async (product: Product) => {
    if (selectedProduct) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)))
    } else {
      setProducts([...products, product])
    }
    setIsDialogOpen(false)
  }

  const handleStockUpdate = (productId: string, newStock: number) => {
    setProducts(products.map((p) => 
      p.id === productId ? { ...p, stock: newStock } : p
    ))
    setIsStockDialogOpen(false)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { variant: "destructive" as const, label: "Sin stock", icon: AlertTriangle }
    if (stock <= 10) return { variant: "default" as const, label: "Stock bajo", icon: TrendingDown }
    return { variant: "default" as const, label: "Disponible", icon: TrendingUp }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Productos</p>
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-2">{stats.total}</p>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Stock Bajo</p>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold mt-2 text-orange-500">{stats.lowStock}</p>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Sin Stock</p>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold mt-2 text-red-500">{stats.outOfStock}</p>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Valor Inventario</p>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">${stats.totalValue.toLocaleString()} MXN</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Estado de stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="low">Stock bajo</SelectItem>
            <SelectItem value="out">Sin stock</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No se encontraron productos
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock)
                const StockIcon = stockStatus.icon
                
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell>${product.price.toLocaleString()} MXN</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StockIcon className="h-4 w-4" />
                        <Badge variant={stockStatus.variant}>
                          {product.stock} unidades
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${(product.price * product.stock).toLocaleString()} MXN
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleManageStock(product)}
                          title="Gestionar Stock"
                        >
                          <Package className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(product)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(product.id)}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <ProductDialog product={selectedProduct} open={isDialogOpen} onOpenChange={setIsDialogOpen} onSave={handleSave} />
      <StockDialog 
        product={selectedProduct} 
        open={isStockDialogOpen} 
        onOpenChange={setIsStockDialogOpen} 
        onUpdate={handleStockUpdate}
      />
    </div>
  )
}
