"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel"
import { ChevronLeft, ChevronRight, Star, Check } from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
  description: string
  long_description?: string
  image: string
  benefits: string[]
  price: number
  stock: number
}

const PRODUCTS: Product[] = [
  {
    id: "calm-core",
    name: "CALM CORE",
    category: "stress-anxiety",
    description: "Reducción de estrés y mejora del sueño",
    long_description: "Suplemento natural en cápsulas formulado con extractos de plantas adaptógenas, minerales y aminoácidos que ayudan a reducir el estrés crónico, mejorar la respuesta al cortisol, promover calma mental y favorecer un sueño reparador.",
    image: "/productos/CALMCORE.png",
    benefits: [
      "Disminución del estrés y la ansiedad",
      "Mejora en la calidad del sueño",
      "Regulación del cortisol",
      "Soporte del estado de ánimo"
    ],
    price: 899,
    stock: 100
  },
  {
    id: "moodlift",
    name: "MOODLIFT",
    category: "stress-anxiety",
    description: "Mejora del estado de ánimo y bienestar emocional",
    long_description: "Suplemento natural formulado para mejorar el estado de ánimo, reducir la irritabilidad y la ansiedad. Combina aminoácidos, adaptógenos y minerales que apoyan el equilibrio emocional y la respuesta al estrés.",
    image: "/productos/MOODLIFT.png",
    benefits: [
      "Mejora el estado de ánimo y bienestar emocional",
      "Reducción de la irritabilidad y la ansiedad",
      "Apoyo en estados de agotamiento emocional",
      "Aporte de magnesio y vitamina B6 para el sistema nervioso"
    ],
    price: 899,
    stock: 100
  },
  {
    id: "deepz",
    name: "DEEPZ",
    category: "stress-anxiety",
    description: "Sueño profundo y reparador",
    long_description: "Suplemento formulado para promover un sueño profundo y reparador, reducir el insomnio y facilitar la relajación nocturna. Contiene triptófano, adaptógenos y minerales que apoyan el equilibrio del sistema nervioso antes de dormir.",
    image: "/productos/DEEPZ.png",
    benefits: [
      "Promueve un sueño profundo y reparador",
      "Reducción del insomnio y ansiedad nocturna",
      "Apoyo a la relajación del sistema nervioso",
      "Fórmula sin efectos sedantes artificiales"
    ],
    price: 899,
    stock: 100
  },
  {
    id: "shield-up",
    name: "SHIELD UP",
    category: "immunity",
    description: "Fortalecimiento del sistema inmunológico",
    long_description: "Suplemento natural diseñado para fortalecer el sistema inmunológico y apoyar la respuesta natural del cuerpo ante infecciones. Formulado con extractos de hongos medicinales, vitamina C y zinc en su forma bisglicinato para mejorar la biodisponibilidad.",
    image: "/productos/SHIELDUP.png",
    benefits: [
      "Refuerzo del sistema inmunológico",
      "Apoyo a la respuesta natural del cuerpo ante infecciones",
      "Aporte antioxidante con vitamina C",
      "Mejora de la biodisponibilidad de zinc"
    ],
    price: 899,
    stock: 100
  },
  {
    id: "oxycell",
    name: "OXYCELL",
    category: "longevity",
    description: "Protección celular y longevidad",
    long_description: "Suplemento natural diseñado para proteger contra el daño oxidativo y apoyar la longevidad y vitalidad celular. Contiene hongos medicinales, antioxidantes y minerales esenciales para el equilibrio celular y el bienestar general.",
    image: "/productos/OXYCELL.png",
    benefits: [
      "Protección contra el daño oxidativo",
      "Apoyo a la longevidad y vitalidad celular",
      "Aporte de antioxidantes naturales",
      "Equilibrio mineral con magnesio y zinc"
    ],
    price: 899,
    stock: 100
  },
  {
    id: "hormonix",
    name: "HORMONIX",
    category: "hormonal",
    description: "Balance hormonal general",
    long_description: "Suplemento natural para promover el balance hormonal, aumentar la vitalidad física y emocional, y mejorar el estado físico y emocional. Formulado con plantas adaptógenas y minerales esenciales que apoyan la función endocrina.",
    image: "/productos/HORMONIX.png",
    benefits: [
      "Balance hormonal general",
      "Aumento de la vitalidad física y emocional",
      "Apoyo adaptógeno al sistema endocrino",
      "Vitamina de zinc y magnesio para funciones hormonales"
    ],
    price: 899,
    stock: 100
  },
  {
    id: "focus-mind",
    name: "FOCUSMIND",
    category: "cognitive",
    description: "Mejora del enfoque y la concentración",
    long_description: "Suplemento diseñado para reducir la fatiga crónica y mejorar la energía celular. Formulado con adaptógenos, antioxidantes y vitaminas esenciales que apoyan la vitalidad y el metabolismo energético.",
    image: "/productos/FOCUSMIND.png",
    benefits: [
      "Reducción de la fatiga crónica",
      "Mejora de la energía celular",
      "Aporte de antioxidantes y adaptógenos",
      "Estimulación sin cafeína ni estimulantes artificiales"
    ],
    price: 899,
    stock: 100
  },
  {
    id: "cell-recharge",
    name: "CELL RECHARGE",
    category: "energy-performance",
    description: "Recarga de energía celular",
    long_description: "Suplemento diseñado para reducir la fatiga crónica y mejorar la energía celular. Formulado con adaptógenos, antioxidantes y vitaminas esenciales que apoyan la vitalidad y el metabolismo energético.",
    image: "/productos/CELLRECHARGE.png",
    benefits: [
      "Reducción de la fatiga crónica",
      "Mejora de la energía celular",
      "Aporte de antioxidantes y adaptógenos",
      "Apoyo al rendimiento físico y mental"
    ],
    price: 899,
    stock: 100
  },
  {
    id: "vital-fuel",
    name: "VITAL FUEL",
    category: "energy-performance",
    description: "Energía física y mental sostenida",
    long_description: "Suplemento natural formulado para aumentar la energía física y mental de forma sostenida, sin estimulantes artificiales. Contiene extractos de plantas adaptógenas y micronutrientes esenciales para el rendimiento diario.",
    image: "/productos/VITALFUEL.png",
    benefits: [
      "Aumento de energía física y mental",
      "Apoyo al rendimiento durante la actividad física",
      "Mejora de la vitalidad sin estimulantes artificiales",
      "Reducción del cansancio y la fatiga"
    ],
    price: 899,
    stock: 100
  },
  {
    id: "neuroshield",
    name: "NEUROSHIELD",
    category: "cognitive",
    description: "Protección cognitiva y neurológica",
    long_description: "Suplemento dual que combina ingredientes para el refuerzo del sistema inmunológico y la salud cerebral. Con hongos medicinales, antioxidantes y micronutrientes esenciales que apoyan tanto la defensa natural del cuerpo como el rendimiento cognitivo.",
    image: "/productos/NEUROSHIELD.png",
    benefits: [
      "Apoyo al sistema inmunológico",
      "Mejora del rendimiento cognitivo y enfoque",
      "Acción antioxidante y neuroprotectora",
      "Estimulación suave sin cafeína"
    ],
    price: 899,
    stock: 100
  }
]

