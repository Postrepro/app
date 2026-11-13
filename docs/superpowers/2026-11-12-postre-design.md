# Postre — diseño técnico y funcional

**Fecha:** 12 de noviembre de 2026  
**Estado:** propuesta escrita para revisión del usuario  
**Base:** decisiones aprobadas durante el diseño conversacional; reemplaza cualquier punto contradictorio del borrador anterior de definición funcional.

## 1. Objetivo y alcance

Postre será una PWA SaaS para negocios de repostería en Venezuela. La persona propietaria de Postre gestiona cuentas, pruebas, suscripciones y comprobantes desde `/admin`; cada repostero administra su negocio, recetas, compras, inventario, clientes, pedidos y ventas; el comprador utiliza la tienda pública del negocio. El propósito es dar a pequeños reposteros una experiencia organizada y adaptable inspirada en la facilidad de Shopify, con herramientas propias para costos, producción y porciones.

Toda la interfaz y los mensajes visibles para clientes, reposteros y administradores estarán en español. El producto debe funcionar bien en teléfono y computadora. En teléfono debe sentirse como una app, con navegación compacta y poco desplazamiento. En escritorio debe aprovechar un diseño de web de administración. La interfaz usará Figtree, paleta crema y chocolate y materiales glass; el negocio podrá personalizar colores y marca, pero no elegir tipografía.

## 2. Arquitectura aprobada

- Una aplicación **Next.js App Router** como único frontend y capa de rutas, desplegada en **Vercel**.
- **Supabase** para PostgreSQL, Auth, Storage y Edge Functions programadas.
- El esquema inicial será multiempresa: cada fila operativa pertenece a un negocio. Las políticas **RLS** limitarán el acceso al negocio autorizado; el panel de Postre tendrá permisos administrativos separados y auditables.
- Las operaciones críticas —cambiar estado de suscripción, aprobar un pago, reservar existencias, confirmar pedido, registrar producción/venta y sincronizar ventas offline— se validarán en el servidor o mediante transacciones SQL/funciones controladas, no solo en el cliente.
- Imágenes de catálogo publicadas podrán leerse públicamente; comprobantes de pago, recibos de compra y demás datos privados se guardarán en almacenamiento privado con acceso firmado y validado por negocio.
- El proveedor de tasas se consulta desde servidor. Las credenciales de APIs nunca se envían al navegador.

### Rutas

| Ruta | Uso |
| --- | --- |
| `/` | Landing de Postre, explicación del servicio y registro |
| `/admin` | Panel privado del propietario de Postre |
| `/{slug}` | Área privada del negocio repostero |
| `/{slug}-pos` | Tienda pública del negocio para compradores |

`slug` es el nombre elegido por el negocio, no una ruta fija como `manu`. El router reservará nombres de sistema y validará unicidad y colisiones entre slugs y sufijo `-pos`.

## 3. Cuentas, permisos y suscripción

### Registro y seguridad

- Google OAuth será la opción principal para verificar el correo del repostero. En el registro se completan nombre, apellido, cédula, correo y teléfono; la prueba comienza cuando el registro queda completo.
- Se solicita una clave de cuenta además del acceso con Google, para recuperación y flujos que la requieran.
- El PIN del POS será de **cuatro dígitos**, único por persona dentro de su negocio. Se guardará como hash y servirá para reabrir rápidamente una sesión del POS en un dispositivo ya autorizado; no sustituye el inicio de sesión ni es una credencial adecuada para acceso remoto por sí sola. El desbloqueo local requiere límites de intentos y una sesión previamente autorizada.
- Cada usuario adicional tendrá su cuenta y PIN individual. La cuenta base cuesta US$5/mes; cada usuario adicional cuesta US$2/mes.
- Roles: admin de Postre, propietario del negocio y empleado invitado con permisos limitados. Los permisos de empleados se aplican por negocio.
- El cliente de tienda puede comprar como invitado y, al terminar, elegir si crea cuenta con sus datos ya ingresados.
- La foto de cédula queda expresamente fuera del lanzamiento y no se recopila.

### Datos de negocio

RIF, si está registrada la empresa; dirección, si existe o se usa para despachar desde casa; y modalidad de delivery (propio o encargado) con teléfono cuando corresponda, son opcionales y condicionales. El registro debe distinguir dirección del negocio y dirección de despacho, y pedir al cliente la dirección de entrega cuando el pedido requiere delivery.

### Prueba y cobros manuales

