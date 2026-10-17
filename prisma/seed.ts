import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * Seed de DEMOSTRACIÓN — todos los datos son ficticios.
 * Usuarios demo:
 *   Admin:    demo@demopisos.cl / demo1234
 *   Vendedor: vendedor@demopisos.cl / demo1234
 */
const prisma = new PrismaClient();
const img = (slug: string) => JSON.stringify([`/demo/${slug}.svg`]);

const categorias = [
  { nombre: "Piso Vinílico SPC", slug: "pisos-spc", descripcion: "Pisos vinílicos rígidos SPC, resistentes al agua.", orden: 1 },
  { nombre: "Piso Flotante", slug: "piso-flotante", descripcion: "Pisos flotantes laminados de fácil instalación.", orden: 2 },
  { nombre: "Deck WPC", slug: "deck-wpc", descripcion: "Deck de madera plástica para terrazas y exteriores.", orden: 3 },
  { nombre: "Metal Siding", slug: "metal-siding", descripcion: "Revestimiento exterior metálico de alta durabilidad.", orden: 4 },
  { nombre: "Siding WPC", slug: "siding-wpc", descripcion: "Revestimiento exterior de compuesto madera-plástico.", orden: 5 },
  { nombre: "Piedra PU", slug: "piedra-pu", descripcion: "Paneles de poliuretano con textura de piedra natural.", orden: 6 },
];

// [categoria, slug-imagen, nombre, sku, precio m2, rendimiento (m2 por unidad de venta), unidadVenta, dimensiones, destacado, descuento %]
type P = [string, string, string, string, number, number, string, string, boolean, number?];
const productos: P[] = [
  ["pisos-spc", "spc-roble-natural", "Piso SPC Roble Natural (Caja 10 un.)", "DEMO-SPC-001", 16990, 2.23, "caja", "1220 x 183 x 5 mm", true, 10],
  ["pisos-spc", "spc-gris-ceniza", "Piso SPC Gris Ceniza (Caja 10 un.)", "DEMO-SPC-002", 16990, 2.23, "caja", "1220 x 183 x 5 mm", false],
  ["pisos-spc", "spc-nogal-oscuro", "Piso SPC Nogal Oscuro (Caja 10 un.)", "DEMO-SPC-003", 18490, 2.23, "caja", "1220 x 183 x 5 mm", false],
  ["piso-flotante", "flotante-haya", "Piso Flotante Haya 8 mm (Caja 8 un.)", "DEMO-FLO-001", 8990, 2.4, "caja", "1218 x 198 x 8 mm", true],
  ["piso-flotante", "flotante-blanco", "Piso Flotante Blanco Nórdico 8 mm (Caja 8 un.)", "DEMO-FLO-002", 9490, 2.4, "caja", "1218 x 198 x 8 mm", false],
  ["piso-flotante", "flotante-cerezo", "Piso Flotante Cerezo 12 mm (Caja 7 un.)", "DEMO-FLO-003", 12990, 1.48, "caja", "1218 x 173 x 12 mm", false, 15],
  ["deck-wpc", "deck-teca", "Deck WPC Teca 2,2 m", "DEMO-DEC-001", 32990, 0.32, "un", "2200 x 146 x 25 mm", true],
  ["deck-wpc", "deck-grafito", "Deck WPC Grafito 2,2 m", "DEMO-DEC-002", 32990, 0.32, "un", "2200 x 146 x 25 mm", false],
  ["deck-wpc", "deck-cafe", "Deck WPC Café 2,9 m", "DEMO-DEC-003", 34990, 0.42, "un", "2900 x 146 x 25 mm", false],
  ["metal-siding", "metal-negro", "Metal Siding Negro Mate 3 m", "DEMO-MET-001", 21990, 0.6, "un", "3000 x 200 x 16 mm", true],
  ["metal-siding", "metal-madera", "Metal Siding Imitación Madera 3 m", "DEMO-MET-002", 23990, 0.6, "un", "3000 x 200 x 16 mm", false],
  ["metal-siding", "metal-gris", "Metal Siding Gris Grafito 3 m", "DEMO-MET-003", 21990, 0.6, "un", "3000 x 200 x 16 mm", false],
  ["siding-wpc", "wpc-siding-teca", "Siding WPC Teca 2,9 m", "DEMO-SWP-001", 19990, 0.46, "un", "2900 x 156 x 21 mm", false],
  ["siding-wpc", "wpc-siding-gris", "Siding WPC Gris 2,9 m", "DEMO-SWP-002", 19990, 0.46, "un", "2900 x 156 x 21 mm", true],
  ["siding-wpc", "wpc-siding-nogal", "Siding WPC Nogal 2,9 m", "DEMO-SWP-003", 20990, 0.46, "un", "2900 x 156 x 21 mm", false],
  ["piedra-pu", "piedra-pizarra", "Panel Piedra PU Pizarra", "DEMO-PPU-001", 27990, 0.72, "un", "1200 x 600 x 25 mm", true],
  ["piedra-pu", "piedra-arena", "Panel Piedra PU Arena", "DEMO-PPU-002", 27990, 0.72, "un", "1200 x 600 x 25 mm", false],
  ["piedra-pu", "piedra-rustica", "Panel Piedra PU Rústica", "DEMO-PPU-003", 29990, 0.72, "un", "1200 x 600 x 25 mm", false, 5],
];

