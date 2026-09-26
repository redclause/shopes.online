# Shopes.online

A Next.js App Router starter for a curated online-shopping and affiliate editorial site.

## Current foundation
- Next.js App Router with responsive Tailwind CSS v4 styling.
- Server-rendered editorial homepage and category-first navigation.
- Global affiliate disclosure placement and restrained product CTA styling.
- Metadata defaults and image-host configuration.

## Planned production architecture
- PostgreSQL (managed independently; not Neon or Supabase) with indexed category, slug, publication date, and full-text search columns.
- Keyset pagination for large category collections; never load an entire category into memory.
- Content stored as normalized records, with product references and affiliate destinations separated from editorial copy.
- ISR/tag-based revalidation for published content, plus CDN caching for public pages.
- Dynamic sitemap partitioning and per-post Open Graph metadata / JSON-LD.

## Setup
1. Install Node.js 20.9+.
2. Run `npm install`.
3. Run `npm run dev`.
4. Set `NEXT_PUBLIC_SITE_URL` to the canonical public origin for production.

This initial commit is a UI and framework scaffold, not a completed CMS, database integration, verified 100k-record benchmark, or deployed production service.