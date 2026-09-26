export const ARTICLE_COUNT = 100_000;
export const SITEMAP_PAGE_SIZE = 1_000;

const topics = [
  "online shopping","ecommerce stores","retail websites","shopping platforms","product research","price comparison","online ordering","digital storefronts","retailer selection","shopping checklists",
  "product discovery","shopping budgets","delivery options","return policies","warranty coverage","customer support","seller verification","product specifications","product descriptions","shopping research",
  "home shopping","technology shopping","fashion shopping","office shopping","travel shopping","fitness shopping","kitchen shopping","garden shopping","pet shopping","automotive shopping",
  "electronics buying","computer buying","phone buying","audio buying","camera buying","furniture buying","appliance buying","clothing buying","shoe buying","accessory buying",
  "gift shopping","seasonal shopping","sustainable shopping","reusable products","subscription shopping","specialty retail","small-shop shopping","brand-store shopping","marketplace shopping","international shopping"
] as const;

const themes = [
  "how to choose the right product","how to compare products online","how to evaluate a retailer","how to build a shopping shortlist","how to research before buying",
  "how to compare specifications","how to compare total cost","how to check compatibility","how to evaluate product quality","how to understand product descriptions",
  "how to compare delivery options","how to understand return policies","how to evaluate warranty terms","how to assess customer support","how to verify seller information",
  "how to plan a shopping budget","how to avoid common shopping mistakes","how to organize product research","how to make online shopping more efficient","how to make a confident purchase decision",
  "how to compare alternatives","how to identify useful features","how to separate useful features from marketing","how to judge long-term value","how to shop for everyday use",
  "how to shop for small spaces","how to shop for busy routines","how to shop for first-time buyers","how to shop for experienced buyers","how to shop for practical value",
  "how to compare store policies","how to check package contents","how to check dimensions","how to check materials","how to check maintenance requirements",
  "how to evaluate portability","how to evaluate ease of use","how to evaluate durability","how to evaluate comfort","how to evaluate performance",
  "how to plan repeat purchases","how to research replacement parts","how to understand availability","how to compare regional versions","how to prepare for checkout",
  "how to review an order before payment","how to organize saved products","how to compare several stores","how to research unfamiliar products","how to create a reusable buying checklist"
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
  return {
    angleIndex:z%angles.length,
    themeIndex:Math.floor(z/angles.length)%themes.length,
    topicIndex:Math.floor(z/(angles.length*themes.length))%topics.length
  };
}

export function getArticleMeta(id:number):ShoppingArticleMeta|null{
  const p=articleIdToParts(id);if(!p)return null;
  const topic=topics[p.topicIndex],theme=themes[p.themeIndex],angle=angles[p.angleIndex];
  const title=titleCase(topic)+": "+titleCase(theme)+" with a focus on "+titleCase(angle);
  const slug=String(id).padStart(6,"0")+"-"+slugify(topic)+"-"+slugify(theme)+"-"+slugify(angle);
  return {
    id,slug,title,topic,theme,angle,
    description:"A practical online shopping article about "+topic+", exploring "+theme+" with a focus on "+angle+"."
  };
}

const paragraphs=[
  (t:string,h:string,a:string)=>"Online shopping works best when the decision starts with the actual need rather than a product advertisement. For "+t+", define the intended use, frequency, available space, important constraints, and realistic budget before opening multiple store pages. This makes "+h+" more useful because the comparison has a clear purpose.",
  (t:string,h:string,a:string)=>"A useful product comparison separates facts from impressions. Check specifications, dimensions, materials, compatibility, included accessories, seller information, delivery terms, and support options. When the focus is "+a+", record the measurable information that affects the purchase instead of relying only on promotional language.",
  (t:string,h:string,a:string)=>"The store matters as much as the item. Compare the seller's identity, availability, shipping destination, delivery estimate, return process, warranty terms, and customer-support channels. A product that looks attractive can become less practical when the complete purchasing conditions are unclear.",
  (t:string,h:string,a:string)=>"Total cost should include more than the displayed product price. Delivery, accessories, consumables, installation, maintenance, replacement parts, and other ownership expenses can change the value of a purchase. A simple comparison table can make these differences easier to see before checkout.",
  (t:string,h:string,a:string)=>"Compatibility deserves an explicit check. Product dimensions, connectors, operating requirements, supported systems, regional versions, model numbers, and included components can all affect whether an item works as expected. Confirm the exact variant rather than assuming that products with similar names are interchangeable.",
  (t:string,h:string,a:string)=>"Customer feedback can add practical context, especially when several shoppers report the same experience. It should still be interpreted carefully because usage conditions differ. Separate observations about the product from comments about delivery, packaging, personal preference, or an individual seller.",
  (t:string,h:string,a:string)=>"For "+h+", a shortlist is usually more useful than an endless collection of browser tabs. Keep a small set of candidates and record the reasons each one remains under consideration. Compare the same criteria across every candidate so that the decision does not change simply because one product has better marketing.",
  (t:string,h:string,a:string)=>"The strongest shopping process is proportional to the purchase. An everyday item may need only a few checks, while a costly or technically complex product deserves deeper research. The goal is not to spend unlimited time comparing everything; it is to spend enough time verifying the facts that could materially change the purchase.",
  (t:string,h:string,a:string)=>"Before payment, confirm the exact product, variant, quantity, seller, condition, final total, shipping destination, estimated delivery, return terms, and warranty information. These final checks are simple, but they prevent many errors created by comparing multiple versions of a product at once.",
  (t:string,h:string,a:string)=>"Long-term usefulness should be part of the decision. Consider cleaning, maintenance, storage, charging, updates, replacement parts, repairs, and whether other people will use the item. A purchase that fits the first day but creates repeated inconvenience may not provide the practical value expected from it.",
  (t:string,h:string,a:string)=>"When evaluating "+a+", avoid treating one specification as universally important. The right balance depends on the shopper's routine, budget, environment, and expectations. A good article or comparison therefore explains trade-offs instead of presenting one feature as automatically superior in every situation.",
  (t:string,h:string,a:string)=>"A reusable shopping checklist can include the need, budget, preferred specifications, compatibility constraints, seller, availability, delivery, return policy, warranty, support, total cost, and expected maintenance. Keeping this checklist in the repository or notes makes future online shopping faster and more consistent.",
  (t:string,h:string,a:string)=>"Good online shopping research is ultimately a process of reducing uncertainty. For "+t+", verify the information that matters, compare complete purchasing conditions, and keep personal preferences separate from objective specifications. This approach makes "+h+" clearer and helps the final choice reflect the shopper's actual requirements."
];

export function getArticle(id:number):ShoppingArticle|null{
  const meta=getArticleMeta(id);if(!meta)return null;
  const {topic,theme,angle,title,slug,description}=meta;
  let content="";
  for(let i=0;content.length<10500;i++){
    const paragraph=paragraphs[(i+id)%paragraphs.length](topic,theme,angle);
    content+="<p>"+paragraph+" The same principle applies throughout online retail: compare like with like, verify important details, and consider the complete ownership experience rather than a single headline feature.</p>";
  }
  return {...meta,content};
}

export function getArticleIdFromSlug(slug:string){
  const m=slug.match(/^(\d{6})-/);if(!m)return null;
  const id=Number(m[1]);const a=getArticleMeta(id);
  return a&&a.slug===slug?id:null;
}
