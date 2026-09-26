import type { APIRoute } from "astro";
import { ARTICLE_COUNT, SITEMAP_PAGE_SIZE, getArticle } from "../data/shopping-articles";

export const GET: APIRoute = ({ params, site }) => {
  const page = Number(params.page);
  const pageCount = Math.ceil(ARTICLE_COUNT / SITEMAP_PAGE_SIZE);
  if (!Number.isInteger(page) || page < 1 || page > pageCount) {
    return new Response("Not found", { status: 404 });
  }

  const start = (page - 1) * SITEMAP_PAGE_SIZE + 1;
  const end = Math.min(page * SITEMAP_PAGE_SIZE, ARTICLE_COUNT);
  const base = site ?? new URL("https://shopes.online");

  const urls = [];
  for (let id = start; id <= end; id++) {
    const article = getArticle(id);
    if (article) {
      urls.push("<url><loc>" + new URL("/shopping/" + article.slug, base).href + "</loc></url>");
    }
  }

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>"
  ].join("");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800"
    }
  });
};
