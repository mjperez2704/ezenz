"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "CALM CORE",
    category: "Relajación",
    action: "ENERGÍA",
    image: "/productos/CALMCORE.png",
    price: 29.99,
  },
  {
    id: 2,
    name: "MOODLIFT",
    category: "Relajación",
    action: "ENERGÍA CELULAR",
    image: "/productos/MOODLIFT.png",
    price: 34.99,
  },
  {
    id: 3,
    name: "SHIELD UP",
    category: "Defensa",
    action: "INMUNIDAD",
    image: "/productos/SHIELDUP.png",
    price: 32.99,
  },
  {
    id: 4,
    name: "OXYCELL",
    category: "Longevidad",
    action: "ENERGÍA CELULAR",
    image: "/productos/OXYCELL.png",
    price: 39.99,
  },
  {
    id: 5,
    name: "HORMONIX",
    category: "Balance Hormonal",
    action: "VITALIDAD HORMONAL",
    image: "/productos/HORMONIX.png",
    price: 36.99,
  },
  {
    id: 6,
    name: "FOCUS MIND",
    category: "Enfoque",
    action: "ENERGÍA CELULAR",
    image: "/productos/FOCUSMIND.png",
    price: 34.99,
  },
  {
    id: 7,
    name: "DEEPZ",
    category: "Relajación",
    action: "ENERGÍA CELULAR",
    image: "/productos/DEEPZ.png",
    price: 31.99,
  },
  {
    id: 8,
    name: "CELL RECHARGE",
    category: "Energía",
    action: "ENERGÍA CELULAR",
    image: "/productos/CELLRECHARGE.png",
    price: 37.99,
  },
  {
    id: 9,
    name: "VITAL FUEL",
    category: "Energía",
    action: "VITALIDAD",
    image: "/productos/VITALFUEL.png",
    price: 33.99,
  },
  {
    id: 10,
    name: "NEUROSHIELD",
    category: "Enfoque",
    action: "NEUROPROTECCIÓN",
    image: "/productos/NEUROSHIELD.png",
    price: 38.99,
  },
]

export function MobileProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const currentProduct = products[currentIndex]

  return (
    <section className="py-12 px-4">
      <div className="max-w-lg mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Nuestros Productos
        </h2>

        <div className="relative bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-6 border border-white/10">
          {/* Imagen del producto */}
          <div className="relative h-64 mb-6">
            <Image
              src={currentProduct.image || "/placeholder.svg"}
              alt={currentProduct.name}
              fill
              className="object-contain"
            />
          </div>

          {/* Información del producto */}
          <div className="space-y-3 text-center">
            <p className="text-sm text-purple-300">{currentProduct.category}</p>
            <h3 className="text-2xl font-bold text-white">{currentProduct.name}</h3>
            <p className="text-sm text-blue-300">{currentProduct.action}</p>
            <p className="text-3xl font-bold text-white">${currentProduct.price}</p>
            
            <Button 
              asChild
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Link href={`/mobile/productos/${currentProduct.id}`}>
                Ver Detalles
              </Link>
            </Button>
          </div>

          {/* Controles de navegación */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevProduct}
              className="text-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <div className="flex gap-2">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? "w-8 bg-purple-500" 
                      : "w-2 bg-gray-500"
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={nextProduct}
              className="text-white"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Button 
            asChild
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Link href="/mobile/productos">Ver Catálogo Completo</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
