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
        description: String(
          item.content ?? item.snippet ?? item.text ?? item.description ?? "",
        ),
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
        query,
        topic: "general",
        search_depth: "basic",
        max_results: 10,
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

async function exa(query: string) {
  const key = getSecret("EXA_API_KEY");
  if (!key) return [];

  const response = await withTimeout((signal) =>
    fetch("https://api.exa.ai/search", {
      method: "POST",
      signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
      },
      body: JSON.stringify({
        query,
        type: "auto",
        numResults: 10,
        contents: { highlights: { maxCharacters: 500 } },
      }),
    ),
  );

  if (!response.ok) throw new Error(`Exa ${response.status}`);
  const data = (await response.json()) as { results?: unknown[] };
  return normalize(data.results ?? [], "Exa");
}

async function firecrawl(query: string) {
  const key = getSecret("FIRECRAWL_API_KEY");
  if (!key) return [];

  const response = await withTimeout((signal) =>
    fetch("https://api.firecrawl.dev/v2/search", {
      method: "POST",
      signal,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        query,
        limit: 10,
        scrapeOptions: { formats: ["markdown"] },
      }),
    ),
  );

  if (!response.ok) throw new Error(`Firecrawl ${response.status}`);
  const data = (await response.json()) as {
    data?: unknown[];
    results?: unknown[];
  };
  return normalize(data.data ?? data.results ?? [], "Firecrawl");
}

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("q")?.trim() ?? "";

  if (!query) return json({ results: [], providers: [] });
  if (query.length > 200) return json({ error: "Query too long" }, 400);

  const [tavilyResult, exaResult, firecrawlResult] = await Promise.allSettled([
    tavily(query),
    exa(query),
    firecrawl(query),
  ]);

  const results = [tavilyResult, exaResult, firecrawlResult].flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );

  const providers = [
    getSecret("TAVILY_API_KEY") ? "Tavily" : null,
    getSecret("EXA_API_KEY") ? "Exa" : null,
    getSecret("FIRECRAWL_API_KEY") ? "Firecrawl" : null,
  ].filter((value): value is string => Boolean(value));

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
