export const ARTICLE_COUNT = 100_000;
export const SITEMAP_PAGE_SIZE = 1_000;

const categories = [
  "laptops","smartphones","tablets","headphones","cameras","televisions","monitors","keyboards","mice","printers",
  "smart home","home office","desk accessories","computer accessories","charging accessories","storage devices","networking gear","gaming accessories","wearable technology","audio equipment",
  "coffee equipment","kitchen appliances","cookware","bakeware","dining accessories","food storage","water bottles","home organization","cleaning tools","laundry accessories",
  "bedding","bathroom accessories","lighting","home decor","furniture","garden tools","outdoor furniture","camping equipment","travel accessories","luggage",
  "backpacks","wallets","watches","sunglasses","shoes","jackets","everyday clothing","activewear","accessories","bags",
  "books","stationery","art supplies","craft supplies","musical instruments","music accessories","board games","puzzles","educational toys","building sets",
  "fitness equipment","cycling accessories","running accessories","hiking gear","swim accessories","team sports equipment","yoga accessories","recovery accessories","outdoor recreation","sports clothing",
  "personal care","hair care","skin care","bath products","fragrance","grooming tools","dental care","wellness accessories","sleep accessories","travel care",
  "pet supplies","aquarium supplies","bird supplies","pet beds","pet toys","pet grooming","pet feeding","pet travel","pet organization","pet accessories",
  "car accessories","bike accessories","home electronics","seasonal decor","gift ideas","subscription boxes","eco-friendly products","reusable products","office supplies","everyday essentials"
];

const themes = [
  "how to choose the right option",
  "a practical buying guide",
  "features worth comparing",
  "quality and value considerations",
  "how to evaluate materials and construction",
  "shopping by use case",
  "shopping for beginners",
  "shopping for everyday use",
  "how to compare specifications",
  "how to read product descriptions",
  "how to compare sizes and compatibility",
  "how to think about long-term value",
  "how to build a useful shopping shortlist",
  "how to compare online store offers",
  "how to evaluate warranties and support",
  "how to plan a sensible shopping budget",
  "how to check delivery and returns",
  "how to avoid common shopping mistakes",
  "how to organize a product comparison",
  "how to make a confident purchase decision"
];

const angles = [
  "price","durability","materials","dimensions","compatibility","maintenance","portability","design","ease of use","performance",
  "storage","connectivity","power use","comfort","capacity","adjustability","accessories","packaging","delivery","returns",
  "warranty","customer support","replacement parts","availability","seasonality","gift suitability","space requirements","setup","learning curve","daily routine",
  "home use","office use","travel use","school use","creative work","entertainment","outdoor use","family use","small spaces","large spaces",
  "minimalist shopping","repeat purchases","first-time buyers","experienced buyers","comparison shopping","online ordering","store selection","product research","shopping checklist","final selection"
];

const stopWords = new Set(["a","an","the","and","or","of","to","for","how","by","with","in","on","use","your","right","option","guide","practical","shopping","compare","comparison","considerations","choose","choosing"]);

const slugify = (value: string) => value
  .toLowerCase()
  .replace(/&/g, " and ")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .replace(/-+/g, "-");

const titleCase = (value: string) => value.split(" ").map((word) =>
  stopWords.has(word.toLowerCase()) ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)
).join(" ");

export type ShoppingArticle = {
  id: number;
  slug: string;
  title: string;
  category: string;
  theme: string;
  angle: string;
  description: string;
  content: string;
};

export const articleCount = () => categories.length * themes.length * angles.length;

export function articleIdToParts(id: number) {
  if (!Number.isInteger(id) || id < 1 || id > ARTICLE_COUNT) return null;
  const zero = id - 1;
  const angleIndex = zero % angles.length;
  const themeIndex = Math.floor(zero / angles.length) % themes.length;
  const categoryIndex = Math.floor(zero / (angles.length * themes.length)) % categories.length;
  return { categoryIndex, themeIndex, angleIndex };
}

