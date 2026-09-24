(function(){
function boot(){
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const country=$("#mw-country"),city=$("#mw-city"),section=$("#mw-section"),current=$("#mw-location-current");
 if(!country||!city)return;
 const aliases={"US":"United States","USA":"United States","U.S.":"United States","United States of America":"United States","UK":"United Kingdom","U.K.":"United Kingdom"};
 const canon=v=>aliases[(v||"").trim()]||(v||"").trim();
 const norm=v=>canon(v).normalize("NFKC").trim().toLocaleLowerCase();
 const esc=v=>String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
 const uniq=a=>[...new Set(a.filter(Boolean))].sort((a,b)=>a.localeCompare(b));
 const sectionPages={news:"news.html",sports:"sports.html",job:"job_offers.html",service:"services.html",real_estate:"real_estate.html",vehicle:"cars_motorcycles.html",art:"arts.html",dating:"dating.html",wellness:"wellness_longevity.html",science:"science.html",travel:"travel.html",politics:"politics.html",finance:"finance.html"};
 const cardSelector=".mw-story,.mw-news-hero,.mw-news-row,.mw-listing-row,.card,.dating-card";
 const cards=()=>$$ (cardSelector).filter(x=>!x.closest(".mw-global-card"));
 const attr=(x,k)=>((x.dataset&&x.dataset[k])||"").trim();
 const field=(x,k)=>k==="country"?canon(attr(x,k)):attr(x,k);
 const catalog=(Array.isArray(window.MAESTRO_LOCATIONS)?window.MAESTRO_LOCATIONS:[]).map(x=>({country:canon(x.country),city:(x.city||"").trim()}));
 function pairs(){return [...catalog,...cards().map(x=>({country:field(x,"country"),city:field(x,"city")}))]}
 function setopts(sel,a,label){let old=sel.value;sel.innerHTML='<option value="">'+label+'</option>'+a.map(v=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join("");let hit=[...sel.options].find(o=>norm(o.value)===norm(old));if(hit)sel.value=hit.value}
 setopts(country,uniq(pairs().map(x=>x.country)),"All countries");
 function refill(){let c=canon(country.value);setopts(city,uniq(pairs().filter(x=>!c||norm(x.country)===norm(c)).map(x=>x.city)),"All cities / areas")}
 function type(x){let v=attr(x,"type")||attr(x,"category");if(v)return v.toLowerCase();let p=location.pathname.toLowerCase();if(p.includes("news"))return"news";if(p.includes("sports"))return"sports";if(p.includes("job"))return"job";if(p.includes("services"))return"service";if(p.includes("real_estate"))return"real_estate";if(p.includes("cars_motorcycles"))return"vehicle";if(p.includes("arts"))return"art";if(p.includes("dating"))return"dating";if(p.includes("wellness"))return"wellness";if(p.includes("science"))return"science";if(p.includes("travel"))return"travel";if(p.includes("politics"))return"politics";if(p.includes("finance"))return"finance";return""}
 function wanted(x,c,ct,sec){return (!c||norm(field(x,"country"))===norm(c))&&(!ct||norm(field(x,"city"))===norm(ct))&&(!sec||type(x)===sec)}
 function apply(){
   let c=canon(country.value),ct=city.value,sec=section.value;
   localStorage.setItem("mw_web_country",c);localStorage.setItem("mw_web_city",ct);localStorage.setItem("mw_web_section",sec);
   let all=cards(),shown=0;
   all.forEach(x=>{let ok=wanted(x,c,ct,sec);x.hidden=!ok;x.style.setProperty("display",ok?"":"none","important");if(ok)shown++});
   $$(".mw-filter-empty").forEach(x=>x.remove());
   if((c||ct)&&!shown){let host=$(".mw-section-wrap,.wrap,main")||document.body,e=document.createElement("div");e.className="mw-empty mw-filter-empty";e.textContent="No data collected for "+[ct,c].filter(Boolean).join(", ")+" in this view.";host.prepend(e)}
   const isIndex=/\/(?:index\.html)?$/i.test(location.pathname)||location.pathname.endsWith("/");
   if(isIndex){$$(".mw-live-section[data-mw-section]").forEach(box=>{let k=(box.dataset.mwSection||"").toLowerCase();box.hidden=!!sec&&k!==sec;box.style.setProperty("display",(!sec||k===sec)?"":"none","important")})}
   if(current)current.textContent=(c||ct||sec)?("Showing: "+[ct,c,sec&&sec.replaceAll("_"," ")].filter(Boolean).join(" · ")+" · "+shown+" matching items"):("Showing all available areas · "+shown+" items");
   $$(".mw-myworld-text").forEach(x=>x.textContent=[ct,c,sec&&sec.replaceAll("_"," ")].filter(Boolean).join(" · ")||"Your saved country, city and section preferences stay on this device.");
 }
 country.addEventListener("change",()=>{refill();apply()});city.addEventListener("change",apply);section.addEventListener("change",apply);
 $("#mw-apply-location")?.addEventListener("click",()=>{apply();let sec=section.value;if(sec&&sectionPages[sec]){let target=sectionPages[sec],cur=(location.pathname.split("/").pop()||"index.html").toLowerCase();if(cur!==target.toLowerCase())window.open(target,"_blank","noopener")}});
 $("#mw-clear-location")?.addEventListener("click",()=>{country.value="";refill();city.value="";section.value="";apply()});
 let sc=canon(localStorage.getItem("mw_web_country")||""),st=localStorage.getItem("mw_web_city")||"",ss=localStorage.getItem("mw_web_section")||"";
 let co=[...country.options].find(o=>norm(o.value)===norm(sc));if(co){country.value=co.value;refill()}else refill();
 let cio=[...city.options].find(o=>norm(o.value)===norm(st));if(cio)city.value=cio.value;
 if([...section.options].some(o=>o.value===ss))section.value=ss;
 apply();
 // Other Maestro scripts may touch card display. Reassert exact location filtering after DOM mutations.
 let pending=false;
 new MutationObserver(()=>{if(pending)return;pending=true;setTimeout(()=>{pending=false;apply()},50)}).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();