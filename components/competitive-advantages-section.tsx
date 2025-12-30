import Image from "next/image"

export function CompetitiveAdvantagesSection() {
  const advantages = [
    {
      title: "Know-how único en formulación",
      description:
        "Nuestra experiencia acumulada nos permite crear soluciones versátiles y personalizadas desde cero. Más de 25 fórmulas propias desarrolladas desde 0 hasta hoy, años de investigación, desarrollo y comprensión profunda del comportamiento de los activos dentro del cuerpo humano.",
    },
    {
      title: "Acceso a proveedores\ninternacionales de alta calidad",
      description:
        "Gracias a la trayectoria del Ing. Zimikov, tenemos contacto directo con las principales compañías proveedoras de la materia prima más alta calidad, contrastada, trazabilidad y confiabilidad de los suministros incluso en distintos países.",
    },
    {
      title: "Confianza comprobada por clientes B2B y B2C",
      description:
        "Más de 2100 clientes directos han depositado su confiabilidad en nuestros servicios. Nuestro modelo de trabajo garantiza entregas puntuales, atención trazable de productos, hasta acompañamiento estratégico en cada etapa del proceso.",
    },
    {
      title: "Co-desarrollo y adaptación",
      description:
        "Más que empacar, acompañamos a nuestros clientes en el desarrollo de sus productos, desde vista hasta lanzamiento. Nos adaptamos a diferentes clientes, formulaciones complejas y necesitan regulación.",
    },
    {
      title: "Cumplimiento normativo y visión ética",
      description:
        "Estamos certificados por COFEPRIS en plantas, procesos y almacenes. Mantenemos altos estándares de calidad, salubridad y eficiencia para asegurar la máxima transparencia y confianza en cada etapa del proceso.",
    },
  ]

  return (
    <section
      className="relative w-full min-h-[540px] py-12 sm:py-16 md:h-[540px] flex items-center justify-center -my-px bg-cover bg-center"
      style={{ backgroundImage: "url(/images/fondo_seccion_ventaja_competitiva.jpg)" }}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <div className="flex flex-col md:items-end space-y-6 sm:space-y-8 md:max-w-5xl md:ml-auto">
          {/* Header */}
          <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
            <Image
              src="/images/estrella_stardust.png"
              alt="Estrella"
              width={28}
              height={28}
              className="sm:w-8 sm:h-8 flex-shrink-0"
            />
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-wide font-condor italic">
              VENTAJAS COMPETITIVAS
            </h2>
          </div>

          <div className="space-y-6 sm:space-y-8 w-full">
            {/* First Row - 3 columns on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {advantages.slice(0, 3).map((advantage, index) => (
                <div key={index} className="flex flex-col items-start space-y-2 sm:space-y-3">
                  <div className="w-full border-t border-white/40 pt-3 sm:pt-4">
                    <Image
                      src="/images/estrella_small_stardust.png"
                      alt="Estrella"
                      width={20}
                      height={20}
                      className="sm:w-6 sm:h-6 mb-2 sm:mb-3"
                    />
                    <h3 className="text-sm sm:text-base font-bold text-white mb-2 leading-tight font-din whitespace-pre-line">
                      {advantage.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-white/85 font-montserrat">{advantage.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Second Row - 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:max-w-2xl">
              {advantages.slice(3).map((advantage, index) => (
                <div key={index} className="flex flex-col items-start space-y-2 sm:space-y-3">
                  <div className="w-full border-t border-white/40 pt-3 sm:pt-4">
                    <Image
                      src="/images/estrella_small_stardust.png"
                      alt="Estrella"
                      width={20}
                      height={20}
                      className="sm:w-6 sm:h-6 mb-2 sm:mb-3"
                    />
                    <h3 className="text-sm sm:text-base font-bold text-white mb-2 leading-tight font-din">
                      {advantage.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-white/85 font-montserrat">{advantage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
