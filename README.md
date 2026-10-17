# DemoPisos — Product Catalog & Sales Quoting Platform

<p>
  <img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/>
</p>

> **This is a demo of the original source code behind [www.revestimientoschillan.cl](https://www.revestimientoschillan.cl)**, a flooring and cladding store in Chillán, Chile, which I developed and which runs in production.
> The client's data has been removed: brand, products, prices, images and users in this repository are **fictional**. The application code is the same.
>
> 🇨🇱 *Demo del código fuente original de [www.revestimientoschillan.cl](https://www.revestimientoschillan.cl), desarrollado por mí y en producción. Se eliminaron los datos del cliente: marca, productos, precios, imágenes y usuarios de este repositorio son ficticios.*
>
> 🔗 **Live site / Sitio en producción:** https://www.revestimientoschillan.cl

## What it does

A full-stack web platform for a building-materials store, with three areas:

| Area | Who uses it | Features |
|------|-------------|----------|
| **Public catalog** (`/`) | Customers | Categories, product pages with images, prices per m² and per unit, discounts, featured products, store locations, one-click **WhatsApp quote request** |
| **Admin panel** (`/admin`) | Store owner | CRUD for products, categories, banners, branches, sales reps and site settings · image upload · **bulk product import from Excel** · quote overview |
| **Sales portal** (`/vendedor`) | Sales reps | Create and edit quotes with customer data, live product search, m² → boxes/units calculation, discounts and VAT · export quotes to **PDF** and **Word (DOCX)** |

## Tech stack

- **Next.js 14** (App Router, Route Handlers as REST API) + **React 18** + **TypeScript**
- **Prisma ORM** on **PostgreSQL**
- **Tailwind CSS**
- Auth: **JWT** in httpOnly cookies + **bcrypt** password hashing, separate roles for admin and sales reps
- Documents: **jsPDF** + **html2canvas** (PDF), **docx** (Word), **SheetJS/xlsx** (Excel import)
- Production version deployed on **Vercel**

## Architecture

```
┌─────────────────────────┐      ┌──────────────────────────────┐
│  Public site  (SSR)     │      │  Admin panel   /admin        │
│  /[categoria]/[slug]    │      │  Sales portal  /vendedor     │
└───────────┬─────────────┘      └──────────────┬───────────────┘
            │  fetch                            │  fetch + JWT cookie
            ▼                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  Next.js Route Handlers  /api/*                                 │
│  productos · categorias · banners · sucursales · configuracion  │
│  vendedores · clientes · cotizaciones · auth · upload · import  │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Prisma Client
                                ▼
                        ┌───────────────┐
                        │  PostgreSQL   │
                        └───────────────┘
```

Data model: `Categoria` 1─N `Producto` · `Vendedor` 1─N `Cotizacion` N─1 `Cliente` · `Cotizacion` 1─N `CotizacionItem` · plus `Banner`, `Sucursal`, `Configuracion`, `Admin`. See [`prisma/schema.prisma`](prisma/schema.prisma).

## Run locally

Requirements: Node.js 18+ and a PostgreSQL database (local, [Neon](https://neon.tech), Supabase…).

```bash
git clone https://github.com/machukeitor1/demopisos-catalog.git
cd demopisos-catalog
npm install
cp .env.example .env      # set DATABASE_URL and JWT_SECRET
npm run db:setup          # creates tables + loads demo data
npm run dev               # http://localhost:3000
```

### Demo users

| Role | URL | Email | Password |
|------|-----|-------|----------|
| Admin | `/admin/login` | `demo@demopisos.cl` | `demo1234` |
| Sales rep | `/vendedor/login` | `vendedor@demopisos.cl` | `demo1234` |

## Notes

- Product images are generated SVG placeholders (`npm run placeholders` regenerates them).
- This repository is meant to be run locally; it is not deployed. To see the application working, visit the [live site](https://www.revestimientoschillan.cl).
- Image upload writes to `public/uploads`, which works locally; the production version uses object storage for images.
- `JWT_SECRET` is required in production; the app refuses to sign tokens without it.

## Author

**Cristian Machuca** — Full-stack developer · Chillán, Chile
[LinkedIn](https://www.linkedin.com/in/cristianmachuca-dev) · [GitHub](https://github.com/machukeitor1)
