"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PlatinumLineSection() {
  return (
    <section
      className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden"
      style={{
        backgroundImage: 'url("/images/linea-platinum-bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-16 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 uppercase tracking-wider font-Anisette">
            LINEA PLATINUM
          </h2>
          <p className="text-white text-xs md:text-sm uppercase tracking-widest font-Anisette">
            SOLO CIENCIA, PUREZA Y PROPOSITO, RESPETANDO TU CUERPO Y TU ESTILO DE VIDA
          </p>
        </div>

        <div className="max-w-2xl mx-auto lg:mx-0 lg:ml-auto lg:mr-20">
          <div className="space-y-6 text-white mb-8">
            <p className="text-base md:text-lg leading-relaxed">La excelencia no se improvisa.Se formula</p>

            <p className="text-sm md:text-base leading-relaxed">
              Disenamos esta linea para quienes exigen lo maximo de su cuerpo y no aceptan menos de lo mejor, la{" "}
              <span className="font-bold">Linea Platino</span> representa el pinaculo de la innovacion en
              suplementacion.
            </p>

            <p className="text-sm md:text-base leading-relaxed">
              Con Formulas unicas en el mundo, disenadas meticulosamente para verdaderos apasionados de la salud y el
              rendimiento. Reunimos las dosis mas potentes, los ingredientes mas puros y la calidad mas alta disponible,
              para ofrecer una experiencia transformadora con resultados visibles, medibles e impactantes.
            </p>

            <div className="space-y-1">
              <p className="text-sm md:text-base leading-relaxed">Esta no es una formula mas. Es una declaracion.</p>
              <p className="text-sm md:text-base leading-relaxed">
                Una apuesta por lo esencial, efectivo y absolutamente limpio.
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-10">
            <div className="flex items-center gap-3 text-white">
              <span className="text-xl">✓</span>
              <span className="text-sm md:text-base uppercase tracking-wide">SIN COLORANTES</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <span className="text-xl">✓</span>
              <span className="text-sm md:text-base uppercase tracking-wide">SIN ADITIVOS</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <span className="text-xl">✓</span>
              <span className="text-sm md:text-base uppercase tracking-wide">SIN EXCUSAS</span>
            </div>
          </div>

          <div className="flex justify-center lg:justify-start">
            <Link href="/productos">
              <Button className="bg-white hover:bg-gray-100 text-black px-12 md:px-16 py-5 md:py-6 text-base md:text-lg tracking-wider uppercase font-bold rounded-lg transition-all">
                SHOP NOW
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
