import { db } from "@/lib/database"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCcw } from "lucide-react"

export const metadata = {
  title: "Políticas de Devolución | STARDUST",
  description: "Políticas de devolución y reembolso de STARDUST",
}

export default async function PoliticasDevolucionPage() {
  const content = await db.getEditableContent("return_policy")

  const returnContent =
    content?.content ||
    `
    <div class="space-y-8">
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">POLÍTICAS DE DEVOLUCIÓN Y REEMBOLSO</h2>
        <p class="text-white/80">
          En STARDUST queremos que estés completamente satisfecho con tu compra. Si por alguna razón no lo estás, 
          te ofrecemos opciones de devolución y reembolso bajo las siguientes condiciones.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">1. Plazo para devoluciones</h3>
        <p class="text-white/80">
          Tienes <strong class="text-white">30 días naturales</strong> a partir de la fecha de recepción del producto 
          para solicitar una devolución o cambio, siempre que cumpla con las condiciones establecidas.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">2. Condiciones del producto</h3>
        <p class="text-white/80 mb-2">Para que una devolución sea aceptada, el producto debe:</p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>Estar en su empaque original sin abrir o dañar</li>
          <li>Incluir todos los accesorios, manuales y etiquetas originales</li>
          <li>No haber sido usado, alterado o dañado</li>
          <li>Mantener los sellos de seguridad intactos (si aplica)</li>
          <li>Conservar el comprobante de compra original</li>
        </ul>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">3. Productos no elegibles para devolución</h3>
        <p class="text-white/80 mb-2">No se aceptan devoluciones de:</p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>Productos personalizados o hechos a medida</li>
          <li>Productos de higiene personal una vez abiertos</li>
          <li>Productos perecederos o de consumo inmediato</li>
          <li>Productos en liquidación o promoción especial (salvo defecto de fábrica)</li>
          <li>Software, descargas digitales o códigos canjeados</li>
        </ul>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">4. Proceso de devolución</h3>
        <ol class="list-decimal list-inside space-y-2 text-white/80 ml-4">
          <li>Contacta a nuestro servicio al cliente a info@stardustharmony.com con tu número de pedido y motivo de devolución</li>
          <li>Recibirás un correo con las instrucciones y el número de autorización de devolución (RMA)</li>
          <li>Empaca el producto de forma segura incluyendo el número RMA visible</li>
          <li>Envía el paquete a la dirección que te indicaremos</li>
          <li>Una vez recibido e inspeccionado, procesaremos tu reembolso o cambio</li>
        </ol>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">5. Costos de envío de devolución</h3>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li><strong class="text-white">Producto defectuoso o error en el envío:</strong> STARDUST cubre el costo de devolución</li>
          <li><strong class="text-white">Cambio de opinión:</strong> El cliente cubre el costo de devolución</li>
          <li><strong class="text-white">Cambio por otra talla o modelo:</strong> El cliente cubre el envío de devolución, STARDUST cubre el envío del nuevo producto</li>
        </ul>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">6. Reembolsos</h3>
        <p class="text-white/80 mb-2">Una vez aprobada tu devolución:</p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>El reembolso se procesará al mismo método de pago original</li>
          <li>Tiempo de reembolso: 5-10 días hábiles (dependiendo de tu institución bancaria)</li>
          <li>Se reembolsará el costo del producto menos los gastos de envío originales (salvo producto defectuoso)</li>
          <li>Recibirás un correo de confirmación cuando el reembolso sea procesado</li>
        </ul>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">7. Cambios</h3>
        <p class="text-white/80">
          Si deseas cambiar un producto por otro de igual o mayor valor, sigue el proceso de devolución y realiza 
          un nuevo pedido con el producto deseado. Si el nuevo producto es de menor valor, se reembolsará la diferencia.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">8. Productos defectuosos o dañados</h3>
        <p class="text-white/80">
          Si recibes un producto defectuoso o dañado, contáctanos inmediatamente. Te solicitaremos fotografías 
          del producto y empaque para procesar tu reclamación de forma prioritaria. En estos casos, cubrimos 
          todos los costos de envío y tienes la opción de reembolso completo o reemplazo inmediato.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">9. Garantías del fabricante</h3>
        <p class="text-white/80">
          Los productos que cuenten con garantía del fabricante mantienen dicha garantía. Para hacer válida 
          una garantía específica, consulta la póliza incluida con tu producto o contáctanos para orientación.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">10. Contacto</h3>
        <p class="text-white/80 mb-2">Para cualquier duda sobre devoluciones:</p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>Email: info@stardustharmony.com</li>
          <li>Teléfono: [Número de contacto]</li>
          <li>Horario: Lunes a Viernes, 9:00 AM - 6:00 PM</li>
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
              <RefreshCcw className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Políticas de Devolución</h1>
          </div>
          <p className="text-white/60 mb-8">Fecha de última actualización: {new Date().toLocaleDateString("es-MX")}</p>

          <div className="prose prose-invert prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: returnContent }} />

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
