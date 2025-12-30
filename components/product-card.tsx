"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ChevronDown, ChevronUp } from "lucide-react"
import { useCart } from "@/lib/cart-context"

interface ProductCardProps {
  id: string
  name: string
  category: string
  description: string
  price: number
  image: string
  benefits?: string[]
  longDescription?: string
  ingredients?: string
}

export function ProductCard({
  id,
  name,
  category,
  description,
  price,
  image,
  benefits,
  longDescription,
  ingredients,
}: ProductCardProps) {
  const { addToCart } = useCart()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart({
      id,
      name,
      price,
      image,
      category: category || "General",
    })
  }

  return (
    <Card
      className={`group relative overflow-hidden border-[rgb(74,34,86)] bg-[rgb(15,15,35)] backdrop-blur-sm hover:shadow-2xl hover:shadow-[rgb(170,151,196)]/20 transition-all duration-500 ${
        isExpanded ? "col-span-full" : ""
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className={`${isExpanded ? "md:grid md:grid-cols-2 md:gap-6" : ""}`}>
        {/* Left Side - Image and Basic Info */}
        <div>
          <CardContent className="relative z-10 space-y-4 pt-6">
            {/* Category Badge */}
            <Badge className="w-fit bg-[rgb(170,151,196)]/20 text-[rgb(170,151,196)] border-[rgb(170,151,196)]/50 font-astrobia text-xs uppercase tracking-wider">
              {category}
            </Badge>

            <div className="relative h-48 sm:h-56 lg:h-64 flex items-center justify-center">
              <div className="relative w-32 h-48 sm:w-36 sm:h-56 lg:w-40 lg:h-64 animate-float">
                <Image src={image || "/placeholder.svg"} alt={name} fill className="object-contain drop-shadow-2xl" />
              </div>
            </div>

            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all duration-300 font-montserrat text-sm sm:text-base"
              variant="outline"
            >
              {isExpanded ? (
                <>
                  Ver Menos <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Ver Más <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {/* Product Name */}
            <h3 className="text-xl sm:text-2xl font-bold text-white text-center font-condor tracking-wider">{name}</h3>

            {/* Short Description */}
            {!isExpanded && (
              <p className="text-xs sm:text-sm text-white/70 text-center leading-relaxed font-montserrat line-clamp-2">
                {description}
              </p>
            )}

            {/* Price */}
            <div className="text-center py-2">
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] bg-clip-text text-transparent font-din">
                ${price.toFixed(2)}
              </p>
              <p className="text-white/40 text-xs font-montserrat">MXN</p>
            </div>
          </CardContent>

          <CardFooter className="relative z-10 pb-6">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:from-[rgb(190,171,216)] hover:to-[rgb(221,38,84)] text-white font-semibold transition-all duration-300 shadow-lg shadow-[rgb(170,151,196)]/30 text-sm sm:text-base px-2 sm:px-4"
            >
              <ShoppingCart className="mr-1 sm:mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">Agregar</span>
            </Button>
          </CardFooter>
        </div>

        {isExpanded && (
          <div className="relative z-10 p-6 space-y-6 bg-gradient-to-br from-[rgb(74,34,86)]/20 to-transparent border-t md:border-t-0 md:border-l border-[rgb(74,34,86)]">
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-[rgb(170,151,196)] mb-2 font-montserrat uppercase tracking-wide">
                  Descripción
                </h4>
                <p className="text-white/80 leading-relaxed font-montserrat text-sm">
                  {longDescription || description}
                </p>
              </div>

              {benefits && benefits.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-[rgb(170,151,196)] mb-3 font-montserrat uppercase tracking-wide">
                    Funciones
                  </h4>
                  <ul className="space-y-2">
                    {benefits.map((benefit: string, index: number) => (
                      <li key={index} className="text-white/70 text-sm flex items-start gap-2 font-montserrat">
                        <span className="text-[rgb(170,151,196)] mt-1 flex-shrink-0">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {ingredients && (
                <div>
                  <h4 className="text-lg font-bold text-[rgb(170,151,196)] mb-2 font-montserrat uppercase tracking-wide">
                    Ingredientes
                  </h4>
                  <p className="text-white/70 text-sm font-montserrat leading-relaxed">{ingredients}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
