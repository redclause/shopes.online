import Link from "next/link";

export default function NotFound() {
  return <main className="error-page"><p className="eyebrow">404 · Not found</p><h1>This page isn’t here.</h1><p>It may have moved, or the link may be out of date.</p><Link className="cta" href="/">Back to Shopes</Link></main>;
}