"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="error-page" role="alert"><p className="eyebrow">Something went wrong</p><h1>Let’s try that again.</h1><p>We couldn’t load this page just now.</p><button className="cta" onClick={() => reset()}>Try again</button></main>;
}