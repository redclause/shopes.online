export const ARTICLE_COUNT = 100_000;
export const SITEMAP_PAGE_SIZE = 1_000;

export const shoppingTopics = [
  "online shopping","ecommerce stores","retail websites","shopping platforms","product research","price comparison","online ordering","digital storefronts","retailer selection","shopping checklists",
  "product discovery","shopping budgets","delivery options","return policies","warranty coverage","customer support","seller verification","product specifications","product descriptions","shopping research",
  "home shopping","technology shopping","fashion shopping","office shopping","travel shopping","fitness shopping","kitchen shopping","garden shopping","pet shopping","automotive shopping",
  "electronics buying","computer buying","phone buying","audio buying","camera buying","furniture buying","appliance buying","clothing buying","shoe buying","accessory buying",
  "gift shopping","seasonal shopping","sustainable shopping","reusable products","subscription shopping","specialty retail","small-shop shopping","brand-store shopping","marketplace shopping","international shopping",
  "budget shopping","premium shopping","small-space shopping","family shopping","student shopping","remote-work shopping","smart-home shopping","everyday essentials","household purchasing","personal purchasing",
  "business purchasing","mobile shopping","desktop shopping","app-store shopping","official-store shopping","local shopping","cross-border shopping","online retail","consumer buying","shopping technology",
  "shopping convenience","shopping organization","shopping routines","quality shopping","durability shopping","comfort shopping","compatibility shopping","size selection","material selection","feature comparison",
  "specification comparison","maintenance planning","replacement planning","repeat-purchase shopping","gift selection","beginner shopping","experienced shopping","informed purchasing","responsible purchasing","minimalist purchasing",
  "practical purchasing","deal research","store selection","delivery planning","returns planning","warranty research","long-term value","product comparison","shopping education","buying decisions"
] as const;

const themes = [
  "how to choose the right product","how to compare products online","how to evaluate a retailer","how to build a shopping shortlist","how to research before buying",
  "how to compare specifications","how to compare total cost","how to check compatibility","how to evaluate product quality","how to understand product descriptions",
  "how to compare delivery options","how to understand return policies","how to evaluate warranty terms","how to assess customer support","how to verify seller information",
  "how to plan a shopping budget","how to avoid common shopping mistakes","how to organize product research","how to make online shopping more efficient","how to make a confident purchase decision"
] as const;

const angles = [
  "price","value","durability","materials","dimensions","compatibility","maintenance","portability","design","ease of use",
  "performance","storage","connectivity","power use","comfort","capacity","adjustability","accessories","packaging","delivery",
  "returns","warranty","customer support","replacement parts","availability","seasonality","gift suitability","space requirements","setup","learning curve",
  "daily routine","home use","office use","travel use","school use","creative work","entertainment","outdoor use","family use","small spaces",
  "large spaces","minimalist shopping","repeat purchases","first-time buyers","experienced buyers","comparison shopping","online ordering","store selection","product research","final selection"
] as const;

const slugify=(s:string)=>s.toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").replace(/-+/g,"-");
const titleCase=(s:string)=>s.split(" ").map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" ");

export type ShoppingArticle={id:number;slug:string;title:string;topic:string;theme:string;angle:string;description:string;content:string};
export type ShoppingArticleMeta=Omit<ShoppingArticle,"content">;

export function articleIdToParts(id:number){
  if(!Number.isInteger(id)||id<1||id>ARTICLE_COUNT)return null;
  const z=id-1;
  return { angleIndex:z%angles.length, themeIndex:Math.floor(z/angles.length)%themes.length, topicIndex:Math.floor(z/(angles.length*themes.length))%shoppingTopics.length };
}

export function getArticleMeta(id:number):ShoppingArticleMeta|null{
  const p=articleIdToParts(id);if(!p)return null;
  const topic=shoppingTopics[p.topicIndex],theme=themes[p.themeIndex],angle=angles[p.angleIndex];
  const title=titleCase(topic)+": "+titleCase(theme)+" with a focus on "+titleCase(angle);
  const slug=String(id).padStart(6,"0")+"-"+slugify(topic)+"-"+slugify(theme)+"-"+slugify(angle);
  return {id,slug,title,topic,theme,angle,description:"A practical online shopping article about "+topic+", exploring "+theme+" with a focus on "+angle+"."};
}

const paragraphTemplates=[
  "Start with the actual shopping need. Define the intended use, frequency, available space, important constraints, and realistic budget before comparing products or stores.",
  "Compare facts rather than marketing language. Check specifications, dimensions, materials, compatibility, included accessories, seller information, delivery terms, and support options.",
  "Evaluate the complete store experience. Seller identity, availability, shipping, delivery estimates, returns, warranty coverage, and customer support all affect the practical value of an order.",
  "Consider total ownership cost rather than only the displayed price. Delivery, accessories, consumables, installation, maintenance, and replacement parts can change the real cost.",
  "Verify compatibility before ordering. Model numbers, dimensions, connectors, operating requirements, regional versions, supported systems, and package contents should match the intended setup.",
  "Use customer feedback as supporting evidence. Repeated observations can reveal practical patterns, but reviews should be separated from individual preferences and delivery experiences.",
  "Create a focused shortlist and compare the same criteria across every candidate. This reduces the effect of attractive presentation and keeps the decision tied to measurable requirements.",
  "Research in proportion to the purchase. Simple everyday purchases need a short checklist, while expensive or technically complex purchases deserve deeper specification, warranty, compatibility, and return research.",
  "Before checkout, confirm the exact product, variant, quantity, seller, condition, final total, shipping destination, delivery estimate, return terms, and warranty information.",
  "Think about long-term use. Storage, cleaning, maintenance, charging, updates, replacement parts, repairs, and shared household use can matter long after the order arrives.",
  "Treat trade-offs explicitly. A feature that matters greatly to one shopper may matter very little to another, so comparisons should explain practical differences instead of declaring one universal answer.",
  "Keep a reusable shopping checklist covering the need, budget, specifications, compatibility, seller, availability, delivery, returns, warranty, support, total cost, and expected maintenance.",
  "Good online shopping research reduces uncertainty. Verify the information that can change the decision, compare complete purchasing conditions, and keep personal preferences separate from objective product facts."
];

export function getArticle(id:number):ShoppingArticle|null{
  const meta=getArticleMeta(id);if(!meta)return null;
  const {topic,theme,angle}=meta;
  let content="";
  for(let i=0;content.length<10500;i++){
    const base=paragraphTemplates[(i+id)%paragraphTemplates.length];
    content+="<p>"+base+" In the context of "+topic+", this matters when "+theme+" and when the comparison is specifically about "+angle+". The practical goal is to make the information clear enough to compare alternatives, verify store conditions, and understand the complete purchase before ordering.</p>";
  }
  return {...meta,content};
}

export function getArticleIdFromSlug(slug:string){
  const m=slug.match(/^(\d{6})-/);if(!m)return null;
  const id=Number(m[1]);const article=getArticleMeta(id);
  return article&&article.slug===slug?id:null;
}
