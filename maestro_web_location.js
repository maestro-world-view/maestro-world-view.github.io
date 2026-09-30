(function(){
function boot(){
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const isIndexNow=/\/(?:index\.html)?$/i.test(location.pathname)||location.pathname.endsWith("/");
 if(!isIndexNow){
   const pickers=[...document.querySelectorAll(".mw-location-picker")];
   pickers.slice(1).forEach(x=>x.remove());
 }
 const country=$("#mw-country"),city=$("#mw-city"),section=$("#mw-section"),keyword=$("#mw-keyword"),current=$("#mw-location-current");
 if(!country||!city)return;
 const aliases={"US":"United States","USA":"United States","U.S.":"United States","United States of America":"United States","UK":"United Kingdom","U.K.":"United Kingdom"};
 const canon=v=>aliases[(v||"").trim()]||(v||"").trim();
 const norm=v=>canon(v).normalize("NFKC").trim().toLocaleLowerCase();
 const esc=v=>String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
 const uniq=a=>[...new Set(a.filter(Boolean))].sort((a,b)=>a.localeCompare(b));
 const ALL_COUNTRIES=["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bonaire, Sint Eustatius and Saba", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Cook Islands", "Costa Rica", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia", "Côte d'Ivoire", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "North Korea", "North Macedonia", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Romania", "Russia", "Rwanda", "Réunion", "Saint Barthélemy", "Saint Helena, Ascension and Tristan da Cunha", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin (French part)", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten (Dutch part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Svalbard and Jan Mayen", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Türkiye", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands, British", "Virgin Islands, U.S.", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe", "Åland Islands"];
 const sectionPages={news:"news.html",sports:"sports.html",job:"job_offers.html",service:"services.html",real_estate:"real_estate.html",vehicle:"cars_motorcycles.html",art:"arts.html",wellness:"wellness_longevity.html",science:"science.html",travel:"travel.html",politics:"politics.html",finance:"finance.html"};
 const cardSelector=".mw-cloud-card,.mw-story,.mw-news-hero,.mw-news-row,.mw-listing-row,.card,.dating-card";
 const cards=()=>$$ (cardSelector).filter(x=>!x.closest(".mw-global-card")&&!x.closest("#mw-search-results"));
 const attr=(x,k)=>((x.dataset&&x.dataset[k])||"").trim();
 const field=(x,k)=>k==="country"?canon(attr(x,k)):attr(x,k);
 // V19.1: full DB-backed metadata, not the small preview-card set.
 const dbLocs=Array.isArray(window.MAESTRO_DB_LOCATIONS)?window.MAESTRO_DB_LOCATIONS:[];
 function pairs(){let a=dbLocs.map(x=>({country:canon(x.country),city:(x.city||"").trim()}));cards().forEach(x=>{let c=field(x,"country"),ct=field(x,"city");if(c)a.push({country:c,city:ct})});return a}
 function setopts(sel,a,label){let old=sel.value;sel.innerHTML='<option value="">'+label+'</option>'+a.map(v=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join("");let hit=[...sel.options].find(o=>norm(o.value)===norm(old));if(hit)sel.value=hit.value}
 setopts(country,uniq(ALL_COUNTRIES.concat(pairs().map(x=>x.country))),"All countries");
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
 const stateURL=(target,c,ct,sec,q)=>{
   const u=new URL(target,location.href);
   if(c)u.searchParams.set("country",c);else u.searchParams.delete("country");
   if(ct)u.searchParams.set("city",ct);else u.searchParams.delete("city");
   if(sec)u.searchParams.set("section",sec);else u.searchParams.delete("section");
   if(q)u.searchParams.set("keyword",q);else u.searchParams.delete("keyword");
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
   const secFilter=sec==="all"?"":sec;
   // Dedicated pages already define their section. A stale section preference must not hide their feed.
   const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
   const dedicatedKey=Object.entries(sectionPages).find(([k,v])=>v.toLowerCase()===page)?.[0]||"";
   if(dedicatedKey){sec=dedicatedKey;}
   if(!isIndexPage()){
     localStorage.setItem("mw_web_country",c);
     localStorage.setItem("mw_web_city",ct);
     localStorage.setItem("mw_web_section",sec);
   }
   let all=cards(),shown=0;
   all.forEach(x=>{
     let ok=wanted(x,c,ct,secFilter)&&(!q||(x.innerText||"").toLocaleLowerCase().includes(q));
     x.hidden=!ok;
     x.dataset.mwLocationVisible=ok?"1":"0";
     x.style.setProperty("display",ok?"":"none","important");
     if(ok)shown++;
   });
   $$(".mw-filter-empty").forEach(x=>x.remove());
   if((c||ct)&&!shown&&!(isIndexPage()&&hydrating)){let host=$(".mw-section-wrap,.wrap,main")||document.body,e=document.createElement("div");e.className="mw-empty mw-filter-empty";e.textContent="No data collected for "+[ct,c].filter(Boolean).join(", ")+" in this view.";host.prepend(e)}
   const isIndex=isIndexPage();
   if(isIndex){
     $$(".mw-editorial-section[data-mw-section],.mw-live-section[data-mw-section]").forEach(box=>{let k=(box.dataset.mwSection||"").toLowerCase();box.hidden=!!secFilter&&k!==secFilter;box.style.setProperty("display",(!secFilter||k===secFilter)?"":"none","important")});
     hydrateIndex(c,ct,secFilter);
   }
   updateDashboard(c,ct);
   if(current)current.textContent=(c||ct||sec)?("Showing: "+[ct,c,sec&&sec.replaceAll("_"," ")].filter(Boolean).join(" · ")+" · "+shown+" matching items"):("Showing all available areas · "+shown+" items");
   $$(".mw-myworld-text").forEach(x=>x.textContent=[ct,c,sec&&sec.replaceAll("_"," ")].filter(Boolean).join(" · ")||"Your saved country, city and section preferences stay on this device.");
 }
 country.addEventListener("change",()=>{hydrationKey="";refill();apply()});city.addEventListener("change",()=>{hydrationKey="";apply()});section.addEventListener("change",()=>{hydrationKey="";apply()});keyword?.addEventListener("input",apply);
 $("#mw-apply-location")?.addEventListener("click",()=>{let sec=section.value;if(!sec)return;apply();let c=canon(country.value),ct=city.value,q=(keyword?.value||"").trim();if(sec==="all"){window.open(stateURL("all_sections.html",c,ct,"all",q),"_blank","noopener");return;}let target=sectionPages[sec];if(!target)return;window.open(stateURL(target,c,ct,sec,q),"_blank","noopener")});
 $("#mw-clear-location")?.addEventListener("click",()=>{country.value="";refill();city.value="";section.value="";if(keyword)keyword.value="";apply()});
 const params=new URLSearchParams(location.search);
 const _hasFilterParams=params.has("country")||params.has("city")||params.has("section")||params.has("keyword");
 const _indexDefault=isIndexPage()&&!_hasFilterParams;
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
 if(keyword&&params.has("keyword"))keyword.value=params.get("keyword")||"";
 document.addEventListener("maestro:cloud-updated",()=>{let oldC=country.value,oldCity=city.value;setopts(country,uniq(ALL_COUNTRIES.concat(pairs().map(x=>x.country))),"All countries");let hit=[...country.options].find(o=>norm(o.value)===norm(oldC));if(hit)country.value=hit.value;refill();let chit=[...city.options].find(o=>norm(o.value)===norm(oldCity));if(chit)city.value=chit.value;apply()});
 apply();
 // Persist the active location state into every internal section link that opens a new tab
 // (including bottom dashboard OPEN SECTION links). This keeps Country/City/Keyword/Section
 // when navigating from All Sections or any dedicated section page.
 function carryFiltersToInternalLinks(){
   const c=canon(country.value),ct=city.value,q=(keyword?.value||"").trim();
   $$('a[target="_blank"][href]').forEach(a=>{
     const raw=a.getAttribute("href")||"";
     if(!raw||raw.startsWith("#")||/^(?:mailto:|tel:|javascript:)/i.test(raw))return;
     let u;try{u=new URL(raw,location.href)}catch(e){return}
     if(u.origin!==location.origin)return;
     const page=(u.pathname.split("/").pop()||"").toLowerCase();
     const entry=Object.entries(sectionPages).find(([k,v])=>v.toLowerCase()===page);
     let targetSec=entry?entry[0]:(page==="all_sections.html"?"all":"");
     if(!targetSec)return;
     if(c)u.searchParams.set("country",c);else u.searchParams.delete("country");
     if(ct)u.searchParams.set("city",ct);else u.searchParams.delete("city");
     if(q)u.searchParams.set("keyword",q);else u.searchParams.delete("keyword");
     u.searchParams.set("section",targetSec);
     a.href=u.href;
   });
 }
 carryFiltersToInternalLinks();
 country.addEventListener("change",carryFiltersToInternalLinks);
 city.addEventListener("change",carryFiltersToInternalLinks);
 section.addEventListener("change",carryFiltersToInternalLinks);
 keyword?.addEventListener("input",carryFiltersToInternalLinks);
 // Other Maestro scripts may touch card display. Reassert exact location filtering after DOM mutations.
 let pending=false;
 new MutationObserver(()=>{if(pending)return;pending=true;setTimeout(()=>{pending=false;apply()},50)}).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();