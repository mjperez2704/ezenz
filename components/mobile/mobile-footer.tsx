import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter } from 'lucide-react'

export function MobileFooter() {
  return (
    <footer className="bg-[rgb(10,10,25)] border-t border-white/10 py-8 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center">
          <div className="relative w-32 h-8 mx-auto mb-2">
            <Image
              src="/images/design-mode/logo.png"
              alt="STARDUST"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-gray-400 text-sm">
            Suplementos nootrópicos de última generación
          </p>
        </div>

        {/* Enlaces */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-2">
            <h4 className="text-white font-semibold">Tienda</h4>
            <Link href="/productos" className="block text-gray-400 text-sm hover:text-white transition-colors">
              Productos
            </Link>
            <Link href="/productos" className="block text-gray-400 text-sm hover:text-white transition-colors">
              Categorías
            </Link>
          </div>
          <div className="space-y-2">
            <h4 className="text-white font-semibold">Ayuda</h4>
            <Link href="/contacto" className="block text-gray-400 text-sm hover:text-white transition-colors">
              Contacto
            </Link>
            <Link href="/envios-devoluciones" className="block text-gray-400 text-sm hover:text-white transition-colors">
              Envíos
            </Link>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="flex justify-center gap-4">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <Twitter className="h-5 w-5" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-xs border-t border-white/10 pt-4">
          © 2025 Stardust. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
