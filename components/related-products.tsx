"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "./product-card"
import { db, type Product } from "@/lib/database"

interface RelatedProductsProps {
  currentProductId: string
  category: string
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  useEffect(() => {
    const allProducts = db.getAllProducts()
    const filtered = allProducts.filter((product) => product.category === category && product.id !== currentProductId)
    setRelatedProducts(filtered.slice(0, 3))
  }, [currentProductId, category])

  if (relatedProducts.length === 0) return null

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-[rgb(15,15,35)]">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[rgb(170,151,196)] rounded-full blur-[150px] opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Productos{" "}
            <span className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] bg-clip-text text-transparent">
              Relacionados
            </span>
          </h2>
          <p className="text-white/60 text-lg">Descubre más productos de la categoría {category}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}
