-- Script para insertar el contenido por defecto de páginas legales y templates de email
-- Este script inserta contenido HTML formateado para STARDUST

-- 1. TÉRMINOS Y CONDICIONES DEL SERVICIO
INSERT INTO editable_content (key, title, content, content_type, updated_at, update_by)
VALUES (
  'terms_of_service',
  'Términos y Condiciones del Servicio',
  '<div class="space-y-6">
    <p class="text-white/80 text-lg leading-relaxed">
      El presente documento establece los términos y condiciones que regulan el acceso y uso del sitio web 
      <strong>STARDUST</strong> y la compra de productos ofrecidos por <strong>STARDUST</strong>, 
      en adelante "EL PROVEEDOR".
    </p>
    <p class="text-white/80 leading-relaxed">
      Al acceder, navegar o utilizar este sitio, usted (en adelante "EL USUARIO") acepta quedar vinculado por estos Términos y Condiciones.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">1. Objeto del sitio</h2>
    <p class="text-white/80 leading-relaxed mb-2">El sitio permite a EL USUARIO:</p>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li>Consultar información de productos.</li>
      <li>Realizar pedidos y contratar la compra de productos en línea.</li>
      <li>Realizar pagos a través de distintos medios habilitados.</li>
    </ul>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">2. Aceptación de los términos</h2>
    <p class="text-white/80 leading-relaxed">
      El uso del sitio implica la aceptación plena y sin reservas de estos Términos y Condiciones. 
      Si EL USUARIO no está de acuerdo, deberá abstenerse de utilizar el sitio y/o realizar compras.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">3. Registro de usuario y confidencialidad de la cuenta</h2>
    <p class="text-white/80 leading-relaxed mb-2">Para realizar compras, puede ser necesario crear una cuenta:</p>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li>EL USUARIO se compromete a proporcionar información veraz, completa y actualizada.</li>
      <li>EL USUARIO es responsable de mantener la confidencialidad de su usuario y contraseña.</li>
      <li>Cualquier operación realizada mediante su cuenta se entenderá efectuada por EL USUARIO.</li>
      <li>EL PROVEEDOR podrá suspender o cancelar cuentas que hagan uso indebido del sitio, incurran en fraude o proporcionen datos falsos.</li>
    </ul>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">4. Información de productos, precios y disponibilidad</h2>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li>Los precios de los productos se muestran en pesos mexicanos (MXN), e incluyen o no impuestos según se indique.</li>
      <li>EL PROVEEDOR se reserva el derecho de modificar precios, promociones y disponibilidad en cualquier momento, sin afectar órdenes ya confirmadas.</li>
      <li>Las imágenes de los productos son ilustrativas y pueden presentar variaciones respecto al producto final, sin afectar sus características esenciales.</li>
    </ul>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">5. Proceso de compra</h2>
    <ol class="list-decimal list-inside text-white/80 space-y-2 ml-4">
      <li>EL USUARIO selecciona los productos y los agrega al carrito.</li>
      <li>EL USUARIO proporciona datos de envío, facturación y elige el método de pago.</li>
      <li>Antes de finalizar la compra, se mostrará un resumen con el detalle del pedido, impuestos, gastos de envío y total a pagar.</li>
      <li>La confirmación del pedido estará sujeta a la validación del pago y disponibilidad del producto.</li>
      <li>EL PROVEEDOR enviará por correo electrónico el resumen de la compra y el número de pedido.</li>
    </ol>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">6. Formas de pago</h2>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li>Se aceptarán las formas de pago indicadas en el sitio (tarjeta de crédito o débito, plataformas de pago en línea, transferencias, etc.).</li>
      <li>Los pagos se procesan a través de proveedores externos seguros.</li>
      <li>EL PROVEEDOR no almacena los datos completos de tarjetas bancarias.</li>
    </ul>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">7. Envíos, entrega y riesgo</h2>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li>Los productos serán enviados al domicilio indicado por EL USUARIO.</li>
      <li>Se informará un plazo estimado de entrega; sin embargo, pueden existir variaciones por causas ajenas a EL PROVEEDOR (logística, clima, eventos de fuerza mayor, etc.).</li>
      <li>El riesgo de pérdida o daño se transmite a EL USUARIO al momento de la entrega física del producto.</li>
    </ul>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">8. Devoluciones, cancelaciones y reembolsos</h2>
    <p class="text-white/80 leading-relaxed mb-2">
      EL PROVEEDOR establecerá en el sitio su política de devoluciones y cancelaciones, que deberá indicar:
    </p>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li>Plazos para solicitar devoluciones o cambios.</li>
      <li>Condiciones del producto (empaque, uso, sellos de seguridad, etc.).</li>
      <li>Supuestos en que no procede la devolución (productos personalizados, abiertos, de consumo inmediato, etc.).</li>
    </ul>
    <p class="text-white/80 leading-relaxed mt-4">
      EL USUARIO deberá revisar y aceptar dicha política antes de completar la compra.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">9. Garantías</h2>
    <p class="text-white/80 leading-relaxed">
      Los productos contarán con las garantías que establezca el fabricante o, en su caso, 
      las mínimas previstas por la legislación mexicana aplicable. 
      Para hacer válida una garantía, EL USUARIO deberá seguir el procedimiento indicado en el sitio 
      o en la póliza de garantía correspondiente.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">10. Propiedad intelectual</h2>
    <p class="text-white/80 leading-relaxed mb-2">
      Todo el contenido del sitio (marcas, logos, textos, imágenes, diseños, código fuente, etc.) 
      es propiedad de EL PROVEEDOR o se utiliza con autorización de sus titulares.
    </p>
    <p class="text-white/80 leading-relaxed mb-2">Queda prohibido:</p>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li>Reproducir, distribuir o modificar el contenido sin autorización previa y por escrito.</li>
      <li>Utilizar cualquier elemento del sitio con fines distintos a la consulta y compra legítima de productos.</li>
    </ul>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">11. Protección de datos personales</h2>
    <p class="text-white/80 leading-relaxed">
      El tratamiento de los datos personales de EL USUARIO se regirá por nuestro Aviso de Privacidad. 
      Al usar el sitio, EL USUARIO reconoce haberlo leído y aceptado.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">12. Responsabilidad</h2>
    <p class="text-white/80 leading-relaxed mb-2">EL PROVEEDOR no será responsable por:</p>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li>Interrupciones o fallos en el servicio de internet, proveedores de hosting, pasarelas de pago o terceros ajenos.</li>
      <li>Daños indirectos, incidentales o consecuenciales derivados del uso del sitio.</li>
    </ul>
    <p class="text-white/80 leading-relaxed mt-4">
      Sin perjuicio de lo anterior, EL PROVEEDOR cumplirá con las obligaciones mínimas de protección 
      al consumidor que establezca la legislación vigente en México.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">13. Modificaciones a los Términos y Condiciones</h2>
    <p class="text-white/80 leading-relaxed">
      EL PROVEEDOR podrá actualizar estos Términos y Condiciones en cualquier momento. 
      Las modificaciones entrarán en vigor a partir de su publicación en el sitio, 
      indicando la fecha de última actualización.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">14. Legislación aplicable y jurisdicción</h2>
    <p class="text-white/80 leading-relaxed">
      Estos Términos y Condiciones se rigen por las leyes federales de los Estados Unidos Mexicanos. 
      Para la interpretación y cumplimiento de los mismos, las partes se someten a la jurisdicción 
      de los tribunales competentes de México, renunciando a cualquier otro fuero que pudiera corresponderles 
      por razón de su domicilio presente o futuro.
    </p>
  </div>',
  'html',
  NOW(),
  'admin'
) ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW(),
  update_by = 'admin';

