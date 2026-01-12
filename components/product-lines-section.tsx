"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ProductLinesSection() {
  const productLines = [
    {
      name: "PLATINUM",
      image: "/products/platinum_solo.png",
      background: "/products/platinum_fondo.png",
    },
    {
      name: "PREFORMAS",
      image: "/products/preformas_solo.png",
      background: "/products/preformas_fondo.png",
    },
    {
      name: "VITALIDAD",
      image: "/products/vitalidad_solo.png",
      background: "/products/vitalidad_fondo.png",
    },
    {
      name: "LONGEVIDAD",
      image: "/products/longevidad_solo.png",
      background: "/products/longevidad_fondo.png",
    },
    {
      name: "BELLEZA",
      image: "/products/belleza_solo.png",
      background: "/products/belleza_fondo.png",
    },
    {
      name: "NEUROCOGNITIVO",
      image: "/products/neurocognitivo_solo.png",
      background: "/products/neurocognitivo_fondo.png",
    },
    {
      name: "FORTEX",
      image: "/products/fortex_solo.png",
      background: "/products/fortex_fondo.png",
    },
  ]

  return (
    <section className="relative w-full bg-white py-16 md:py-20 lg:py-24 overflow-hidden">
      <div className="absolute bottom-0 left-0 w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 opacity-[0.03] pointer-events-none">
        {/* Background Image */}
        
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 lg:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 uppercase tracking-tight">
            NUESTRAS LÍNEAS
          </h2>
          <p className="text-black text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Hemos creado cinco diferentes líneas especializadas en cada una de las áreas de mayor importancia para el
            buen funcionamiento del cuerpo humano.
          </p>
        </div>

        <div className="mb-12 md:mb-16">
          {/* Desktop: todas las cards en una fila */}
          <div className="hidden lg:flex justify-center items-start gap-4 xl:gap-5 mb-12">
            {productLines.map((line, index) => (
              <div
                key={index}
                className="relative w-[180px] xl:w-[200px] aspect-[3/4] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                {/* Fondo de color */}
                <Image src={line.background || "/placeholder.svg"} alt="" fill className="object-cover" />

                {/* Imagen del producto */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="relative w-full h-full">
                    <Image
                      src={line.image || "/placeholder.svg"}
                      alt={line.name}
                      fill
                      className="object-contain drop-shadow-2xl py-0"
                    />
                  </div>
                </div>

                {/* Etiqueta inferior con lotus y nombre */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm py-2.5 px-3 flex items-center justify-center gap-2">
                  <Image src="/images/design-mode/loto_transparente_ok.png" alt="" width={18} height={18} className="opacity-70" />
                  <span className="text-black text-sm font-bold uppercase tracking-wide">{line.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tablet: Grid de 3-4 columnas */}
          <div className="hidden md:grid lg:hidden grid-cols-3 xl:grid-cols-4 gap-4 mb-12 max-w-5xl mx-auto">
            {productLines.map((line, index) => (
              <div
                key={index}
                className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <Image src={line.background || "/placeholder.svg"} alt="" fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="relative w-full h-full">
                    <Image
                      src={line.image || "/placeholder.svg"}
                      alt={line.name}
                      fill
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm py-2.5 px-3 flex items-center justify-center gap-2">
                  <Image src="/logo-lotus.svg" alt="" width={16} height={16} className="opacity-70" />
                  <span className="text-black text-xs font-bold uppercase tracking-wide">{line.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Grid de 2 columnas */}
          <div className="grid grid-cols-2 gap-3 md:hidden mb-10 max-w-md mx-auto">
            {productLines.map((line, index) => (
              <div key={index} className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                <Image src={line.background || "/placeholder.svg"} alt="" fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center p-3">
                  <div className="relative w-full h-full">
                    <Image
                      src={line.image || "/placeholder.svg"}
                      alt={line.name}
                      fill
                      className="object-contain drop-shadow-xl"
                    />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm py-2 px-2 flex items-center justify-center gap-1.5">
                  <Image src="/logo-lotus.svg" alt="" width={14} height={14} className="opacity-70" />
                  <span className="text-black text-[10px] font-bold uppercase tracking-wide">{line.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Link href="/productos">
            <Button
              size="lg"
              className="bg-black hover:bg-gray-900 text-white px-16 md:px-20 lg:px-24 py-5 md:py-6 text-base md:text-lg font-bold tracking-widest uppercase rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              SHOP NOW
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
