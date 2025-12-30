"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  image: string
  slug: string
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "El Poder de los Adaptógenos en la Vida Moderna",
    excerpt:
      "Descubre cómo los adaptógenos pueden ayudarte a manejar el estrés y mejorar tu bienestar general en un mundo cada vez más acelerado.",
    category: "Ciencia",
    date: "15 Dic 2024",
    readTime: "5 min",
    image: "/adaptogenic-herbs.jpg",
    slug: "poder-adaptogenos-vida-moderna",
  },
  {
    id: "2",
    title: "Sueño Profundo: La Base del Bienestar",
    excerpt:
      "Aprende sobre la importancia del sueño reparador y cómo nuestras fórmulas pueden ayudarte a lograr un descanso de calidad.",
    category: "Bienestar",
    date: "10 Dic 2024",
    readTime: "7 min",
    image: "/peaceful-sleep.png",
    slug: "sueno-profundo-base-bienestar",
  },
  {
    id: "3",
    title: "Energía Sostenible: Más Allá de la Cafeína",
    excerpt:
      "Explora alternativas naturales para mantener tu energía durante todo el día sin los efectos secundarios de los estimulantes artificiales.",
    category: "Energía",
    date: "5 Dic 2024",
    readTime: "6 min",
    image: "/natural-energy.jpg",
    slug: "energia-sostenible-mas-alla-cafeina",
  },
  {
    id: "4",
    title: "Enfoque Mental en la Era Digital",
    excerpt:
      "Descubre estrategias y suplementos naturales para mejorar tu concentración en un mundo lleno de distracciones digitales.",
    category: "Enfoque",
    date: "1 Dic 2024",
    readTime: "8 min",
    image: "/mental-focus.jpg",
    slug: "enfoque-mental-era-digital",
  },
  {
    id: "5",
    title: "Inmunidad Natural: Fortalece tu Sistema",
    excerpt:
      "Conoce los ingredientes clave que ayudan a fortalecer tu sistema inmunológico de forma natural y efectiva.",
    category: "Defensa",
    date: "28 Nov 2024",
    readTime: "5 min",
    image: "/immune-system.jpg",
    slug: "inmunidad-natural-fortalece-sistema",
  },
  {
    id: "6",
    title: "Balance Hormonal: La Clave del Equilibrio",
    excerpt:
      "Entiende la importancia del equilibrio hormonal y cómo los adaptógenos pueden ayudarte a mantenerlo naturalmente.",
    category: "Balance",
    date: "25 Nov 2024",
    readTime: "9 min",
    image: "/hormonal-balance.jpg",
    slug: "balance-hormonal-clave-equilibrio",
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[rgb(15,15,35)]">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[rgb(15,15,35)] via-[rgb(20,20,40)] to-transparent">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[rgb(170,151,196)] rounded-full blur-[120px] opacity-10" />
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[rgb(201,18,64)] rounded-full blur-[120px] opacity-10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance font-condor">
            Nuestro{" "}
            <span className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto text-pretty leading-relaxed font-montserrat">
            Explora artículos sobre bienestar, ciencia y el poder de la naturaleza para transformar tu vida.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="group bg-white/5 border-[rgb(74,34,86)] hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[rgb(170,151,196)]/20 overflow-hidden h-full">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgb(15,15,35)] to-transparent opacity-60" />
                    <Badge className="absolute top-4 left-4 bg-[rgb(170,151,196)]/90 text-white border-none font-montserrat">
                      {post.category}
                    </Badge>
                  </div>

                  <CardHeader>
                    <h3 className="text-xl font-bold text-white group-hover:text-[rgb(170,151,196)] transition-colors font-astrobia line-clamp-2">
                      {post.title}
                    </h3>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-white/70 text-sm leading-relaxed line-clamp-3 font-montserrat">{post.excerpt}</p>

                    <div className="flex items-center gap-4 text-xs text-white/50">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-[rgb(170,151,196)] text-sm font-semibold group-hover:gap-2 transition-all font-montserrat">
                      Leer más
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Empty State (cuando no hay posts) */}
          {blogPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/60 text-lg font-montserrat">Próximamente: Nuevos artículos sobre bienestar.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
