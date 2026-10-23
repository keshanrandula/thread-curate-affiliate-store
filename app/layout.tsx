import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/StructuredData";
import { getSiteSettings } from "@/lib/api";
import { ThemeProvider } from "@/components/ThemeProvider";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "THREAD & CURATE | Curated Clothes & Verified Fashion Deals",
    template: "%s | THREAD & CURATE",
  },
  description:
    "Discover handpicked designer clothes, footwear, outerwear, and accessories. Curated deals with verified merchant affiliate links.",
  keywords: [
    "affiliate shop",
    "fashion deals",
    "designer clothes",
    "menswear",
    "womenswear",
    "curated fashion",
    "merino wool",
    "denim",
    "handpicked apparel",
  ],
  authors: [{ name: "Thread & Curate", url: siteUrl }],
  creator: "Thread & Curate",
  publisher: "Thread & Curate",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "THREAD & CURATE | Verified Fashion Deals",
    description:
      "Handpicked clothing, outerwear, and accessories from vetted top-tier affiliate brands.",
    url: siteUrl,
    siteName: "THREAD & CURATE",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "THREAD & CURATE Fashion Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "THREAD & CURATE | Verified Fashion Deals",
    description:
      "Handpicked clothing, outerwear, and accessories from vetted top-tier affiliate brands.",
    creator: "@threadandcurate",
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&h=630&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${plusJakarta.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('app-theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s||'dark';var r=t==='system'?(p?'dark':'light'):t;if(r==='dark'){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme','light');document.documentElement.style.colorScheme='light';}}catch(e){}})();`,
          }}
        />
        <OrganizationJsonLd
          siteName={settings.siteName}
          url={siteUrl}
          logo={settings.logo}
          socialLinks={settings.socialLinks}
        />
        <WebsiteJsonLd siteName={settings.siteName} url={siteUrl} />
      </head>
      <body className="min-h-screen bg-stone-50 text-stone-900 dark:bg-[#0c0a09] dark:text-[#fafaf9] font-sans antialiased selection:bg-amber-500/30 selection:text-amber-800 dark:selection:text-amber-200">
        <ThemeProvider defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