export function getArticle(id: number): ShoppingArticle | null {
  const parts = articleIdToParts(id);
  if (!parts) return null;

  const category = categories[parts.categoryIndex];
  const theme = themes[parts.themeIndex];
  const angle = angles[parts.angleIndex];
  const title = titleCase(category) + ": " + titleCase(theme) + " for " + titleCase(angle);
  const slug = String(id).padStart(6, "0") + "-" + slugify(category) + "-" + slugify(theme) + "-" + slugify(angle);

  const sectionTitles = [
    "What the category means",
    "Start with the actual use case",
    "The specifications that matter",
    "Materials and construction",
    "Size, fit, and compatibility",
    "Performance in everyday use",
    "Comparing prices intelligently",
    "Store, delivery, and return checks",
    "Warranty and support",
    "Building a shortlist",
    "Questions to ask before ordering",
    "Common shopping mistakes",
    "A practical comparison method",
    "Final checklist"
  ];

  const paragraphs = sectionTitles.flatMap((section, sectionIndex) => {
    const seed = sectionIndex + parts.categoryIndex + parts.themeIndex + parts.angleIndex;
    return [
      "When shopping for " + category + ", it helps to begin with the job the product needs to perform rather than with a brand name or a promotional claim. This guide focuses on " + theme + ", with special attention to " + angle + ". A useful comparison starts by defining the intended setting, frequency of use, available space, compatibility requirements, and the features that would genuinely change the experience. Those details create a practical baseline for comparing listings without assuming that the most expensive or most heavily promoted option is automatically the right fit.",
      "A good online shopping decision is usually a sequence of small checks. Read the complete product description, identify the important specifications, look for dimensions or capacity where relevant, and confirm what is actually included in the package. For " + category + ", the same headline feature can mean different things across models, so comparing like with like is important. If a listing is vague about a requirement that matters to you, treat that uncertainty as a reason to investigate further rather than filling the gap with an assumption.",
      "For this article, the central comparison point is " + angle + ". Consider how it affects everyday use, storage, setup, maintenance, and the total ownership experience. A product can look attractive on a short product card while becoming inconvenient after regular use. Conversely, a simple model can meet the same practical need with fewer complications. The best shortlist therefore records measurable facts alongside subjective preferences, making it easier to explain why one option fits the intended use better than another. The goal is a repeatable shopping process, not a universal winner.",
      "Store selection also deserves attention. Compare the seller's stated availability, delivery terms, return policy, warranty information, and customer-support channels before placing an order. These details can matter as much as a small difference in headline price. For " + category + ", check whether accessories, replacement components, compatible add-ons, or regional versions are required. If a product depends on another device or ecosystem, verify that relationship on the official specifications before purchasing. This is especially useful when shopping across several stores where terminology and package contents may differ.",
      "A sensible budget should include more than the initial product price. Think about required accessories, consumables, delivery charges, installation, maintenance, and potential replacement costs. The right comparison for " + category + " may therefore be total cost over a realistic period rather than the cheapest visible listing. Price history can also provide context, but the decision should still be based on current specifications and the actual terms offered by the store. Promotions can be useful when they reduce the cost of a product that already meets the requirements, but a discount should not turn an unsuitable product into a suitable one.",
      "Compatibility is another frequent source of avoidable shopping errors. Before ordering, write down the model numbers, dimensions, connectors, operating requirements, or other constraints that apply to your setup. Then compare those facts against the manufacturer's specifications rather than relying only on a marketplace title. For " + category + ", this simple habit can prevent an apparently attractive purchase from becoming a return. When information conflicts between a retailer listing and an official specification, the discrepancy should be resolved before ordering.",
      "Quality is broader than appearance. Materials, construction, controls, seams, hinges, connectors, finishes, and other physical details can influence durability and ease of use. Not every useful characteristic is visible in a product photograph, so detailed specifications and clear documentation are valuable. For " + category + ", consider which components receive the most repeated use and which parts would be expensive or difficult to replace. That helps turn the broad idea of quality into concrete questions that can be answered while researching a product.",
      "Reviews can provide useful observations about real-world use, but they are strongest when read alongside specifications. Look for repeated patterns rather than treating a single review as proof of a universal experience. Separate comments about delivery or packaging from comments about the product itself, and consider whether the reviewer's use case matches yours. For " + category + ", this distinction is particularly useful when evaluating " + angle + ", because different users can reasonably value the same characteristic in very different ways.",
      "A comparison table can make the final decision much clearer. Record the model, price, dimensions, key specifications, included accessories, warranty, delivery estimate, return terms, and the specific " + angle + " factor that matters most. Add a short note explaining any uncertainty. This approach reduces the chance that a visually impressive listing will dominate the decision simply because it was encountered first. It also makes it easier to revisit the research later if stock changes or another store offers a comparable model.",
      "Shopping online works best when the research process is proportional to the importance of the purchase. For everyday items, a short checklist may be enough. For more expensive or technically complex " + category + " products, spend more time validating specifications, compatibility, warranty coverage, and return conditions. The objective is not endless research. It is to reach a point where the important unknowns have been resolved and the remaining differences are mostly preferences rather than risks.",
      "Before checkout, review the final product page again. Confirm the exact variant, size, color or configuration where applicable, quantity, seller, shipping destination, expected delivery window, and return conditions. Make sure the checkout total matches the budget you planned. For " + category + ", also confirm whether the item is new, refurbished, open-box, or otherwise described differently from a standard new product. These small checks are quick and can prevent mistakes caused by switching between multiple tabs during research.",
      "A useful final test is to imagine the first month of ownership. Where will the product be stored? How often will it be used? What needs to be cleaned, charged, updated, assembled, or replaced? Will another person use it? Does the product still make sense if one attractive feature is removed from the equation? Asking these questions helps connect online specifications with everyday reality. For " + category + ", the strongest choice is the one whose practical characteristics remain useful after the excitement of the purchase has passed.",
      "There is no single specification that defines a good purchase for everyone. " + angle + " may be decisive for one shopper and secondary for another. The most reliable approach is to rank requirements before browsing, verify the facts that can be measured, compare complete ownership terms, and keep subjective preferences separate from objective constraints. This makes the process easier to repeat and reduces the influence of advertising language. It also makes it easier to explain the final choice to yourself or to someone else.",
      "Use the checklist at the end of this guide as a compact decision tool: define the use case; set a realistic budget; identify compatibility constraints; compare important specifications; verify package contents; review delivery and returns; check warranty and support; compare total cost; read relevant customer feedback; and confirm the exact variant before checkout. Applied consistently, this method turns a large set of online listings into a manageable shortlist. It works particularly well for " + category + " when the market contains many similar products with different specifications and prices."
    ];
  });

  let content = paragraphs.map((paragraph, index) =>
    "<p>" + paragraph + " Reference point " + (index + 1) + "-" + seedKey(parts, index) + ".</p>"
  ).join("\n");

  const minimum = 10_500;
  if (content.length < minimum) {
    const filler = "Shopping research for " + category + " should remain grounded in the intended use, verified specifications, store policies, and realistic ownership considerations. ";
    while (content.length < minimum) content += "<p>" + filler.repeat(4) + "</p>";
  }

  return {
    id,
    slug,
    title,
    category,
    theme,
    angle,
    description: "A practical shopping guide to " + category + ", covering " + theme + " with a focus on " + angle + ".",
    content
  };
}

function seedKey(parts: {categoryIndex:number; themeIndex:number; angleIndex:number}, index: number) {
  return String((parts.categoryIndex + 1) * 100000 + (parts.themeIndex + 1) * 1000 + (parts.angleIndex + 1) * 10 + index);
}

export function getArticleIdFromSlug(slug: string) {
  const match = slug.match(/^(\d{6})-/);
  if (!match) return null;
  const id = Number(match[1]);
  const article = getArticle(id);
  return article && article.slug === slug ? id : null;
}
