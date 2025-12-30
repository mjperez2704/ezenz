"use client"

import Image from "next/image"

export function WhoWeAreSection() {
  return (
    <section className="relative w-full bg-white py-20 sm:py-32">
      <div className="container mx-auto px-8 sm:px-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Logo lado izquierdo con marca de agua */}
          <div className="relative flex flex-col items-center justify-center">
            {/* Logo grande como marca de agua */}
            <div className="relative w-[400px] h-[400px] opacity-20">
              <Image
                src="/images/design-mode/loto_transparente_ok.png"
                alt="E-ZENZ Logo"
                fill
                className="object-contain"
                quality={100}
              />
            </div>
            {/* Texto TWIST THE CLOCK sobre el logo */}
            <div className="absolute">
              <h3 className="text-3xl font-light text-black tracking-[0.3em] text-center">TWIST THE CLOCK</h3>
            </div>
          </div>

          {/* Contenido lado derecho */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-normal text-black mb-8">¿Quiénes somos?</h2>

            <p className="text-base text-black leading-relaxed">
              E-ZENZ es sinónimo de precisión, pureza y compromiso absoluto con la calidad. Cada uno de nuestros
              productos está formulado desde cero, con un enfoque minucioso en la eficacia, la seguridad y la
              experiencia de uso.
            </p>

            <p className="text-base text-black leading-relaxed">
              Nuestra misión es ofrecer soluciones reales, funcionales y bien hechas, desarrolladas con rigor técnico y
              ejecutadas con estándares superiores de trazabilidad, inocuidad y eficiencia.
            </p>

            <p className="text-base text-black leading-relaxed">
              Con más de 50 desarrollos únicos, E-ZENZ representa un ecosistema de innovación y resultados tangibles.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
