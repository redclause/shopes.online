-- PostgreSQL schema for large-scale editorial content.
-- Apply with your migration tool; use a managed PostgreSQL provider other than Neon/Supabase.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id BIGINT NOT NULL REFERENCES categories(id),
  slug TEXT NOT NULL UNIQUE,
  title VARCHAR(240) NOT NULL,
  excerpt VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  search_document TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(body, '')), 'C')
  ) STORED,
  CHECK (char_length(body) BETWEEN 5000 AND 20000)
);

CREATE INDEX posts_category_published_idx
  ON posts (category_id, published_at DESC, id DESC)
  WHERE status = 'published';
CREATE INDEX posts_published_at_idx
  ON posts (published_at DESC, id DESC)
  WHERE status = 'published';
CREATE INDEX posts_search_gin_idx ON posts USING GIN (search_document);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(240) NOT NULL,
  brand VARCHAR(160),
  merchant_name VARCHAR(160) NOT NULL,
  canonical_url TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  price_amount NUMERIC(12,2),
  price_currency CHAR(3),
  availability TEXT,
  checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE post_products (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  placement INTEGER NOT NULL DEFAULT 0,
  note VARCHAR(500),
  PRIMARY KEY (post_id, product_id)
);
CREATE INDEX post_products_product_idx ON post_products (product_id);

-- Query patterns:
-- Full-text: WHERE search_document @@ websearch_to_tsquery('english', $1)
-- Ranked: ORDER BY ts_rank(search_document, websearch_to_tsquery('english', $1)) DESC
-- Browse: category_id = $1 AND status='published' AND (published_at,id) < ($cursor_time,$cursor_id)
-- Always LIMIT a bounded page size (e.g. 24); do not offset-scan huge collections.