-- 2. AVISO DE PRIVACIDAD
INSERT INTO editable_content (key, title, content, content_type, updated_at, update_by)
VALUES (
  'privacy_policy',
  'Aviso de Privacidad Integral',
  '<div class="space-y-6">
    <p class="text-white/80 text-lg leading-relaxed">
      <strong>STARDUST</strong>, es responsable del tratamiento de sus datos personales, 
      en términos de la legislación mexicana aplicable en materia de protección de datos personales.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">1. Datos personales que recabamos</h2>
    <p class="text-white/80 leading-relaxed mb-2">Podemos recabar, entre otros, los siguientes datos personales:</p>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li><strong>Datos de identificación:</strong> nombre, apellidos, RFC, CURP (si aplica).</li>
      <li><strong>Datos de contacto:</strong> domicilio, correo electrónico, teléfono móvil o fijo.</li>
      <li><strong>Datos de facturación:</strong> razón social, RFC, domicilio fiscal, datos para CFDI.</li>
      <li><strong>Datos transaccionales:</strong> historial de compras, productos adquiridos, forma de pago (sin almacenar números completos de tarjeta), referencias de envío.</li>
    </ul>
    <p class="text-white/80 leading-relaxed mt-4">
      No recabamos de forma intencional datos personales sensibles, salvo que sea estrictamente necesario y con su consentimiento expreso.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">2. Finalidades del tratamiento</h2>
    <p class="text-white/80 leading-relaxed mb-2">Sus datos personales serán utilizados para las siguientes finalidades primarias:</p>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li>Crear y administrar su cuenta de usuario en la plataforma.</li>
      <li>Procesar pedidos, pagos, facturación y entregas de productos.</li>
      <li>Brindar atención al cliente, seguimiento de pedidos y soporte técnico.</li>
      <li>Cumplir obligaciones derivadas de la relación jurídica que se genere.</li>
    </ul>
    <p class="text-white/80 leading-relaxed mt-4 mb-2">Adicionalmente, podremos utilizarlos para finalidades secundarias:</p>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li>Envío de publicidad, promociones, newsletters y comunicaciones comerciales.</li>
      <li>Realización de encuestas de calidad, estudios de mercado y estadísticas internas.</li>
    </ul>
    <p class="text-white/80 leading-relaxed mt-4">
      Si no desea que sus datos se utilicen para finalidades secundarias, puede solicitarlo en cualquier momento 
      mediante correo indicando "Limitación de uso de datos".
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">3. Fundamento y consentimiento</h2>
    <p class="text-white/80 leading-relaxed mb-2">El tratamiento de sus datos se realiza con base en:</p>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li>La legislación mexicana en materia de protección de datos personales.</li>
      <li>La relación jurídica que se establece al utilizar nuestra plataforma y contratar nuestros productos/servicios.</li>
    </ul>
    <p class="text-white/80 leading-relaxed mt-4">
      Al proporcionar sus datos y utilizar nuestro sitio, usted consiente el tratamiento de los mismos conforme a este Aviso de Privacidad. 
      En los casos que la ley lo exija, recabaremos su consentimiento expreso.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">4. Transferencia de datos personales</h2>
    <p class="text-white/80 leading-relaxed mb-2">Podremos compartir sus datos personales con:</p>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li>Proveedores de servicios de pago en línea, pasarelas de pago y entidades financieras.</li>
      <li>Empresas de mensajería y logística para la entrega de productos.</li>
      <li>Proveedores de servicios tecnológicos (hosting, correo masivo, CRM, etc.).</li>
    </ul>
    <p class="text-white/80 leading-relaxed mt-4">
      Estas transferencias tendrán como única finalidad cumplir con la prestación del servicio contratado 
      y se realizarán bajo medidas de seguridad adecuadas. No venderemos, cederemos ni transferiremos 
      sus datos a terceros ajenos al servicio sin su consentimiento.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">5. Derechos ARCO y medios para ejercerlos</h2>
    <p class="text-white/80 leading-relaxed mb-2">Usted tiene derecho a:</p>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li>Acceder a sus datos personales.</li>
      <li>Rectificarlos cuando sean inexactos o incompletos.</li>
      <li>Cancelarlos cuando considere que no se requieren para alguna de las finalidades señaladas.</li>
      <li>Oponerse al tratamiento para fines específicos.</li>
    </ul>
    <p class="text-white/80 leading-relaxed mt-4 mb-2">
      Para ejercer sus derechos ARCO o revocar su consentimiento, podrá enviar una solicitud indicando:
    </p>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li>Nombre completo y medio para comunicarle la respuesta.</li>
      <li>Copia de identificación oficial (INE, pasaporte, etc.).</li>
      <li>Descripción clara de los datos respecto de los que busca ejercer el derecho.</li>
    </ul>
    <p class="text-white/80 leading-relaxed mt-4">
      Responderemos dentro de los plazos establecidos por la ley aplicable.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">6. Uso de cookies y tecnologías similares</h2>
    <p class="text-white/80 leading-relaxed mb-2">Nuestro sitio web utiliza cookies y tecnologías similares para:</p>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li>Recordar su sesión y preferencias.</li>
      <li>Analizar el uso del sitio y mejorar la experiencia del usuario.</li>
      <li>Mostrar contenido y publicidad relacionada con sus intereses.</li>
    </ul>
    <p class="text-white/80 leading-relaxed mt-4">
      Usted puede deshabilitar las cookies desde la configuración de su navegador; sin embargo, 
      algunas funciones del sitio podrían no operar correctamente.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">7. Medidas de seguridad</h2>
    <p class="text-white/80 leading-relaxed">
      Implementamos medidas de seguridad administrativas, técnicas y físicas para proteger sus datos personales 
      contra daño, pérdida, alteración, destrucción o uso, acceso o tratamiento no autorizado.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">8. Cambios al Aviso de Privacidad</h2>
    <p class="text-white/80 leading-relaxed">
      Nos reservamos el derecho de modificar o actualizar este Aviso de Privacidad en cualquier momento. 
      Las modificaciones estarán disponibles en nuestro sitio web con la fecha de última actualización.
    </p>
  </div>',
  'html',
  NOW(),
  'admin'
) ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW(),
  update_by = 'admin';

