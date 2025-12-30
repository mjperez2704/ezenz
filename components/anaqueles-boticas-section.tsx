import Image from "next/image"

export function AnaquelesBóticasSection() {
  return (
    <section className="relative w-full min-h-screen">
      {/* Shared Background Image for both sections */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/fondos/anaqueles_botica.jpg"
          alt="Fondo Anaqueles y Botica"
          fill
          className="object-cover"
          quality={100}
          priority
        />
        {/* Dark overlay to ensure text readability on image */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex flex-col w-full">
        {/* ANAQUELES Section (Top Half - Right Aligned) */}
        <div className="w-full min-h-[50vh] flex items-center justify-end p-8 lg:p-16 lg:pr-32">
          <div className="max-w-2xl w-full">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-8 tracking-[0.2em] uppercase text-center lg:text-right">
              ANAQUELES
            </h2>
            <p className="text-white/90 text-lg mb-12 font-light text-center lg:text-right">
              Contamos con bodegas principales destinadas a:
            </p>

            {/* Timeline Horizontal */}
            <div className="relative mt-8">
              {/* Line */}
              <div className="absolute top-[7px] left-0 w-full h-0.5 bg-white/30"></div>

              <div className="relative flex justify-between">
                {/* Point 1 */}
                <div className="flex flex-col items-center group w-1/3">
                  <div className="w-4 h-4 rounded-full bg-white z-10 mb-4 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                  <p className="text-white text-sm md:text-base font-bold text-center">Materias primas</p>
                </div>
                {/* Point 2 */}
                <div className="flex flex-col items-center group w-1/3">
                  <div className="w-4 h-4 rounded-full bg-white z-10 mb-4 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                  <p className="text-white text-sm md:text-base font-bold text-center">Material de empaque</p>
                </div>
                {/* Point 3 */}
                <div className="flex flex-col items-center group w-1/3">
                  <div className="w-4 h-4 rounded-full bg-white z-10 mb-4 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                  <p className="text-white text-sm md:text-base font-bold text-center">
                    Insumos y activos
                    <br />
                    líquidos o en polvo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BÓTICA Section (Bottom Half - Left Aligned) */}
        <div className="w-full min-h-[50vh] flex items-center justify-start p-8 lg:p-16 lg:pl-32">
          <div className="max-w-2xl w-full">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-8 tracking-[0.2em] uppercase text-center lg:text-left">
              BÓTICA
            </h2>
            <p className="text-white/90 text-lg mb-12 leading-relaxed text-center lg:text-left">
              Nuevo proyecto con modelo escalable y visión a futuro, diseñado para evolucionar hacia un formato de
              franquicia.
            </p>

            {/* Timeline Horizontal */}
            <div className="relative mt-8">
              {/* Line */}
              <div className="absolute top-[7px] left-0 w-full h-0.5 bg-white/30"></div>

              <div className="relative flex justify-between gap-4">
                {/* Point 1 */}
                <div className="flex flex-col items-center w-1/3">
                  <div className="w-4 h-4 rounded-full bg-white z-10 mb-4 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                  <p className="text-white text-sm font-bold text-center">Call Center</p>
                </div>
                {/* Point 2 */}
                <div className="flex flex-col items-center w-1/3">
                  <div className="w-4 h-4 rounded-full bg-white z-10 mb-4 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                  <p className="text-white text-sm font-bold text-center">
                    Showroom de
                    <br />
                    material de empaque
                    <br />
                    primario y secundario.
                  </p>
                </div>
                {/* Point 3 */}
                <div className="flex flex-col items-center w-1/3">
                  <div className="w-4 h-4 rounded-full bg-white z-10 mb-4 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                  <p className="text-white text-sm font-bold text-center">
                    Catálogo digital de materias
                    <br />
                    primas y productos terminados
                  </p>
                </div>
              </div>
            </div>
            
            {/* Decoration Lotus (Optional, kept subtle) */}
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] opacity-10 pointer-events-none">
                <Image src="/images/design-mode/loto_transparente_ok.png" alt="" fill className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
