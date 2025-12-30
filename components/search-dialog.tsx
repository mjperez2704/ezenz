"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { Product } from "@/lib/database"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import Image from "next/image"

interface SearchDialogProps {
  open: boolean
  onClose: () => void
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    const timer = setTimeout(async () => {
      const supabase = createClient()
      const lowerQuery = query.toLowerCase()

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`name.ilike.%${lowerQuery}%,description.ilike.%${lowerQuery}%,category.ilike.%${lowerQuery}%`)

      if (!error && data) {
        setResults(data)
      } else {
        setResults([])
      }
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleClose = () => {
    setQuery("")
    setResults([])
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0">
        <DialogTitle className="sr-only">Buscar productos</DialogTitle>
        <div className="flex flex-col h-full">
          {/* Search Input */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-10 text-lg"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-4">
            {!query && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Comienza a escribir para buscar productos</p>
              </div>
            )}

            {query && isSearching && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Buscando...</p>
              </div>
            )}

            {query && !isSearching && results.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No se encontraron productos para "{query}"</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/productos/${product.id}`}
                    onClick={handleClose}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{product.category}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-foreground">${product.price.toFixed(2)} MXN</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