-- 3. POLÍTICAS DE ENVÍO
INSERT INTO editable_content (key, title, content, content_type, updated_at, update_by)
VALUES (
  'shipping_policy',
  'Políticas de Envío',
  '<div class="space-y-6">
    <p class="text-white/80 text-lg leading-relaxed">
      En <strong>STARDUST</strong> nos comprometemos a que tus productos lleguen en perfectas condiciones 
      y en el tiempo estimado.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">Zonas de Cobertura</h2>
    <p class="text-white/80 leading-relaxed">
      Realizamos envíos a toda la República Mexicana a través de paqueterías reconocidas. 
      Los tiempos de entrega varían según la ubicación del destino.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">Tiempos de Entrega</h2>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li><strong>Ciudad de México y Área Metropolitana:</strong> 2 a 4 días hábiles</li>
      <li><strong>Interior de la República:</strong> 4 a 7 días hábiles</li>
      <li><strong>Zonas remotas:</strong> 7 a 10 días hábiles</li>
    </ul>
    <p class="text-white/80 leading-relaxed mt-4">
      Los tiempos de entrega comienzan a contar a partir de la confirmación del pago y disponibilidad del producto.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">Costos de Envío</h2>
    <p class="text-white/80 leading-relaxed">
      El costo de envío se calcula automáticamente al momento del checkout, considerando el peso, 
      dimensiones del paquete y la ubicación del destinatario.
    </p>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4 mt-2">
      <li>Envío gratis en compras mayores a $999 MXN</li>
      <li>Costo variable para compras menores según ubicación</li>
    </ul>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">Seguimiento de Pedido</h2>
    <p class="text-white/80 leading-relaxed">
      Una vez que tu pedido sea enviado, recibirás un correo electrónico con el número de guía de rastreo 
      para que puedas dar seguimiento a tu paquete en tiempo real.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">Verificación al Recibir</h2>
    <p class="text-white/80 leading-relaxed">
      Te recomendamos revisar tu paquete al momento de recibirlo. Si detectas algún daño externo, 
      por favor repórtalo inmediatamente con el personal de paquetería y contáctanos.
    </p>
  </div>',
  'html',
  NOW(),
  'admin'
) ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW(),
  update_by = 'admin';

