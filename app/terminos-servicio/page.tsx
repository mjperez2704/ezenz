import { db } from "@/lib/database"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Términos y Condiciones del Servicio | STARDUST",
  description: "Términos y condiciones de uso y compra en línea de STARDUST",
}

export default async function TerminosServicioPage() {
  const content = await db.getEditableContent("terms_of_service")

  const termsContent =
    content?.content ||
    `
    <div class="space-y-8">
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">TÉRMINOS Y CONDICIONES DE USO Y COMPRA EN LÍNEA</h2>
        <p class="text-white/80 mb-4">
          El presente documento establece los términos y condiciones que regulan el acceso y uso del sitio web 
          de STARDUST y la compra de productos ofrecidos por STARDUST, con domicilio en Puebla, México.
        </p>
        <p class="text-white/80">
          Al acceder, navegar o utilizar este sitio, usted (en adelante "EL USUARIO") acepta quedar vinculado 
          por estos Términos y Condiciones.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">1. Objeto del sitio</h3>
        <p class="text-white/80 mb-2">El sitio permite a EL USUARIO:</p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>Consultar información de productos</li>
          <li>Realizar pedidos y contratar la compra de productos en línea</li>
          <li>Realizar pagos a través de distintos medios habilitados</li>
        </ul>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">2. Aceptación de los términos</h3>
        <p class="text-white/80">
          El uso del sitio implica la aceptación plena y sin reservas de estos Términos y Condiciones. 
          Si EL USUARIO no está de acuerdo, deberá abstenerse de utilizar el sitio y/o realizar compras.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">3. Registro de usuario y confidencialidad de la cuenta</h3>
        <p class="text-white/80 mb-2">Para realizar compras, puede ser necesario crear una cuenta:</p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>EL USUARIO se compromete a proporcionar información veraz, completa y actualizada</li>
          <li>EL USUARIO es responsable de mantener la confidencialidad de su usuario y contraseña</li>
          <li>Cualquier operación realizada mediante su cuenta se entenderá efectuada por EL USUARIO</li>
          <li>STARDUST podrá suspender o cancelar cuentas que hagan uso indebido del sitio, incurran en fraude o proporcionen datos falsos</li>
        </ul>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">4. Información de productos, precios y disponibilidad</h3>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>Los precios de los productos se muestran en MXN, e incluyen o no impuestos según se indique</li>
          <li>STARDUST se reserva el derecho de modificar precios, promociones y disponibilidad en cualquier momento, sin afectar órdenes ya confirmadas</li>
          <li>Las imágenes de los productos son ilustrativas y pueden presentar variaciones respecto al producto final, sin afectar sus características esenciales</li>
        </ul>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">5. Proceso de compra</h3>
        <ol class="list-decimal list-inside space-y-2 text-white/80 ml-4">
          <li>EL USUARIO selecciona los productos y los agrega al carrito</li>
          <li>EL USUARIO proporciona datos de envío, facturación y elige el método de pago</li>
          <li>Antes de finalizar la compra, se mostrará un resumen con el detalle del pedido, impuestos, gastos de envío y total a pagar</li>
          <li>La confirmación del pedido estará sujeta a la validación del pago y disponibilidad del producto</li>
          <li>STARDUST enviará por correo electrónico el resumen de la compra y el número de pedido</li>
        </ol>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">6. Formas de pago</h3>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>Se aceptarán las formas de pago indicadas en el sitio (tarjeta de crédito o débito, plataformas de pago en línea, etc.)</li>
          <li>Los pagos se procesan a través de proveedores externos seguros</li>
          <li>STARDUST no almacena los datos completos de tarjetas bancarias</li>
        </ul>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">7. Envíos, entrega y riesgo</h3>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>Los productos serán enviados al domicilio indicado por EL USUARIO</li>
          <li>Se informará un plazo estimado de entrega; sin embargo, pueden existir variaciones por causas ajenas a STARDUST (logística, clima, eventos de fuerza mayor, etc.)</li>
          <li>El riesgo de pérdida o daño se transmite a EL USUARIO al momento de la entrega física del producto</li>
          <li>Se observarán las disposiciones de la Ley Federal de Protección al Consumidor en materia de comercio electrónico</li>
        </ul>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">8. Devoluciones, cancelaciones y reembolsos</h3>
        <p class="text-white/80 mb-2">STARDUST establece su política de devoluciones y cancelaciones, que indica:</p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>Plazos para solicitar devoluciones o cambios</li>
          <li>Condiciones del producto (empaque, uso, sellos de seguridad, etc.)</li>
          <li>Supuestos en que no procede la devolución (productos personalizados, abiertos, de consumo inmediato, etc.)</li>
        </ul>
        <p class="text-white/80 mt-3">EL USUARIO deberá revisar y aceptar dicha política antes de completar la compra.</p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">9. Garantías</h3>
        <p class="text-white/80">
          Los productos contarán con las garantías que establezca el fabricante o, en su caso, las mínimas 
          previstas por la legislación mexicana aplicable. Para hacer válida una garantía, EL USUARIO deberá 
          seguir el procedimiento indicado en el sitio o en la póliza de garantía correspondiente.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">10. Propiedad intelectual</h3>
        <p class="text-white/80 mb-2">
          Todo el contenido del sitio (marcas, logos, textos, imágenes, diseños, código fuente, etc.) es 
          propiedad de STARDUST o se utiliza con autorización de sus titulares.
        </p>
        <p class="text-white/80 mb-2">Queda prohibido:</p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>Reproducir, distribuir o modificar el contenido sin autorización previa y por escrito</li>
          <li>Utilizar cualquier elemento del sitio con fines distintos a la consulta y compra legítima de productos</li>
        </ul>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">11. Protección de datos personales</h3>
        <p class="text-white/80">
          El tratamiento de los datos personales de EL USUARIO se regirá por nuestro Aviso de Privacidad. 
          Al usar el sitio, EL USUARIO reconoce haberlo leído y aceptado.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">12. Responsabilidad</h3>
        <p class="text-white/80 mb-2">STARDUST no será responsable por:</p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>Interrupciones o fallos en el servicio de internet, proveedores de hosting, pasarelas de pago o terceros ajenos</li>
          <li>Daños indirectos, incidentales o consecuenciales derivados del uso del sitio</li>
        </ul>
        <p class="text-white/80 mt-3">
          Sin perjuicio de lo anterior, STARDUST cumplirá con las obligaciones mínimas de protección al 
          consumidor que establezca la legislación vigente en México.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">13. Modificaciones a los Términos y Condiciones</h3>
        <p class="text-white/80">
          STARDUST podrá actualizar estos Términos y Condiciones en cualquier momento. Las modificaciones 
          entrarán en vigor a partir de su publicación en el sitio, indicando la fecha de última actualización. 
          El uso continuado del sitio después de dichas modificaciones implica la aceptación de las mismas.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">14. Legislación aplicable y jurisdicción</h3>
        <p class="text-white/80">
          Estos Términos y Condiciones se rigen por las leyes federales de los Estados Unidos Mexicanos. 
          Para la interpretación y cumplimiento de los mismos, las partes se someten a la jurisdicción de 
          los tribunales competentes de Puebla, México, renunciando a cualquier otro fuero que pudiera 
          corresponderles por razón de su domicilio presente o futuro.
        </p>
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
          <h1 className="text-4xl font-bold text-white mb-4">Términos y Condiciones de Uso y Compra en Línea</h1>
          <p className="text-white/60 mb-8">Fecha de última actualización: {new Date().toLocaleDateString("es-MX")}</p>

          <div className="prose prose-invert prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: termsContent }} />

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
