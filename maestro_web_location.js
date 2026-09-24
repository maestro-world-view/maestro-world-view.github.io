(function(){
function boot(){
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const country=$("#mw-country"),city=$("#mw-city"),section=$("#mw-section"),current=$("#mw-location-current");if(!country||!city)return;
 const updateMyWorld=()=>{
   let c=localStorage.getItem("mw_web_country")||"",ct=localStorage.getItem("mw_web_city")||"",sec=localStorage.getItem("mw_web_section")||"";
   let txt=[ct,c,sec&&sec.replaceAll("_"," ")].filter(Boolean).join(" · ")||"Your saved country, city and section preferences stay on this device.";
   $$(".mw-myworld-text").forEach(x=>x.textContent=txt);
 };
 const aliases={"US":"United States","USA":"United States","U.S.":"United States","United States of America":"United States","UK":"United Kingdom","U.K.":"United Kingdom"};
 const sectionPages={news:"news.html",sports:"sports.html",job:"job_offers.html",service:"services.html",real_estate:"real_estate.html",vehicle:"cars_motorcycles.html",art:"arts.html",dating:"dating.html",wellness:"wellness_longevity.html",science:"science.html",travel:"travel.html",politics:"politics.html",finance:"finance.html"};
 const canon=v=>aliases[(v||"").trim()]||(v||"").trim();
 const norm=v=>canon(v).normalize("NFKC").trim().toLocaleLowerCase();
 const cards=$$(".mw-story,.card,.dating-card").filter(x=>!x.closest(".mw-global-card"));
 const attr=(x,k)=>((x.dataset&&x.dataset[k])||"").trim();
 // V18.10 strict target filtering: use only collection metadata rendered into data-country/data-city.
 const field=(x,k)=>{let a=attr(x,k);return k==="country"?canon(a):a};
 const uniq=a=>[...new Set(a.filter(Boolean))].sort((a,b)=>a.localeCompare(b));
 const esc=v=>String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
 const catalog=(Array.isArray(window.MAESTRO_LOCATIONS)?window.MAESTRO_LOCATIONS:[]).map(x=>({country:canon(x.country),city:(x.city||"").trim()}));
 const pairs=[...catalog,...cards.map(x=>({country:field(x,"country"),city:field(x,"city")}))];
 function setopts(sel,a,label){sel.innerHTML='<option value="">'+label+'</option>'+a.map(v=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join("")}
 setopts(country,uniq(pairs.map(x=>x.country)),"All countries");
 function refill(){let c=canon(country.value);setopts(city,uniq(pairs.filter(x=>!c||norm(x.country)===norm(c)).map(x=>x.city)),"All cities / areas")}
 country.addEventListener("change",()=>{refill();apply()});
 city.addEventListener("change",apply);
 section.addEventListener("change",apply);
 refill();
 function type(x){let v=attr(x,"type")||attr(x,"category");if(v)return v.toLowerCase();let p=location.pathname.toLowerCase();if(p.includes("news"))return"news";if(p.includes("sports"))return"sports";if(p.includes("job"))return"job";if(p.includes("services"))return"service";if(p.includes("real_estate"))return"real_estate";if(p.includes("cars_motorcycles"))return"vehicle";if(p.includes("arts"))return"art";if(p.includes("dating"))return"dating";if(p.includes("wellness_longevity"))return"wellness";if(p.includes("science"))return"science";if(p.includes("travel"))return"travel";if(p.includes("politics"))return"politics";if(p.includes("finance"))return"finance";return""}
 function apply(){
  let c=canon(country.value),ct=city.value,sec=section.value;
  localStorage.setItem("mw_web_country",c);localStorage.setItem("mw_web_city",ct);localStorage.setItem("mw_web_section",sec);
  cards.forEach(x=>{let xc=field(x,"country"),xt=field(x,"city"),typ=type(x);x.style.display=((!c||norm(xc)===norm(c))&&(!ct||norm(xt)===norm(ct))&&(!sec||typ===sec))?"":"none"});
  $$(".mw-filter-empty").forEach(x=>x.remove());
  if(c||ct){
    const visible=cards.filter(x=>x.style.display!=="none");
    if(!visible.length){
      const host=$(".mw-editorial-section,.mw-top-stories,main,body");
      if(host){let e=document.createElement("div");e.className="mw-empty mw-filter-empty";e.textContent="No data collected for "+[ct,c].filter(Boolean).join(", ")+" in this view.";host.appendChild(e)}
    }
  }
  const isIndex=/\/(?:index\.html)?$/i.test(location.pathname)||location.pathname.endsWith("/");
  if(isIndex){
    $$(".mw-live-section[data-mw-section]").forEach(box=>{
      const k=(box.dataset.mwSection||"").toLowerCase();
      box.style.display=(!sec||k===sec)?"":"none";
    });
    $$(".mw-global-card,.stats").forEach(box=>box.style.display=sec?"none":"");
    // Remove empty grid space when only one local section is selected.
    $$(".mw-grid-live,.mw-global-grid").forEach(g=>{g.style.display=sec?"block":""});
  }
  if(current)current.textContent=(c||ct||sec)?("Showing: "+[ct,c,sec&&sec.replace("_"," ")].filter(Boolean).join(" · ")):"Showing all available areas";updateMyWorld();
 }
 $("#mw-apply-location")?.addEventListener("click",()=>{
   let c=canon(country.value),ct=city.value,sec=section.value;
   localStorage.setItem("mw_web_country",c);localStorage.setItem("mw_web_city",ct);localStorage.setItem("mw_web_section",sec);
   // On ANY Maestro page, choosing a specific section opens that dedicated
   // section page in a new tab. This keeps navigation behavior consistent.
   if(sec && sectionPages[sec]){
     const target=sectionPages[sec];
     const currentPage=(location.pathname.split("/").pop()||"index.html").toLowerCase();
     if(currentPage!==target.toLowerCase()){
       window.open(target,"_blank","noopener");
       return;
     }
   }
   apply();
 });
 $("#mw-clear-location")?.addEventListener("click",()=>{country.value="";refill();city.value="";section.value="";apply()});
 let sc=canon(localStorage.getItem("mw_web_country")||""),st=localStorage.getItem("mw_web_city")||"",ss=localStorage.getItem("mw_web_section")||"";let co=[...country.options].find(o=>norm(o.value)===norm(sc));if(co){country.value=co.value;refill()}let cio=[...city.options].find(o=>norm(o.value)===norm(st));if(cio)city.value=cio.value;if([...section.options].some(o=>o.value===ss))section.value=ss;apply();updateMyWorld();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();