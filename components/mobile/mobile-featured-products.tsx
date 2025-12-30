import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const featuredProducts = [
  {
    id: 1,
    name: "CALM CORE",
    description: "Reduce el estrés y mejora el sueño",
    image: "/productos/CALM CORE.png",
    price: 29.99,
  },
  {
    id: 6,
    name: "FOCUS MIND",
    description: "Mejora concentración y claridad mental",
    image: "/productos/FOCUS MIND.png",
    price: 34.99,
  },
  {
    id: 8,
    name: "CELL RECHARGE",
    description: "Energía celular sostenida",
    image: "/productos/CELL RECHARGE.png",
    price: 37.99,
  },
]

export function MobileFeaturedProducts() {
  return (
    <section className="py-12 px-4 bg-gradient-to-b from-purple-900/10 to-transparent">
      <h2 className="text-3xl font-bold text-white text-center mb-8">
        Más Populares
      </h2>
      
      <div className="space-y-4 max-w-lg mx-auto">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-[rgb(20,20,45)] rounded-xl p-4 border border-white/10 flex gap-4"
          >
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{product.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{product.description}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xl font-bold text-white">${product.price}</span>
                <Button 
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  <Link href={`/mobile/productos/${product.id}`}>Ver</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
