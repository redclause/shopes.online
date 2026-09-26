export const prerender = true;
import { ARTICLE_COUNT, SITEMAP_PAGE_SIZE } from "../data/shopping-articles";

export const GET = ({ site }) => {
  const pageCount = Math.ceil(ARTICLE_COUNT / SITEMAP_PAGE_SIZE);
  const entries = Array.from({ length: pageCount }, (_, index) => {
    const page = index + 1;
    return `  <sitemap><loc>${new URL("/sitemap-articles-" + page + ".xml", site)}</loc></sitemap>`;
  }).join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } }
  );
};