const slugify = (t: string) =>
  t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function main() {
  console.log("🌱 Insertando datos demo...");

  const demoPass = await bcrypt.hash("demo1234", 10);
  await prisma.admin.upsert({
    where: { email: "demo@demopisos.cl" },
    update: {},
    create: { email: "demo@demopisos.cl", password: demoPass },
  });

  for (const cat of categorias) {
    await prisma.categoria.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }

  for (const [catSlug, imgSlug, nombre, sku, precioM2, rend, unidadVenta, dimensiones, destacado, descuento] of productos) {
    const categoria = await prisma.categoria.findUniqueOrThrow({ where: { slug: catSlug } });
    const precio = descuento ? Math.round(precioM2 * (1 - descuento / 100)) : precioM2;
    await prisma.producto.upsert({
      where: { sku },
      update: {},
      create: {
        nombre,
        slug: `${slugify(nombre)}-${slugify(sku)}`,
        sku,
        descripcion: `${nombre}. Producto ficticio para la demostración del catálogo.`,
        dimensiones,
        unidad: "m2",
        precio,
        precioAntes: descuento ? precioM2 : null,
        descuento: descuento ?? null,
        marca: "DemoPisos",
        imagenes: img(imgSlug),
        destacado,
        rendimiento: rend,
        unidadVenta,
        precioUnitario: Math.round(precio * rend),
        categoriaId: categoria.id,
      },
    });
  }

  // Imagen de categoría = primera imagen de su primer producto
  for (const cat of await prisma.categoria.findMany({ where: { imagen: null }, include: { productos: { take: 1 } } })) {
    const first = cat.productos[0];
    if (first) await prisma.categoria.update({ where: { id: cat.id }, data: { imagen: JSON.parse(first.imagenes)[0] } });
  }

  await prisma.banner.deleteMany();
  await prisma.banner.createMany({
    data: [
      { titulo: "", imagen: "/demo/banner-1.svg", orden: 1 },
      { titulo: "", imagen: "/demo/banner-2.svg", orden: 2 },
    ],
  });

  if ((await prisma.sucursal.count()) === 0) {
    await prisma.sucursal.create({
      data: {
        nombre: "Casa Matriz",
        zona: "Zona Centro",
        direccion: "Av. Ejemplo 123, Santiago",
        region: "Región Metropolitana",
        esCasaMatriz: true,
        horarioAtencion: "Lun a Vie: 09:00 - 18:00 | Sáb: 09:00 - 13:30",
        horarioEntrega: "Lun a Vie: 09:00 - 17:00",
        whatsapp: "56912345678",
        telefono: "+56 9 1234 5678",
        emailPostventa: "postventa@demopisos.cl",
      },
    });
  }

  await prisma.configuracion.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nombreEmpresa: "DemoPisos",
      whatsappGlobal: "56912345678",
      emailContacto: "ventas@demopisos.cl",
      metaTitle: "DemoPisos - Catálogo de pisos y revestimientos (demo)",
      metaDescription: "Sitio de demostración: catálogo, panel admin y cotizador para vendedores.",
    },
  });

  await prisma.vendedor.upsert({
    where: { rut: "11.111.111-1" },
    update: {},
    create: { nombre: "Vendedor Demo", rut: "11.111.111-1", telefono: "+56 9 1234 5678", email: "vendedor@demopisos.cl", password: demoPass },
  });

  console.log("✅ Datos demo listos. Admin: demo@demopisos.cl / demo1234 · Vendedor: vendedor@demopisos.cl / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
