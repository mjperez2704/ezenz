"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      toast({
        title: "Email inválido",
        description: "Por favor ingresa un email válido.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const success = db.saveNewsletterSubscription(email)

      if (success) {
        toast({
          title: "¡Suscripción exitosa!",
          description: "Te has suscrito correctamente a nuestro newsletter.",
        })
        setEmail("")
      } else {
        toast({
          title: "Ya estás suscrito",
          description: "Este email ya está registrado en nuestro newsletter.",
          variant: "destructive",
        })
      }

      setIsLoading(false)
    }, 1000)
  }

  return (
    <footer className="bg-black border-t border-[rgb(74,34,86)]/50 text-black bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-black bg-black">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand Section */}
          <div className="space-y-4 sm:space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_header-PqxMWL3rJNKA2cYULzN0OoxB6wn44h.png"
                alt="STARDUST Logo"
                width={180}
                height={54}
                className="sm:w-48 h-auto"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              No es solo una marca: Es una forma de vivir el bienestar, donde lo natural y lo científico se encuentran
              para elevar tu vida.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-white font-bold text-base sm:text-lg uppercase tracking-wide">Navegación</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-white/70 hover:text-[rgb(170,151,196)] transition-colors text-sm">
                Inicio
              </Link>
              <Link
                href="/productos"
                className="block text-white/70 hover:text-[rgb(170,151,196)] transition-colors text-sm font-sans"
              >
                Productos
              </Link>
              <Link
                href="/contacto"
                className="block text-white/70 hover:text-[rgb(170,151,196)] transition-colors text-sm"
              >
                Contacto
              </Link>
              <Link
                href="/cuenta"
                className="block text-white/70 hover:text-[rgb(170,151,196)] transition-colors text-sm"
              >
                Mi Cuenta
              </Link>
              <Link
                href="/politicas-envio"
                className="block text-white/70 hover:text-[rgb(170,151,196)] transition-colors text-sm"
              >
                Políticas de Envío
              </Link>
              <Link
                href="/politicas-devolucion"
                className="block text-white/70 hover:text-[rgb(170,151,196)] transition-colors text-sm"
              >
                Políticas de Devolución
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-white font-bold text-base sm:text-lg uppercase tracking-wide">Contacto</h3>
            <div className="space-y-3">
              <a
                href="tel:+524421457866"
                className="flex items-center gap-3 text-white/70 hover:text-[rgb(170,151,196)] transition-colors text-sm"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+52 442-145-7866</span>
              </a>
              <a
                href="mailto:contacto@stardustmex.com"
                className="flex items-center gap-3 text-white/70 hover:text-[rgb(170,151,196)] transition-colors text-sm break-all"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>{"contacto@ezenz.com"}</span>
              </a>
              <div className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Querétaro, México</span>
              </div>
            </div>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-white font-bold text-base sm:text-lg uppercase tracking-wide">Síguenos</h3>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/stardust"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[rgb(170,151,196)]/20 hover:bg-[rgb(170,151,196)] rounded-full flex items-center justify-center transition-all"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://instagram.com/stardust_oficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[rgb(170,151,196)]/20 hover:bg-[rgb(170,151,196)] rounded-full flex items-center justify-center transition-all"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://youtube.com/stardust"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[rgb(170,151,196)]/20 hover:bg-[rgb(170,151,196)] rounded-full flex items-center justify-center transition-all"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>

            <div className="pt-2 sm:pt-4">
              <h4 className="text-white/80 font-medium text-sm mb-3">Newsletter</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-[rgb(170,151,196)]/30 text-white placeholder:text-white/40 text-sm"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:from-[rgb(201,18,64)] hover:to-[rgb(170,151,196)] flex-shrink-0"
                >
                  {isLoading ? "..." : "→"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[rgb(74,34,86)]/50 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm text-center sm:text-left text-white">
            © {new Date().getFullYear()} EZENZ. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              href="/aviso-privacidad"
              className="text-white/50 hover:text-[rgb(170,151,196)] text-xs sm:text-sm transition-colors"
            >
              Privacidad
            </Link>
            <Link
              href="/terminos-servicio"
              className="text-white/50 hover:text-[rgb(170,151,196)] text-xs sm:text-sm transition-colors"
            >
              Términos
            </Link>
            <Link
              href="/politicas-envio"
              className="text-white/50 hover:text-[rgb(170,151,196)] text-xs sm:text-sm transition-colors"
            >
              Envíos
            </Link>
            <Link
              href="/politicas-devolucion"
              className="text-white/50 hover:text-[rgb(170,151,196)] text-xs sm:text-sm transition-colors"
            >
              Devoluciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
