export type Category={slug:string;name:string;children?:Category[]};
export type Listing={slug:string;name:string;description:string;url:string;category:string;country:string;tags:string[]};
export type Shop={slug:string;name:string;description:string;url:string;country:string;city:string;tags:string[]};

export const categories:Category[]=[
 {slug:"shopping",name:"Shopping",children:[
  {slug:"fashion",name:"Fashion"},{slug:"home",name:"Home & Living"},{slug:"electronics",name:"Electronics"},{slug:"toys",name:"Toys & Children"}
 ]},
 {slug:"services",name:"Services",children:[
  {slug:"professional",name:"Professional Services"},{slug:"creative",name:"Creative Services"},{slug:"repair",name:"Repair & Maintenance"}
 ]},
 {slug:"food",name:"Food & Dining",children:[
  {slug:"restaurants",name:"Restaurants"},{slug:"cafes",name:"Cafes & Coffee"},{slug:"bakeries",name:"Bakeries"}
 ]},
 {slug:"travel",name:"Travel & Places",children:[
  {slug:"hotels",name:"Hotels & Stays"},{slug:"guides",name:"Guides & Tourism"}
 ]}
];

export const listings:Listing[]=[
 {slug:"local-shopping-guide",name:"Local Shopping Guide",description:"A hand-indexed starting point for discovering useful local businesses.",url:"https://example.com",category:"shopping",country:"georgia",tags:["directory","shopping"]},
 {slug:"creative-directory",name:"Creative Services Directory",description:"Independent creative services and studios worth exploring.",url:"https://example.com",category:"services",country:"georgia",tags:["creative","services"]}
];

export const shops:Shop[]=[
 {slug:"sample-local-shop",name:"Sample Local Shop",description:"A clean storefront profile for a neighborhood merchant.",url:"https://example.com",country:"georgia",city:"Tbilisi",tags:["local","retail"]},
 {slug:"sample-cafe",name:"Sample Cafe",description:"A sample merchant profile demonstrating the local shops index.",url:"https://example.com",country:"georgia",city:"Tbilisi",tags:["cafe","local"]}
];
