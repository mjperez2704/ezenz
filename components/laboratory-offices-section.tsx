"use client"

import Image from "next/image"

export function LaboratoryOfficesSection() {
  const advantages = [
    {
      title: "Formulación",
      description:
        "Área exclusiva donde se preparan las fórmulas base con el más alto grado de confidencialidad, así como con las tecnologías necesarias y omponentes clave de cada producto.",
    },
    {
      title: "Control de calidad",
      description:
        "Análisis de materias primas, materiales de empaque y producto terminado. Tanto interno como externo",
    },
    {
      title: "Encapsulado y mezclado",
      description: "Espacio equipado con maquinaria para encapsular, dosificar y mezclar.",
    },
    {
      title: "Etiquetados y empaquetado",
      description: "Zona donde se sellan, etiquetan y empacan nuestros productos ya destinados B2C y B2B.",
    },
    {
      title: "Producto semiterminado",
      description: "Espacio intermedio para reguardar y mezclar lista para encapsular o mezclar.",
    },
  ]
  const advantages2 = [
    {
      title: "Formulación",
      description: "Sala de juntas.",
    },
    {
      title: "Control de calidad",
      description: "Oficina de dirección general",
    },
    {
      title: "Encapsulado y mezclado",
      description: "Oficina administrativa y de compras",
    },
    {
      title: "Etiquetados y empaquetado",
      description: "Departamento de mercadotecnia",
    },
    {
      title: "Producto semiterminado",
      description: "Oficina de gerencia administrativa.",
    },
  ]

  return (
    <section className="relative w-full min-h-[400px] lg:h-[1080px] bg-white">
      {/* Background Image - 1920x592 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/fondos/laboratorio_oficinas.jpg"
          alt="Ventajas Competitivas Background"
          fill
          className="object-cover object-center"
          quality={100}
          priority
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full">
        <div className="container mx-auto px-4 sm:px-6 flex py-12 lg:py-0 lg:px-0 items-stretch w-[1920px] h-[550px] flex-row">
          {/* Right side content area - starts at around 40% of width */}
          <div className="w-full text-right text-white bg-transparent bg-transparent h-[500px] mr-0 mt-10 lg:w-[1665px] lg:ml-60">
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 uppercase tracking-[0.25em] text-center text-card lg:mb-12">
              LABORATORIO
            </h2>

            {/* Advantages Grid with Timeline */}
            <div className="space-y-8 lg:space-y-12">
              {/* Top Row - 3 advantages */}
              <div className="relative">
                {/* Timeline line */}
                <div className="hidden lg:block absolute top-0 left-0 right-0 h-[2px] bg-card" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
                  {advantages.slice(0, 3).map((advantage, index) => (
                    <div key={index} className="relative pt-0 lg:pt-6 text-card">
                      {/* Dot on timeline */}
                      <div className="hidden lg:block absolute top-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-card" />

                      <div className="text-center">
                        <h3 className="font-bold text-sm lg:text-base mb-2 lg:mb-3 text-card">{advantage.title}</h3>
                        <p className="text-xs lg:text-sm leading-relaxed text-card">{advantage.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Row - 2 advantages */}
              <div className="relative text-card bg-transparent">
                {/* Timeline line */}
                <div className="hidden lg:block absolute top-0 left-0 right-0 h-[2px] bg-card" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
                  {advantages.slice(3, 5).map((advantage, index) => (
                    <div key={index} className="relative pt-0 lg:pt-6">
                      {/* Dot on timeline */}
                      <div className="hidden lg:block absolute top-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-card" />

                      <div className="text-center">
                        <h3 className="font-bold text-sm lg:text-base mb-2 lg:mb-3 text-background">
                          {advantage.title}
                        </h3>
                        <p className="text-xs lg:text-sm leading-relaxed text-card">{advantage.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>  
          <div className="w-full bg-transparent bg-transparent h-[500px] text-left text-black lg:ml-[50px] mr-40 lg:w-[650px]">
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 uppercase tracking-[0.25em] lg:mb-12 text-black text-center">
              OFICINAS
            </h2>

            {/* Advantages Grid with Timeline */}
            <div className="space-y-8 lg:space-y-12">
              {/* Top Row - 3 advantages */}
              <div className="relative">
                {/* Timeline line */}
                <div className="hidden lg:block absolute top-0 left-0 right-0 h-[2px] bg-black leading-7 font-semibold" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
                  {advantages2.slice(0, 3).map((advantage2, index) => (
                    <div key={index} className="relative pt-0 lg:pt-6 text-card">
                      {/* Dot on timeline */}
                      <div className="hidden lg:block absolute top-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-black" />

                      <div className="text-center">
                        <h3 className="font-bold text-sm lg:text-base mb-2 lg:mb-3 text-black">{advantage2.title}</h3>
                        <p className="text-xs lg:text-sm leading-relaxed text-black">{advantage2.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Row - 2 advantages */}
              <div className="relative text-card bg-transparent">
                {/* Timeline line */}
                <div className="hidden lg:block absolute top-0 left-0 right-0 h-[2px] text-black bg-black" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
                  {advantages2.slice(3, 5).map((advantage2, index) => (
                    <div key={index} className="relative pt-0 lg:pt-6">
                      {/* Dot on timeline */}
                      <div className="hidden lg:block absolute top-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-black" />

                      <div className="text-center">
                        <h3 className="font-bold text-sm lg:text-base mb-2 lg:mb-3 text-black">
                          {advantage2.title}
                        </h3>
                        <p className="text-xs lg:text-sm leading-relaxed text-black">{advantage2.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  )
}
