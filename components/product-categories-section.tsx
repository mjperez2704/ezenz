"use client"

import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    name: "RELAJACIÓN",
    icon: "✦",
    products: ["CALM CORE", "MOODLIFT", "DEEPZ"],
    href: "/productos?categoria=relajacion",
    bgImage: "/relajacion.png",
  },
  {
    name: "DEFENSA",
    icon: "✦",
    products: ["SHIELD UP"],
    href: "/productos?categoria=defensa",
    bgImage: "/defensa.png",
  },
  {
    name: "ENERGÍA",
    icon: "✦",
    products: ["VITAL FUEL", "CELL RECHARGE"],
    href: "/productos?categoria=energia",
    bgImage: "/energia.png",
  },
  {
    name: "ENFOQUE",
    icon: "✦",
    products: ["FOCUS MIND", "NEUROSHIELD"],
    href: "/productos?categoria=enfoque",
    bgImage: "/enfoque.png",
  },
  {
    name: "LONGEVIDAD",
    icon: "✦",
    products: ["OXYCELL"],
    href: "/productos?categoria=longevidad",
    bgImage: "/longevidad.png",
  },
  {
    name: "BALANCE HORMONAL",
    icon: "✦",
    products: ["HORMONIX"],
    href: "/productos?categoria=balance-hormonal",
    bgImage: "/balance_hormonal.png",
  },
]

export function ProductCategoriesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[rgb(15,15,35)] via-[rgb(74,34,86)]/20 to-[rgb(15,15,35)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-6 mb-16">
          <p className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed">
            Hemos creado seis diferentes categorías especializadas en cada una de las áreas de mayor importancia para el
            buen funcionamiento del cuerpo humano.
          </p>
          <p className="text-base text-white/70">
            Puedes dar click en la categoría de tu interés para conocer los productos que tenemos disponibles para ti.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative backdrop-blur-sm border border-[rgb(170,151,196)]/30 rounded-2xl p-8 hover:border-[rgb(170,151,196)] hover:shadow-[0_0_30px_rgba(170,151,196,0.3)] transition-all duration-300 overflow-hidden"
            >
              <Image
                src={category.bgImage || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-all duration-300 border-0 opacity-10" />

              <div className="absolute top-0 right-0 w-32 h-32 bg-[rgb(170,151,196)]/10 rounded-full blur-3xl group-hover:bg-[rgb(170,151,196)]/20 transition-all duration-300" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.icon}</span>
                  <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                </div>

                <div className="space-y-2">
                  {category.products.map((product) => (
                    <div key={product} className="text-[rgb(170,151,196)]/80 text-sm font-medium">
                      {product}
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-[rgb(170,151,196)] text-sm font-medium">Ver más →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
