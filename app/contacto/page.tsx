"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "¡Mensaje enviado!",
      description: "Nos pondremos en contacto contigo pronto.",
    })

    setIsSubmitting(false)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <main className="min-h-screen bg-[rgb(15,15,35)]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[rgb(15,15,35)] via-[rgb(20,20,40)] to-transparent">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[rgb(170,151,196)] rounded-full blur-[120px] opacity-10" />
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[rgb(201,18,64)] rounded-full blur-[120px] opacity-10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance">
            Ponte en{" "}
            <span className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] bg-clip-text text-transparent">
              Contacto
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto text-pretty leading-relaxed">
            Estamos aquí para responder tus preguntas y ayudarte a encontrar los productos perfectos para tu bienestar.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information Cards */}
            <div className="space-y-6">
              <Card className="bg-white/5 border-[rgb(74,34,86)] hover:border-[rgb(170,151,196)] transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Email</h3>
                      <p className="text-white/60 text-sm mb-2">Envíanos un correo electrónico</p>
                      <a
                        href="mailto:contacto@stardustmex.com"
                        className="text-[rgb(170,151,196)] hover:text-[rgb(201,18,64)] transition-colors"
                      >
                        contacto@stardustmex.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-[rgb(74,34,86)] hover:border-[rgb(170,151,196)] transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Teléfono</h3>
                      <p className="text-white/60 text-sm mb-2">Lun - Vie, 9am - 6pm</p>
                      <a
                        href="tel:+524421457866"
                        className="text-[rgb(170,151,196)] hover:text-[rgb(201,18,64)] transition-colors"
                      >
                        +52 442-145-7866
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-[rgb(74,34,86)] hover:border-[rgb(170,151,196)] transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Oficina</h3>
                      <p className="text-white/60 text-sm mb-2">Visítanos en nuestra ubicación</p>
                      <p className="text-[rgb(170,151,196)]">Querétaro, México</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white/5 border-[rgb(74,34,86)]">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Envíanos un Mensaje</h2>
                  <p className="text-white/60 mb-8">
                    Completa el formulario y nos pondremos en contacto contigo lo antes posible.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white/80">
                          Nombre Completo
                        </Label>
                        <Input
                          id="name"
                          required
                          className="bg-white/5 border-[rgb(74,34,86)] text-white placeholder:text-white/40 focus:border-[rgb(170,151,196)]"
                          placeholder="Juan Pérez"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white/80">
                          Correo Electrónico
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          className="bg-white/5 border-[rgb(74,34,86)] text-white placeholder:text-white/40 focus:border-[rgb(170,151,196)]"
                          placeholder="juan@ejemplo.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-white/80">
                        Asunto
                      </Label>
                      <Input
                        id="subject"
                        required
                        className="bg-white/5 border-[rgb(74,34,86)] text-white placeholder:text-white/40 focus:border-[rgb(170,151,196)]"
                        placeholder="¿En qué podemos ayudarte?"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-white/80">
                        Mensaje
                      </Label>
                      <Textarea
                        id="message"
                        required
                        className="bg-white/5 border-[rgb(74,34,86)] text-white placeholder:text-white/40 focus:border-[rgb(170,151,196)] min-h-[200px]"
                        placeholder="Cuéntanos más sobre tu consulta..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:opacity-90 text-white text-lg h-14"
                    >
                      {isSubmitting ? (
                        <>Enviando...</>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Enviar Mensaje
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-[rgb(15,15,35)]">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[rgb(170,151,196)] rounded-full blur-[150px] opacity-10" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Preguntas Frecuentes</h2>
          <p className="text-white/60 text-lg mb-12">
            Encuentra respuestas rápidas a las preguntas más comunes sobre nuestros productos y servicios.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {[
              {
                q: "¿Cuánto tarda el envío?",
                a: "Procesamos todos los pedidos en 1-2 días hábiles. El envío estándar toma 5-7 días hábiles.",
              },
              {
                q: "¿Ofrecen garantía de devolución?",
                a: "Sí, ofrecemos una garantía de devolución de dinero de 30 días en todos nuestros productos.",
              },
              {
                q: "¿Los productos son veganos?",
                a: "La mayoría de nuestros productos son 100% veganos. Verifica la etiqueta de cada producto.",
              },
              {
                q: "¿Necesito receta médica?",
                a: "No, nuestros suplementos son de venta libre y no requieren receta médica.",
              },
            ].map((faq, index) => (
              <Card key={index} className="bg-white/5 border-[rgb(74,34,86)]">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </main>
  )
}
