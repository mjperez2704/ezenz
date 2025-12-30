"use client"

import Image from "next/image"
import { FileKey, Shield, Leaf } from "lucide-react"

export function PhilosophySection() {
  const values = [
    {
      icon: <FileKey className="w-10 h-10" />,
      title: "Transparencia",
      description:
        "Lo que decimos que contiene cada producto, es exactamente lo que contiene. Sin engaños, sin dosis ocultas, sin ingredientes de relleno.",
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Seguridad",
      description:
        "Nunca usamos compuestos asociados con riesgos para la salud, como precursores del cáncer que aún hoy son comunes en muchas marcas del mercado.",
    },
    {
      icon: <Leaf className="w-10 h-10" />,
      title: "Natural",
      description:
        "Además, nuestros productos están libres de saborizantes artificiales, edulcorantes, conservadores y utilizamos exclusivamente cápsulas veganas.",
    },
  ]

  return (
    <section className="relative w-full max-w-[1920px] mx-auto min-h-[500px] py-16 sm:py-20">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/design-mode/filosofia.png"
          alt="Philosophy Background"
          fill
          className="object-cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-7xl text-transparent bg-transparent my-0 sm:px-7">
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-12 items-center opacity-100 bg-transparent text-white">
          <div className="space-y-6 text-white">
            <h2 className="text-3xl sm:text-4xl familyfont-Anisette mb-8 font-light lg:text-4xl text-left tracking-wider">
              Comprometidos con tu salud
            </h2>
            <p className="leading-relaxed text-sm">
              En Ezenz, nuestra prioridad es la <strong>calidad, no el precio</strong>. A diferencia de muchas marcas
              que compiten en el mercado de los suplementos de bajo costo, nosotros partimos de un compromiso
              inquebrantable con la eficacia, la pureza y la transparencia.
            </p>
            <p className="text-sm leading-relaxed sm:text-sm">
              Cada una de nuestras formulas ha sido disenada con precision: usamos{" "}
              <strong>dosis clinicamente respaldadas</strong>, ingredientes de alta calidad, tecnologia avanzada y un
              profundo respeto por el cuerpo humano. No buscamos competir con otras marcas; competimos con los
              resultados que tu esperas obtener.
            </p>
          </div>

          <div className="space-y-6 text-white text-right leading-6">
            <h2 className="text-2xl sm:text-3xl familyfont-Anisette mb-8 font-light tracking-[0.2em] lg:text-5xl">
              Nuestra Filosofia{" "}
            </h2>
          </div>
        </div>
      </div>
    </section>
  )
}
