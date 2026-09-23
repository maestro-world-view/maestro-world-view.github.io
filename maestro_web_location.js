(function(){
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const country=$("#mw-country"),city=$("#mw-city"),section=$("#mw-section"),current=$("#mw-location-current");
if(!country||!city)return;
const globalCards=$$(".mw-global-card");
const candidates=$$(".mw-story,.card").filter(x=>!x.closest(".mw-global-card"));
function txt(x){return (x.innerText||"").replace(/\s+/g," ").trim()}
function attr(x,k){return ((x.dataset&&x.dataset[k])||"").trim()}
function field(x,k){
 let a=attr(x,k); if(a)return a;
 let t=txt(x), rx=k==="country"?/(?:Country[:\s-]+)([A-Za-z .'-]{2,40})/i:/(?:City[:\s-]+)([A-Za-z .'-]{2,50})/i;
 let m=t.match(rx); return m?m[1].trim():"";
}
function uniq(a){return [...new Set(a.filter(Boolean))].sort((a,b)=>a.localeCompare(b))}
function setopts(sel,a,label){sel.innerHTML='<option value="">'+label+'</option>'+a.map(v=>'<option value="'+v.replace(/"/g,"&quot;")+'">'+v.replace(/</g,"&lt;")+'</option>').join("")}
setopts(country,uniq(candidates.map(x=>field(x,"country"))),"All countries");
function refillCities(){
 const c=country.value;
 setopts(city,uniq(candidates.filter(x=>!c||field(x,"country")===c).map(x=>field(x,"city"))),"All cities / areas");
}
country.addEventListener("change",refillCities); refillCities();
function inferredType(x){
 let v=attr(x,"type")||attr(x,"category"); if(v)return v.toLowerCase();
 let path=location.pathname.toLowerCase(), head=(x.closest("section")?.innerText||"").toLowerCase();
 if(path.includes("news")||head.includes("news"))return "news";
 if(path.includes("sports")||head.includes("sport"))return "sports";
 if(path.includes("services")||head.includes("service"))return "service";
 if(path.includes("job")||head.includes("job"))return "job";
 if(path.includes("real_estate")||head.includes("real estate"))return "real_estate";
 if(path.includes("cars_motorcycles")||head.includes("motor"))return "vehicle";
 if(path.includes("arts")||head.includes("art"))return "art";\n if(path.includes("dating")||head.includes("dating"))return "dating";
 return "";
}
function apply(){
 const c=country.value,ct=city.value,sec=section.value;
 localStorage.setItem("mw_web_country",c); localStorage.setItem("mw_web_city",ct); localStorage.setItem("mw_web_section",sec);
 candidates.forEach(x=>{
   const xc=field(x,"country"), xt=field(x,"city"), typ=inferredType(x);
   const okC=!c||xc===c, okCt=!ct||xt===ct, okS=!sec||typ===sec;
   x.style.display=(okC&&okCt&&okS)?"":"none";
 });
 current.textContent=(c||ct||sec)?("Showing: "+[ct,c,sec&&sec.replace("_"," ")].filter(Boolean).join(" · ")):"Showing all available areas";
}
$("#mw-apply-location")?.addEventListener("click",apply);
$("#mw-clear-location")?.addEventListener("click",()=>{country.value="";refillCities();city.value="";section.value="";apply()});
let sc=localStorage.getItem("mw_web_country")||"", st=localStorage.getItem("mw_web_city")||"", ss=localStorage.getItem("mw_web_section")||"";
if([...country.options].some(o=>o.value===sc)){country.value=sc;refillCities()}
if([...city.options].some(o=>o.value===st))city.value=st;
if([...section.options].some(o=>o.value===ss))section.value=ss;
apply();
})();