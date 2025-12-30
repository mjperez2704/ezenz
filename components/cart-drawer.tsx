"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link"
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart()

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="bg-[rgb(15,15,35)] border-[rgb(74,34,86)] w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white text-2xl flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-[rgb(170,151,196)]" />
              Carrito de Compras
              {cartCount > 0 && (
                <span className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] text-white text-sm px-2 py-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </SheetTitle>
            {cart.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
                    clearCart()
                  }
                }}
                className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Vaciar
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex flex-col flex-1 mt-6 overflow-hidden">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-white/40" />
              </div>
              <p className="text-white/60 text-center">Tu carrito está vacío</p>
              <Link href="/productos" onClick={onClose}>
                <Button className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:opacity-90 text-white">
                  Explorar Productos
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/5 border border-[rgb(74,34,86)] rounded-xl p-4 flex gap-4 relative"
                  >
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-2 right-2 text-white/40 hover:text-[rgb(201,18,64)] transition-colors z-10"
                      aria-label="Eliminar producto"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {/* Product Image */}
                    <div className="relative w-20 h-20 rounded-lg bg-gradient-to-br from-[rgb(74,34,86)] to-[rgb(104,43,78)] flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate pr-6">{item.name}</h3>
                      <p className="text-white/50 text-sm">{item.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[rgb(170,151,196)] font-bold">${item.price.toFixed(2)} MXN</span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-white/5 border border-[rgb(74,34,86)] rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-white hover:text-[rgb(170,151,196)] p-1"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-white hover:text-[rgb(170,151,196)] p-1"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <SheetFooter className="space-y-4 border-t border-[rgb(74,34,86)] pt-4">
                <div className="w-full space-y-3">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between text-white/70">
                    <span>Subtotal:</span>
                    <span>${cartTotal.toFixed(2)} MXN</span>
                  </div>
                  <div className="flex items-center justify-between text-white/70">
                    <span>Envío:</span>
                    <span className="text-[rgb(170,151,196)]">Calculado en checkout</span>
                  </div>
                  <div className="h-px bg-[rgb(74,34,86)]" />
                  <div className="flex items-center justify-between text-white text-xl font-bold">
                    <span>Total:</span>
                    <span className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] bg-clip-text text-transparent">
                      ${cartTotal.toFixed(2)} MXN
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Link href="/checkout" onClick={onClose} className="block">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:opacity-90 text-white h-14 text-lg"
                    >
                      Proceder al Checkout
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={onClose}
                    className="w-full border-[rgb(74,34,86)] bg-white/5 text-white hover:bg-white/10"
                  >
                    Continuar Comprando
                  </Button>
                </div>
              </SheetFooter>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