export function ProductCarousel() {
  const [products] = useState<Product[]>(PRODUCTS)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const scrollPrev = () => api?.scrollPrev()
  const scrollNext = () => api?.scrollNext()

  if (products.length === 0) return null

  const currentProduct = products[current]

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      "stress-anxiety": "RELAJACIÓN",
      "immunity": "DEFENSA",
      "energy-performance": "ENERGÍA",
      "cognitive": "ENFOQUE",
      "longevity": "LONGEVIDAD",
      "hormonal": "BALANCE HORMONAL"
    }
    return categories[category] || "BIENESTAR"
  }

  const getActionLabel = (productId: string) => {
    const actions: Record<string, string> = {
      "calm-core": "ENERGÍA",
      "moodlift": "ENERGÍA CELULAR",
      "deepz": "ENERGÍA CELULAR",
      "shield-up": "INMUNIDAD",
      "oxycell": "ENERGÍA CELULAR",
      "hormonix": "VITALIDAD HORMONAL",
      "focus-mind": "ENERGÍA CELULAR",
      "cell-recharge": "ENERGÍA CELULAR",
      "vital-fuel": "VITALIDAD",
      "neuroshield": "NEUROPROTECCIÓN"
    }
    return actions[productId] || getCategoryLabel(currentProduct.category)
  }

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[rgb(15,15,35)] via-[rgb(20,20,40)] to-[rgb(15,15,35)] overflow-hidden">
      {/* Fondo cósmico */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/fondo_1.jpg"
          alt="Fondo cósmico"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgb(15,15,35)]/80 via-transparent to-[rgb(15,15,35)]/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Logo Stardust centrado */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            
            <div className="flex justify-center items-center mb-8 sm:mb-12">
              <div className="relative flex items-center gap-2 sm:gap-3">
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-wider italic">
                  <Image
                    src="/logo-stardust.png"
                    alt="STARDUST"
                    width={400}
                    height={100}
                    className="w-48 sm:w-80 h-auto lg:w-[84px]"
                    priority
                  />
                </h1>
              </div>
            </div>
          </div>
          
        </div>

        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.id}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Columna Izquierda - Categoría y Funciones */}
                  <div className="lg:col-span-3 space-y-6">
                    {/* Categoría con estrella */}
                    <div className="flex items-center gap-3">
                      <Star className="w-6 h-6 text-white fill-white" />
                      <h3 className="text-3xl font-condor italic text-white tracking-wider">
                        {getCategoryLabel(product.category)}
                      </h3>
                    </div>

                    {/* Funciones */}
                    <div className="space-y-4">
                      <h4 className="text-2xl font-condor italic text-white">FUNCIONES</h4>
                      <ul className="space-y-3">
                        {product.benefits?.slice(0, 4).map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2 text-white/90">
                            <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                            <span className="font-montserrat text-sm leading-relaxed">{benefit}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Cantidad de cápsulas */}
                      <div className="inline-block bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] px-6 py-2 rounded-lg">
                        <span className="text-white font-montserrat font-bold text-lg">60 cáp</span>
                      </div>
                    </div>
                  </div>

                  {/* Columna Central - Imagen del Producto */}
                  <div className="lg:col-span-6 flex items-center justify-center relative">
                    {/* Anillos orbitales */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[400px] h-[400px] rounded-full border-4 border-white/30 animate-spin-slow" />
                      <div className="absolute w-[450px] h-[450px] rounded-full border-4 border-white/20 animate-spin-slower" />
                    </div>

                    {/* Círculo con gradiente para la imagen */}
                    <div className="relative w-[380px] h-[380px] rounded-full bg-gradient-to-br from-purple-600/30 via-pink-500/30 to-transparent backdrop-blur-sm border border-white/20 flex items-center justify-center z-10">
                      <div className="relative w-64 h-80 animate-float">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-contain drop-shadow-2xl"
                        />
                      </div>
                    </div>

                    {/* Flechas de navegación grandes */}
                    <button
                      onClick={scrollPrev}
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center text-white hover:text-[rgb(170,151,196)] transition-colors z-20"
                      aria-label="Producto anterior"
                    >
                      <ChevronLeft className="w-16 h-16" strokeWidth={3} />
                    </button>
                    <button
                      onClick={scrollNext}
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center text-white hover:text-[rgb(170,151,196)] transition-colors z-20"
                      aria-label="Siguiente producto"
                    >
                      <ChevronRight className="w-16 h-16" strokeWidth={3} />
                    </button>
                  </div>

                  {/* Columna Derecha - Nombre y Detalles */}
                  <div className="lg:col-span-3 space-y-6">
                    {/* Nombre del producto */}
                    <h2 className="text-5xl font-condor italic text-white tracking-wider uppercase">
                      {product.name}
                    </h2>

                    {/* Acción */}
                    <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                      <p className="text-sm text-white/60 font-montserrat uppercase tracking-wider mb-1">
                        ACCIÓN: <span className="text-white font-astrobia">{getActionLabel(product.id)}</span>
                      </p>
                    </div>

                    {/* Recomendación de uso */}
                    <div className="space-y-2">
                      <p className="text-sm text-white/60 font-montserrat uppercase tracking-wider">
                        RECOMENDACIÓN DE USO:
                      </p>
                      <p className="text-lg font-montserrat text-white">
                        2 cápsula al día
                      </p>
                    </div>

                    {/* Descripción */}
                    <p className="text-sm font-montserrat text-white/80 leading-relaxed">
                      {product.long_description || product.description}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Controles inferiores */}
        <div className="flex items-center justify-center gap-6 mt-12">
          {/* Botón CATÁLOGO */}
          <Link href="/productos">
            <Button
              variant="outline"
              className="border-2 border-white/50 bg-transparent text-white hover:bg-white/10 font-din uppercase tracking-wider px-8 py-6 text-lg"
            >
              CATÁLOGO
            </Button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-slower {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-spin-slower {
          animation: spin-slower 30s linear infinite;
        }
      `}</style>
    </section>
  )
}