-- 4. POLÍTICAS DE DEVOLUCIÓN
INSERT INTO editable_content (key, title, content, content_type, updated_at, update_by)
VALUES (
  'return_policy',
  'Políticas de Devolución',
  '<div class="space-y-6">
    <p class="text-white/80 text-lg leading-relaxed">
      En <strong>STARDUST</strong> queremos que estés completamente satisfecho con tu compra. 
      Si por alguna razón no lo estás, ofrecemos las siguientes opciones.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">Plazo para Devoluciones</h2>
    <p class="text-white/80 leading-relaxed">
      Tienes <strong>30 días naturales</strong> a partir de la fecha de recepción del producto 
      para solicitar una devolución o cambio.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">Condiciones del Producto</h2>
    <p class="text-white/80 leading-relaxed mb-2">Para procesar una devolución, el producto debe cumplir con:</p>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li>Estar en su empaque original, sin abrir y sin signos de uso.</li>
      <li>Incluir todos los accesorios, manuales y documentación original.</li>
      <li>Conservar las etiquetas y sellos de seguridad intactos.</li>
      <li>No presentar daños causados por mal uso o manipulación incorrecta.</li>
    </ul>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">Productos No Retornables</h2>
    <p class="text-white/80 leading-relaxed mb-2">No se aceptan devoluciones en:</p>
    <ul class="list-disc list-inside text-white/80 space-y-2 ml-4">
      <li>Productos personalizados o hechos bajo pedido especial.</li>
      <li>Productos de higiene personal o consumo directo que hayan sido abiertos.</li>
      <li>Productos en liquidación o venta especial (salvo defecto de fábrica).</li>
      <li>Productos digitales o descargas electrónicas.</li>
    </ul>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">Proceso de Devolución</h2>
    <ol class="list-decimal list-inside text-white/80 space-y-2 ml-4">
      <li>Contacta a nuestro equipo de atención al cliente con tu número de pedido.</li>
      <li>Indica el motivo de la devolución y adjunta fotografías si es necesario.</li>
      <li>Nuestro equipo revisará tu solicitud y te proporcionará una autorización de devolución.</li>
      <li>Envía el producto al domicilio que te indicaremos (los gastos de envío de devolución corren por cuenta del cliente).</li>
      <li>Una vez recibido y verificado el producto, procesaremos tu reembolso o cambio.</li>
    </ol>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">Reembolsos</h2>
    <p class="text-white/80 leading-relaxed">
      Los reembolsos se procesarán dentro de 7 a 10 días hábiles después de recibir y verificar el producto devuelto. 
      El reembolso se realizará mediante el mismo método de pago utilizado en la compra original.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">Cambios</h2>
    <p class="text-white/80 leading-relaxed">
      Si deseas cambiar tu producto por otro, sujeto a disponibilidad, procesaremos el cambio sin costo adicional. 
      Si el nuevo producto tiene un precio mayor, deberás cubrir la diferencia.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">Productos Defectuosos</h2>
    <p class="text-white/80 leading-relaxed">
      Si recibes un producto defectuoso o dañado, contáctanos inmediatamente. Procesaremos el cambio o reembolso 
      sin costo alguno para ti, incluyendo los gastos de envío.
    </p>
  </div>',
  'html',
  NOW(),
  'admin'
) ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW(),
  update_by = 'admin';

