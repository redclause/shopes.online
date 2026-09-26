import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";

type SearchResult = {
  title: string;
  url: string;
  description: string;
  source: string;
  domain: string;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, s-maxage=30, stale-while-revalidate=300",
    },
  });

const normalize = (items: unknown[], source: string): SearchResult[] =>
  items
    .map((raw) => {
      const item = raw as Record<string, unknown>;
      const url = String(item.url ?? item.link ?? "");
      return {
        title: String(item.title ?? item.name ?? "Untitled result"),
        url,
        description: String(item.content ?? item.snippet ?? item.text ?? item.description ?? ""),
        source,
        domain: (() => {
          try {
            return new URL(url).hostname.replace(/^www\./, "");
          } catch {
            return "";
          }
        })(),
      };
    })
    .filter((item) => Boolean(item.url));

const withTimeout = async <T>(
  promiseFactory: (signal: AbortSignal) => Promise<T>,
  milliseconds = 9000,
): Promise<T> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), milliseconds);
  try {
    return await promiseFactory(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
};

async function tavily(query: string) {
  const key = getSecret("TAVILY_API_KEY");
  if (!key) return [];

  const shopQuery = `Find online shops, ecommerce stores, retailers, and official store websites relevant to: ${query}. Return shopping websites rather than news, articles, blogs, social media, directories, reviews, or informational pages.`;

  const response = await withTimeout((signal) =>
    fetch("https://api.tavily.com/search", {
      method: "POST",
      signal,
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        api_key: key,
        query: shopQuery,
        topic: "general",
        search_depth: "advanced",
        max_results: 15,
        include_answer: false,
        include_raw_content: false,
      }),
    }),
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Tavily ${response.status}${detail ? `: ${detail.slice(0, 160)}` : ""}`);
  }

  const data = (await response.json()) as { results?: unknown[] };
  return normalize(data.results ?? [], "Tavily");
}

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("q")?.trim() ?? "";

  if (!query) return json({ results: [], providers: [] });
  if (query.length > 200) return json({ error: "Query too long" }, 400);

  const [tavilyResult] = await Promise.allSettled([tavily(query)]);

  const results =
    tavilyResult.status === "fulfilled" ? tavilyResult.value : [];

  const providers = getSecret("TAVILY_API_KEY") ? ["Tavily"] : [];

  const unique = new Map<string, SearchResult>();
  for (const result of results) {
    const canonicalUrl = result.url.replace(/#.*$/, "").replace(/\/$/, "");
    if (!unique.has(canonicalUrl)) unique.set(canonicalUrl, result);
  }

  return json({
    results: [...unique.values()].slice(0, 30),
    providers,
  });
};
