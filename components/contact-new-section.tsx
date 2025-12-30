"use client"

import Image from "next/image"
import { Mail, Phone, Instagram, Facebook, Star, TrendingUp, Beaker, Package, Pill } from "lucide-react"
import { FaYoutube, FaClipboardList } from "react-icons/fa"

export function ContactNewSection() {
  return (
    <div className="w-full">
      <section className="relative w-full bg-white py-16 md:py-20">
        {/* Lotus watermark */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 opacity-5">
          <Image src="/logo.svg" alt="Lotus watermark" fill className="object-contain" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            {/* Left side - CONTACTANOS button */}
            <div className="w-full md:w-auto">
              <div className="inline-block bg-black text-white px-12 py-4 rounded-full">
                <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider">CONTACTANOS</h2>
              </div>
            </div>

            {/* Right side - Contact information in columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 w-full md:w-auto">
              {/* Column 1 */}
              <div className="flex flex-col space-y-6">
                <div className="flex items-center gap-4">
                  <Facebook className="w-8 h-8 flex-shrink-0" />
                  <span className="text-lg font-medium">@EzenzMX</span>
                </div>
                <div className="flex items-center gap-4">
                  <Instagram className="w-8 h-8 flex-shrink-0" />
                  <span className="text-lg font-medium">@ezenz_official</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-8 h-8 flex-shrink-0" />
                  <span className="text-lg font-medium">442-145-7866</span>
                </div>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col space-y-6">
                <div className="flex items-center gap-4">
                  <FaYoutube className="w-8 h-8 flex-shrink-0" />
                  <span className="text-lg font-medium">Ezenz</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-8 h-8 flex-shrink-0" />
                  <span className="text-lg font-medium">ezenzcorp@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full bg-black py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left side - Text content */}
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-8 tracking-wide">
                CONOCE MAS DE NOSOTROS
              </h2>
              <div className="space-y-6 text-base md:text-lg leading-relaxed">
                <p>
                  En <span className="font-bold">E-ZENZ</span> contamos con una infraestructura solida y en constante
                  expansion, cuidadosamente distribuida para cubrir todas las etapas clave de formulacion, produccion,
                  control y operacion.
                </p>
                <p>
                  Nuestro espacio actual combina laboratorios, areas productivas especializadas, almacenamiento y
                  oficinas administrativas, distribuidos estrategicamente para garantizar eficiencia, trazabilidad e
                  inocuidad en todos nuestros procesos.
                </p>
              </div>
            </div>

            {/* Right side - Feature buttons grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex items-center gap-4 hover:bg-white/20 transition-colors">
                <div className="bg-white rounded-full p-3 flex-shrink-0">
                  <Star className="w-6 h-6 text-black" />
                </div>
                <span className="text-white font-bold text-sm uppercase tracking-wide">VENTAJAS COMPETITIVAS</span>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex items-center gap-4 hover:bg-white/20 transition-colors">
                <div className="bg-white rounded-full p-3 flex-shrink-0">
                  <FaClipboardList className="w-6 h-6 text-black" />
                </div>
                <span className="text-white font-bold text-sm uppercase tracking-wide">
                  ADMINISTRATIVOS Y OPERACIONES
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex items-center gap-4 hover:bg-white/20 transition-colors">
                <div className="bg-white rounded-full p-3 flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-black" />
                </div>
                <span className="text-white font-bold text-sm uppercase tracking-wide">CAPACIDAD INSTALADA</span>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex items-center gap-4 hover:bg-white/20 transition-colors">
                <div className="bg-white rounded-full p-3 flex-shrink-0">
                  <Package className="w-6 h-6 text-black" />
                </div>
                <span className="text-white font-bold text-sm uppercase tracking-wide">ALMACENES Y LOGÍSTICA</span>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex items-center gap-4 hover:bg-white/20 transition-colors">
                <div className="bg-white rounded-full p-3 flex-shrink-0">
                  <Beaker className="w-6 h-6 text-black" />
                </div>
                <span className="text-white font-bold text-sm uppercase tracking-wide">LABORATORIO PRINCIPAL</span>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex items-center gap-4 hover:bg-white/20 transition-colors">
                <div className="bg-white rounded-full p-3 flex-shrink-0">
                  <Pill className="w-6 h-6 text-black" />
                </div>
                <span className="text-white font-bold text-sm uppercase tracking-wide">BOTICA</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
