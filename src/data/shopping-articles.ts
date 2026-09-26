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

const articleOpeners=[
"Begin with the real-world need, then narrow the decision to evidence that can be checked.",
"Online listings are easiest to compare when the shopper defines the outcome before comparing features.",
"A useful shopping guide separates product facts, store conditions, and personal preferences.",
"Good research starts with the constraints that would make a product unsuitable, not with the most attractive listing.",
"Different products can solve the same problem in very different ways, so the comparison should begin with the intended use.",
"Shopping research becomes clearer when every candidate is measured against the same practical requirements.",
"Before comparing prices, establish what the purchase actually needs to accomplish.",
"A strong shortlist is built from verified requirements rather than from popularity or presentation.",
"The most useful product information is the information that can change the decision.",
"Online shopping rewards a deliberate process: define, compare, verify, and only then decide."
] as const;

const articleSections=[
"Define the requirement. Write down the intended use, environment, frequency, important constraints, and acceptable budget. This creates a reference point for every later comparison.",
"Separate essentials from preferences. A must-have compatibility requirement should not be treated the same way as a cosmetic preference or an optional convenience feature.",
"Compare the candidates using identical fields. Record the exact model or variant, measurable specifications, included items, availability, and any condition that changes the practical result.",
"Evaluate the surrounding purchase conditions. Seller identity, fulfillment, delivery, returns, warranty, support, and final delivered cost can materially change an otherwise attractive option.",
"Research the focus of this article in context. The angle is not an isolated feature; it should be judged by how it affects the stated use, the environment, and the expected ownership experience.",
"Look for trade-offs. A candidate may improve one criterion while introducing a compromise elsewhere. The useful question is whether that compromise matters for this particular requirement.",
"Verify important claims. Prefer precise measurements, model identifiers, manufacturer information, clear store policies, and other evidence that can be checked rather than relying on broad promotional wording.",
"Consider ownership after delivery. Storage, setup, cleaning, maintenance, updates, consumables, replacement parts, and support can all affect the long-term usefulness of a purchase.",
"Use reviews carefully. Repeated, specific observations can reveal practical patterns, but individual preferences and delivery experiences should not be treated as universal product facts.",
"Create a final shortlist. Remove candidates that fail a non-negotiable requirement, then compare the remaining options on the article's main focus and the complete transaction.",
"Before checkout, recheck the exact variant, seller, condition, quantity, final total, destination, delivery estimate, return terms, and warranty information shown for the current order.",
"Document the decision. Keeping the criteria and evidence makes future repeat purchases easier and helps distinguish a genuine product change from a different listing or seller."
] as const;

const focusGuidance:Record<string,string>={
price:"Price should be evaluated as a complete cost, including unavoidable delivery, required accessories, recurring charges, and other expenses connected with normal use.",
value:"Value depends on the intended use. Compare useful capability, expected longevity, support, and ownership costs rather than treating the lowest price as the definition of value.",
durability:"Durability is best assessed through construction, materials, care requirements, repairability, replacement availability, and warranty information.",
materials:"Materials can affect weight, care, comfort, durability, appearance, and suitability for the intended environment, so compare the materials that actually influence the use case.",
dimensions:"Measure the destination and the usable space before ordering. Product dimensions alone may not show clearance, access, operating space, or storage requirements.",
compatibility:"Compatibility should be checked against the exact model, version, standard, connector, operating environment, and regional requirement rather than inferred from a broad category.",
maintenance:"Maintenance includes cleaning, charging, updates, consumables, calibration, storage, and routine care. Compare the ongoing work as well as the initial product.",
portability:"Portability includes packed size, weight, carrying method, protection, power requirements, and how often the item will actually be moved.",
performance:"Performance claims should be connected to the intended task. Prefer measurable specifications and evidence that reflects the workload instead of relying on general promotional language.",
storage:"Storage concerns both the main item and its accessories. Compare footprint, organization, environmental requirements, and how easily the item can be put away between uses.",
connectivity:"Connectivity research should cover supported standards, required software or accounts, connection limits where relevant, and compatibility with the devices already in use.",
comfort:"Comfort depends on the person and situation. Consider dimensions, adjustment range, contact materials, weight distribution, and expected duration of use.",
capacity:"Capacity should be compared with real usage. Distinguish usable capacity from headline capacity and consider how often the limit will actually be reached.",
accessories:"Accessories can change the effective cost and usefulness of a product. Identify what is included, what is optional, and what is required for normal operation.",
delivery:"Delivery should be evaluated for the actual destination and timing requirement, including shipping method, estimated arrival, order cutoffs, and delay conditions.",
returns:"Return research should cover the time window, exclusions, process, condition requirements, and any cost associated with sending the item back.",
warranty:"Warranty research should identify the provider, duration, exclusions, geographic limits, and process for obtaining service.",
availability:"Availability matters when the exact variant is limited, backordered, discontinued, or offered by different sellers. Confirm stock for the actual item being compared.",
setup:"Setup can include assembly, tools, software, accounts, calibration, installation space, and learning time. Include these requirements in the comparison.",
"learning curve":"Learning time is part of practical usability. Compare documentation, controls, onboarding, support, and the amount of practice required for the intended task.",
"replacement parts":"Replacement availability affects long-term ownership. Check whether important wear components are identifiable and realistically obtainable.",
"gift suitability":"Gift suitability depends on recipient needs, sizing or compatibility, presentation, delivery timing, and exchange flexibility, not only on product specifications.",
"space requirements":"Compare the complete operating footprint, including access, ventilation, movement, cables, doors, and routine maintenance where relevant.",
"repeat purchases":"Repeat purchases should verify the current version, package size, formulation or specification, seller, price, and terms rather than assuming a familiar listing is unchanged.",
"first-time buyers":"First-time buyers benefit from a short vocabulary and a small set of must-check criteria. Avoid letting unfamiliar specifications obscure the actual requirement.",
"experienced buyers":"Experienced buyers can examine deeper specifications, but should still distinguish measurable evidence from assumptions and personal preference.",
"comparison shopping":"Comparison shopping works best when the same fields are recorded for every candidate. This exposes trade-offs without relying on different listing layouts.",
"online ordering":"Online ordering adds transaction details that are easy to miss in a product-only comparison. Verify the exact variant, seller, destination, final cost, and terms.",
"store selection":"Store selection should consider seller identity, fulfillment, availability, delivery, returns, warranty handling, support, and information quality alongside price.",
"product research":"Product research should answer the questions that can change the decision. Gather focused evidence instead of collecting every available specification.",
"final selection":"The final selection should be checked against the original requirement. If an important part of the decision still depends on an assumption, the research is not finished."
};

