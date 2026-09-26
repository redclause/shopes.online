import type { APIRoute } from "astro";
import { ARTICLE_COUNT, SITEMAP_PAGE_SIZE } from "../data/shopping-articles";

export const GET: APIRoute = ({ site }) => {
  const pageCount = Math.ceil(ARTICLE_COUNT / SITEMAP_PAGE_SIZE);
  const base = site ?? new URL("https://shopes.online");
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...Array.from({ length: pageCount }, (_, index) =>
      "<sitemap><loc>" + new URL("/sitemap-blog-" + (index + 1) + ".xml", base).href + "</loc></sitemap>"
    ),
    "</sitemapindex>"
  ].join("");
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
};
