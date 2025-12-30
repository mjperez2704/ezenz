"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "./product-card"
import { db, type Product } from "@/lib/database"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const allProducts = db.getAllProducts()
    setProducts(allProducts.slice(0, 3))
  }, [])

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[rgb(15,15,35)] via-[rgb(20,20,40)] to-[rgb(15,15,35)]">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[rgb(170,151,196)] rounded-full blur-[150px] opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 text-balance font-condor italic">
            Nuestros Productos{" "}
            <span className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] bg-clip-text text-transparent">
              Estelares
            </span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto text-pretty leading-relaxed font-montserrat">
            Cada fórmula es una obra de ingeniería natural y científica, diseñada para activar tu sistema integral.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}