- Prueba gratuita de siete días desde la finalización del registro.
- Suscripción y usuarios adicionales se pagan manualmente, sin pasarela ni API de pago. El negocio adjunta comprobante y el admin revisa, aprueba o rechaza desde `/admin`, con nota y registro de auditoría.
- Al vencer prueba o periodo pagado se pausa el uso operativo hasta la aprobación de renovación. El área de suscripción, carga de comprobante y consulta de estado sigue accesible; los datos se conservan y no se eliminan por falta de pago.
- Una renovación anticipada se suma al final del periodo actual. Una renovación tardía inicia desde la fecha de aprobación administrativa.
- Los datos bancarios/instrucciones de pago del dueño de Postre quedan configurables cuando se suministren.

## 4. Tasas y dinero

- Panel con las referencias **Dólar**, **Euro** y **USDT**, actualizadas diariamente. La interfaz no mostrará fuente ni fecha según decisión del usuario.
- Para cada registro, Supabase conservará internamente el proveedor, valor recibido, momento efectivo, momento de consulta y estado de actualización para auditoría e historial; esa información interna no se presentará en la tarjeta de tasas.
- La fuente propuesta es Vzla.io API v1 en su plan gratuito. Una Edge Function programada consultará las tres referencias una vez al día y guardará los valores. Si la consulta falla, conservará la última tasa válida y dejará una alerta interna al administrador.
- Cada negocio decide si muestra bolívares, dólares o euros y elige BCV dólar, BCV euro o tasa personalizada para conversiones/precios. En la UI de referencia las etiquetas visibles son Dólar, Euro y USDT; se puede detallar el tipo de tasa dentro de configuración de precios.
- Cada compra guarda monto original, moneda, cantidad/unidad y tasa aplicada. Cada pedido conserva el precio y tasa confirmados; cambios posteriores no reescriben historia.

## 5. Costos, compras, recetas y existencias

### Fórmulas de referencia

Se trasladan las fórmulas del Excel compartido: costo unitario de ingrediente = monto de compra / cantidad comprada; costo de ingrediente en receta = cantidad utilizada × costo unitario; costo total de receta = suma de materiales más costos adicionales configurados; costo por unidad/porción = costo total / rendimiento; precio sugerido base = costo unitario / (1 − margen); y punto de equilibrio = gastos fijos / contribución unitaria, redondeado hacia arriba. Los días laborables mensuales parten de 24, pero son configurables. Mano de obra es opcional y, si se activa, se calcula con duración y tarifa por hora.

El modelo incluirá validación de margen y división por cero, precisión/redondeos explícitos y exclusión de ventas cuando se contabiliza merma, evitando sumar dos veces gastos ya incorporados al costo.

### Inventario

- Compras de ingredientes generan lotes de costo y cantidad disponibles. Se aprobó costeo **FIFO**: consumir primero los lotes más antiguos, manteniendo trazabilidad del costo histórico.
- Insumos soportan gramos, mililitros y unidades con conversiones compatibles. Las unidades no convertibles (por ejemplo masa a volumen sin densidad) no se convertirán automáticamente.
- Crear receta define cantidades y rendimiento. Al registrar preparación, Postre descuenta los ingredientes una única vez y aumenta producto terminado.
- Un producto divisible comparte existencia: preparar una torta de 12 porciones crea 12 porciones disponibles; venta de 2 deja 10. La venta de torta completa solo se ofrece si la existencia y estado de las porciones permiten convertir/salir de esa unidad sin duplicar stock.
- Encargos personalizados descuentan ingredientes al registrar la preparación, no al recibir una solicitud sin aceptar.
- Merma registra ingrediente o producto, cantidad, motivo y costo; se ve como pérdida, no como venta.
- Mostrar existencias disponibles, reservadas y preparadas para que el repostero entienda dónde se consumió cada lote.

## 6. Tienda, pedidos y clientes

