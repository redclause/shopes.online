# Shopes.online

Astro-powered, SSG-first directory and local-shops search engine.

## Architecture
- Astro 6 static generation for directory/category/shop pages.
- Tailwind CSS v4 through Vite.
- Pagefind build-time full-text search; no search server required.
- Typed TypeScript directory data designed to migrate to SQLite or another lightweight indexed store later.
- Hierarchical category routes and dedicated local-shop storefront pages.
- Automated sitemap integration, canonical metadata, OpenGraph defaults, robots.txt and accessible mobile-first UI.

## Commands
- `npm run dev`
- `npm run check`
- `npm run build`
- `npm run preview`

The current repository contains a deliberately small seed dataset. It is the foundation for importing a substantially larger hand-indexed directory without changing the public URL model.
