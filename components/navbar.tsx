"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Search, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/cart-drawer"
import { SearchDialog } from "@/components/search-dialog"
import { useCart } from "@/lib/cart-context"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { cartCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black backdrop-blur-lg border-b border-black/50 shadow-lg shadow-[rgb(170,151,196)]/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-black">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-32 sm:w-36 h-8 group-hover:scale-105 transition-transform duration-300">
                <Image src="/images/design-mode/logo_header.png" alt="EZENZ" fill className="object-contain" priority />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-white/90 hover:text-[rgb(170,151,196)] transition-colors font-medium text-sm uppercase tracking-wide"
              >
                Inicio
              </Link>
              <Link
                href="/productos"
                className="text-white/90 hover:text-[rgb(170,151,196)] transition-colors font-medium text-sm uppercase tracking-wide"
              >
                Productos
              </Link>
              <Link
                href="/contacto"
                className="text-white/90 hover:text-[rgb(170,151,196)] transition-colors font-medium text-sm uppercase tracking-wide"
              >
                Contacto
              </Link>
              <Link
                href="/cuenta"
                className="text-white/90 hover:text-[rgb(170,151,196)] transition-colors font-medium text-sm uppercase tracking-wide"
              >
                Mi Cuenta
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-[rgb(170,151,196)] hover:bg-white/10 transition-all rounded-full"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-[rgb(170,151,196)] hover:bg-white/10 transition-all rounded-full relative"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg shadow-[rgb(170,151,196)]/50 animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Button>
              <Link href="/cuenta">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-[rgb(170,151,196)] hover:bg-white/10 transition-all rounded-full hidden sm:flex"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:text-[rgb(170,151,196)] hover:bg-white/10 transition-all rounded-full"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[rgb(15,15,35)]/98 backdrop-blur-lg border-t border-[rgb(74,34,86)]/50">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <Link
                href="/"
                className="block px-4 py-3 text-white/90 hover:text-[rgb(170,151,196)] hover:bg-white/5 rounded-lg transition-all font-medium uppercase tracking-wide"
              >
                Inicio
              </Link>
              <Link
                href="/productos"
                className="block px-4 py-3 text-white/90 hover:text-[rgb(170,151,196)] hover:bg-white/5 rounded-lg transition-all font-medium uppercase tracking-wide"
              >
                Productos
              </Link>
              <Link
                href="/contacto"
                className="block px-4 py-3 text-white/90 hover:text-[rgb(170,151,196)] hover:bg-white/5 rounded-lg transition-all font-medium uppercase tracking-wide"
              >
                Contacto
              </Link>
              <Link
                href="/cuenta"
                className="block px-4 py-3 text-white/90 hover:text-[rgb(170,151,196)] hover:bg-white/5 rounded-lg transition-all font-medium uppercase tracking-wide"
              >
                Mi Cuenta
              </Link>
            </div>
          </div>
        )}
      </nav>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
