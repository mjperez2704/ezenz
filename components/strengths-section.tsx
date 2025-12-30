import Image from "next/image"
import { TrendingUp, ClipboardCheck, Package, TestTube, Pill } from "lucide-react"

export function StrengthsSection() {
  const strengths = [
    {
      icon: <Image src="/images/estrella_stardust.png" alt="Estrella" width={48} height={48} />,
      label: "VENTAJAS\nCOMPETITIVAS",
    },
    {
      icon: <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.5} />,
      label: "CAPACIDAD\nINSTALADA",
    },
    {
      icon: <ClipboardCheck className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.5} />,
      label: "ADMINISTRATIVOS\nY OPERACIONES",
    },
    {
      icon: <Package className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.5} />,
      label: "ALMACENES\nY LOGÍSTICA",
    },
    {
      icon: <TestTube className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.5} />,
      label: "LABORATORIO\nPRINCIPAL",
    },
    {
      icon: <Pill className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.5} />,
      label: "BÓTICA",
    },
  ]

  return (
    <section
      className="relative w-full min-h-[540px] py-12 sm:py-16 md:h-[540px] flex items-center justify-center -my-px bg-cover bg-center"
      style={{
        backgroundImage: "url(/images/fondo_seccion_fortalezas_actuales.jpg)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide font-condor italic">
              FORTALEZAS ACTUALES
            </h2>
            <div className="flex gap-1.5 sm:gap-2 justify-center">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/60" />
              ))}
            </div>
          </div>

          <div className="max-w-5xl space-y-3 sm:space-y-4 text-white/95 px-4">
            <p className="text-sm sm:text-base md:text-lg leading-relaxed font-montserrat">
              En <span className="font-bold font-condor italic">Stardust</span> contamos con una infraestructura sólida y en constante crecimiento, diseñada para cubrir cada
              etapa clave de la formulación, producción, control y operación.
            </p>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed font-montserrat">
              Nuestro espacio integra laboratorios, áreas productivas especializadas, zonas de almacenamiento y oficinas
              administrativas, organizados estratégicamente para asegurar eficiencia, trazabilidad e inocuidad en cada
              uno de nuestros procesos.
            </p>
          </div>

          {/* Grid responsive para iconos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 sm:gap-8 pt-4 sm:pt-6 w-full max-w-6xl">
            {strengths.map((strength, index) => (
              <div key={index} className="flex flex-col items-left gap-2 sm:gap-3">
                <div className="text-white/90 flex items-center justify-center">{strength.icon}</div>
                <p className="text-xs sm:text-sm font-bold text-white text-center uppercase tracking-wide leading-tight font-din whitespace-pre-line">
                  {strength.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
