import { writeFile } from "node:fs/promises";

const baseUrl = new URL(process.argv[2] ?? process.env.CRAWL_URL ?? "http://localhost:3000");
const maxPages = Number(process.env.CRAWL_MAX_PAGES ?? 250);
const queue = [new URL("/", baseUrl).href];
const visited = new Set();
const report = {
  baseUrl: baseUrl.origin,
  pages: [],
  brokenLinks: [],
  brokenImages: [],
  apiFailures: [],
  redirects: [],
};

function isSameOrigin(url) {
  return url.origin === baseUrl.origin;
}

function normalizeUrl(value, currentUrl) {
  try {
    const url = new URL(value, currentUrl);
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

async function request(url, options = {}) {
  const startedAt = Date.now();
  const response = await fetch(url, {
    redirect: "manual",
    headers: { "user-agent": "bubble-buddy-production-crawler/1.0" },
    ...options,
  });
  const location = response.headers.get("location");
  if (location) {
    const target = normalizeUrl(location, url);
    report.redirects.push({ from: url, status: response.status, to: target?.href ?? location });
  }
  return { response, durationMs: Date.now() - startedAt };
}

async function checkResource(url, kind, source) {
  try {
    const { response } = await request(url, { method: "HEAD" });
    if (response.status >= 400) {
      const failure = { url, status: response.status, source };
      if (kind === "image") report.brokenImages.push(failure);
      else if (kind === "api") report.apiFailures.push(failure);
      else report.brokenLinks.push(failure);
    }
  } catch (error) {
    const failure = { url, status: "network-error", source, error: String(error) };
    if (kind === "image") report.brokenImages.push(failure);
    else if (kind === "api") report.apiFailures.push(failure);
    else report.brokenLinks.push(failure);
  }
}

while (queue.length > 0 && visited.size < maxPages) {
  const url = queue.shift();
  if (!url || visited.has(url)) continue;
  visited.add(url);

  try {
    const { response, durationMs } = await request(url);
    const contentType = response.headers.get("content-type") ?? "";
    report.pages.push({ url, status: response.status, durationMs });

    if (response.status >= 400) {
      report.brokenLinks.push({ url, status: response.status, source: "page" });
      continue;
    }

    if (!contentType.includes("text/html")) continue;
    const html = await response.text();
    const links = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map((match) => match[1]);

    for (const rawValue of links) {
      const resourceUrl = normalizeUrl(rawValue, url);
      if (!resourceUrl || !isSameOrigin(resourceUrl)) continue;
      const resource = resourceUrl.href;
      const pathname = resourceUrl.pathname;
      const kind = pathname.startsWith("/api/") ? "api" : /\.(?:png|jpe?g|gif|webp|avif|svg|ico)$/i.test(pathname) ? "image" : "link";

      if (kind === "link" && !visited.has(resource) && queue.length + visited.size < maxPages) {
        queue.push(resource);
      } else if (kind !== "link") {
        await checkResource(resource, kind, url);
      }
    }
  } catch (error) {
    report.brokenLinks.push({ url, status: "network-error", source: "page", error: String(error) });
  }
}

for (const path of ["/robots.txt", "/sitemap.xml", "/this-route-does-not-exist"]) {
  const url = new URL(path, baseUrl).href;
  try {
    const { response } = await request(url);
    report.pages.push({ url, status: response.status, durationMs: 0 });
    if (path === "/this-route-does-not-exist" && response.status !== 404) {
      report.brokenLinks.push({ url, status: response.status, source: "404-check" });
    }
  } catch (error) {
    report.brokenLinks.push({ url, status: "network-error", source: "special-route", error: String(error) });
  }
}

const outputPath = process.env.CRAWL_REPORT ?? "production-crawl-report.json";
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(`Crawled ${report.pages.length} responses from ${report.baseUrl}`);
console.log(`Broken links: ${report.brokenLinks.length}`);
console.log(`Broken images: ${report.brokenImages.length}`);
console.log(`API failures: ${report.apiFailures.length}`);
console.log(`Redirect responses: ${report.redirects.length}`);
console.log(`Report: ${outputPath}`);

if (report.brokenLinks.length > 0) {
  process.exitCode = 1;
}