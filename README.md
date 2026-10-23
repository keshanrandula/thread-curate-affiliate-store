# 🛍️ THREAD & CURATE — Modern Affiliate Commerce Platform

A modern, ultra-fast, SEO-optimized **Next.js (App Router) + TypeScript** affiliate marketing web platform. Products are **not sold directly**: each product has an external affiliate URL and an optimized **"Buy now"** action that tracks outbound click events and redirects directly to verified merchant checkout pages (Amazon, ASOS, Nike, Nordstrom, Everlane, Awin, ShareASale, CJ Affiliate, etc.).

The platform is **niche-agnostic** (administrators can add custom categories, attributes, and vertical markets at any time), seeded out-of-the-box with an initial **luxury fashion store** containing 4 categories and 24 demo fashion items.

---

## 🚀 Key Highlights & Architecture

### 1. Public Storefront (`app/(shop)`)
- **Homepage (`/`)**: High-converting hero section, category grid, curated featured products, trending items carousel, and newsletter intake.
- **Shop / Catalog (`/shop`)**: Instant multi-attribute filtering (category, price range, brand, color, size, tags, rating), search with query highlight, and sorting (price low/high, newest, most popular).
- **Product Detail (`/product/[slug]`)**: Multi-angle image gallery with zoom preview, price discount computation (`comparePrice`), dynamic key-value specifications, trust badges, affiliate partner disclosure, and related products carousel.
- **Category Collections (`/category/[slug]`)**: Breadcrumb navigation, subcategory links, dynamic hero, and filtered product feed.
- **Search (`/search`)**: Dedicated full-text search with instant results and fallback suggestions.
- **Wishlist**: Client-side persisted drawer and quick toggle across cards and product views.
- **Legal Compliance**: Persistent/dismissible FTC affiliate disclosure ribbon, contextual affiliate disclaimer near checkout buttons, and dedicated `/disclosure`, `/privacy`, `/about`, and `/contact` pages.

### 2. Merchant Admin Dashboard (`app/(admin)/admin`)
- **Protected by Auth.js / Jose Middleware**: Strictly guards `/admin/:path*`, redirecting unauthenticated users to `/admin/login`.
- **Analytics Overview (`/admin`)**: Metric cards (Total Products, Published vs Drafts, Clicks 7d/30d), interactive **Recharts** clicks over time line chart, Top 10 clicked products table, and live click stream.
- **Product Management (`/admin/products`)**:
  - Filterable data table (search, category, status, featured).
  - Multi-row bulk actions (**Publish**, **Unpublish**, **Delete**).
  - One-click product duplication.
  - CSV catalog Export & CSV Import with format validation.
  - Interactive Create/Edit form: auto-slug generation, dynamic key-value attributes, tags editor, multiple image upload with **HTML5 drag-to-reorder**.
- **Category Hierarchy (`/admin/categories`)**: Tree view of parent & child categories, inline add/edit modal, delete confirmation, and drag-and-drop sort reordering.
- **Detailed Click Logs (`/admin/clicks`)**: Outbound click audit trail with IP/User-Agent, product, referrer, and timestamps.
- **Deep Analytics (`/admin/analytics`)**: Interactive 7/14/30/90 day date-range selector, daily clicks area chart, category share breakdown, and affiliate network performance.
- **Site Settings & SEO (`/admin/settings`)**: Branding, logo URL preview, hero headline/subhead, editable FTC disclosure text, and social links.

---

## ⚡ Performance, SEO & Lighthouse Optimization

- **Image Optimization**:
  - Enabled Next.js modern image formats (`image/avif`, `image/webp`).
  - Next/Image with responsive `sizes` attribute and `priority` on above-the-fold hero and gallery images.
- **Font Optimization**:
  - Zero-layout-shift Google Font (`Inter`) using `next/font/google` with `display: 'swap'` and CSS variable scoping.
