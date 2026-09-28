export type Shop = {
  slug: string;
  name: string;
  url: string;
  description: string;
  categories: string[];
  country: string;
  domain: string;
  featured?: boolean;
};

export const shops: Shop[] = [
  {
    slug: "apple",
    name: "Apple",
    url: "https://www.apple.com/store/",
    description: "Official online store for Apple products, including Mac, iPhone, iPad, Apple Watch, AirPods and accessories.",
    categories: ["electronics", "computers", "phones", "audio", "accessories"],
    country: "United States",
    domain: "apple.com",
    featured: true
  },
  {
    slug: "best-buy",
    name: "Best Buy",
    url: "https://www.bestbuy.com/",
    description: "Online electronics and technology retailer covering computers, TVs, appliances, phones, gaming, audio and smart home products.",
    categories: ["electronics", "computers", "appliances", "gaming", "audio", "smart home"],
    country: "United States",
    domain: "bestbuy.com",
    featured: true
  },
  {
    slug: "target",
    name: "Target",
    url: "https://www.target.com/",
    description: "Online retailer for everyday essentials, home, beauty, clothing, electronics, toys, groceries and more.",
    categories: ["home", "beauty", "clothing", "electronics", "toys", "grocery"],
    country: "United States",
    domain: "target.com",
    featured: true
  },
  {
    slug: "etsy",
    name: "Etsy",
    url: "https://www.etsy.com/",
    description: "Online marketplace focused on handmade, vintage, custom and unique goods from independent sellers.",
    categories: ["handmade", "gifts", "jewelry", "home", "art", "vintage"],
    country: "United States",
    domain: "etsy.com",
    featured: true
  },
  {
    slug: "nike",
    name: "Nike",
    url: "https://www.nike.com/",
    description: "Official Nike online store for footwear, clothing, sports equipment and accessories.",
    categories: ["sports", "shoes", "clothing", "fitness", "accessories"],
    country: "United States",
    domain: "nike.com"
  },
  {
    slug: "ikea",
    name: "IKEA",
    url: "https://www.ikea.com/",
    description: "Online home-furnishing store for furniture, storage, kitchen, bedroom, lighting, decor and household products.",
    categories: ["furniture", "home", "kitchen", "bedroom", "storage", "decor"],
    country: "Sweden",
    domain: "ikea.com"
  },
  {
    slug: "walmart",
    name: "Walmart",
    url: "https://www.walmart.com/",
    description: "Large online retailer covering groceries, household goods, electronics, clothing, home, toys and everyday products.",
    categories: ["grocery", "home", "electronics", "clothing", "toys", "household"],
    country: "United States",
    domain: "walmart.com"
  },
  {
    slug: "ebay",
    name: "eBay",
    url: "https://www.ebay.com/",
    description: "Online shopping marketplace for new, used, collectible and refurbished products across many categories.",
    categories: ["marketplace", "electronics", "collectibles", "fashion", "home", "automotive"],
    country: "United States",
    domain: "ebay.com"
  }
];

export const shopCategories = [
  "All shops", "Electronics", "Computers", "Phones", "Home", "Furniture",
  "Clothing", "Shoes", "Sports", "Beauty", "Toys", "Gifts", "Handmade",
  "Kitchen", "Gaming", "Audio", "Marketplace"
] as const;

const normalize = (value: string) =>
  value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s.-]/g, " ").replace(/\s+/g, " ").trim();

export function getShop(slug: string) {
  return shops.find((shop) => shop.slug === slug) ?? null;
}

export function searchShops(query: string, category?: string) {
  const q = normalize(query);
  const c = normalize(category ?? "");
  const terms = q.split(" ").filter(Boolean);

  return shops
    .filter((shop) => {
      const haystack = normalize([
        shop.name,
        shop.domain,
        shop.description,
        shop.country,
        ...shop.categories
      ].join(" "));
      const categoryMatch = !c || c === "all shops" || shop.categories.some((item) => normalize(item) === c);
      const queryMatch = !terms.length || terms.every((term) => haystack.includes(term));
      return categoryMatch && queryMatch;
    })
    .sort((a, b) => {
      if (!q) return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      const score = (shop: Shop) => {
        const name = normalize(shop.name);
        const domain = normalize(shop.domain);
        return (name === q ? 100 : 0) + (name.startsWith(q) ? 40 : 0) + (domain.includes(q) ? 25 : 0) + (shop.categories.some((x) => normalize(x).includes(q)) ? 15 : 0);
      };
      return score(b) - score(a) || a.name.localeCompare(b.name);
    });
}
