import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";

type SearchResult = {
  title: string;
  url: string;
  description: string;
  source: string;
  domain: string;
  resultType: "shop" | "app";
  shopScore: number;
  schemaTypes: string[];
};

const APP_STORE_DOMAINS = new Set(["apps.apple.com", "play.google.com"]);

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "public, s-maxage=30, stale-while-revalidate=300",
  },
});

const normalize = (items: unknown[], source: string): SearchResult[] => items.map((raw) => {
  const item = raw as Record<string, unknown>;
  const url = String(item.url ?? item.link ?? "");
  let domain = "";
  try { domain = new URL(url).hostname.replace(/^www\./, "").toLowerCase(); } catch {}
  return {
    title: String(item.title ?? item.name ?? "Untitled result"),
    url,
    description: String(item.content ?? item.snippet ?? item.text ?? item.description ?? ""),
    source,
    domain,
    resultType: APP_STORE_DOMAINS.has(domain) ? "app" : "shop",
    shopScore: 0,
    schemaTypes: [],
  };
}).filter((item) => Boolean(item.url));

const withTimeout = async <T>(factory: (signal: AbortSignal) => Promise<T>, milliseconds = 9000): Promise<T> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), milliseconds);
  try { return await factory(controller.signal); } finally { clearTimeout(timeout); }
};

const collectSchemaNodes = (value: unknown, nodes: Record<string, unknown>[] = []) => {
  if (!value || typeof value !== "object") return nodes;
  if (Array.isArray(value)) { value.forEach((item) => collectSchemaNodes(item, nodes)); return nodes; }
  const object = value as Record<string, unknown>;
  if (object["@type"]) nodes.push(object);
  Object.values(object).forEach((child) => collectSchemaNodes(child, nodes));
  return nodes;
};

const schemaTypes = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string")
    : typeof value === "string" ? [value] : [];

async function inspectSchema(url: string, domain: string) {
  const appStore = APP_STORE_DOMAINS.has(domain);
  try {
    const response = await withTimeout((signal) => fetch(url, {
      signal,
      redirect: "follow",
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "ShopesBot/1.0 (+https://shopes.online)",
      },
    }), 5000);

    if (!response.ok) return { score: appStore ? 100 : 0, types: [] as string[], name: undefined, description: undefined };

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return { score: appStore ? 100 : 0, types: [] as string[], name: undefined, description: undefined };
    }

    const html = (await response.text()).slice(0, 1500000);
    const nodes: Record<string, unknown>[] = [];

    for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      try { collectSchemaNodes(JSON.parse(match[1].trim()), nodes); } catch {}
    }

    const types = [...new Set(nodes.flatMap((node) =>
      schemaTypes(node["@type"]).map((type) => type.split("/").pop() || type),
    ))];

    const lower = new Set(types.map((type) => type.toLowerCase()));
    const pageText = html.toLowerCase();
    let score = appStore ? 100 : 0;

    if (lower.has("onlinestore")) score += 100;
    if (lower.has("onlinebusiness")) score += 55;
    if (lower.has("product")) score += 45;
    if (lower.has("offer")) score += 35;
    if (lower.has("aggregateoffer")) score += 20;
    if (lower.has("softwareapplication")) score += 80;
    if (lower.has("mobileapplication")) score += 80;
    if (lower.has("organization")) score += 10;

    // Some major marketplaces do not expose OnlineStore JSON-LD consistently.
    // Strong commerce signals from the page can still qualify an otherwise valid shop.
    const commerceSignals = [
      /add to (cart|basket)/i,
      /buy now/i,
      /shopping cart/i,
      /checkout/i,
      /\bprice\b/i,
      /\bproducts?\b/i,
      /\bshipping\b/i,
    ];
    const commerceSignalCount = commerceSignals.filter((pattern) => pattern.test(pageText)).length;
    if (commerceSignalCount >= 3) score += 45;

    const store = nodes.find((node) =>
      schemaTypes(node["@type"]).some((type) =>
        ["OnlineStore", "OnlineBusiness", "Organization", "SoftwareApplication", "MobileApplication"].includes(type),
      ),
    );

    return {
      score,
      types,
      name: typeof store?.name === "string" ? store.name : undefined,
      description: typeof store?.description === "string" ? store.description : undefined,
    };
  } catch {
    return {
      score: appStore ? 100 : 0,
      types: [] as string[],
      name: undefined,
      description: undefined,
    };
  }
}

async function tavily(query: string) {
  const key = getSecret("TAVILY_API_KEY");
  if (!key) return [];

  const shopQuery = [
    "Find actual online shops, ecommerce stores, retailers, official brand stores, and official app-store listings relevant to:",
    query,
    "Prioritize pages that represent something users can shop from or install.",
    "For mobile apps, prefer official Apple App Store or Google Play listings.",
    "Avoid news, articles, blogs, social media, directories, reviews, guides, and informational pages.",
  ].join(" ");

  const response = await withTimeout((signal) => fetch("https://api.tavily.com/search", {
    method: "POST",
    signal,
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      api_key: key,
      query: shopQuery,
      topic: "general",
      search_depth: "advanced",
      max_results: 20,
      include_answer: false,
      include_raw_content: false,
    }),
  }));

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error("Tavily " + response.status + (detail ? ": " + detail.slice(0, 160) : ""));
  }

  const data = await response.json() as { results?: unknown[] };
  return normalize(data.results ?? [], "Tavily");
}

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) return json({ results: [], providers: [] });
  if (query.length > 200) return json({ error: "Query too long" }, 400);

  const [tavilyResult] = await Promise.allSettled([tavily(query)]);
  const candidates = tavilyResult.status === "fulfilled" ? tavilyResult.value : [];

  const enriched = await Promise.all(candidates.map(async (result) => {
    const schema = await inspectSchema(result.url, result.domain);
    const resultType = result.resultType === "app" || schema.types.some((type) =>
      ["SoftwareApplication", "MobileApplication"].includes(type),
    ) ? "app" : "shop";

    return {
      ...result,
      resultType,
      title: schema.name || result.title,
      description: schema.description || result.description,
      shopScore: schema.score,
      schemaTypes: schema.types,
    };
  }));

  const unique = new Map<string, SearchResult>();
  for (const result of enriched) {
    const canonicalUrl = result.url.replace(/#.*$/, "").replace(/\/$/, "");
    if (!unique.has(canonicalUrl)) unique.set(canonicalUrl, result);
  }

  const results = [...unique.values()]
    .filter((result) => result.shopScore >= 35)
    .sort((a, b) => b.shopScore - a.shopScore)
    .slice(0, 30);

  return json({
    results,
    providers: getSecret("TAVILY_API_KEY") ? ["Tavily", "Schema.org JSON-LD"] : [],
  });
};
