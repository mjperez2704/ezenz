"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Download } from "lucide-react"

interface NewsletterTableProps {
  subscribers: Array<{ email: string; date: string }>
}

export function NewsletterTable({ subscribers: initialSubscribers }: NewsletterTableProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSubscribers = initialSubscribers.filter((sub) =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleExport = () => {
    const csv = ["Email,Fecha de Suscripción", ...filteredSubscribers.map((sub) => `${sub.email},${sub.date}`)].join(
      "\n",
    )

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "newsletter-subscribers.csv"
    a.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Fecha de Suscripción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscribers.map((subscriber) => (
              <TableRow key={subscriber.email}>
                <TableCell className="font-medium">{subscriber.email}</TableCell>
                <TableCell>{new Date(subscriber.date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">Total de suscriptores: {filteredSubscribers.length}</p>
    </div>
  )
}
