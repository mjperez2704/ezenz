import Image from "next/image"
import { ClipboardCheck } from "lucide-react"

export function AdministrativeOperationsSection() {
  const areas = [
    { name: "Sala de juntas" },
    { name: "Oficina de dirección general" },
    { name: "Oficina administrativa y\nde compras" },
    { name: "Departamento de\nmercadotecnia" },
    { name: "Oficina de gerencia\nadministrativa" },
  ]

  return (
    <section
      className="relative w-full min-h-[540px] py-12 sm:py-16 md:h-[540px] flex items-center justify-center overflow-hidden -my-px"
      style={{
        backgroundImage: "url(/images/fondo_seccion_administrativo_operacion.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 max-w-[1400px] w-full px-4 sm:px-6 md:px-8 text-center">
        <div className="flex justify-center mb-3 sm:mb-4">
          <ClipboardCheck className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={1.5} />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 italic tracking-wider font-condor">
          ADMINISTRATIVOS Y OPERACIONES
        </h2>

        <p className="text-white text-sm sm:text-base md:text-lg mb-8 sm:mb-12 max-w-3xl mx-auto font-montserrat">
          Contamos con cinco áreas funcionales dentro de nuestro laboratorio principal:
        </p>

        <div className="space-y-6 sm:space-y-8">
          {/* First Row - 3 columns on desktop, stacked on mobile */}
          <div className="relative">
            <div className="hidden md:block absolute inset-x-0 top-1/2 h-px bg-white/30" />
            <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {areas.slice(0, 3).map((area, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Image
                    src="/images/estrella_small_stardust.png"
                    alt="Estrella"
                    width={20}
                    height={20}
                    className="sm:w-6 sm:h-6 mb-3 sm:mb-4"
                  />
                  <p className="text-white font-semibold text-sm sm:text-base text-center px-2 whitespace-pre-line font-din">
                    {area.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Second Row - 2 columns */}
          <div className="relative">
            <div className="hidden md:block absolute inset-x-0 top-1/2 h-px bg-white/30" />
            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-2xl mx-auto">
              {areas.slice(3, 5).map((area, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Image
                    src="/images/estrella_small_stardust.png"
                    alt="Estrella"
                    width={20}
                    height={20}
                    className="sm:w-6 sm:h-6 mb-3 sm:mb-4"
                  />
                  <p className="text-white font-semibold text-sm sm:text-base text-center px-2 whitespace-pre-line font-din">
                    {area.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
