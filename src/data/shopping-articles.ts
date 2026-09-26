export const ARTICLE_COUNT = 100_000;
export const SITEMAP_PAGE_SIZE = 1_000;

export const shoppingCategories = [
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
] as const;

const themes = ["how to choose the right option","a practical buying guide","features worth comparing","quality and value considerations","shopping by use case","shopping for beginners","shopping for everyday use","how to compare specifications","how to plan a sensible shopping budget","how to check delivery and returns","how to avoid common shopping mistakes","how to build a useful shopping shortlist","how to evaluate warranties and support","how to compare online store offers","how to read product descriptions","how to compare sizes and compatibility","how to think about long-term value","how to organize a product comparison","how to research products online","how to make a confident purchase decision"];
const angles = ["price","durability","materials","dimensions","compatibility","maintenance","portability","design","ease of use","performance","storage","connectivity","power use","comfort","capacity","adjustability","accessories","packaging","delivery","returns","warranty","customer support","replacement parts","availability","seasonality","gift suitability","space requirements","setup","learning curve","daily routine","home use","office use","travel use","school use","creative work","entertainment","outdoor use","family use","small spaces","large spaces","minimalist shopping","repeat purchases","first-time buyers","experienced buyers","comparison shopping","online ordering","store selection","product research","shopping checklist","final selection"];

const slugify=(s:string)=>s.toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").replace(/-+/g,"-");
const titleCase=(s:string)=>s.split(" ").map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" ");

export type ShoppingArticle={id:number;slug:string;title:string;category:string;theme:string;angle:string;description:string;content:string};
export type ShoppingArticleMeta=Omit<ShoppingArticle,"content">;

export function articleIdToParts(id:number){if(!Number.isInteger(id)||id<1||id>ARTICLE_COUNT)return null;const z=id-1;return{angleIndex:z%angles.length,themeIndex:Math.floor(z/angles.length)%themes.length,categoryIndex:Math.floor(z/(angles.length*themes.length))%shoppingCategories.length};}
export function getArticleMeta(id:number):ShoppingArticleMeta|null{
 const p=articleIdToParts(id);if(!p)return null;
 const category=shoppingCategories[p.categoryIndex],theme=themes[p.themeIndex],angle=angles[p.angleIndex];
 const title=titleCase(category)+": "+titleCase(theme)+" for "+titleCase(angle);
 const slug=String(id).padStart(6,"0")+"-"+slugify(category)+"-"+slugify(theme)+"-"+slugify(angle);
 return{id,slug,title,category,theme,angle,description:"A practical shopping guide to "+category+", covering "+theme+" with a focus on "+angle+"."};
}
export function getArticle(id:number):ShoppingArticle|null{
 const meta=getArticleMeta(id);if(!meta)return null;
 const {category,theme,angle}=meta;
 const {title,slug,description}=meta;
 const blocks=[
  "Start with the actual shopping need. Define where the product will be used, how often it will be used, who will use it, and which constraints matter before comparing stores or models.",
  "Read complete product specifications instead of relying on promotional headlines. For "+category+", compare dimensions, materials, capacity, compatibility, included accessories, and any technical requirements that affect everyday use.",
  "Focus this guide on "+angle+". Consider how that factor changes convenience, durability, total ownership cost, storage, maintenance, and the experience after the initial purchase.",
  "Compare sellers as carefully as products. Check availability, delivery terms, return policies, warranty coverage, customer support, seller identity, and whether the displayed price includes everything required.",
  "Build a shortlist using measurable facts. Record price, important specifications, package contents, delivery information, warranty, and the reasons each option matches the intended use. This keeps attractive marketing from replacing practical comparison.",
  "Consider the complete cost rather than only the headline price. Accessories, consumables, installation, maintenance, delivery, and replacement parts can change the value of an apparently inexpensive product.",
  "Verify compatibility before ordering. Model numbers, dimensions, connectors, operating requirements, supported ecosystems, regional versions, and other constraints should be checked against reliable specifications.",
  "Use customer feedback as supporting evidence. Repeated observations can reveal practical strengths or limitations, but reviews should be interpreted in the context of the reviewer's use case and separated from delivery or packaging experiences.",
  "A sensible online shopping process is proportional to the purchase. Everyday products may need a short checklist, while expensive or technically complex products deserve deeper specification, warranty, compatibility, and return-policy research.",
  "Before checkout, confirm the exact variant, quantity, seller, condition, shipping destination, delivery estimate, return terms, and final total. These simple checks prevent many errors caused by comparing several tabs at once.",
  "Think beyond the first day of ownership. Consider storage, cleaning, charging, updates, assembly, replacement parts, maintenance, and whether another person will use the product. Practical usefulness should survive the excitement of the purchase.",
  "There is no universal specification that makes one product right for every shopper. The useful approach is to rank personal requirements, verify objective facts, compare complete ownership terms, and keep subjective preferences separate from measurable constraints.",
  "Use a final checklist: define the use case, set a realistic budget, identify compatibility constraints, compare specifications, verify package contents, review delivery and returns, check warranty and support, compare total cost, and confirm the exact variant.",
  "This shopping guide is designed to make research clearer and more repeatable. For "+category+", the most useful decision is the one that fits the intended routine, available space, budget, compatibility requirements, and expectations for long-term use."
 ];
 let content="";
 for(let i=0;content.length<10500;i++) content+="<p>"+blocks[i%blocks.length]+" The comparison should remain specific to the shopper's needs, because "+angle+" can matter differently across products, households, budgets, and shopping situations.</p>";
 return{id,slug,title,category,theme,angle,description:"A practical shopping guide to "+category+", covering "+theme+" with a focus on "+angle+".",content};
}
export function getArticleIdFromSlug(slug:string){const m=slug.match(/^(\d{6})-/);if(!m)return null;const id=Number(m[1]);const a=getArticleMeta(id);return a&&a.slug===slug?id:null;}
