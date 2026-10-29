import assert from "node:assert";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const BASE_URL = "http://localhost:3000";

const results = [];

function record(name, passed, detail = "") {
  results.push({ name, passed, detail });
  const icon = passed ? "✓ PASS" : "✗ FAIL";
  console.log(`${icon}: ${name}${detail ? ` (${detail})` : ""}`);
}

async function runTests() {
  console.log("=========================================");
  console.log("   AUTOMATED ROUTE & REDIRECT TESTS      ");
  console.log("=========================================\n");

  // 1. Home page test
  try {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert.ok(html.includes("Curated Style") || html.includes("affiliate-shop"), "Home page content missing");
    record("GET / (Home Page)", true, `Status ${res.status}, length ${html.length}`);
  } catch (err) {
    record("GET / (Home Page)", false, err.message);
  }

  // 2. Shop page test
  try {
    const res = await fetch(`${BASE_URL}/shop`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert.ok(html.includes("Shop") || html.includes("Products"), "Shop catalog content missing");
    record("GET /shop (Catalog)", true, `Status ${res.status}, length ${html.length}`);
  } catch (err) {
    record("GET /shop (Catalog)", false, err.message);
  }

  // 3. Category page test
  try {
    const res = await fetch(`${BASE_URL}/category/men`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert.ok(html.includes("Men"), "Category 'Men' content missing");
    record("GET /category/men (Category Page)", true, `Status ${res.status}`);
  } catch (err) {
    record("GET /category/men (Category Page)", false, err.message);
  }

  // 4. Product page test
  try {
    const res = await fetch(`${BASE_URL}/product/classic-merino-wool-crewneck-sweater`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert.ok(
      html.includes("Classic Merino Wool Crewneck") || html.includes("Sweater"),
      "Product title missing from page"
    );
    record("GET /product/:slug (Product Detail)", true, `Status ${res.status}`);
  } catch (err) {
    record("GET /product/:slug (Product Detail)", false, err.message);
  }

  // 5. Admin login page test
  try {
    const res = await fetch(`${BASE_URL}/admin/login`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert.ok(html.includes("Admin") || html.includes("Login"), "Admin login content missing");
    record("GET /admin/login (Admin Login)", true, `Status ${res.status}`);
  } catch (err) {
    record("GET /admin/login (Admin Login)", false, err.message);
  }

  // 6. Robots.txt and Sitemap.xml
  try {
    const resRobots = await fetch(`${BASE_URL}/robots.txt`);
    assert.strictEqual(resRobots.status, 200, `Expected 200 for robots.txt`);
    const robotsTxt = await resRobots.text();
    assert.ok(robotsTxt.includes("User-Agent") || robotsTxt.includes("Disallow"), "Invalid robots.txt");
    record("GET /robots.txt", true, `Status ${resRobots.status}`);
  } catch (err) {
    record("GET /robots.txt", false, err.message);
  }

  try {
    const resSitemap = await fetch(`${BASE_URL}/sitemap.xml`);
    assert.strictEqual(resSitemap.status, 200, `Expected 200 for sitemap.xml`);
    record("GET /sitemap.xml", true, `Status ${resSitemap.status}`);
  } catch (err) {
    record("GET /sitemap.xml", false, err.message);
  }

  console.log("\n=========================================");
  console.log("   AUTOMATED /go/[id] REDIRECT TESTS     ");
  console.log("=========================================\n");

  // 7. /go/[slug] redirect test with manual redirect handling
  try {
    const res = await fetch(`${BASE_URL}/go/classic-merino-wool-crewneck-sweater`, {
      redirect: "manual",
    });
    // In Next.js, NextResponse.redirect(url, { status: 307 }) returns 307
    assert.strictEqual(res.status, 307, `Expected 307 redirect, got ${res.status}`);
    const location = res.headers.get("location");
    assert.ok(location, "Missing Location header");
    assert.ok(
      location.startsWith("http://") || location.startsWith("https://"),
      `Expected valid redirect URL, got ${location}`
    );
    const cacheControl = res.headers.get("cache-control");
    assert.ok(
      cacheControl && cacheControl.includes("no-store"),
      `Expected Cache-Control: no-store, got ${cacheControl}`
    );
    record("GET /go/:slug (Valid Redirect 307)", true, `Redirects to ${location}`);
  } catch (err) {
    record("GET /go/:slug (Valid Redirect 307)", false, err.message);
  }

  // 8. /go/[id] redirect test with demo fallback ID
  try {
    const res = await fetch(`${BASE_URL}/go/prod_demo_1`, {
      redirect: "manual",
    });
    assert.strictEqual(res.status, 307, `Expected 307 redirect, got ${res.status}`);
    const location = res.headers.get("location");
    assert.ok(location, "Missing Location header");
    record("GET /go/:id (Demo ID 307)", true, `Redirects to ${location}`);
  } catch (err) {
    record("GET /go/:id (Demo ID 307)", false, err.message);
  }

  // 9. /go/nonexistent test (should redirect to /shop)
  try {
    const res = await fetch(`${BASE_URL}/go/nonexistent-slug-xyz`, {
      redirect: "manual",
    });
    // Next.js NextResponse.redirect(new URL("/shop", request.url)) default status is 307 or 302
    assert.ok(
      res.status === 307 || res.status === 302,
      `Expected 307/302 redirect for not found, got ${res.status}`
    );
    const location = res.headers.get("location");
    assert.ok(
      location && location.endsWith("/shop"),
      `Expected redirect to /shop, got ${location}`
    );
    record("GET /go/nonexistent (Fallback to /shop)", true, `Redirects to ${location}`);
  } catch (err) {
    record("GET /go/nonexistent (Fallback to /shop)", false, err.message);
  }

  console.log("\n=========================================");
  console.log("   AUTOMATED BROWSER TESTING (CHROME)    ");
  console.log("=========================================\n");

  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  try {
    // Run headless Chrome to render the home page and dump the DOM
    const { stdout } = await execFileAsync(chromePath, [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--dump-dom",
      `${BASE_URL}/`,
    ]);
    assert.ok(stdout.includes("<html"), "Chrome failed to render HTML DOM");
    assert.ok(
      stdout.includes("Curated Style") || stdout.includes("affiliate-shop"),
      "Chrome rendered DOM missing core content"
    );
    record("Chrome Headless DOM Render (/) ", true, `Rendered ${stdout.length} bytes`);
  } catch (err) {
    record("Chrome Headless DOM Render (/) ", false, err.message);
  }

  try {
    // Run headless Chrome to render the shop page
    const { stdout } = await execFileAsync(chromePath, [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--dump-dom",
      `${BASE_URL}/shop`,
    ]);
    assert.ok(stdout.includes("<html"), "Chrome failed to render shop DOM");
    record("Chrome Headless DOM Render (/shop) ", true, `Rendered ${stdout.length} bytes`);
  } catch (err) {
    record("Chrome Headless DOM Render (/shop) ", false, err.message);
  }

  // Summary
  console.log("\n=========================================");
  console.log("             TEST SUMMARY                ");
  console.log("=========================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log("\nALL AUTOMATED TESTS PASSED SUCCESSFULLY!");
  }
}

runTests();

