(()=>{
const api=()=>String(window.MAESTRO_SUBMISSION_API||"https://maestro-submissions.onrender.com").replace(/\/$/,"");
const e=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const abs=u=>{u=String(u||"");return !u?"":/^https?:\/\//i.test(u)?u:api()+u};
async function g(p){try{let r=await fetch(api()+p,{cache:"no-store"});return r.ok?await r.json():[]}catch{return[]}}
function notify(){document.dispatchEvent(new CustomEvent("maestro:cloud-updated"));}
function stamp(v){try{return new Intl.DateTimeFormat(undefined,{year:"numeric",month:"short",day:"numeric"}).format(new Date(v))}catch{return""}}
function communityMeta(x){return `<div class="src mw-community-meta"><img class="mw-source-icon mw-community-icon" src="logo.png" alt="Maestro World View"><span class="mw-community-label">MAESTRO WORLD VIEW · COMMUNITY SUBMISSION</span>${x.city||x.country?` · ${e([x.city,x.country].filter(Boolean).join(" · "))}`:""}${x.created_at?` · ${e(stamp(x.created_at))}`:""}</div>`}
function listingCard(x,section,mode){
 const img=abs(x.image_url)||"logo1.png";
 const isVideo=section==="video"||section==="music"; const link=isVideo?(x.external_url||"#"):`community_article.html?id=${encodeURIComponent(x.id||"")}&section=${encodeURIComponent(section||x.section||"")}&type=listing`;
 const raw=String(x.description||""); const desc=e(raw.length>320?raw.slice(0,317).trimEnd()+"…":raw);
 const extra=[x.organization,x.price].filter(Boolean).map(e).join(" · ");
 const mediaBadge=section==="music"?`<div class="mw-video-badge">♫ MUSIC</div>`:section==="video"?`<div class="mw-video-badge">▶ VIDEO</div>`:"";
 const contact=x.contact_email?`<div class="contact"><strong>Email:</strong> ${e(x.contact_email)}</div>`:"";
 if(mode==="market") return `<article class="card mw-cloud-card" data-cloud-id="${e(x.id)}" data-country="${e(x.country)}" data-city="${e(x.city)}" data-type="${e(section)}"><img class="mw-feed-image" src="${e(img)}" alt="" loading="lazy" onerror="this.onerror=null;this.src='logo1.png'"><div>${communityMeta(x)}${mediaBadge}<h2>${e(x.title)}</h2>${extra?`<div class="facts">${extra}</div>`:""}<p class="desc">${desc}</p>${contact}<a class="mw-source-button" target="_blank" rel="noopener" href="${e(link)}">${isVideo?(section==="music"?"PLAY MUSIC":"WATCH VIDEO"):"READ MORE"}</a></div></article>`;
 if(mode==="listing") return `<article class="mw-listing-row mw-story mw-cloud-card" data-cloud-id="${e(x.id)}" data-country="${e(x.country)}" data-city="${e(x.city)}" data-type="${e(section)}"><img class="mw-feed-image mw-listing-thumb" src="${e(img)}" alt="" loading="lazy" onerror="this.onerror=null;this.src='logo1.png'"><div class="mw-listing-copy">${communityMeta(x)}${mediaBadge}<h3>${e(x.title)}</h3>${extra?`<div class="mw-cloud-facts">${extra}</div>`:""}<p>${desc}</p>${contact}<a class="mw-source-button" target="_blank" rel="noopener" href="${e(link)}">${isVideo?(section==="music"?"PLAY MUSIC":"WATCH VIDEO"):"READ MORE"}</a></div></article>`;
 return `<article class="mw-news-row mw-story mw-cloud-card" data-cloud-id="${e(x.id)}" data-country="${e(x.country)}" data-city="${e(x.city)}" data-type="${e(section)}"><img class="mw-feed-image mw-news-thumb" src="${e(img)}" alt="" loading="lazy" onerror="this.onerror=null;this.src='logo1.png'"><div class="mw-news-row-copy">${communityMeta(x)}${mediaBadge}<h3>${e(x.title)}</h3>${extra?`<div class="mw-cloud-facts">${extra}</div>`:""}<p>${desc}</p>${contact}<a class="mw-source-button" target="_blank" rel="noopener" href="${e(link)}">${isVideo?(section==="music"?"PLAY MUSIC":"WATCH VIDEO"):"READ MORE"}</a></div></article>`;
}
function targetFor(section){const scoped=document.querySelector(`.mw-editorial-section[data-mw-section="${CSS.escape(section)}"]`);if(scoped){let vm=scoped.querySelector(".mw-view-more-wrap");return{host:scoped,before:vm||null,mode:scoped.querySelector(".mw-listing-row")?"listing":"news"}}const market=["job","service","real_estate","vehicle","art","public_events","freelance","gaming","tech_ai","property_rental","kids_movies","movies","nature","astrology","history","product_reviews","celebrities","athletes","luxury","fashion","cuisine"].includes(section);if(market){let first=document.querySelector("article.card");if(first)return{host:first.parentElement,before:first,mode:"market"};let h=document.querySelector("header h1")?.parentElement||document.querySelector("main")||document.body;return{host:h,before:null,mode:"market"}}let latest=document.querySelector(".mw-latest");if(latest){let head=latest.querySelector(".mw-editorial-head");return{host:latest,before:head?head.nextSibling:latest.firstChild,mode:"news"}}let main=document.querySelector(".mw-section-wrap,.wrap,main")||document.body;return{host:main,before:null,mode:"news"}}
function replaceCloud(section,a){
 document.querySelectorAll(`.mw-cloud-card[data-type="${CSS.escape(section)}"]`).forEach(n=>n.remove());
 let t=targetFor(section),box=document.createElement("div");
 box.innerHTML=a.map(x=>listingCard(x,section,t.mode)).join("");
 let nodes=[...box.children];
 // V25.48 COMMUNITY-FIRST: for every dedicated section page, insert approved
 // community submissions before the first harvested/database story.  This
 // works with both canonical mw-news-row pages and older market/listing layouts.
 const main=document.querySelector("main")||document.body;
 const dedicated=main.querySelector('.mw-latest');
 let firstHarvested=null;
 if(dedicated){
   firstHarvested=dedicated.querySelector('article:not(.mw-cloud-card)');
   if(firstHarvested){
     t={host:firstHarvested.parentElement,before:firstHarvested,mode:t.mode};
   }else{
     t={host:dedicated,before:null,mode:t.mode};
   }
 }else{
   firstHarvested=main.querySelector('article:not(.mw-cloud-card)');
   if(firstHarvested)t={host:firstHarvested.parentElement,before:firstHarvested,mode:t.mode};
 }
 // Preserve API order while inserting before one fixed anchor.
 if(t.before)nodes.forEach(n=>t.host.insertBefore(n,t.before));
 else nodes.forEach(n=>t.host.appendChild(n));
 notify()
}
window.loadSubmittedListings=async function(section){let a=await g("/api/listings/"+section);replaceCloud(section,a);window.__mwCloudTimers=window.__mwCloudTimers||{};if(!window.__mwCloudTimers[section])window.__mwCloudTimers[section]=setInterval(()=>window.loadSubmittedListings(section),30000)};
window.loadSubmittedResumes=async()=>{let h=document.querySelector("#submitted-resumes");if(!h)return;let a=await g("/api/resumes");h.innerHTML=a.map(x=>{let text=String(x.resume_text||"");let summary=(text.match(/Summary:\s*([^\n]+)/i)||[])[1]||(text.match(/Experience:\s*([^\n]+)/i)||[])[1]||"Professional profile";let skills=(text.match(/Skills:\s*([^\n]+)/i)||[])[1]||"";let link=`community_article.html?id=${encodeURIComponent(x.id||"")}&type=resume`;return `<article class="card mw-story mw-cloud-card" data-country="${e(x.country)}" data-city="${e(x.city)}" data-type="resume" data-role="${e([x.job_title,x.profession,x.organization].filter(Boolean).join(" "))}" data-skills="${e(text)}">${x.profile_image_url?`<img class="mw-feed-image" src="${e(abs(x.profile_image_url))}" alt="">`:""}<div><div class="src"><span class="mw-community-label">MAESTRO WORLD VIEW · COMMUNITY SUBMISSION</span></div><h2>${e([x.first_name,x.last_name].filter(Boolean).join(" "))}</h2><h3>${e(x.job_title||x.profession||"Professional profile")}</h3>${x.organization||x.city||x.country?`<div class="facts">${e([x.organization,x.city,x.country].filter(Boolean).join(" · "))}</div>`:""}<p>${e(summary)}</p>${skills?`<div class="facts"><strong>Skills:</strong> ${e(skills)}</div>`:""}${x.email?`<div class="contact"><strong>Email:</strong> ${e(x.email)}</div>`:""}<a class="mw-source-button" target="_blank" rel="noopener" href="${e(link)}">READ MORE</a></div></article>`}).join("");notify()};
window.loadSubmittedDating=async()=>{let h=document.querySelector("#submitted-dating");if(!h)return;let a=await g("/api/dating");h.innerHTML=a.map(x=>{let bio=String(x.bio||"");let gender=(bio.match(/Gender:\s*([^\n]+)/i)||[])[1]||"",goal=(bio.match(/Relationship goal:\s*([^\n]+)/i)||[])[1]||"",occupation=(bio.match(/Occupation:\s*([^\n]+)/i)||[])[1]||"";let link=`community_article.html?id=${encodeURIComponent(x.id||"")}&type=dating`;return `<article class="dating-card mw-story mw-cloud-card" data-country="${e(x.country)}" data-city="${e(x.city)}" data-type="dating" data-age="${e(x.age||"")}" data-gender="${e(gender)}" data-goal="${e(goal)}">${x.photo_url?`<img class="mw-feed-image" src="${e(abs(x.photo_url))}" alt="">`:""}<div class="dating-copy"><div class="src"><span class="mw-community-label">MAESTRO WORLD VIEW · COMMUNITY SUBMISSION</span></div><h2>${e(x.display_name||"Dating profile")}${x.age?`, ${e(x.age)}`:""}</h2><h3>${e(x.headline||occupation||"Dating profile")}</h3><div class="facts">${e([x.city,x.country,gender,goal].filter(Boolean).join(" · "))}</div><p>${e(bio.length>320?bio.slice(0,317).trimEnd()+"…":bio)}</p>${x.contact_email?`<div class="contact"><strong>Email:</strong> ${e(x.contact_email)}</div>`:""}<a class="mw-source-button" target="_blank" rel="noopener" href="${e(link)}">READ MORE</a></div></article>`}).join("");notify()};
const COUNT_CACHE="mw_community_counts_v1";
function readCountCache(){try{return JSON.parse(localStorage.getItem(COUNT_CACHE)||"{}")||{}}catch{return{}}}
function writeCountCache(v){try{localStorage.setItem(COUNT_CACHE,JSON.stringify(v))}catch{}}
function applyCommunityCount(key,n,addLocal){
 document.querySelectorAll(".mw-bottom-dashboard .stat").forEach(card=>{
  const label=(card.dataset.countKey||card.querySelector("span")?.textContent||"").trim();
  if(label!==key)return;
  if(card.dataset.harvestedTotal===undefined)
   card.dataset.harvestedTotal=String(Number(card.dataset.total||card.querySelector("b")?.textContent||0)||0);
  const harvested=addLocal?(Number(card.dataset.harvestedTotal)||0):0;
  const total=harvested+(Number(n)||0);
  card.dataset.total=String(total);
  const b=card.querySelector("b");if(b)b.textContent=String(total);
 });
}
function applyCachedCommunityCounts(){
 const cache=readCountCache();
 Object.entries(cache).forEach(([key,v])=>applyCommunityCount(key,v.n,v.addLocal));
}
async function refreshCloudDashboardCounts(){
 const defs=[
  ["News","/api/listings/news",true],["Sports","/api/listings/sports",true],
  ["Jobs","/api/listings/job",true],["Services","/api/listings/service",true],
  ["Real Estate","/api/listings/real_estate",true],["Motors","/api/listings/vehicle",true],
  ["Arts","/api/listings/art",true],["Wellness","/api/listings/wellness",true],
  ["Science","/api/listings/science",true],["Travel","/api/listings/travel",true],
  ["Politics","/api/listings/politics",true],["Finance","/api/listings/finance",true],
  ["Public Events / Notices","/api/listings/public_events",true],
  ["Freelance / Remote Work","/api/listings/freelance",true],
  ["Gaming","/api/listings/gaming",true],["Tech & AI","/api/listings/tech_ai",true],
  ["Property Rentals","/api/listings/property_rental",true],
  ["Kids Movies","/api/listings/kids_movies",true],
  ["Movies","/api/listings/movies",true],
  ["Nature","/api/listings/nature",true],
  ["Astrology","/api/listings/astrology",true],
  ["History","/api/listings/history",true],
  ["Product Reviews","/api/listings/product_reviews",true],
  ["Celebrities","/api/listings/celebrities",true],
  ["Athletes","/api/listings/athletes",true],
  ["Luxury","/api/listings/luxury",true],
  ["Fashion","/api/listings/fashion",true],
  ["Cuisine","/api/listings/cuisine",true],
  ["Trending Videos","/api/listings/video",true],["Trending Music","/api/listings/music",true],
  ["Resume Bank","/api/resumes",false],["Dating","/api/dating",false]
 ];
 for(const [key,path,addLocal] of defs){
  try{
   const r=await fetch(api()+path,{cache:"no-store"});
   if(!r.ok)continue;                         // never turn a failed endpoint into zero
   const rows=await r.json();
   if(!Array.isArray(rows))continue;
   const cache=readCountCache();
   cache[key]={n:rows.length,addLocal:!!addLocal,at:Date.now()};
   writeCountCache(cache);
   applyCommunityCount(key,rows.length,addLocal);
  }catch(e){ /* leave generated count untouched */ }
 }
}
window.refreshCloudDashboardCounts=refreshCloudDashboardCounts;
document.addEventListener("DOMContentLoaded",()=>{applyCachedCommunityCounts();refreshCloudDashboardCounts();setInterval(refreshCloudDashboardCounts,30000)});

})();
