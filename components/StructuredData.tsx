export interface BreadcrumbListItem {
  name: string;
  url: string;
}

export function ProductJsonLd({ product, siteUrl = "http://localhost:3000" }: { product: any; siteUrl?: string }) {
  if (!product) return null;

  const baseUrl = siteUrl.replace(/\/$/, "");
  const productUrl = `${baseUrl}/product/${product.slug}`;
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [`${baseUrl}/placeholder.png`];

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: images,
    description: product.description || `${product.title} by ${product.brand}`,
    brand: {
      "@type": "Brand",
      name: product.brand || "Brand",
    },
    sku: product._id ? String(product._id) : product.slug,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating || 4.8,
      bestRating: "5",
      worstRating: "1",
      reviewCount: Math.floor((product.clicks || 5) * 1.5) + 14,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency || "USD",
      price: product.price,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      url: productUrl,
      seller: {
        "@type": "Organization",
        name: product.affiliateNetwork || "Affiliate Partner",
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "US",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0.00",
          currency: product.currency || "USD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "US",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbListJsonLd({ items, siteUrl = "http://localhost:3000" }: { items: BreadcrumbListItem[]; siteUrl?: string }) {
  if (!items || items.length === 0) return null;

  const baseUrl = siteUrl.replace(/\/$/, "");
  const itemListElement = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url.startsWith("/") ? "" : "/"}${item.url}`,
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd({
  siteName = "THREAD & CURATE",
  url = "http://localhost:3000",
  logo,
  socialLinks = {},
}: {
  siteName?: string;
  url?: string;
  logo?: string;
  socialLinks?: Record<string, string | undefined>;
}) {
  const sameAs = Object.values(socialLinks).filter(Boolean) as string[];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url,
    logo: logo || undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteJsonLd({
  siteName = "THREAD & CURATE",
  url = "http://localhost:3000",
}: {
  siteName?: string;
  url?: string;
}) {
  const baseUrl = url.replace(/\/$/, "");
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ItemListJsonLd({
  name,
  description,
  items,
  siteUrl = "http://localhost:3000",
}: {
  name: string;
  description?: string;
  items: Array<{ name: string; url: string; image?: string; price?: number }>;
  siteUrl?: string;
}) {
  if (!items || items.length === 0) return null;

  const baseUrl = siteUrl.replace(/\/$/, "");
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description: description || undefined,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url.startsWith("/") ? "" : "/"}${item.url}`,
      image: item.image || undefined,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
