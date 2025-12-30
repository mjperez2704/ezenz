"use client"

import Image from "next/image"

export function CompetitiveAdvantagesNewSection() {
  const advantages = [
    {
      title: "Know-how unico en formulacion",
      description:
        "Nuestra experiencia acumulada nos permite crear soluciones realistas y funcionales desde cero. Mas de 270 formulaciones desarrolladas internamente representan anos de investigacion, desempeno y comprension profunda del comportamiento de los activos dentro del cuerpo humano.",
    },
    {
      title: "Acceso a proveedores internacionales de alta calidad",
      description:
        "Contamos con proveedores internacionales de la mas alta calidad: continuidad, trazabilidad y continuidad de suministro incluso en entornos volatiles.",
    },
    {
      title: "Confianza comprobada por clientes B2B y B2C",
      description:
        "Mas de 500 clientes directos han depositado su confianza en nuestros servicios. Nuestro modelo de trabajo garantiza entregas puntuales, absoluta trazabilidad de productos, hasta acompanamiento estrategico en cada etapa del proceso.",
    },
    {
      title: "Co-desarrollo y adaptacion",
      description:
        "Mas que maquilar, acompanamos a nuestros clientes en el desarrollo de sus productos, desde ideas hasta lanzamientos. Nos adaptamos a diferentes clientes, formulaciones complejas y necesidades regulatorias.",
    },
    {
      title: "Cumplimiento normativo y vision etica",
      description:
        "Estamos certificados por COFEPRIS en plantas, procesos y almacenes. Mantenemos altos estandares de calidad, inocuidad y eficiencia para asegurar la maxima transparencia y confianza en cada etapa del proceso.",
    },
  ]

  return (
    <section className="relative w-full min-h-[400px] lg:h-[592px] bg-white">
      {/* Background Image - 1920x592 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/fondos/ventajas_competitivas.jpg"
          alt="Ventajas Competitivas Background"
          fill
          className="object-cover object-center"
          quality={100}
          priority
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full">
        <div className="container mx-auto px-4 sm:px-6 h-full flex items-center py-12 lg:py-0 w-auto lg:px-0">
          {/* Right side content area - starts at around 40% of width */}
          <div className="w-full lg:ml-60 mr-[-10px] lg:w-[116%] text-right">
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-8 lg:mb-12 uppercase tracking-[0.25em] text-center">
              VENTAJAS COMPETITIVAS
            </h2>

            {/* Advantages Grid with Timeline */}
            <div className="space-y-8 lg:space-y-12">
              {/* Top Row - 3 advantages */}
              <div className="relative">
                {/* Timeline line */}
                <div className="hidden lg:block absolute top-0 left-0 right-0 h-[2px] bg-black" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
                  {advantages.slice(0, 3).map((advantage, index) => (
                    <div key={index} className="relative pt-0 lg:pt-6">
                      {/* Dot on timeline */}
                      <div className="hidden lg:block absolute top-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full" />

                      <div className="text-center">
                        <h3 className="font-bold text-sm lg:text-base mb-2 lg:mb-3 text-black">{advantage.title}</h3>
                        <p className="text-xs lg:text-sm text-black leading-relaxed">{advantage.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Row - 2 advantages */}
              <div className="relative">
                {/* Timeline line */}
                <div className="hidden lg:block absolute top-0 left-0 right-0 h-[2px] bg-black" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
                  {advantages.slice(3, 5).map((advantage, index) => (
                    <div key={index} className="relative pt-0 lg:pt-6">
                      {/* Dot on timeline */}
                      <div className="hidden lg:block absolute top-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full" />

                      <div className="text-center">
                        <h3 className="font-bold text-sm lg:text-base mb-2 lg:mb-3 text-black">{advantage.title}</h3>
                        <p className="text-xs lg:text-sm text-black leading-relaxed">{advantage.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
