# Postre

PWA en español para que negocios de repostería organicen recetas, costos, inventario, ventas, pedidos y tienda en línea.

## Desarrollo local

Requisitos: Node.js 20.9 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

## Stack

- Next.js App Router y TypeScript
- Figtree, identidad crema y chocolate, componentes glass
- Supabase para autenticación, base de datos y almacenamiento
- Vercel para despliegues

## Rutas iniciales

- `/`: información de Postre y plan
- `/registro`: comienzo del registro
- `/acceso`: acceso a la cuenta
- `/admin`: panel del equipo Postre
- `/{nombre-del-negocio}`: espacio del repostero
- `/{nombre-del-negocio}-pos`: tienda pública

Las rutas privadas y los formularios de esta etapa son una base visual. Antes de invitar negocios a usarlas hay que conectar Auth, políticas RLS y operaciones de base de datos, configurar proveedores de OAuth, activar el dominio y validar los flujos completos.

## Entornos

Configura las variables locales en `.env.local` (no subir al repositorio):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

No se almacenan claves de servicio en el cliente ni en GitHub.
