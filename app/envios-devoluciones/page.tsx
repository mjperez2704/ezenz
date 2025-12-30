import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Truck, Package, RefreshCw, Shield, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EnviosDevolucionesPage() {
  return (
    <main className="min-h-screen bg-[rgb(15,15,35)]">
      <Navbar />

      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Envíos y Devoluciones</h1>
            <p className="text-white/60 text-lg">
              Tu satisfacción es nuestra prioridad. Conoce nuestras políticas de envío y devoluciones.
            </p>
          </div>

          {/* Shipping Section */}
          <div className="space-y-6 mb-12">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Truck className="h-8 w-8 text-[rgb(170,151,196)]" />
              Política de Envíos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-[rgb(74,34,86)]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[rgb(170,151,196)]" />
                    Tiempos de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white/70 space-y-2 text-sm">
                  <p>
                    <strong className="text-white">Nacional:</strong> 3-5 días hábiles
                  </p>
                  <p>
                    <strong className="text-white">Ciudad de México y área metropolitana:</strong> 1-2 días hábiles
                  </p>
                  <p>
                    <strong className="text-white">Zonas remotas:</strong> 5-7 días hábiles
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-[rgb(74,34,86)]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-[rgb(170,151,196)]" />
                    Costos de Envío
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white/70 space-y-2 text-sm">
                  <p>
                    <strong className="text-white">Envío estándar:</strong> $99 MXN
                  </p>
                  <p>
                    <strong className="text-white">Envío gratis:</strong> En compras mayores a $899 MXN
                  </p>
                  <p>
                    <strong className="text-white">Envío express:</strong> $199 MXN (1-2 días)
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-[rgb(74,34,86)]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[rgb(170,151,196)]" />
                    Cobertura
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white/70 space-y-2 text-sm">
                  <p>Realizamos envíos a toda la República Mexicana a través de paqueterías certificadas.</p>
                  <p>
                    Los productos se envían con <strong className="text-white">seguimiento en tiempo real</strong> para
                    que puedas monitorear tu pedido.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-[rgb(74,34,86)]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[rgb(170,151,196)]" />
                    Seguridad
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white/70 space-y-2 text-sm">
                  <p>
                    Todos nuestros envíos incluyen <strong className="text-white">seguro de paquetería</strong>.
                  </p>
                  <p>
                    Embalaje especial que protege la integridad de los productos durante el traslado, manteniendo la
                    temperatura adecuada.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Returns Section */}
          <div className="space-y-6 mb-12">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <RefreshCw className="h-8 w-8 text-[rgb(170,151,196)]" />
              Política de Devoluciones
            </h2>

            <Card className="bg-white/5 border-[rgb(74,34,86)]">
              <CardContent className="text-white/70 space-y-4 text-sm pt-6">
                <div>
                  <h3 className="text-white font-semibold mb-2 text-base">Garantía de Satisfacción</h3>
                  <p>
                    En STARDUST queremos que estés 100% satisfecho con tu compra. Si por alguna razón no estás
                    completamente satisfecho, aceptamos devoluciones dentro de los primeros{" "}
                    <strong className="text-white">30 días</strong> posteriores a la recepción de tu pedido.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2 text-base">Condiciones para Devolución</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>El producto debe estar en su empaque original, sin abrir y sin usar</li>
                    <li>Debe incluir todos los accesorios y documentación original</li>
                    <li>El sello de seguridad debe estar intacto</li>
                    <li>Se requiere el comprobante de compra o número de pedido</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2 text-base">Proceso de Devolución</h3>
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>Contacta nuestro equipo de soporte en stardustcorp@gmail.com o al +52 442-145-7866</li>
                    <li>Proporciona tu número de pedido y razón de la devolución</li>
                    <li>Recibirás una etiqueta de devolución prepagada por correo electrónico</li>
                    <li>Empaca el producto de forma segura y pega la etiqueta</li>
                    <li>
                      Una vez recibido y verificado, procesaremos tu reembolso en 5-10 días hábiles al método de pago
                      original
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2 text-base">Excepciones</h3>
                  <p>No se aceptan devoluciones en los siguientes casos:</p>
                  <ul className="space-y-2 list-disc list-inside mt-2">
                    <li>Productos abiertos o con sellos de seguridad rotos (por razones de salud e higiene)</li>
                    <li>Productos comprados en promociones especiales o liquidación (salvo defecto de fábrica)</li>
                    <li>Después de 30 días desde la recepción del pedido</li>
                  </ul>
                </div>

                <div className="bg-[rgb(170,151,196)]/10 border border-[rgb(170,151,196)]/30 rounded-lg p-4 mt-6">
                  <h3 className="text-[rgb(170,151,196)] font-semibold mb-2 text-base">Garantía de Calidad</h3>
                  <p className="text-white/80">
                    Si recibes un producto defectuoso o dañado, contáctanos de inmediato. Cubriremos el costo del envío
                    de devolución y te enviaremos un reemplazo sin cargo adicional.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact CTA */}
          <Card className="bg-gradient-to-r from-[rgb(170,151,196)]/20 to-[rgb(201,18,64)]/20 border-[rgb(170,151,196)]">
            <CardContent className="text-center py-8">
              <h3 className="text-white text-xl font-bold mb-2">¿Tienes más preguntas?</h3>
              <p className="text-white/70 mb-4">
                Nuestro equipo de atención al cliente está listo para ayudarte con cualquier duda sobre envíos o
                devoluciones.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:stardustcorp@gmail.com"
                  className="text-[rgb(170,151,196)] hover:text-white transition-colors font-semibold"
                >
                  stardustcorp@gmail.com
                </a>
                <span className="text-white/30 hidden sm:inline">|</span>
                <a
                  href="tel:+524421457866"
                  className="text-[rgb(170,151,196)] hover:text-white transition-colors font-semibold"
                >
                  +52 442-145-7866
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
