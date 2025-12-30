"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { ProductFilters } from "@/components/product-filters"
import { useCart } from "@/lib/cart-context"

interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  image: string
  display_order?: number
}

export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchProducts() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("[v0] Supabase credentials not found. Using fallback products.")
        const fallbackProducts = [
          {
            id: "1",
            name: "HARMONY",
            category: "DESCANSO",
            price: 24.99,
            description:
              "Fórmula diseñada para promover un sueño profundo y reparador. Combina extractos naturales que ayudan a relajar el cuerpo y la mente.",
            image: "/images/producto_harmony.png",
          },
          {
            id: "2",
            name: "FOCUS",
            category: "CONCENTRACIÓN",
            price: 29.99,
            description:
              "Mejora tu claridad mental y concentración. Ingredientes naturales que apoyan la función cognitiva y la memoria.",
            image: "/images/producto_focus.png",
          },
          {
            id: "3",
            name: "ENERGY",
            category: "VITALIDAD",
            price: 27.99,
            description:
              "Aumenta tu energía de forma natural y sostenida. Sin cafeína artificial, solo ingredientes que revitalizan tu cuerpo.",
            image: "/images/producto_energy.png",
          },
        ]
        setProducts(fallbackProducts)
        setFilteredProducts(fallbackProducts)
        setLoading(false)
        setError("Conecta Supabase desde el sidebar para ver los productos reales.")
        return
      }

      try {
        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

        const { data, error } = await supabase
          .from("products")
          .select("id, name, category, price, description, image, display_order")
          .order("display_order")

        if (error) {
          console.error("[v0] Error fetching products:", error)
          setError("Error al cargar productos desde la base de datos.")
          setLoading(false)
          return
        }

        if (data && data.length > 0) {
          setProducts(data as Product[])
          setFilteredProducts(data as Product[])
        } else {
          console.warn("[v0] No products found in database")
          setError("No se encontraron productos en la base de datos.")
        }
      } catch (err) {
        console.error("[v0] Unexpected error:", err)
        setError("Error inesperado al conectar con la base de datos.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleFilterChange = (filters: {
    categories: string[]
    priceRange: { min: number; max: number }
    sortBy: string
  }) => {
    let filtered = [...products]

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
      default:
        // Ordenar por categoría por defecto
        filtered.sort((a, b) => a.category.localeCompare(b.category))
        break
    }

    setFilteredProducts(filtered)
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    })
  }

  return (
    <section className="relative w-full overflow-hidden -my-px">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/fondo_seccion_nuestros_products.jpg"
          alt="Products Background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>

      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wider font-condor italic flex items-center justify-center gap-2 sm:gap-3 mb-4">
            <Image
              src="/images/estrella_small_stardust.png"
              alt="Star"
              width={20}
              height={20}
              className="sm:w-6 sm:h-6 object-contain"
            />
            Nuestros Productos
            <Image
              src="/images/estrella_small_stardust.png"
              alt="Star"
              width={20}
              height={20}
              className="sm:w-6 sm:h-6 object-contain"
            />
          </h2>
          <p className="text-white/90 text-sm sm:text-base max-w-3xl mx-auto font-montserrat leading-relaxed px-4">
            En <span className="font-bold font-condor italic">Stardust</span> no dejamos nada al azar. Cada una de
            nuestras fórmulas es una obra de ingeniería natural y científica, diseñada para actuar con precisión en
            distintas áreas de tu bienestar. Juntas forman un sistema integral que acompaña tu cuerpo y mente desde la
            energía diaria hasta la calma más profunda.
          </p>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-8 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200 text-xs sm:text-sm text-center">⚠️ {error}</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="mb-8">
            <ProductFilters onFilterChange={handleFilterChange} resultsCount={filteredProducts.length} />
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 sm:gap-x-6 sm:gap-y-10 max-w-7xl mx-auto">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex gap-2 sm:gap-3 group">
                {/* Vertical Category Text - Hidden on mobile */}
                <div className="hidden sm:flex items-center justify-center w-6">
                  <span
                    className="text-white/60 text-[20px] tracking-[0.2em] uppercase whitespace-nowrap font-astrobia"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    {product.category}
                  </span>
                </div>

                {/* Product Card Content */}
                <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col">
                  {/* Mobile category badge */}
                  <div className="sm:hidden mb-2">
                    <span className="text-white/60 text-[9px] tracking-[0.2em] uppercase font-astrobia">
                      {product.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-center mb-3">
                    <Image
                      src="/images/estrella_mini_stardust.png"
                      alt="Star"
                      width={10}
                      height={10}
                      className="sm:w-3 sm:h-3 object-contain mr-1.5"
                    />
                    <h3 className="text-sm sm:text-base font-bold text-white font-condor italic uppercase tracking-wider">
                      {product.name}
                    </h3>
                    <Image
                      src="/images/estrella_mini_stardust.png"
                      alt="Star"
                      width={10}
                      height={10}
                      className="sm:w-3 sm:h-3 object-contain ml-1.5"
                    />
                  </div>

                  <div className="relative w-full aspect-[3/4] mb-3 sm:mb-4 max-h-40 sm:max-h-48">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <p className="text-white/80 text-[10px] sm:text-[11px] leading-relaxed mb-3 flex-grow font-sans line-clamp-4">
                    {product.description}
                  </p>

                  <div className="mt-auto">
                    <p className="text-white font-bold text-sm sm:text-base mb-2">${product.price.toFixed(2)}</p>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-white text-black hover:bg-white/90 font-bold tracking-wider text-[9px] sm:text-[10px] py-1.5 h-auto rounded-full uppercase"
                    >
                      AGREGA AL CARRITO
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-white/70 text-base sm:text-lg">
              No se encontraron productos con los filtros seleccionados.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
