const categories = [
  { name: "Home & living", slug: "home-living" },
  { name: "Tech essentials", slug: "tech" },
  { name: "Style & accessories", slug: "style" },
  { name: "Kitchen finds", slug: "home-living" },
  { name: "Outdoor & travel", slug: "style" }
];

const picks = [
  { category: "Home & living", title: "Small upgrades for calmer mornings", desc: "Thoughtful everyday pieces that make your routine feel a little easier.", price: "Editor's picks", art: "☕" },
  { category: "Tech essentials", title: "Useful tech, minus the clutter", desc: "A practical shortlist of devices and accessories worth comparing.", price: "Explore the guide", art: "⌁" },
  { category: "Kitchen finds", title: "The tools that earn their drawer space", desc: "Versatile kitchen helpers selected for function, not hype.", price: "Editor's picks", art: "✳" }
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div><p className="eyebrow">A little more considered</p><h1>Find your next <em>good thing.</em></h1></div>
        <p className="hero-copy">A clear-eyed guide to useful products, smart buys and discoveries worth your time. Less noise, better choices.</p>
      </section>
      <section aria-labelledby="themes-title">
        <div className="section-heading"><h2 id="themes-title">Browse by theme</h2><span className="eyebrow">Curated categories</span></div>
        <div className="category-strip">{categories.map((item) => <a className="category-pill" href={`/category/${item.slug}`} key={item.name}>{item.name} ↗</a>)}</div>
      </section>
      <section aria-labelledby="picks-title">
        <div className="section-heading"><h2 id="picks-title">Worth a closer look</h2><a href="/category/home-living">Explore all guides ↗</a></div>
        <div className="cards">{picks.map((item) => <article className="product-card" key={item.title}>
          <div className="product-art" aria-hidden="true">{item.art}</div>
          <div className="product-info"><span className="product-meta">{item.category}</span><h3>{item.title}</h3><p>{item.desc}</p><div className="card-bottom"><span className="price">{item.price}</span><a className="cta" href="/category/home-living">Read guide ↗</a></div></div>
        </article>)}</div>
        <p className="disclosure">Affiliate disclosure: Some recommendations may include affiliate links. If you buy through them, Shopes may earn a commission at no additional cost to you. Editorial selections remain independent.</p>
      </section>
    </main>
  );
}