export const runtime = "nodejs";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, s-maxage=30, stale-while-revalidate=300" } });

const normalize = (items: any[], source: string) => items.map((item) => ({
  title: item.title ?? item.name ?? "Untitled result",
  url: item.url ?? item.link ?? "",
  description: item.content ?? item.snippet ?? item.text ?? item.description ?? "",
  source,
  domain: (() => { try { return new URL(item.url ?? item.link).hostname.replace(/^www\./, ""); } catch { return ""; } })(),
})).filter((item) => item.url);

async function tavily(query: string) {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return [];
  const response = await fetch("https://api.tavily.com/search", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ api_key: key, query, search_depth: "basic", max_results: 8, include_answer: false, include_raw_content: false }) });
  if (!response.ok) throw new Error("Tavily " + response.status);
  const data = await response.json();
  return normalize(data.results ?? [], "Tavily");
}

async function exa(query: string) {
  const key = process.env.EXA_API_KEY;
  if (!key) return [];
  const response = await fetch("https://api.exa.ai/search", { method: "POST", headers: { "content-type": "application/json", "x-api-key": key }, body: JSON.stringify({ query, type: "auto", numResults: 8, contents: { highlights: { maxCharacters: 500 } } }) });
  if (!response.ok) throw new Error("Exa " + response.status);
  const data = await response.json();
  return normalize(data.results ?? [], "Exa");
}

async function firecrawl(query: string) {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key) return [];
  const response = await fetch("https://api.firecrawl.dev/v2/search", { method: "POST", headers: { "content-type": "application/json", authorization: "Bearer " + key }, body: JSON.stringify({ query, limit: 8, scrapeOptions: { formats: ["markdown"] } }) });
  if (!response.ok) throw new Error("Firecrawl " + response.status);
  const data = await response.json();
  return normalize(data.data ?? data.results ?? [], "Firecrawl");
}

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query) return json({ results: [], providers: [] });
  if (query.length > 200) return json({ error: "Query too long" }, 400);
  const settled = await Promise.allSettled([tavily(query), exa(query), firecrawl(query)]);
  const results = settled.flatMap((result) => result.status === "fulfilled" ? result.value : []);
  const providers = [process.env.TAVILY_API_KEY ? "Tavily" : null, process.env.EXA_API_KEY ? "Exa" : null, process.env.FIRECRAWL_API_KEY ? "Firecrawl" : null].filter(Boolean);
  const unique = new Map<string, any>();
  for (const result of results) { const key = result.url.replace(/#.*$/, ""); if (!unique.has(key)) unique.set(key, result); }
  return json({ results: [...unique.values()].slice(0, 24), providers });
}