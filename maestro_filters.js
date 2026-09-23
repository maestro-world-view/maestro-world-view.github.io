(function(){
function uniq(a){return [...new Set(a.filter(Boolean).map(x=>x.trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b))}
function esc(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function values(cards,key){
 let out=[];
 cards.forEach(c=>{
   let v=c.dataset[key]||"";
   if(v)v.split("|").forEach(x=>out.push(x));
 });
 return uniq(out)
}
function fallbackValues(cards,kind){
 let out=[];
 cards.forEach(c=>{
   let t=c.innerText||"";
   if(kind==="country"){
     let m=t.match(/(?:Country|Location)\s*[:\-]\s*([A-Za-z .'-]{2,40})/i);if(m)out.push(m[1])
   } else if(kind==="city"){
     let m=t.match(/(?:City)\s*[:\-]\s*([A-Za-z .'-]{2,50})/i);if(m)out.push(m[1])
   }
 });
 return uniq(out)
}
function addSelect(box,id,label,vals){
 if(!vals.length)return;
 let s=document.createElement("select");s.id=id;s.innerHTML='<option value="">'+label+'</option>'+vals.map(v=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join("");
 box.appendChild(s);return s
}
function init(){
 let cards=[...document.querySelectorAll(".card")];if(!cards.length)return;
 let host=document.querySelector("header")||document.body;
 let box=document.createElement("div");box.className="mw-filterbar";
 let title=document.createElement("strong");title.textContent="FILTER EXISTING DATA";box.appendChild(title);
 let search=document.createElement("input");search.id="mwAny";search.placeholder="Search name, company, title, keyword...";box.appendChild(search);
 let countries=values(cards,"country");if(!countries.length)countries=fallbackValues(cards,"country");
 let cities=values(cards,"city");if(!cities.length)cities=fallbackValues(cards,"city");
 let categories=values(cards,"category"),sources=values(cards,"source"),sports=values(cards,"sport");
 let country=addSelect(box,"mwCountry","All countries",countries);
 let city=addSelect(box,"mwCity","All cities",cities);
 let category=addSelect(box,"mwCategory","All categories",categories);
 let source=addSelect(box,"mwSource","All sources",sources);
 let sport=addSelect(box,"mwSport","All sports",sports);
 let reset=document.createElement("button");reset.textContent="Reset";box.appendChild(reset);
 let count=document.createElement("span");count.className="mw-count";box.appendChild(count);
 host.appendChild(box);
 function val(x){return x?x.value.toLowerCase():""}
 function apply(){
   let q=search.value.toLowerCase(),co=val(country),ci=val(city),ca=val(category),so=val(source),sp=val(sport),shown=0;
   cards.forEach(c=>{
     let text=c.innerText.toLowerCase();
     let ok=(!q||text.includes(q))&&(!co||text.includes(co))&&(!ci||text.includes(ci))&&(!ca||text.includes(ca))&&(!so||text.includes(so))&&(!sp||text.includes(sp));
     c.style.display=ok?"":"none";if(ok)shown++;
   });
   count.textContent=shown+" of "+cards.length+" records";
 }
 [search,country,city,category,source,sport].filter(Boolean).forEach(x=>{x.oninput=apply;x.onchange=apply});
 reset.onclick=function(){[search,country,city,category,source,sport].filter(Boolean).forEach(x=>x.value="");apply()};
 let remembered=new URLSearchParams(location.search).get("place")||localStorage.getItem("maestro_place")||"";
 if(remembered){
   let exact=false;
   if(country&&[...country.options].some(o=>o.value.toLowerCase()===remembered.toLowerCase())){country.value=[...country.options].find(o=>o.value.toLowerCase()===remembered.toLowerCase()).value;exact=true}
   if(city&&[...city.options].some(o=>o.value.toLowerCase()===remembered.toLowerCase())){city.value=[...city.options].find(o=>o.value.toLowerCase()===remembered.toLowerCase()).value;exact=true}
   if(!exact)search.value=remembered;
 }
 apply()
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();