"use client"

import { Sparkles, Microscope, Leaf, Atom } from "lucide-react"

export function ScienceSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[rgb(15,15,35)] to-[rgb(74,34,86)]/30 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgb(170,151,196)] rounded-full blur-[150px] opacity-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgb(201,18,64)] rounded-full blur-[150px] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight font-condor italic">
            La ciencia detrás del cosmos
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-montserrat">
            Cada fórmula es una obra de ingeniería natural y científica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[rgb(170,151,196)]/20 rounded-xl">
                <Microscope className="w-6 h-6 text-[rgb(170,151,196)]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 font-din">Precisión Científica</h3>
                <p className="text-white/70 leading-relaxed font-montserrat">
                  Desarrollamos fórmulas basadas en investigación sólida y control de calidad impecable.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[rgb(101,177,113)]/20 rounded-xl">
                <Leaf className="w-6 h-6 text-[rgb(101,177,113)]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 font-din">Poder Natural</h3>
                <p className="text-white/70 leading-relaxed font-montserrat">
                  Adaptógenos y activos naturales diseñados para generar un impacto positivo y real.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[rgb(201,18,64)]/20 rounded-xl">
                <Atom className="w-6 h-6 text-[rgb(201,18,64)]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 font-din">Innovación Inteligente</h3>
                <p className="text-white/70 leading-relaxed font-montserrat">
                  Integramos ciencia avanzada y recursos naturales para crear soluciones efectivas y seguras.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[rgb(74,34,86)]/60 to-[rgb(104,43,78)]/60 backdrop-blur-sm border border-[rgb(170,151,196)]/30 p-8 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Molecular Structure Visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <Sparkles className="w-32 h-32 text-[rgb(170,151,196)] animate-glow" />
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-4 h-4 bg-[rgb(170,151,196)] rounded-full animate-pulse"
                        style={{
                          top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 8)}%`,
                          left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 8)}%`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
