import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import WhatsAppButton from "@/components/site/WhatsAppButton";
import MapButton from "@/components/site/MapButton";

export const metadata: Metadata = {
  title: "DemoPisos - Catálogo de pisos y revestimientos (demo)",
  description: "Venta de revestimientos metálicos, WPC, pisos vinílicos SPC, deck y siding granito. Sitio de demostración.",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <WhatsAppButton />
      <MapButton />
      <Footer />
    </>
  );
}
