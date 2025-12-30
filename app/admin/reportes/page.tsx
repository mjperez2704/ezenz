"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package } from "lucide-react"
import { db } from "@/lib/database"
import type { Order } from "@/types"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"]

export default function ReportesPage() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [dateRange, setDateRange] = useState("30") // días

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [ordersData, productsData] = await Promise.all([db.getAllOrders(), db.getAllProductsAsync()])

      setOrders(ordersData)
      setProducts(productsData)
    } catch (error) {
      console.error("Error cargando datos:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calcular métricas
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const totalProducts = products.length

  // Ventas por día (últimos 30 días)
  const salesByDay = () => {
    const days = Number.parseInt(dateRange)
    const now = new Date()
    const data = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString("es-ES", { month: "short", day: "numeric" })

      const dayOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt)
        return orderDate.toDateString() === date.toDateString()
      })

      data.push({
        date: dateStr,
        ventas: dayOrders.reduce((sum, order) => sum + order.total, 0),
        pedidos: dayOrders.length,
      })
    }

    return data
  }

  // Productos más vendidos
  const topProducts = () => {
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {}

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productSales[item.id]) {
          productSales[item.id] = { name: item.name, quantity: 0, revenue: 0 }
        }
        productSales[item.id].quantity += item.quantity
        productSales[item.id].revenue += item.price * item.quantity
      })
    })

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
  }

  // Ventas por categoría
  const salesByCategory = () => {
    const categorySales: Record<string, number> = {}

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const product = products.find((p) => p.id === item.id)
        const category = product?.category || "Sin categoría"

        if (!categorySales[category]) {
          categorySales[category] = 0
        }
        categorySales[category] += item.price * item.quantity
      })
    })

    return Object.entries(categorySales).map(([category, value]) => ({
      name: category,
      value,
    }))
  }

  // Estados de pedidos
  const ordersByStatus = () => {
    const statusCount: Record<string, number> = {}

    orders.forEach((order) => {
      const status = order.status || "pending"
      statusCount[status] = (statusCount[status] || 0) + 1
    })

    const statusNames: Record<string, string> = {
      pending: "Pendiente",
      processing: "Procesando",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
    }

    return Object.entries(statusCount).map(([status, count]) => ({
      name: statusNames[status] || status,
      value: count,
    }))
  }

  // Exportar a CSV
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((header) => JSON.stringify(row[header] || "")).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportVentasCSV = () => {
    const data = salesByDay().map((item) => ({
      Fecha: item.date,
      Ventas: `$${item.ventas.toFixed(2)}`,
      Pedidos: item.pedidos,
    }))
    exportToCSV(data, "reporte_ventas_diarias")
  }

  const exportProductosCSV = () => {
    const data = topProducts().map((item) => ({
      Producto: item.name,
      Cantidad: item.quantity,
      Ingresos: `$${item.revenue.toFixed(2)}`,
    }))
    exportToCSV(data, "reporte_productos_mas_vendidos")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Cargando reportes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reportes y Analíticas</h1>
          <p className="text-muted-foreground">Análisis detallado del desempeño de tu tienda</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
          </select>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+12.5%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+8.2%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-red-500" />
              <span className="text-red-500">-2.1%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+3</span> nuevos este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos y reportes */}
      <Tabs defaultValue="ventas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ventas">Ventas</TabsTrigger>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
          <TabsTrigger value="pedidos">Estado Pedidos</TabsTrigger>
        </TabsList>

        <TabsContent value="ventas" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ventas Diarias</CardTitle>
                <CardDescription>Ingresos y número de pedidos por día</CardDescription>
              </div>
              <Button onClick={exportVentasCSV} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={salesByDay()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="ventas" stroke="#8b5cf6" name="Ventas ($)" />
                  <Line yAxisId="right" type="monotone" dataKey="pedidos" stroke="#ec4899" name="Pedidos" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productos" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Productos Más Vendidos</CardTitle>
                <CardDescription>Top 10 productos por ingresos generados</CardDescription>
              </div>
              <Button onClick={exportProductosCSV} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={topProducts()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8b5cf6" name="Ingresos ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categorias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Categoría</CardTitle>
              <CardDescription>Distribución de ingresos por categoría de producto</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={salesByCategory()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) => entry.name}
                  >
                    {salesByCategory().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pedidos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Pedidos</CardTitle>
              <CardDescription>Distribución de pedidos por estado actual</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={ordersByStatus()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {ordersByStatus().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
