import type { APIRoute } from "astro";
import { put } from "@vercel/blob";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const clean = (value: FormDataEntryValue | null, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();

    if (clean(form.get("website"), 500) && form.get("website") === "website") {
      return json({ error: "Invalid submission." }, 400);
    }

    const name = clean(form.get("name"), 120);
    const url = clean(form.get("url"), 1000);
    const description = clean(form.get("description"), 600);
    const category = clean(form.get("category"), 80);
    const city = clean(form.get("city"), 100);
    const country = clean(form.get("country"), 100);
    const email = clean(form.get("email"), 200);
    const source = clean(form.get("source"), 80) || "directory";

    if (!name || !url) return json({ error: "Name and website URL are required." }, 400);

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return json({ error: "Please enter a valid website URL." }, 400);
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return json({ error: "Only HTTP and HTTPS websites can be submitted." }, 400);
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Please enter a valid email address." }, 400);
    }

    const submission = {
      id: crypto.randomUUID(),
      status: "pending",
      submittedAt: new Date().toISOString(),
      name,
      url: parsed.toString(),
      description,
      category,
      city,
      country,
      email,
      source,
    };

    const pathname = `submissions/${submission.submittedAt.slice(0, 10)}/${submission.id}.json`;

    await put(pathname, JSON.stringify(submission, null, 2), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
    });

    return json({ ok: true, message: "Submission received for review." });
  } catch (error) {
    console.error("Submission failed", error);
    return json({ error: "Submissions are temporarily unavailable. Please try again later." }, 503);
  }
};
