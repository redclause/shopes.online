import type { Metadata } from "next";
import { notFound } from "next/navigation";

const themes: Record<string, { title: string; intro: string; description: string }> = {
  "home-living": { title: "Home & living", intro: "Useful details for a more comfortable home.", description: "Practical product guides and considered finds for home and everyday living." },
  tech: { title: "Tech essentials", intro: "Technology that solves real, everyday problems.", description: "Clear guides to useful technology, accessories and smart everyday buys." },
  style: { title: "Style & accessories", intro: "Wearable, useful finds selected with care.", description: "Shopping guides for considered style and practical accessories." }
};

export function generateStaticParams() {
  return Object.keys(themes).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const theme = themes[slug];
  return theme ? { title: theme.title, description: theme.description, alternates: { canonical: `/category/${slug}` } } : {};
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const theme = themes[slug];
  if (!theme) notFound();
  return (
    <main>
      <section className="hero category-hero">
        <div><p className="eyebrow">Shop by theme</p><h1>{theme.title}<em>.</em></h1></div>
        <p className="hero-copy">{theme.intro}</p>
      </section>
      <section>
        <div className="section-heading"><h2>Latest guides</h2><span className="eyebrow">Editorial collection</span></div>
        <div className="empty-state"><span className="empty-icon">✳</span><h3>Good guides are on the way.</h3><p>This category is ready for published stories and curated product picks.</p></div>
        <p className="disclosure">Some articles may contain affiliate links. If you purchase through these links, we may earn a commission at no additional cost to you.</p>
      </section>
    </main>
  );
}