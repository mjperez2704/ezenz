import { db } from "@/lib/database"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Truck } from "lucide-react"

export const metadata = {
  title: "Políticas de Envío | STARDUST",
  description: "Políticas y condiciones de envío de STARDUST",
}

export default async function PoliticasEnvioPage() {
  const content = await db.getEditableContent("shipping_policy")

  const shippingContent =
    content?.content ||
    `
    <div class="space-y-8">
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">POLÍTICAS DE ENVÍO</h2>
        <p class="text-white/80">
          En STARDUST nos comprometemos a entregar tus productos de manera segura y oportuna. A continuación 
          te presentamos nuestra política de envíos.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">1. Áreas de cobertura</h3>
        <p class="text-white/80">
          Realizamos envíos a todo México. Los tiempos y costos de envío varían dependiendo de tu ubicación 
          y del producto seleccionado.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">2. Tiempos de entrega</h3>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li><strong class="text-white">Envío estándar:</strong> 5-7 días hábiles</li>
          <li><strong class="text-white">Envío express:</strong> 2-3 días hábiles</li>
          <li><strong class="text-white">Zona metropolitana:</strong> 1-2 días hábiles</li>
        </ul>
        <p class="text-white/80 mt-3">
          Los tiempos de entrega son estimados y pueden variar por factores externos como condiciones climáticas, 
          disponibilidad de la paquetería o días festivos.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">3. Costos de envío</h3>
        <p class="text-white/80 mb-2">
          El costo de envío se calcula automáticamente durante el proceso de compra con base en:
        </p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>Destino de envío</li>
          <li>Peso y dimensiones del paquete</li>
          <li>Tipo de servicio seleccionado (estándar o express)</li>
        </ul>
        <p class="text-white/80 mt-3">
          <strong class="text-white">Envío gratis:</strong> Aplicable en compras superiores a $999 MXN en zona metropolitana.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">4. Procesamiento de pedidos</h3>
        <p class="text-white/80">
          Los pedidos se procesan de lunes a viernes de 9:00 AM a 6:00 PM. Los pedidos realizados después 
          de las 2:00 PM o en fin de semana se procesarán el siguiente día hábil.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">5. Rastreo de envíos</h3>
        <p class="text-white/80">
          Una vez que tu pedido sea enviado, recibirás un correo electrónico con el número de guía para 
          rastrear tu paquete en tiempo real a través del sitio web de la paquetería.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">6. Recepción del pedido</h3>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>Es necesario que alguien mayor de 18 años reciba el paquete</li>
          <li>Se debe presentar identificación oficial al momento de la entrega</li>
          <li>Verifica el estado del paquete antes de firmar de recibido</li>
          <li>Si el paquete presenta daños visibles, repórtalo inmediatamente a servicio al cliente</li>
        </ul>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">7. Intentos de entrega</h3>
        <p class="text-white/80">
          La paquetería realizará hasta 3 intentos de entrega. Si no hay nadie para recibir el paquete, 
          se dejará un aviso con las instrucciones para programar una nueva entrega o recoger en sucursal.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">8. Envíos internacionales</h3>
        <p class="text-white/80">
          Por el momento no realizamos envíos fuera de México. Estamos trabajando para expandir nuestro servicio 
          a otros países próximamente.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">9. Problemas con el envío</h3>
        <p class="text-white/80 mb-2">
          Si tu pedido no llega en el tiempo estimado o presenta algún problema, contáctanos:
        </p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>Email: info@stardustharmony.com</li>
          <li>Teléfono: [Número de contacto]</li>
          <li>Horario de atención: Lunes a Viernes, 9:00 AM - 6:00 PM</li>
        </ul>
      </section>
    </div>
  `

  return (
    <div className="min-h-screen bg-gradient-to-b from-[rgb(15,15,35)] to-[rgb(25,15,45)] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-white hover:text-[rgb(170,151,196)] hover:bg-white/5">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>
        </Link>

        <div className="bg-white/5 backdrop-blur-xl border border-[rgb(170,151,196)]/30 rounded-2xl p-8 sm:p-12 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] rounded-xl">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Políticas de Envío</h1>
          </div>
          <p className="text-white/60 mb-8">Fecha de última actualización: {new Date().toLocaleDateString("es-MX")}</p>

          <div
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: shippingContent }}
          />

          <div className="mt-12 pt-8 border-t border-white/10">
            <Link href="/">
              <Button className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:from-[rgb(190,171,216)] hover:to-[rgb(221,38,84)] text-white">
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
