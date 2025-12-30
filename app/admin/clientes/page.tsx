"use client"

import { useState, useEffect } from "react"
import { db, type Customer } from "@/lib/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    const data = await db.getAllCustomers()
    setCustomers(data)
    setLoading(false)
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <p className="text-muted-foreground">Gestiona los clientes de tu tienda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Clientes ({filteredCustomers.length})</span>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Total Pedidos</TableHead>
                  <TableHead>Total Gastado</TableHead>
                  <TableHead>Registrado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No se encontraron clientes
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.first_name} {customer.last_name}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{customer.total_orders}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">${customer.total_spent.toLocaleString("es-MX")} MXN</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(customer.created_at).toLocaleDateString("es-MX")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
