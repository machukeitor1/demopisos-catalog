import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DemoPisos - Catálogo de pisos y revestimientos (demo)",
  description: "Venta de revestimientos metálicos, WPC, pisos vinílicos SPC, deck y siding granito. Sitio de demostración.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
