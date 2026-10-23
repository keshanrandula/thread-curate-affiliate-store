import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product, ClickEvent } from "@/models";
import { FALLBACK_PRODUCTS } from "@/lib/db-fallback";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userAgent = request.headers.get("user-agent") || "unknown";
  const referrer = request.headers.get("referer") || "";

  let affiliateUrl: string | null = null;
  let targetProductId: any = null;

  try {
    await connectToDatabase();
    
    // Check by ObjectId or slug
    let product: any = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ slug: id });
    }

    if (product) {
      affiliateUrl = product.affiliateUrl;
      targetProductId = product._id;

      // Increment click count & record event asynchronously
      await Promise.allSettled([
        Product.findByIdAndUpdate(targetProductId, { $inc: { clicks: 1 } }),
        ClickEvent.create({
          productId: targetProductId,
          referrer,
          userAgent,
        }),
      ]);
    }
  } catch (err) {
    console.warn("Click tracking error (falling back):", (err as any).message);
  }

  // Fallback check
  if (!affiliateUrl) {
    const fallbackProd =
      FALLBACK_PRODUCTS.find((p) => p._id === id || p.slug === id);
    if (fallbackProd) {
      fallbackProd.clicks += 1;
      affiliateUrl = fallbackProd.affiliateUrl;
    }
  }

  if (affiliateUrl) {
    // 307 Temporary Redirect preserves affiliate referral context and prevents search engine indexing of redirect
    return NextResponse.redirect(affiliateUrl, {
      status: 307,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }

  // If not found, redirect to shop catalog
  return NextResponse.redirect(new URL("/shop", request.url));
}
