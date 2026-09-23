(function(){
function boot(){
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const country=$("#mw-country"),city=$("#mw-city"),section=$("#mw-section"),current=$("#mw-location-current");if(!country||!city)return;
 const aliases={"US":"United States","USA":"United States","U.S.":"United States","United States of America":"United States","UK":"United Kingdom","U.K.":"United Kingdom"};
 const sectionPages={news:"news.html",sports:"sports.html",job:"job_offers.html",service:"services.html",real_estate:"real_estate.html",vehicle:"cars_motorcycles.html",art:"arts.html",dating:"dating.html"};
 const canon=v=>aliases[(v||"").trim()]||(v||"").trim();
 const cards=$$(".mw-story,.card,.dating-card").filter(x=>!x.closest(".mw-global-card"));
 const attr=(x,k)=>((x.dataset&&x.dataset[k])||"").trim();
 const field=(x,k)=>{let a=attr(x,k);if(a)return k==="country"?canon(a):a;let t=(x.innerText||"").replace(/\s+/g," ");let rx=k==="country"?/(?:Country[:\s-]+)([A-Za-z .'-]{2,40})/i:/(?:City[:\s-]+)([A-Za-z .'-]{2,50})/i,m=t.match(rx);return m?(k==="country"?canon(m[1]):m[1].trim()):""};
 const uniq=a=>[...new Set(a.filter(Boolean))].sort((a,b)=>a.localeCompare(b));
 const esc=v=>String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
 const catalog=(Array.isArray(window.MAESTRO_LOCATIONS)?window.MAESTRO_LOCATIONS:[]).map(x=>({country:canon(x.country),city:(x.city||"").trim()}));
 const pairs=[...catalog,...cards.map(x=>({country:field(x,"country"),city:field(x,"city")}))];
 function setopts(sel,a,label){sel.innerHTML='<option value="">'+label+'</option>'+a.map(v=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join("")}
 setopts(country,uniq(pairs.map(x=>x.country)),"All countries");
 function refill(){let c=canon(country.value);setopts(city,uniq(pairs.filter(x=>!c||x.country===c).map(x=>x.city)),"All cities / areas")};country.addEventListener("change",refill);refill();
 function type(x){let v=attr(x,"type")||attr(x,"category");if(v)return v.toLowerCase();let p=location.pathname.toLowerCase();if(p.includes("news"))return"news";if(p.includes("sports"))return"sports";if(p.includes("job"))return"job";if(p.includes("services"))return"service";if(p.includes("real_estate"))return"real_estate";if(p.includes("cars_motorcycles"))return"vehicle";if(p.includes("arts"))return"art";if(p.includes("dating"))return"dating";return""}
 function apply(){
  let c=canon(country.value),ct=city.value,sec=section.value;
  localStorage.setItem("mw_web_country",c);localStorage.setItem("mw_web_city",ct);localStorage.setItem("mw_web_section",sec);
  cards.forEach(x=>{let xc=field(x,"country"),xt=field(x,"city"),typ=type(x);x.style.display=((!c||xc===c)&&(!ct||xt===ct)&&(!sec||typ===sec))?"":"none"});
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
  if(current)current.textContent=(c||ct||sec)?("Showing: "+[ct,c,sec&&sec.replace("_"," ")].filter(Boolean).join(" · ")):"Showing all available areas";
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
 let sc=canon(localStorage.getItem("mw_web_country")||""),st=localStorage.getItem("mw_web_city")||"",ss=localStorage.getItem("mw_web_section")||"";if([...country.options].some(o=>o.value===sc)){country.value=sc;refill()}if([...city.options].some(o=>o.value===st))city.value=st;if([...section.options].some(o=>o.value===ss))section.value=ss;apply();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();