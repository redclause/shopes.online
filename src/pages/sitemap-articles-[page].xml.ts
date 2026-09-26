export const prerender = true;
import { ARTICLE_COUNT, getArticleMeta } from "../data/shopping-articles";

const PAGE_SIZE = 1000;
const PAGE_COUNT = Math.ceil(ARTICLE_COUNT / PAGE_SIZE);

export function getStaticPaths() {
  return Array.from({ length: PAGE_COUNT }, (_, index) => ({
    params: { page: String(index + 1) },
  }));
}

export const GET = ({ params, site }) => {
  const page = Number(params.page);
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, ARTICLE_COUNT);

  const urls = Array.from({ length: end - start + 1 }, (_, index) => {
    const article = getArticleMeta(start + index);
    if (!article) return "";
    return `  <url><loc>${new URL("/blog/" + article.slug, site)}</loc></url>`;
  }).filter(Boolean).join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } }
  );
};
