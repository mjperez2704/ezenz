"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Filter, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface ProductFiltersProps {
  onFilterChange: (filters: {
    categories: string[]
    priceRange: { min: number; max: number }
    sortBy: string
  }) => void
  resultsCount: number
}

export function ProductFilters({ onFilterChange, resultsCount }: ProductFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 2000 })
  const [sortBy, setSortBy] = useState<string>("featured")
  const [categories, setCategories] = useState<Array<{ name: string; slug: string }>>([])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()

        if (data.categories) {
          console.log("[v0] Categories loaded:", data.categories)
          setCategories(data.categories)
        }
      } catch (error) {
        console.error("[v0] Error loading categories:", error)
        // Fallback categories
        setCategories([
          { name: "Relajación", slug: "relajacion" },
          { name: "Enfoque", slug: "enfoque" },
          { name: "Energía", slug: "energia" },
          { name: "Defensa", slug: "defensa" },
          { name: "Longevidad", slug: "longevidad" },
          { name: "Balance Hormonal", slug: "balance-hormonal" },
        ])
      }
    }
    fetchCategories()
  }, [])

  const priceRanges = [
    { label: "Todos los precios", min: 0, max: 2000 },
    { label: "Menos de $900", min: 0, max: 900 },
    { label: "$900 - $1,000", min: 900, max: 1000 },
    { label: "$1,000 - $1,200", min: 1000, max: 1200 },
    { label: "Más de $1,200", min: 1200, max: 2000 },
  ]

  const sortOptions = [
    { label: "Destacados", value: "featured" },
    { label: "Precio: Menor a Mayor", value: "price-asc" },
    { label: "Precio: Mayor a Menor", value: "price-desc" },
    { label: "Nombre: A-Z", value: "name-asc" },
    { label: "Nombre: Z-A", value: "name-desc" },
  ]

  const handleCategoryChange = (categoryName: string, checked: boolean) => {
    console.log("[v0] Category change:", categoryName, checked)
    const newCategories = checked
      ? [...selectedCategories, categoryName]
      : selectedCategories.filter((c) => c !== categoryName)

    setSelectedCategories(newCategories)
    console.log("[v0] Selected categories:", newCategories)
    onFilterChange({ categories: newCategories, priceRange, sortBy })
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max })
    onFilterChange({ categories: selectedCategories, priceRange: { min, max }, sortBy })
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    onFilterChange({ categories: selectedCategories, priceRange, sortBy: value })
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange({ min: 0, max: 2000 })
    setSortBy("featured")
    onFilterChange({ categories: [], priceRange: { min: 0, max: 2000 }, sortBy: "featured" })
  }

  const hasActiveFilters = selectedCategories.length > 0 || priceRange.min > 0 || priceRange.max < 2000

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-white/5 text-white border-[rgb(74,34,86)] hover:bg-white/10 hover:text-[rgb(170,151,196)]"
              >
                <Filter className="w-4 h-4 mr-2" />
                Categoría
                {selectedCategories.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-[rgb(170,151,196)] text-white text-xs rounded-full">
                    {selectedCategories.length}
                  </span>
                )}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filtrar por categoría</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category.slug}
                  checked={selectedCategories.includes(category.name)}
                  onCheckedChange={(checked) => handleCategoryChange(category.name, checked)}
                >
                  {category.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Price Range Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-white/5 text-white border-[rgb(74,34,86)] hover:bg-white/10 hover:text-[rgb(170,151,196)]"
              >
                Precio
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Rango de precio</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {priceRanges.map((range) => (
                <DropdownMenuCheckboxItem
                  key={range.label}
                  checked={priceRange.min === range.min && priceRange.max === range.max}
                  onCheckedChange={() => handlePriceRangeChange(range.min, range.max)}
                >
                  {range.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-white/70 hover:text-[rgb(170,151,196)] hover:bg-white/5"
            >
              <X className="w-4 h-4 mr-2" />
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-white/5 text-white border-[rgb(74,34,86)] hover:bg-white/10 hover:text-[rgb(170,151,196)]"
            >
              Ordenar: {sortOptions.find((opt) => opt.value === sortBy)?.label}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={sortBy === option.value}
                onCheckedChange={() => handleSortChange(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Results Count */}
      <div className="text-center">
        <p className="text-white/60 text-sm font-montserrat">
          Mostrando <span className="text-[rgb(170,151,196)] font-semibold">{resultsCount} productos</span>
        </p>
      </div>
    </div>
  )
}