-- 5. TEMPLATE EMAIL BIENVENIDA
INSERT INTO editable_content (key, title, content, content_type, updated_at, update_by)
VALUES (
  'email_welcome',
  'Template Email de Bienvenida',
  '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(to bottom, #0f0f23, #190f2d); padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 40px;">
      <img src="{{LOGO_URL}}" alt="STARDUST" style="max-width: 200px; height: auto;" />
    </div>
    
    <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(170, 151, 196, 0.3); border-radius: 16px; padding: 40px; backdrop-filter: blur(10px);">
      <h1 style="color: #ffffff; font-size: 32px; margin-bottom: 20px; text-align: center;">¡Bienvenido a STARDUST!</h1>
      
      <p style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        Hola <strong>{{USER_NAME}}</strong>,
      </p>
      
      <p style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        Nos emociona que te hayas unido a nuestra comunidad. En STARDUST encontrarás productos de alta calidad 
        que integran percepción científica, tecnología de vanguardia y el poder de la naturaleza.
      </p>
      
      <div style="background: rgba(170, 151, 196, 0.1); border-left: 4px solid #aa97c4; padding: 20px; margin: 30px 0; border-radius: 8px;">
        <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; line-height: 1.6; margin: 0;">
          Tu cuenta ha sido creada exitosamente. Ya puedes explorar nuestro catálogo, agregar productos a tu carrito 
          y disfrutar de una experiencia de compra única.
        </p>
      </div>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="{{SITE_URL}}" style="display: inline-block; background: linear-gradient(to right, #aa97c4, #c91240); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: bold;">
          Explorar Productos
        </a>
      </div>
      
      <p style="color: rgba(255, 255, 255, 0.7); font-size: 14px; line-height: 1.6; text-align: center; margin-top: 40px;">
        Si tienes alguna pregunta, nuestro equipo está aquí para ayudarte.
      </p>
    </div>
    
    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
      <p style="color: rgba(255, 255, 255, 0.5); font-size: 12px; margin: 0;">
        © {{YEAR}} STARDUST. Todos los derechos reservados.
      </p>
    </div>
  </div>',
  'email_template',
  NOW(),
  'admin'
) ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW(),
  update_by = 'admin';

