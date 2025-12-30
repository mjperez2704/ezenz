"use client"
import { FileText, Shield, Leaf, Target, Telescope } from "lucide-react"

export function MissionVisionValuesSection() {
  return (
    <>
      {/* Top Section - White background with Philosophy values */}
      <section className="relative w-full bg-white py-12 sm:py-16 lg:py-20">
        {/* Lotus watermark on left */}
        <div className="absolute left-0 top-0 bottom-0 w-1/3 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full text-gray-300">
            <path
              fill="currentColor"
              d="M100 20 C80 40, 60 60, 60 90 C60 110, 75 120, 100 120 C125 120, 140 110, 140 90 C140 60, 120 40, 100 20 Z M70 100 C60 100, 50 110, 50 120 C50 135, 60 145, 75 145 C90 145, 100 135, 100 120 L70 100 Z M130 100 C140 100, 150 110, 150 120 C150 135, 140 145, 125 145 C110 145, 100 135, 100 120 L130 100 Z M100 130 C85 140, 70 150, 70 165 C70 175, 85 180, 100 180 C115 180, 130 175, 130 165 C130 150, 115 140, 100 130 Z"
            />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Header Text */}
          <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
            <p className="text-lg sm:text-xl lg:text-2xl mb-2">Porque tu salud merece integridad.</p>
            <p className="text-lg sm:text-xl lg:text-2xl">
              Porque no creemos en comprometer el bienestar por reducir costos
            </p>
          </div>

          {/* Three Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 max-w-6xl mx-auto">
            {/* Transparencia */}
            <div className="flex flex-col items-center text-center">
              <FileText className="w-12 h-12 sm:w-16 sm:h-16 mb-4" />
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">Transparencia</h3>
              <p className="text-sm sm:text-base">
                Lo que decimos que contiene cada producto, es exactamente lo que contiene. Sin engaños, sin dosis
                ocultas, sin ingredientes de relleno.
              </p>
            </div>

            {/* Seguridad */}
            <div className="flex flex-col items-center text-center">
              <Shield className="w-12 h-12 sm:w-16 sm:h-16 mb-4" />
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">Seguridad</h3>
              <p className="text-sm sm:text-base">
                Nunca usamos compuestos asociados con riesgos para la salud, como precursores del cáncer que aún hoy son
                comunes en muchas marcas del mercado.
              </p>
            </div>

            {/* Natural */}
            <div className="flex flex-col items-center text-center">
              <Leaf className="w-12 h-12 sm:w-16 sm:h-16 mb-4" />
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">Natural</h3>
              <p className="text-sm sm:text-base">
                Además, nuestros productos están libres de saborizantes artificiales, edulcorantes, conservadores y
                utilizamos exclusivamente cápsulas veganas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section - Black background with Values, Mission, Vision */}
      <section className="relative w-full bg-black text-white py-12 sm:py-16 lg:py-20">
        {/* Lotus watermark on right */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full text-gray-600">
            <path
              fill="currentColor"
              d="M100 20 C80 40, 60 60, 60 90 C60 110, 75 120, 100 120 C125 120, 140 110, 140 90 C140 60, 120 40, 100 20 Z M70 100 C60 100, 50 110, 50 120 C50 135, 60 145, 75 145 C90 145, 100 135, 100 120 L70 100 Z M130 100 C140 100, 150 110, 150 120 C150 135, 140 145, 125 145 C110 145, 100 135, 100 120 L130 100 Z M100 130 C85 140, 70 150, 70 165 C70 175, 85 180, 100 180 C115 180, 130 175, 130 165 C130 150, 115 140, 100 130 Z"
            />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
            {/* Left Side - Valores */}
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-12 tracking-wider">VALORES</h2>

              <div className="grid grid-cols-2 gap-6 sm:gap-8">
                {["Calidad", "Efectividad", "Innovación", "Compromiso", "Experiencia"].map((value, index) => (
                  <div key={index} className="flex flex-col items-start">
                    <svg className="w-8 h-8 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 2 C10 4, 8 6, 8 9 C8 11, 10 12, 12 12 C14 12, 16 11, 16 9 C16 6, 14 4, 12 2 Z M8 10 C6 10, 4 12, 4 14 C4 16, 6 17, 8 17 C10 17, 12 16, 12 14 L8 10 Z M16 10 C18 10, 20 12, 20 14 C20 16, 18 17, 16 17 C14 17, 12 16, 12 14 L16 10 Z" />
                    </svg>
                    <span className="text-xl sm:text-2xl">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Misión y Visión */}
            <div className="space-y-12">
              {/* Misión */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <Target className="w-12 h-12 sm:w-14 sm:h-14" />
                  <h3 className="text-3xl sm:text-4xl font-bold tracking-wider">MISIÓN</h3>
                </div>
                <p className="text-sm sm:text-base leading-relaxed">
                  Crear y brindar al mercado un producto unico en el mercado. Seleccionando detalladamente cada uno de
                  los ingredientes, cuidando los mas altos estandares de calidad. Asi mismo, buscamos impactar
                  notablemente en la salud y bienestar de nuestros clientes.
                </p>
              </div>

              {/* Visión */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <Telescope className="w-12 h-12 sm:w-14 sm:h-14" />
                  <h3 className="text-3xl sm:text-4xl font-bold tracking-wider">VISIÓN</h3>
                </div>
                <p className="text-sm sm:text-base leading-relaxed">
                  Desarrollar una amplia cartera de productos que cubra todas las necesidades de nuestros consumidores e
                  impactar notable mente en su vitalidad. Haciendo parte esencial de su dia a dia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
