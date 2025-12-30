import { db } from "@/lib/database"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Aviso de Privacidad | STARDUST",
  description: "Aviso de privacidad integral de STARDUST",
}

export default async function AvisoPrivacidadPage() {
  const content = await db.getEditableContent("privacy_policy")

  const privacyContent =
    content?.content ||
    `
    <div class="space-y-8">
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">AVISO DE PRIVACIDAD INTEGRAL</h2>
        <p class="text-white/80 mb-4">
          STARDUST, con domicilio en Puebla, México, y correo de contacto info@stardustharmony.com, 
          es responsable del tratamiento de sus datos personales, en términos de la legislación mexicana 
          aplicable en materia de protección de datos personales.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">1. Datos personales que recabamos</h3>
        <p class="text-white/80 mb-2">Podemos recabar, entre otros, los siguientes datos personales:</p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li><strong class="text-white">Datos de identificación:</strong> nombre, apellidos, RFC, CURP (si aplica)</li>
          <li><strong class="text-white">Datos de contacto:</strong> domicilio, correo electrónico, teléfono móvil o fijo</li>
          <li><strong class="text-white">Datos de facturación:</strong> razón social, RFC, domicilio fiscal, datos para CFDI</li>
          <li><strong class="text-white">Datos transaccionales:</strong> historial de compras, productos adquiridos, forma de pago (sin almacenar números completos de tarjeta), referencias de envío</li>
        </ul>
        <p class="text-white/80 mt-3">
          No recabamos de forma intencional datos personales sensibles, salvo que sea estrictamente necesario 
          y con su consentimiento expreso.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">2. Finalidades del tratamiento</h3>
        <p class="text-white/80 mb-2">Sus datos personales serán utilizados para las siguientes <strong class="text-white">finalidades primarias:</strong></p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>Crear y administrar su cuenta de usuario en la plataforma</li>
          <li>Procesar pedidos, pagos, facturación y entregas de productos</li>
          <li>Brindar atención al cliente, seguimiento de pedidos y soporte técnico</li>
          <li>Cumplir obligaciones derivadas de la relación jurídica que se genere</li>
        </ul>
        <p class="text-white/80 mt-4 mb-2">Adicionalmente, podremos utilizarlos para <strong class="text-white">finalidades secundarias:</strong></p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>Envío de publicidad, promociones, newsletters y comunicaciones comerciales</li>
          <li>Realización de encuestas de calidad, estudios de mercado y estadísticas internas</li>
        </ul>
        <p class="text-white/80 mt-3">
          Si no desea que sus datos se utilicen para finalidades secundarias, puede solicitarlo en cualquier 
          momento mediante correo a info@stardustharmony.com indicando en el asunto "Limitación de uso de datos".
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">3. Fundamento y consentimiento</h3>
        <p class="text-white/80 mb-2">El tratamiento de sus datos se realiza con base en:</p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>La legislación mexicana en materia de protección de datos personales</li>
          <li>La relación jurídica que se establece al utilizar nuestra plataforma y contratar nuestros productos/servicios</li>
        </ul>
        <p class="text-white/80 mt-3">
          Al proporcionar sus datos y utilizar nuestro sitio, usted consiente el tratamiento de los mismos 
          conforme a este Aviso de Privacidad. En los casos que la ley lo exija, recabaremos su consentimiento expreso.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">4. Transferencia de datos personales</h3>
        <p class="text-white/80 mb-2">Podremos compartir sus datos personales con:</p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>Proveedores de servicios de pago en línea, pasarelas de pago y entidades financieras</li>
          <li>Empresas de mensajería y logística para la entrega de productos</li>
          <li>Proveedores de servicios tecnológicos (hosting, correo masivo, CRM, etc.)</li>
        </ul>
        <p class="text-white/80 mt-3">
          Estas transferencias tendrán como única finalidad cumplir con la prestación del servicio contratado 
          y se realizarán bajo medidas de seguridad adecuadas. No venderemos, cederemos ni transferiremos sus 
          datos a terceros ajenos al servicio sin su consentimiento.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">5. Derechos ARCO y medios para ejercerlos</h3>
        <p class="text-white/80 mb-2">Usted tiene derecho a:</p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li><strong class="text-white">Acceder</strong> a sus datos personales</li>
          <li><strong class="text-white">Rectificarlos</strong> cuando sean inexactos o incompletos</li>
          <li><strong class="text-white">Cancelarlos</strong> cuando considere que no se requieren para alguna de las finalidades señaladas</li>
          <li><strong class="text-white">Oponerse</strong> al tratamiento para fines específicos</li>
        </ul>
        <p class="text-white/80 mt-4 mb-2">Para ejercer sus derechos ARCO o revocar su consentimiento, podrá enviar una solicitud a info@stardustharmony.com, indicando:</p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>Nombre completo y medio para comunicarle la respuesta</li>
          <li>Copia de identificación oficial (INE, pasaporte, etc.)</li>
          <li>Descripción clara de los datos respecto de los que busca ejercer el derecho</li>
        </ul>
        <p class="text-white/80 mt-3">Responderemos dentro de los plazos establecidos por la ley aplicable.</p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">6. Uso de cookies y tecnologías similares</h3>
        <p class="text-white/80 mb-2">Nuestro sitio web utiliza cookies y tecnologías similares para:</p>
        <ul class="list-disc list-inside space-y-2 text-white/80 ml-4">
          <li>Recordar su sesión y preferencias</li>
          <li>Analizar el uso del sitio y mejorar la experiencia del usuario</li>
          <li>Mostrar contenido y publicidad relacionada con sus intereses</li>
        </ul>
        <p class="text-white/80 mt-3">
          Usted puede deshabilitar las cookies desde la configuración de su navegador; sin embargo, algunas 
          funciones del sitio podrían no operar correctamente.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">7. Medidas de seguridad</h3>
        <p class="text-white/80">
          Implementamos medidas de seguridad administrativas, técnicas y físicas para proteger sus datos 
          personales contra daño, pérdida, alteración, destrucción o uso, acceso o tratamiento no autorizado.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-[rgb(170,151,196)] mb-3">8. Cambios al Aviso de Privacidad</h3>
        <p class="text-white/80">
          Nos reservamos el derecho de modificar o actualizar este Aviso de Privacidad en cualquier momento. 
          Las modificaciones estarán disponibles en este sitio con la fecha de última actualización.
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
          <h1 className="text-4xl font-bold text-white mb-4">Aviso de Privacidad Integral</h1>
          <p className="text-white/60 mb-8">Fecha de última actualización: {new Date().toLocaleDateString("es-MX")}</p>

          <div
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: privacyContent }}
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