- Tienda pública por negocio en `/{slug}-pos`; compradores no usan el POS privado.
- Catálogo con categorías, búsqueda, fotos, productos listos y por encargo, variaciones pertinentes, carrito y checkout.
- En cada checkout se registran los campos obligatorios acordados: nombre, apellido, cédula, teléfono y dirección; RIF si compra a nombre de empresa. Para retiro, se puede registrar la dirección de entrega como no aplicable y conservar los demás datos requeridos.
- Métodos de pago configurados por el repostero (por ejemplo pago móvil, efectivo y transferencia), selección de retiro o delivery, y carga de comprobante. Postre no mueve dinero ni confirma pagos automáticamente.
- Delivery se cobra mediante tarifa por zona o queda “por confirmar” tras revisar la dirección. En el segundo caso, el comprador debe aceptar el total actualizado antes del pago.
- El pedido se crea en Postre con número propio. Pago y cumplimiento son estados separados. El repostero contacta al cliente manualmente por WhatsApp; no hay WhatsApp API.
- Seguimiento para ambas partes con estados uniformes: recibido, aceptado/rechazado, en preparación, listo/en camino, entregado. Estado del pago separado: pendiente, comprobante por revisar, verificado, parcial/anticipo, pagado o rechazado. Registrar quién y cuándo hizo cada cambio.
- Personalización de tortas: tamaño/porciones, sabor, relleno, decoración, fecha solicitada y notas. El repostero configura antelación, opciones, recargos y urgencias; decide aceptar y cotiza. El cliente acepta precio antes de proceder. Cada repostero establece pago completo o anticipo y condiciones del saldo.
- Cada negocio conserva una ficha de cliente con historial, frecuencia, monto acumulado, última compra y productos frecuentes. Mensajes promocionales no se infieren; consentimiento promocional separado de comunicaciones del pedido y contacto manual disponible.

## 7. POS privado, modo offline y recibos

- Solo propietario y empleados autorizados. Búsqueda, categorías, carrito, escáner de producto/código de barras, alta rápida de producto y recibos.
- Para ventas sin conexión, el dispositivo guarda en IndexedDB una cola local con identificadores idempotentes y operaciones pendientes. La interfaz actualiza una existencia local provisional. Al reconectar, el servidor sincroniza, evita duplicados y muestra conflictos si otro dispositivo consumió existencias; el usuario resuelve diferencias con registro explícito, no se sobrescriben en silencio.
- La creación de órdenes de la tienda y las reservas globales requieren conexión. Una selección en carrito no descuenta existencia global. Al iniciar checkout, reserva por 15 minutos; si el pedido se confirma, la reserva pasa a la orden según su estado; si expira o se cancela, se libera.
- Recibo no fiscal como imagen vertical 1080×1920, con identidad, número de orden, comprador, líneas, importes, delivery, total, pagos y saldo; compartir o descargar. Para muchas líneas, generar varias páginas/imágenes o una versión extendida descargable.

## 8. Facturas, reportes y notificaciones

- Escaneo de factura de compra incluido con cuota inicial de 30 lecturas exitosas por negocio/mes; fallas de OCR no consumen cuota. Registro manual siempre disponible.
- Foto/carga conserva original y extrae comercio, fecha, artículos, cantidades, precios y moneda. Antes de crear lotes de inventario, el repostero revisa y confirma la información. Capturas offline quedan en cola para procesarse al reconectar.
- OCR se implementará detrás de una interfaz de proveedor; proveedor, retención, consentimiento, precisión y costos deben confirmarse antes de habilitar OCR en producción. No se inventa ni introduce un proveedor/API sin aprobación técnica/costo.
- Reportes: ventas, gastos, ganancias estimadas, costo por receta y porción, productos más vendidos, clientes frecuentes, punto de equilibrio y merma. Cifras y tasas deben respetar el snapshot histórico.
- Alertas internas cerrables y push opcional con permiso: pedido nuevo, comprobante pendiente, entrega próxima, stock bajo, prueba/renovación y novedades de producto. Ninguna alerta descartable debe quedar bloqueando la pantalla.

## 9. Onboarding y experiencia visual

- Alta guiada y recorrido progresivo con Atrás/Siguiente, progreso guardado y retomable en móvil y escritorio. Pantalla completa, poco espacio vacío y acciones claras.
- Incluye receta/productos de práctica en entorno de demostración separado de inventario, POS, clientes, órdenes y reportes reales. La persona puede explorar esos ejemplos y luego cargar los propios; puede regresar al modo práctica desde Ayuda.
- La tienda solo se publica con acción explícita del propietario.
- Marca Postre: Figtree global, crema/chocolate y glass; Lucide para iconos. Temas de tienda configurables, con logo, colores, portada, tarjetas y orden/visibilidad de secciones; no cambiar tipografía. El repostero no tiene que editar código.
- La PWA tendrá manifiesto e instalación en dispositivos compatibles. El service worker podrá guardar el shell y recursos estáticos; no cacheará datos privados de negocio como si fueran recursos públicos. El POS offline usará IndexedDB y sincronización explícita.
- Móvil prioriza pedidos, escaneo y caja con navegación inferior compacta; escritorio usa navegación lateral y paneles densos. Componentes de seguimiento de pedidos deben conservar la misma estructura y estilo en todos los pedidos.

