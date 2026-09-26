import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://shopes.online"),
  title: {
    default: "Shopes — thoughtful finds, better shopping",
    template: "%s | Shopes"
  },
  description: "A considered guide to useful products, smart shopping and curated deals.",
  openGraph: {
    type: "website",
    siteName: "Shopes",
    title: "Shopes — thoughtful finds, better shopping",
    description: "A considered guide to useful products, smart shopping and curated deals."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <a className="brand" href="/" aria-label="Shopes home"><span className="brand-mark">s.</span> shopes</a>
            <nav aria-label="Main navigation">
              <a href="/category/home-living">Home & living</a>
              <a href="/category/tech">Tech</a>
              <a href="/category/style">Style</a>
            </nav>
            <a className="header-link" href="/search">Search <span aria-hidden="true">↗</span></a>
          </header>
          {children}
          <footer className="site-footer">
            <a className="brand" href="/"><span className="brand-mark">s.</span> shopes</a>
            <p>Good finds. Clear choices. Shopping with intention.</p>
            <small>Some links may be affiliate links. We may earn a commission at no extra cost to you.</small>
          </footer>
        </div>
      </body>
    </html>
  );
}