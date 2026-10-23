import { getCategories, getSiteSettings } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AffiliateDisclosureBanner } from "@/components/AffiliateDisclosureBanner";
import { WebsiteJsonLd } from "@/components/StructuredData";
import { WishlistProvider } from "@/components/WishlistProvider";
import { WishlistDrawer } from "@/components/WishlistDrawer";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <WishlistProvider>
      <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900 dark:bg-[#09090b] dark:text-[#f4f4f5] transition-colors duration-200">
        <WebsiteJsonLd siteName={settings.siteName} />
        <AffiliateDisclosureBanner customText={settings.disclosureText} />
        <Navbar categories={categories} siteName={settings.siteName} />
        <WishlistDrawer />
        <main className="flex-1">{children}</main>
        <Footer
          siteName={settings.siteName}
          disclosureText={settings.disclosureText}
          socialLinks={settings.socialLinks}
        />
      </div>
    </WishlistProvider>
  );
}
