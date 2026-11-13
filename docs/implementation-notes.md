# Notas de implementación — Postre

## Repositorio y recursos

- El proyecto vive en el repositorio existente `Postrepro/app`, rama de trabajo `codex/postre-foundation`.
- El proyecto Supabase activo es `Postre` (`crnttiawfevggopsnfti`, us-west-2), no se creó un duplicado.
- El equipo Vercel asociado es `postre1`. Falta aprobar el acceso de equipo para enlazar o crear proyectos; no se ha modificado DNS ni se ha publicado en `postre.pro`.

## Alcance visual inicial

Portada, creación de cuenta, inicio de sesión, panel Postre, espacio de negocio por slug, tienda pública `-pos`, tipografía Figtree, PWA manifest e identidad crema/chocolate. Toda interfaz de usuario debe permanecer en español.

## Datos y seguridad

El proyecto Supabase estaba vacío al iniciar este trabajo. Ya se aplicó `supabase/migrations/202611120001_postre_foundation.sql`, con perfiles, negocios, suscripciones de prueba, tasas y una función transaccional de finalización de registro con RLS. La aplicación antigua de la carpeta `~/Desktop/postre` se revisó solo como referencia de interfaz y cálculos. No se copia su esquema SQL ni su lógica de autorización: requiere una revisión de seguridad separada antes de reutilizar cualquier código.

No guardar claves `service_role` en el cliente ni en el repositorio. Los PIN de caja deben guardarse con hash y nunca como texto plano. El trial empieza al completar registro, dura 7 días y requiere que el estado de suscripción se aplique en operaciones de negocio del lado servidor.

## Pendiente para habilitar uso real

- Confirmar que Auth de Supabase permite los enlaces de verificación y sus URLs de retorno locales y de producción.
- Configurar credenciales del proveedor Google OAuth y enlazar credenciales de correo para producción.
- Ampliar tablas/políticas RLS para membresías, tienda, recetas, costos, inventario, pedidos, clientes y comprobantes.
- Definir buckets y políticas para comprobantes/facturas y logos.
- Configurar cron/función para tasas USD, EUR y USDT.
- Completar panel admin y permisos de soporte.
- Enlazar Vercel, configurar variables de entorno, dominios `postre.pro` y despliegues.

El registro funcional actual usa Supabase Auth y `complete_baker_registration`; el periodo de prueba nace al ejecutar esa función, después de que la persona verificó su cuenta y confirmó los datos del negocio. La configuración de Google OAuth, las URLs autorizadas y el correo transaccional todavía necesitan habilitarse en Supabase antes de abrirlo a terceros.
