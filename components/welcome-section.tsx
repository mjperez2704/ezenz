"use client"

import Image from "next/image"

export function WelcomeSection() {
  return (
    <section className="relative w-full max-w-[1920px] mx-auto min-h-[540px] py-12 sm:py-16 md:h-[540px] flex flex-col justify-center overflow-hidden -my-px">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/fondo_seccion_bienvenidos.jpg"
          alt="Welcome Background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        <div className="relative w-6 h-6 sm:w-8 sm:h-8 mb-3">
          <Image src="/images/estrella_stardust.png" alt="Star" fill className="object-contain animate-pulse" />
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-widest font-condor italic mb-4 sm:mb-6">
          BIENVENIDO
        </h2>

        <div className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-white/50 to-transparent my-3" />

        <h3 className="text-lg sm:text-xl md:text-2xl text-white font-astrobia tracking-wide mb-6 sm:mb-8">
          CIENCIA Y ENERGÍA EN PERFECTA ARMONÍA.
        </h3>

        <div className="space-y-3 sm:space-y-4 max-w-4xl px-4">
          <p className="text-white/95 text-sm sm:text-base leading-relaxed font-montserrat">
            En <span className="font-bold font-condor italic">Stardust</span> creemos que el bienestar surge del equilibrio entre ciencia y naturaleza. Nuestras fórmulas
            combinan precisión científica, tecnología avanzada y adaptógenos naturales para ofrecer resultados reales.
          </p>
          <p className="text-white/95 text-sm sm:text-base leading-relaxed font-montserrat">
            Cada ingrediente y cada proceso reflejan nuestro compromiso con la pureza, la efectividad y la
            transparencia.
          </p>
          <p className="text-white/95 text-sm sm:text-base leading-relaxed font-montserrat">
            Stardust no es solo una marca: es una forma de vivir el bienestar, donde lo natural y lo científico se
            encuentran para elevar tu vida.
          </p>
        </div>
      </div>
    </section>
  )
}