-- 6. TEMPLATE EMAIL CONFIRMACIÓN DE PEDIDO
INSERT INTO editable_content (key, title, content, content_type, updated_at, update_by)
VALUES (
  'email_order_confirmation',
  'Template Email Confirmación de Pedido',
  '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(to bottom, #0f0f23, #190f2d); padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 40px;">
      <img src="{{LOGO_URL}}" alt="STARDUST" style="max-width: 200px; height: auto;" />
    </div>
    
    <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(170, 151, 196, 0.3); border-radius: 16px; padding: 40px; backdrop-filter: blur(10px);">
      <h1 style="color: #ffffff; font-size: 32px; margin-bottom: 20px; text-align: center;">¡Pedido Confirmado!</h1>
      
      <p style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        Hola <strong>{{CUSTOMER_NAME}}</strong>,
      </p>
      
      <p style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
        ¡Gracias por tu compra! Tu pedido ha sido confirmado y está siendo procesado.
      </p>
      
      <div style="background: rgba(170, 151, 196, 0.1); border-radius: 12px; padding: 24px; margin: 30px 0;">
        <h2 style="color: #aa97c4; font-size: 18px; margin: 0 0 16px 0;">Detalles del Pedido</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: rgba(255, 255, 255, 0.6); padding: 8px 0; font-size: 14px;">Número de Pedido:</td>
            <td style="color: #ffffff; padding: 8px 0; text-align: right; font-size: 14px; font-weight: bold;">{{ORDER_NUMBER}}</td>
          </tr>
          <tr>
            <td style="color: rgba(255, 255, 255, 0.6); padding: 8px 0; font-size: 14px;">Fecha:</td>
            <td style="color: #ffffff; padding: 8px 0; text-align: right; font-size: 14px;">{{ORDER_DATE}}</td>
          </tr>
          <tr>
            <td style="color: rgba(255, 255, 255, 0.6); padding: 8px 0; font-size: 14px;">Total:</td>
            <td style="color: #aa97c4; padding: 8px 0; text-align: right; font-size: 18px; font-weight: bold;">{{ORDER_TOTAL}}</td>
          </tr>
        </table>
      </div>
      
      <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 24px; margin: 30px 0;">
        <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 16px 0;">Productos:</h3>
        {{ORDER_ITEMS}}
      </div>
      
      <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 24px; margin: 30px 0;">
        <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 16px 0;">Dirección de Envío:</h3>
        <p style="color: rgba(255, 255, 255, 0.7); font-size: 14px; line-height: 1.6; margin: 0;">
          {{SHIPPING_ADDRESS}}
        </p>
      </div>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="{{ORDER_TRACKING_URL}}" style="display: inline-block; background: linear-gradient(to right, #aa97c4, #c91240); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: bold;">
          Ver Detalles del Pedido
        </a>
      </div>
      
      <p style="color: rgba(255, 255, 255, 0.7); font-size: 14px; line-height: 1.6; text-align: center; margin-top: 40px;">
        Te notificaremos cuando tu pedido sea enviado con el número de guía de rastreo.
      </p>
    </div>
    
    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
      <p style="color: rgba(255, 255, 255, 0.5); font-size: 12px; margin: 0;">
        © {{YEAR}} STARDUST. Todos los derechos reservados.
      </p>
    </div>
  </div>',
  'email_template',
  NOW(),
  'admin'
) ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW(),
  update_by = 'admin';

