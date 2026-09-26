(function(){
function boot(){
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const country=$("#mw-country"),city=$("#mw-city"),section=$("#mw-section"),keyword=$("#mw-keyword"),current=$("#mw-location-current");
 if(!country||!city)return;
 const aliases={"US":"United States","USA":"United States","U.S.":"United States","United States of America":"United States","UK":"United Kingdom","U.K.":"United Kingdom"};
 const canon=v=>aliases[(v||"").trim()]||(v||"").trim();
 const norm=v=>canon(v).normalize("NFKC").trim().toLocaleLowerCase();
 const esc=v=>String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
 const uniq=a=>[...new Set(a.filter(Boolean))].sort((a,b)=>a.localeCompare(b));
 const sectionPages={news:"news.html",sports:"sports.html",job:"job_offers.html",service:"services.html",real_estate:"real_estate.html",vehicle:"cars_motorcycles.html",art:"arts.html",wellness:"wellness_longevity.html",science:"science.html",travel:"travel.html",politics:"politics.html",finance:"finance.html"};
 const cardSelector=".mw-cloud-card,.mw-story,.mw-news-hero,.mw-news-row,.mw-listing-row,.card,.dating-card";
 const cards=()=>$$ (cardSelector).filter(x=>!x.closest(".mw-global-card"));
 const attr=(x,k)=>((x.dataset&&x.dataset[k])||"").trim();
 const field=(x,k)=>k==="country"?canon(attr(x,k)):attr(x,k);
 // V19.1: full DB-backed metadata, not the small preview-card set.
 const dbLocs=Array.isArray(window.MAESTRO_DB_LOCATIONS)?window.MAESTRO_DB_LOCATIONS:[];
 function pairs(){let a=dbLocs.map(x=>({country:canon(x.country),city:(x.city||"").trim()}));cards().forEach(x=>{let c=field(x,"country"),ct=field(x,"city");if(c)a.push({country:c,city:ct})});return a}
 function setopts(sel,a,label){let old=sel.value;sel.innerHTML='<option value="">'+label+'</option>'+a.map(v=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join("");let hit=[...sel.options].find(o=>norm(o.value)===norm(old));if(hit)sel.value=hit.value}
 setopts(country,uniq(pairs().map(x=>x.country)),"All countries");
 function refill(){let c=canon(country.value);setopts(city,uniq(pairs().filter(x=>!c||norm(x.country)===norm(c)).map(x=>x.city)),"All cities / areas")}
 function type(x){let v=attr(x,"type")||attr(x,"category");if(v)return v.toLowerCase();let p=location.pathname.toLowerCase();if(p.includes("news"))return"news";if(p.includes("sports"))return"sports";if(p.includes("job"))return"job";if(p.includes("services"))return"service";if(p.includes("real_estate"))return"real_estate";if(p.includes("cars_motorcycles"))return"vehicle";if(p.includes("arts"))return"art";if(p.includes("dating"))return"dating";if(p.includes("wellness"))return"wellness";if(p.includes("science"))return"science";if(p.includes("travel"))return"travel";if(p.includes("politics"))return"politics";if(p.includes("finance"))return"finance";return""}
 function wanted(x,c,ct,sec){return (!c||norm(field(x,"country"))===norm(c))&&(!ct||norm(field(x,"city"))===norm(ct))&&(!sec||type(x)===sec)}

 function updateDashboard(c,ct){
   // No geographic filter: restore authoritative whole-database totals rendered by page_chrome.py.
   if(!c&&!ct){
     $$(".stats .stat").forEach(box=>{let b=box.querySelector("b");if(b&&box.dataset.total!==undefined)b.textContent=box.dataset.total});
     return;
   }
   // Geographic filter: calculate from the complete DB-backed location matrix.
   // Never replace authoritative server totals with zeros if DB metadata failed to load.
   if(!dbLocs.length)return;
   const sums={news:0,sports:0,job:0,service:0,real_estate:0,vehicle:0,art:0,wellness:0,science:0,travel:0,politics:0,finance:0};
   dbLocs.forEach(r=>{
     if(c&&norm(r.country)!==norm(c))return;
     if(ct&&norm(r.city)!==norm(ct))return;
     Object.entries(r.counts||{}).forEach(([k,v])=>{if(Object.prototype.hasOwnProperty.call(sums,k))sums[k]+=Number(v)||0});
   });
   const map={"News":"news","Sports":"sports","Jobs":"job","Services":"service","Real Estate":"real_estate","Motors":"vehicle","Arts":"art","Wellness":"wellness","Science":"science","Travel":"travel","Politics":"politics","Finance":"finance"};
   $$(".stats .stat").forEach(box=>{let label=(box.querySelector("span")?.textContent||"").trim(),key=map[label];if(key){let b=box.querySelector("b");if(b)b.textContent=sums[key]}});
 }
 const isIndexPage=()=>/\/(?:index\.html)?$/i.test(location.pathname)||location.pathname.endsWith("/");
 const stateURL=(target,c,ct,sec)=>{
   const u=new URL(target,location.href);
   if(c)u.searchParams.set("country",c);else u.searchParams.delete("country");
   if(ct)u.searchParams.set("city",ct);else u.searchParams.delete("city");
   if(sec)u.searchParams.set("section",sec);else u.searchParams.delete("section");
   return u.href;
 };
 const sectionCount=(key,c,ct)=>{
   let n=0;
   dbLocs.forEach(r=>{
     if(c&&norm(r.country)!==norm(c))return;
     if(ct&&norm(r.city)!==norm(ct))return;
     n+=Number((r.counts||{})[key])||0;
   });
   return n;
 };
 let hydrationKey="",hydrating=false;
 async function hydrateIndex(c,ct,sec){
   if(!isIndexPage()||(!c&&!ct)||hydrating)return;
   const key=[norm(c),norm(ct),sec||"*"].join("|");
   if(key===hydrationKey)return;
   hydrationKey=key; hydrating=true;
   try{
     const keys=sec?[sec]:Object.keys(sectionPages);
     for(const k of keys){
       if(!sectionPages[k]||sectionCount(k,c,ct)<=0)continue;
       const box=document.querySelector('[data-mw-section="'+CSS.escape(k)+'"].mw-editorial-section,[data-mw-section="'+CSS.escape(k)+'"].mw-live-section');
       if(!box)continue;
       const existing=[...box.querySelectorAll(cardSelector)].some(x=>wanted(x,c,ct,k));
       if(existing)continue;
       const res=await fetch(sectionPages[k],{cache:"no-store"});
       if(!res.ok)continue;
       const doc=new DOMParser().parseFromString(await res.text(),"text/html");
       const matches=[...doc.querySelectorAll(cardSelector)].filter(x=>{
         const xc=canon((x.dataset&&x.dataset.country)||"");
         const xct=((x.dataset&&x.dataset.city)||"").trim();
         return (!c||norm(xc)===norm(c))&&(!ct||norm(xct)===norm(ct));
       }).slice(0,5);
       matches.forEach(x=>{
         x.querySelectorAll("script").forEach(s=>s.remove());
         x.dataset.mwHydrated="1";
         x.dataset.type=k;
         box.appendChild(document.importNode(x,true));
         document.querySelectorAll(".mw-filter-empty").forEach(e=>e.remove());
       });
     }
   }catch(e){console.warn("[V21.9 LOCATION] index hydration warning",e)}
   finally{hydrating=false;apply();}
 }
 function apply(){
   let c=canon(country.value),ct=city.value,sec=section.value,q=(keyword?.value||"").trim().toLocaleLowerCase();
   // Dedicated pages already define their section. A stale section preference must not hide their feed.
   const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
   const dedicatedKey=Object.entries(sectionPages).find(([k,v])=>v.toLowerCase()===page)?.[0]||"";
   if(dedicatedKey)sec=dedicatedKey;
   if(!isIndexPage()){
     localStorage.setItem("mw_web_country",c);
     localStorage.setItem("mw_web_city",ct);
     localStorage.setItem("mw_web_section",sec);
   }
   let all=cards(),shown=0;
   all.forEach(x=>{let ok=wanted(x,c,ct,sec)&&(!q||(x.innerText||"").toLocaleLowerCase().includes(q));x.hidden=!ok;x.style.setProperty("display",ok?"":"none","important");if(ok)shown++});
   $$(".mw-filter-empty").forEach(x=>x.remove());
   if((c||ct)&&!shown&&!(isIndexPage()&&hydrating)){let host=$(".mw-section-wrap,.wrap,main")||document.body,e=document.createElement("div");e.className="mw-empty mw-filter-empty";e.textContent="No data collected for "+[ct,c].filter(Boolean).join(", ")+" in this view.";host.prepend(e)}
   const isIndex=isIndexPage();
   if(isIndex){
     $$(".mw-editorial-section[data-mw-section],.mw-live-section[data-mw-section]").forEach(box=>{let k=(box.dataset.mwSection||"").toLowerCase();box.hidden=!!sec&&k!==sec;box.style.setProperty("display",(!sec||k===sec)?"":"none","important")});
     hydrateIndex(c,ct,sec);
   }
   updateDashboard(c,ct);
   if(current)current.textContent=(c||ct||sec)?("Showing: "+[ct,c,sec&&sec.replaceAll("_"," ")].filter(Boolean).join(" · ")+" · "+shown+" matching items"):("Showing all available areas · "+shown+" items");
   $$(".mw-myworld-text").forEach(x=>x.textContent=[ct,c,sec&&sec.replaceAll("_"," ")].filter(Boolean).join(" · ")||"Your saved country, city and section preferences stay on this device.");
 }
 country.addEventListener("change",()=>{hydrationKey="";refill();apply()});city.addEventListener("change",()=>{hydrationKey="";apply()});section.addEventListener("change",()=>{hydrationKey="";apply()});keyword?.addEventListener("input",apply);
 $("#mw-apply-location")?.addEventListener("click",()=>{apply();let c=canon(country.value),ct=city.value,sec=section.value;if(sec&&sectionPages[sec]){let target=sectionPages[sec],cur=(location.pathname.split("/").pop()||"index.html").toLowerCase();if(cur!==target.toLowerCase())window.open(stateURL(target,c,ct,sec),"_blank","noopener")}});
 $("#mw-clear-location")?.addEventListener("click",()=>{country.value="";refill();city.value="";section.value="";if(keyword)keyword.value="";apply()});
 const params=new URLSearchParams(location.search);
 const _indexDefault=isIndexPage();
 let sc=_indexDefault?"":canon(params.has("country")?params.get("country"):(localStorage.getItem("mw_web_country")||""));
 let st=_indexDefault?"":(params.has("city")?params.get("city"):(localStorage.getItem("mw_web_city")||""));
 let ss=_indexDefault?"":(params.has("section")?params.get("section"):(localStorage.getItem("mw_web_section")||""));
 if(_indexDefault){
   localStorage.removeItem("mw_web_country");
   localStorage.removeItem("mw_web_city");
   localStorage.removeItem("mw_web_section");
   localStorage.removeItem("maestro_place");
 }
 let co=[...country.options].find(o=>norm(o.value)===norm(sc));if(co){country.value=co.value;refill()}else refill();
 let cio=[...city.options].find(o=>norm(o.value)===norm(st));if(cio)city.value=cio.value;
 if([...section.options].some(o=>o.value===ss))section.value=ss;
 document.addEventListener("maestro:cloud-updated",()=>{let oldC=country.value,oldCity=city.value;setopts(country,uniq(pairs().map(x=>x.country)),"All countries");let hit=[...country.options].find(o=>norm(o.value)===norm(oldC));if(hit)country.value=hit.value;refill();let chit=[...city.options].find(o=>norm(o.value)===norm(oldCity));if(chit)city.value=chit.value;apply()});
 apply();
 // Other Maestro scripts may touch card display. Reassert exact location filtering after DOM mutations.
 let pending=false;
 new MutationObserver(()=>{if(pending)return;pending=true;setTimeout(()=>{pending=false;apply()},50)}).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();