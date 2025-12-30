"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  longDescription?: string
  long_description?: string
  benefits?: string[]
  ingredients?: string
  display_order?: number
}

interface ProductsClientProps {
  initialProducts: Product[]
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const sortedInitialProducts = [...initialProducts].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(sortedInitialProducts)

  useEffect(() => {
    const sorted = [...initialProducts].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    setFilteredProducts(sorted)
  }, [initialProducts])

  const handleFilterChange = (filters: {
    categories: string[]
    priceRange: { min: number; max: number }
    sortBy: string
  }) => {
    let filtered = [...initialProducts]

    if (filters.categories.length > 0) {
      console.log("[v0] Filtering by categories:", filters.categories)

      const categoryNormalizedMap: Record<string, string> = {
        "Balance Hormonal": "balance hormonal",
        Relajación: "relajacion",
        Energía: "energia",
        Enfoque: "enfoque",
        Defensa: "defensa",
        Longevidad: "longevidad",
      }

      const normalizedCategories = filters.categories.map((cat) => categoryNormalizedMap[cat] || cat.toLowerCase())

      console.log("[v0] Normalized categories:", normalizedCategories)
      filtered = filtered.filter((p) => {
        const productCategory = p.category.toLowerCase()
        const matches = normalizedCategories.includes(productCategory)
        console.log(`[v0] Product ${p.name} category "${productCategory}" matches:`, matches)
        return matches
      })
    }

    filtered = filtered.filter((p) => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max)

    switch (filters.sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "category":
        filtered.sort((a, b) => a.category.localeCompare(b.category))
        break
      default:
        filtered.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        break
    }

    setFilteredProducts(filtered)
  }

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <ProductFilters onFilterChange={handleFilterChange} resultsCount={filteredProducts.length} />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-12">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              category={product.category}
              description={product.description}
              price={product.price}
              image={product.image}
              benefits={product.benefits}
              longDescription={product.long_description || product.longDescription}
              ingredients={product.ingredients}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/60 text-lg font-montserrat">
              No se encontraron productos con los filtros seleccionados.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
