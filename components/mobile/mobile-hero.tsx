import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function MobileHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center px-4 pt-20 pb-12">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-blue-900/20 to-[rgb(15,15,35)]" />
      
      <div className="relative z-10 text-center space-y-6">
        <h1 className="text-3xl font-bold text-white leading-tight">
          CIENCIA Y ENERGÍA EN PERFECTA ARMONÍA.
        </h1>
        <p className="text-lg text-gray-300 max-w-md mx-auto">
          Stardust no es solo una marca: es una forma de vivir el bienestar, donde lo natural y lo científico se encuentran para elevar tu vida.
        </p>
        
        <div className="flex flex-col items-center gap-4 pt-4">
          <Link href="/productos">
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg"
            >
              Explorar Productos
            </Button>
          </Link>
          
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/logos/descarga_apps.png"
              alt="Descarga la app"
              width={200}
              height={70}
              className="w-44 h-auto"
            />
            <p className="text-sm text-white/90 font-medium">
              ¡Para obtener descuentos exclusivos!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
