import Link from "next/link"
import { Brain, Zap, Shield, Heart, Activity, Scale } from 'lucide-react'

const categories = [
  {
    name: "Enfoque",
    icon: Brain,
    color: "from-blue-500 to-cyan-500",
    href: "/productos?categoria=enfoque",
  },
  {
    name: "Energía",
    icon: Zap,
    color: "from-orange-500 to-yellow-500",
    href: "/productos?categoria=energia",
  },
  {
    name: "Defensa",
    icon: Shield,
    color: "from-red-500 to-pink-500",
    href: "/productos?categoria=defensa",
  },
  {
    name: "Relajación",
    icon: Heart,
    color: "from-purple-500 to-pink-500",
    href: "/productos?categoria=relajacion",
  },
  {
    name: "Balance Hormonal",
    icon: Scale,
    color: "from-green-500 to-lime-500",
    href: "/productos?categoria=balance-hormonal",
  },
  {
    name: "Longevidad",
    icon: Activity,
    color: "from-yellow-500 to-cyan-500",
    href: "/productos?categoria=longevidad",
  },
]

export function MobileCategories() {
  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl font-bold text-white text-center mb-8">
        Categorías
      </h2>
      
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Link
              key={category.name}
              href={category.href}
              className={`bg-gradient-to-br ${category.color} rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-transform`}
            >
              <Icon className="h-8 w-8 text-white" />
              <span className="text-white font-semibold text-center">
                {category.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