- **On-Demand Cache Revalidation (ISR)**:
  - High-traffic public pages leverage static caching with Next.js ISR.
  - Server Actions in `/admin` invalidate cache tags (`products`, `categories`, `settings`) with `revalidateTag` and `revalidatePath` so public storefront reflects changes instantly.
- **Dynamic SEO & Metadata**:
  - `generateMetadata` implemented on every public page with OpenGraph images, Twitter summary cards, and canonical URL tags.
  - Dynamic `sitemap.xml` generated automatically from live database routes at `/sitemap.xml`.
  - Dynamic `robots.txt` disallowing `/admin` and `/go/` while pointing search engines to `sitemap.xml`.
- **JSON-LD Structured Data**:
  - Schema.org `Product` structured data with price, currency, availability, and rating.
  - Schema.org `BreadcrumbList` on category and product detail pages.
  - Schema.org `Organization` and `WebSite` on root layout for Google rich snippets.
- **Custom Error Boundaries**:
  - Custom branded 404 page (`app/not-found.tsx`) with search bar and popular links.
  - Custom interactive error boundary (`app/error.tsx`) with reset action.
  - Root global error handler (`app/global-error.tsx`).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Turbopack, App Router, Server Actions)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + Dark Luxury Modern Aesthetic
- **Database**: MongoDB (via Mongoose) with deterministic fallback demo mode
- **Authentication**: JWT HttpOnly session cookies (`jose` + `bcryptjs`) with Edge Middleware protection
- **Charts**: Recharts
- **Icons**: Lucide React
- **Toast Notifications**: Sonner
- **Validation**: Zod

---

## 📦 Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd "affilte  marketing website"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Populate the required environment variables:
```env
# MongoDB Connection String (Local or MongoDB Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/affiliate_shop

# JWT Secret for Admin Session Signing
AUTH_SECRET=generate-a-32-byte-secret-key-here-with-openssl-rand-hex-32

# Admin Default Credentials
ADMIN_EMAIL=admin@affiliate.com
ADMIN_PASSWORD=admin123

# Public Site URL (Used for Canonical URLs, Open Graph, and Sitemap)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Storage Provider for Image Uploads (direct-url | local-base64 | cloudinary | uploadthing)
STORAGE_PROVIDER=direct-url
```