## 10. Datos, aislamiento y auditoría

Entidades iniciales: usuarios, negocios, membresías/roles, preferencias, suscripciones, comprobantes de suscripción, pagos manuales, clientes, consentimientos, categorías, productos/variantes, lotes de compras, insumos, recetas/líneas, producciones, existencias/movimientos, mermas, pedidos/líneas, reservas, pagos y comprobantes, métodos de pago, zonas/tarifas, cotizaciones, ventas POS, cola de sincronización, tasas, reportes agregados, notificaciones y auditoría administrativa.

Cada entidad propiedad de negocio tendrá `business_id`, índices adecuados y políticas RLS. La autorización no confiará en `business_id` enviado por el cliente: se resolverá desde la membresía autenticada. Acceso de soporte de Postre requiere autorización explícita, alcance/tiempo limitado y bitácora. Los comprobantes y datos personales no serán públicos.

## 11. Manejo de fallos y consistencia

- Fallas de tasas: dejar último valor bueno, mostrar interno al admin y reintentar en siguiente ejecución.
- Fallo al guardar pedido: no confirmar éxito hasta persistencia; usar clave idempotente para reintentos de checkout.
- Falla de imagen/OCR: conservar imagen como pendiente y ofrecer captura manual de campos.
- Conflicto offline: mantener la venta original, reportar stock comprometido y registrar ajuste/decisión explícitos.
- Cierre de suscripción: bloquear operaciones comerciales nuevas, conservar lectura necesaria y pagos/renovación, sin borrar datos ni órdenes pendientes.

## 12. Fases de construcción propuestas

1. Base del producto: checkout real del repositorio, Next.js/PWA, conexión Vercel, Supabase, Auth/RLS, roles y registro/7 días.
2. Suscripción manual y `/admin`: adjuntos privados, revisión, auditoría y bloqueo al vencer.
3. Negocio: onboarding, configuración de tienda, tasas y personalización.
4. Núcleo de costos: compras FIFO, insumos, recetas, producción, porciones y merma; validar resultados contra el Excel.
5. Tienda y pedidos: checkout, pagos manuales, delivery, seguimiento y clientes.
6. POS online/offline y recibos: cola idempotente, conflictos e inventario.
7. Reportes, notificaciones y OCR: integrar proveedores después de confirmar accesos/costos y privacidad.

Cada fase debe tener un plan de implementación propio y criterios de aceptación antes de ejecutarse; por el alcance, no se hará una implementación integral en un solo bloque.

## 13. Dependencias pendientes antes de producción

- El repositorio indicado por el usuario es `Postrepro/app`; existe, está vacío y actualmente es público. Se usará ese repositorio sin cambiar su visibilidad sin aprobación.
- La organización Supabase **Postre Pro** y el proyecto activo **Postre** existen. Reutilizar ese proyecto; inspeccionar migraciones, tablas, Auth y Storage antes de cambios, sin crear un segundo proyecto.
- La cuenta Postre de Vercel identifica el equipo `postre1`, pero la sesión requiere consentimiento de acceso al equipo antes de consultar o crear recursos. Solicitar el consentimiento en Vercel y continuar con la misma conexión después de que el usuario lo apruebe.
- El checkout local actual solo contiene prototipos HTML y definición funcional; no tiene `.git` ni código de Next.js. La agente preparará el checkout de `Postrepro/app` y conectará los proyectos existentes, sin pedir al usuario que realice configuración manual salvo aprobar el consentimiento de acceso que exige Vercel.
- Confirmar disponibilidad y políticas del plan gratuito actual; no basar costos de producción solo en la etiqueta “gratis”.
- Añadir y custodiar el token de Vzla.io en Supabase Vault cuando exista.
- Confirmar proveedor de OCR, costo, residencia/retención de imágenes y autorización de procesamiento.
- Recibir los datos e instrucciones de cobro del dueño de Postre.
- Definir el documento de privacidad/retención para cédulas, teléfonos, direcciones y comprobantes; no almacenar foto de cédula.
- Incorporar al repo las imágenes/logo de marca si no están ya allí.

