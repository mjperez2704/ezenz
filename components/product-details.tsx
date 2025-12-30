"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Heart, Share2, Check, Minus, Plus } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { ProductReviews } from "@/components/product-reviews"

interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  longDescription: string
  image: string
  benefits: string[]
  ingredients: string[]
  usage: string
  gradient: string
  stock: number
}

export function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, product.stock))
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1))

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      },
      quantity,
    )
    toast({
      title: "Añadido al carrito",
      description: `${quantity} x ${product.name} agregado exitosamente`,
    })
  }

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[rgb(170,151,196)] rounded-full blur-[150px] opacity-10" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[rgb(201,18,64)] rounded-full blur-[150px] opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <div
            className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${product.gradient} p-8 lg:p-12 flex items-center justify-center`}
          >
            <div className="relative w-full max-w-md h-[500px] animate-float">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Category Badge */}
            <Badge className="w-fit bg-[rgb(170,151,196)]/20 text-[rgb(170,151,196)] border-[rgb(170,151,196)]/50 text-sm px-4 py-1">
              {product.category}
            </Badge>

            {/* Product Name */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-condor text-white text-balance">{product.name}</h1>

            {/* Short Description */}
            <p className="text-xl text-white/70 leading-relaxed text-pretty">{product.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] bg-clip-text text-transparent">
                ${product.price}
              </span>
              <span className="text-white/60 text-lg">MXN</span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white/60 text-sm">
                {product.stock > 10 ? "En stock" : `Solo quedan ${product.stock} unidades`}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-white/80 font-medium">Cantidad:</span>
              <div className="flex items-center gap-3 bg-white/5 border border-[rgb(74,34,86)] rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="text-white hover:text-[rgb(170,151,196)] hover:bg-white/10 h-8 w-8"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-white font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="text-white hover:text-[rgb(170,151,196)] hover:bg-white/10 h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:opacity-90 text-white text-lg h-14"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Agregar al Carrito
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`border-[rgb(74,34,86)] h-14 ${
                  isWishlisted
                    ? "bg-[rgb(201,18,64)]/20 text-[rgb(201,18,64)] border-[rgb(201,18,64)]"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[rgb(74,34,86)] bg-white/5 text-white hover:bg-white/10 h-14"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-[rgb(74,34,86)] p-1">
              <TabsTrigger
                value="description"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[rgb(170,151,196)] data-[state=active]:to-[rgb(201,18,64)] data-[state=active]:text-white text-white/70"
              >
                Descripción
              </TabsTrigger>
              <TabsTrigger
                value="benefits"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[rgb(170,151,196)] data-[state=active]:to-[rgb(201,18,64)] data-[state=active]:text-white text-white/70"
              >
                Beneficios
              </TabsTrigger>
              <TabsTrigger
                value="ingredients"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[rgb(170,151,196)] data-[state=active]:to-[rgb(201,18,64)] data-[state=active]:text-white text-white/70"
              >
                Ingredientes
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[rgb(170,151,196)] data-[state=active]:to-[rgb(201,18,64)] data-[state=active]:text-white text-white/70"
              >
                Reseñas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-8 space-y-6">
              <div className="bg-white/5 border border-[rgb(74,34,86)] rounded-2xl p-8">
                <p className="text-white/80 text-lg leading-relaxed">{product.longDescription}</p>
                <div className="mt-6 pt-6 border-t border-[rgb(74,34,86)]">
                  <h3 className="text-white font-semibold mb-3">Modo de uso:</h3>
                  <p className="text-white/70 leading-relaxed">{product.usage}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="mt-8">
              <div className="bg-white/5 border border-[rgb(74,34,86)] rounded-2xl p-8">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/80">
                      <Check className="h-5 w-5 text-[rgb(170,151,196)] flex-shrink-0 mt-1" />
                      <span className="leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-8">
              <div className="bg-white/5 border border-[rgb(74,34,86)] rounded-2xl p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="bg-white/5 border border-[rgb(74,34,86)] rounded-lg p-4 flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[rgb(170,151,196)]" />
                      <span className="text-white/80">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <ProductReviews productId={product.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
