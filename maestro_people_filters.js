(()=>{
const n=s=>String(s||'').toLowerCase().trim();
const val=id=>n(document.getElementById(id)?.value);
function apply(kind){
 const root=document.querySelector('[data-mw-bank="'+kind+'"]'); if(!root)return;
 const country=val('mwf-country'),city=val('mwf-city'),keyword=val('mwf-keyword'),role=val('mwf-role'),skills=val('mwf-skills'),gender=val('mwf-gender'),goal=val('mwf-goal');
 const amin=parseInt(document.getElementById('mwf-age-min')?.value||'0',10)||0,amax=parseInt(document.getElementById('mwf-age-max')?.value||'999',10)||999;
 root.querySelectorAll('.mw-person-card,.mw-cloud-card').forEach(c=>{
  const text=n(c.innerText),cc=n(c.dataset.country),ct=n(c.dataset.city),r=n(c.dataset.role),sk=n(c.dataset.skills),g=n(c.dataset.gender),go=n(c.dataset.goal),age=parseInt(c.dataset.age||'0',10)||0;
  let ok=(!country||cc===country)&&(!city||ct===city)&&(!keyword||text.includes(keyword));
  if(kind==='resume')ok=ok&&(!role||r.includes(role)||text.includes(role))&&(!skills||sk.includes(skills)||text.includes(skills));
  else ok=ok&&(!gender||g.includes(gender)||text.includes(gender))&&(!goal||go.includes(goal)||text.includes(goal))&&(!amin||!age||age>=amin)&&(!amax||!age||age<=amax);
  c.style.setProperty('display',ok?'':'none',ok?'':'important');
 });
}
function hydrate(kind){
 const root=document.querySelector('[data-mw-bank="'+kind+'"]');if(!root)return;
 const countries=new Set(),cities=new Set();root.querySelectorAll('[data-country]').forEach(c=>{if(c.dataset.country)countries.add(c.dataset.country);if(c.dataset.city)cities.add(c.dataset.city)});
 const fill=(id,set,label)=>{let s=document.getElementById(id);if(!s)return;s.innerHTML='<option value="">'+label+'</option>'+[...set].sort().map(x=>'<option>'+x.replace(/[&<>]/g,'')+'</option>').join('')};fill('mwf-country',countries,'All countries');fill('mwf-city',cities,'All cities / areas');
 root.querySelectorAll('select,input').forEach(x=>x.addEventListener(x.tagName==='SELECT'?'change':'input',()=>apply(kind)));
 document.addEventListener('maestro:cloud-updated',()=>{hydrate(kind);apply(kind)},{once:true});
}
document.addEventListener('DOMContentLoaded',()=>{let r=document.querySelector('[data-mw-bank]');if(r)hydrate(r.dataset.mwBank)});
})();
