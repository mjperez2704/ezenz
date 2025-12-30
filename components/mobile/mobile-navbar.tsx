"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ShoppingCart, User } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function MobileNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgb(15,15,35)]/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/mobile" className="flex items-center gap-2">
            <div className="relative w-28 h-8">
              <Image
                src="/images/design-mode/logo.png"
                alt="STARDUST"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            <Link href="/mobile/carrito">
              <Button variant="ghost" size="icon" className="text-white">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/mobile/cuenta">
              <Button variant="ghost" size="icon" className="text-white">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[rgb(15,15,35)] pt-16">
          <div className="flex flex-col gap-4 p-6">
            <Link 
              href="/mobile" 
              className="text-xl text-white py-3 border-b border-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              href="/mobile/productos" 
              className="text-xl text-white py-3 border-b border-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Productos
            </Link>
            <Link 
              href="/mobile/categorias" 
              className="text-xl text-white py-3 border-b border-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Categorías
            </Link>
            <Link 
              href="/mobile/contacto" 
              className="text-xl text-white py-3 border-b border-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
            <Link 
              href="/mobile/cuenta" 
              className="text-xl text-white py-3"
              onClick={() => setIsMenuOpen(false)}
            >
              Mi Cuenta
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
