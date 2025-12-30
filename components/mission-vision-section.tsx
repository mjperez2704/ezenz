"use client"

import { Target, Telescope } from "lucide-react"
import Image from "next/image"

export function MissionVisionSection() {
  return (
    <section className="relative w-full max-w-[1920px] mx-auto min-h-[540px] py-12 sm:py-16 md:h-[542px] flex flex-col justify-center overflow-hidden -my-px">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/fondo_seccion_mision_vision.jpg"
          alt="Mission Vision Background"
          fill
          className="object-cover"
          quality={100}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 items-center">
          {/* Vision */}
          <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
            <div className="p-3 rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm">
              <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-condor italic">
              <Image
                src="/images/estrella_mini_stardust.jpg"
                alt="Star"
                width={12}
                height={12}
                className="sm:w-3.5 sm:h-3.5 object-contain"
              />
              VISIÓN
              <Image
                src="/images/estrella_mini_stardust.jpg"
                alt="Star"
                width={12}
                height={12}
                className="sm:w-3.5 sm:h-3.5 object-contain"
              />
            </h3>
            <div className="space-y-2">
              <p className="text-white/90 text-xs leading-relaxed max-w-xs mx-auto font-montserrat">
                Aspiramos a ser una marca de referencia global en el bienestar holístico, llevando nuestros adaptógenos
                y fórmulas inteligentes a todas las personas que buscan equilibrio, energía y conexión con su propia
                esencia.
              </p>
              <p className="text-white/90 text-xs leading-relaxed max-w-xs mx-auto font-montserrat">
                En Stardust, creemos en un futuro donde la salud integral y lo natural se unan para elevar la
                experiencia humana.
              </p>
            </div>
          </div>

          {/* Logo Center */}
          <div className="flex flex-col items-center justify-center order-first md:order-none">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
              <Image
                src="/images/isotipo_stardust.png"
                alt="STARDUST_ISO"
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                priority
              />
            </div>
          </div>

          {/* Mission */}
          <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
            <div className="p-3 rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm">
              <Telescope className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-condor italic">
              <Image
                src="/images/estrella_mini_stardust.png"
                alt="Star"
                width={12}
                height={12}
                className="sm:w-3.5 sm:h-3.5 object-contain"
              />
              MISIÓN
              <Image
                src="/images/estrella_mini_stardust.png"
                alt="Star"
                width={12}
                height={12}
                className="sm:w-3.5 sm:h-3.5 object-contain"
              />
            </h3>
            <div className="space-y-2">
              <p className="text-white/90 text-xs leading-relaxed max-w-xs mx-auto font-montserrat">
                En Stardust, nuestra misión es crear fórmulas de alta calidad que integren precisión científica,
                tecnología de vanguardia y el poder de la naturaleza. Nos especializamos en el desarrollo de productos
                basados en adaptógenos y activos naturales, diseñados para generar un impacto positivo y real en el
                bienestar integral de nuestros consumidores.
              </p>
              <p className="text-white/90 text-xs leading-relaxed max-w-xs mx-auto font-montserrat">
                Inspirados por lo cósmico, buscamos abrir un universo de sensaciones, equilibrio y vitalidad, elevando
                la experiencia de quienes confían en nosotros. Nuestra esencia se fundamenta en la pureza, la innovación
                y una conexión auténtica con el cuerpo y la mente.
              </p>
            </div>
          </div>
        </div>

        {/* Dots Navigation 
        <div className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-12">
          {[...Array(11)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${i === 5 ? "w-2 h-2 sm:w-3 sm:h-3 bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>*/}
      </div>
    </section>
  )
}
