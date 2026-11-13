import type { Metadata } from "next";
import "@fontsource-variable/figtree/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Postre | Tú pones la magia. Nosotros, el orden.",
  description: "Organiza recetas, costos, inventario, pedidos y ventas de tu negocio de repostería con Postre.",
  applicationName: "Postre",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.png", apple: "/icons/icon-192.png" },
};

export const viewport = {
  themeColor: "#f7f2ea",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