-- 7. TEMPLATE EMAIL NOTIFICACIÓN DE ENVÍO
INSERT INTO editable_content (key, title, content, content_type, updated_at, update_by)
VALUES (
  'email_shipping_notification',
  'Template Email Notificación de Envío',
  '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(to bottom, #0f0f23, #190f2d); padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 40px;">
      <img src="{{LOGO_URL}}" alt="STARDUST" style="max-width: 200px; height: auto;" />
    </div>
    
    <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(170, 151, 196, 0.3); border-radius: 16px; padding: 40px; backdrop-filter: blur(10px);">
      <h1 style="color: #ffffff; font-size: 32px; margin-bottom: 20px; text-align: center;">¡Tu Pedido Va en Camino!</h1>
      
      <p style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        Hola <strong>{{CUSTOMER_NAME}}</strong>,
      </p>
      
      <p style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
        ¡Buenas noticias! Tu pedido ha sido enviado y está en camino a tu dirección.
      </p>
      
      <div style="background: rgba(170, 151, 196, 0.1); border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
        <h2 style="color: #aa97c4; font-size: 18px; margin: 0 0 16px 0;">Información de Rastreo</h2>
        <p style="color: rgba(255, 255, 255, 0.7); font-size: 14px; margin: 8px 0;">Paquetería:</p>
        <p style="color: #ffffff; font-size: 16px; font-weight: bold; margin: 0 0 16px 0;">{{CARRIER_NAME}}</p>
        <p style="color: rgba(255, 255, 255, 0.7); font-size: 14px; margin: 8px 0;">Número de Guía:</p>
        <p style="color: #ffffff; font-size: 20px; font-weight: bold; font-family: monospace; margin: 0;">{{TRACKING_NUMBER}}</p>
      </div>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="{{TRACKING_URL}}" style="display: inline-block; background: linear-gradient(to right, #aa97c4, #c91240); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: bold;">
          Rastrear Pedido
        </a>
      </div>
      
      <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 24px; margin: 30px 0;">
        <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 12px 0;">Tiempo Estimado de Entrega:</h3>
        <p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin: 0;">
          {{ESTIMATED_DELIVERY}}
        </p>
      </div>
      
      <p style="color: rgba(255, 255, 255, 0.7); font-size: 14px; line-height: 1.6; text-align: center; margin-top: 40px;">
        Por favor, verifica tu paquete al recibirlo. Si detectas algún daño, contáctanos de inmediato.
      </p>
    </div>
    
    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
      <p style="color: rgba(255, 255, 255, 0.5); font-size: 12px; margin: 0;">
        © {{YEAR}} STARDUST. Todos los derechos reservados.
      </p>
    </div>
  </div>',
  'email_template',
  NOW(),
  'admin'
) ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW(),
  update_by = 'admin';