> **Note on Database Flexibility**: If `MONGODB_URI` is not provided or MongoDB is offline during local exploration, the application automatically activates **in-memory fallback demo mode** ([lib/db-fallback.ts](file:///d:/newproject/affilte%20%20marketing%20website/lib/db-fallback.ts)), allowing you to test UI features immediately without crashing.

### 3. Seed Database
Populate initial categories, products, default site settings, and the admin account:
```bash
npm run seed
```

**Default Admin Credentials:**
- **URL**: `http://localhost:3000/admin`
- **Email**: `admin@affiliate.com`
- **Password**: `admin123`

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront, or [http://localhost:3000/admin](http://localhost:3000/admin) for the dashboard.

### 5. Code Quality & Type Check
```bash
# Run ESLint
npm run lint

# Run TypeScript Typecheck
npx tsc --noEmit

# Run Next.js Production Build
npm run build
```

---

## 🚀 Deployment Guide

### Option A: Deploy to Vercel + MongoDB Atlas (Recommended)

#### Step 1: Set up MongoDB Atlas (Free Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account.
2. Create a new free cluster (Shared M0 Sandbox).
3. Under **Security > Database Access**, add a new database user (e.g. `affiliate_admin`) and generate a secure password.
4. Under **Security > Network Access**, click **Add IP Address** and select **Allow Access from Anywhere (`0.0.0.0/0`)** so Vercel Serverless Functions can connect.
5. In the cluster overview, click **Connect > Drivers > Node.js** and copy your connection string:
   ```
   mongodb+srv://affiliate_admin:<password>@cluster0.mongodb.net/affiliate_shop?retryWrites=true&w=majority&appName=Cluster0
   ```

#### Step 2: Push Your Code to GitHub / GitLab
```bash
git init
git add .
git commit -m "feat: complete affiliate marketing platform"
git remote add origin https://github.com/your-username/affiliate-shop.git
git push -u origin main
```

#### Step 3: Deploy to Vercel
1. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Import your GitHub repository.
3. In the **Environment Variables** section, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `AUTH_SECRET`: A secure 32+ character random secret (run `openssl rand -hex 32` in terminal).
   - `ADMIN_EMAIL`: Your production admin email (e.g., `admin@yourdomain.com`).
   - `ADMIN_PASSWORD`: Your strong admin password.
   - `NEXT_PUBLIC_SITE_URL`: Your Vercel production URL (e.g. `https://your-domain.vercel.app`).
   - `STORAGE_PROVIDER`: `direct-url` (or your Cloudinary / UploadThing keys if configuring image uploads).
4. Click **Deploy**. Vercel will build the production application with Turbopack and deploy to their global edge network.

#### Step 4: Seed Production Database
Once deployed, seed your MongoDB Atlas cluster by running the seed command locally with your Atlas URI:
```bash
MONGODB_URI="mongodb+srv://..." npm run seed
```

---

### Option B: Deploy with Hosted Postgres (Neon / Supabase)

If your organization prefers PostgreSQL over MongoDB:

1. **Provision Database**:
   - **Neon**: Create a serverless Postgres project at [neon.tech](https://neon.tech) and copy the pooled connection string (`postgres://...sslmode=require`).
   - **Supabase**: Create a project at [supabase.com](https://supabase.com) and retrieve the Transaction Connection Pooler URI (port `6543`).
2. **Schema Migration via Prisma or Drizzle**:
   The current models in `models/` follow standard relational mapping:
   ```prisma
   // Example schema.prisma for Postgres migration
   model Category {
     id          String    @id @default(cuid())
     name        String
     slug        String    @unique
     description String?
     image       String?
     parentId    String?
     sortOrder   Int       @default(0)
     products    Product[]
   }

   model Product {
     id               String      @id @default(cuid())
     title            String
     slug             String      @unique
     description      String
     images           String[]
     price            Float
     comparePrice     Float?
     currency         String      @default("USD")
     brand            String
     rating           Float       @default(4.8)
     affiliateUrl     String
     affiliateNetwork String
     isFeatured       Boolean     @default(false)
     isPublished      Boolean     @default(true)
     clicks           Int         @default(0)
     categoryId       String
     category         Category    @relation(fields: [categoryId], references: [id])
     tags             String[]
     attributes       Json        @default("{}")
     clickEvents      ClickEvent[]
     createdAt        DateTime    @default(now())
     updatedAt        DateTime    @updatedAt
   }

   model ClickEvent {
     id        String   @id @default(cuid())
     productId String
     product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
     referrer  String?
     userAgent String?
     createdAt DateTime @default(now())
   }

   model SiteSettings {
     id             String   @id @default(cuid())
     siteName       String   @default("THREAD & CURATE")
     logo           String?
     heroTitle      String
     heroSubtitle   String
     disclosureText String
     socialLinks    Json     @default("{}")
   }
   ```
3. Swap `lib/api.ts` data queries to query Postgres via Prisma Client or Drizzle ORM.
4. Set `DATABASE_URL` in Vercel environment variables.

---

## ⚖️ FTC Affiliate Legal Compliance

Under United States Federal Trade Commission (FTC) guidelines, digital publishers must clearly and conspicuously disclose affiliate relationships:
1. **Header Ribbon**: Notice at the top of every page informing users that links may earn an affiliate commission.
2. **Contextual Disclosure**: Displayed alongside every external merchant redirect button on product detail pages.
3. **Footer Notice**: Permanent editorial ethics and commission disclosure on every page footer.
4. **Dedicated Disclosure Page**: Detailed editorial policy at `/disclosure` explaining merchant relationships, editorial independence, and consumer pricing neutrality.

---

## 📄 License
MIT License. Crafted for modern, high-converting affiliate commerce.