const pick=<T,>(items:readonly T[],seed:number)=>items[Math.abs(seed)%items.length];

export function getArticle(id:number):ShoppingArticle|null{
  const meta=getArticleMeta(id);if(!meta)return null;
  const {topic,theme,angle}=meta;
  const p=articleIdToParts(id)!;
  const focus=focusGuidance[angle]||("For "+angle+", compare the factors that directly affect the intended use and record evidence consistently across the shortlist.");
  const blocks:string[]=[];
  blocks.push("<p>"+pick(articleOpeners,id*7)+" This article focuses specifically on "+topic+", "+theme+", and "+angle+".</p>");
  for(let i=0;i<articleSections.length;i++){
    const section=articleSections[(i+p.topicIndex)%articleSections.length];
    const detail=articleSections[(i+p.themeIndex+id)%articleSections.length];
    const context=i%3===0
      ? "For "+topic+", this should be considered alongside "+angle+" rather than in isolation."
      : i%3===1
      ? "In this shopping context, the same evidence should be compared across every candidate."
      : "The practical test is whether this changes the suitability of the option for the original requirement.";
    blocks.push("<h2>"+["Define the decision","Separate requirements","Build the comparison","Evaluate the store","Focus on the main criterion","Map the trade-offs","Verify the evidence","Plan ownership","Read feedback carefully","Narrow the shortlist","Check before ordering","Keep a decision record"][i]+"</h2><p>"+section+" "+detail+" "+context+"</p>");
    if(i===4)blocks.push("<p>"+focus+" This is the central lens for comparing the options discussed in this article.</p>");
  }
  blocks.push("<h2>Practical checklist</h2><ul><li>Define the intended use and non-negotiable requirements.</li><li>Record comparable specifications for each candidate.</li><li>Verify the exact variant and seller.</li><li>Compare the complete delivered cost and relevant terms.</li><li>Check returns, warranty, support, and long-term ownership.</li><li>Recheck the current listing immediately before ordering.</li></ul>");
  blocks.push("<h2>Conclusion</h2><p>The useful outcome of "+theme+" is not a universal winner. It is a transparent comparison showing why a candidate fits the original need. For "+topic+", keeping "+angle+" connected to measurable requirements makes the research easier to verify, repeat, and improve.</p>");
  let content=blocks.join("");
  let round=0;
  while(content.length<10500){
    const detail=pick(articleSections,id*13+round*17+p.angleIndex);
    const variant=round%4;
    const tail=variant===0?" Recheck the same criterion across the full shortlist."
      :variant===1?" Record the exact model or variant so similar listings are not accidentally treated as identical."
      :variant===2?" Keep store conditions separate from product characteristics when evaluating the evidence."
      :"If this factor does not affect the intended use, give it less weight than a requirement that does.";
    content+="<p>"+detail+" "+focus+tail+" The point is to make the comparison specific to "+topic+" rather than a generic shopping checklist.</p>";
    round++;
  }
  return {...meta,content};
}

export function getArticleIdFromSlug(slug:string){
  const m=slug.match(/^(\d{6})-/);if(!m)return null;
  const id=Number(m[1]);const article=getArticleMeta(id);
  return article&&article.slug===slug?id:null;
}
