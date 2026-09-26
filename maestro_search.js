(()=>{
const API=()=>String(window.MAESTRO_SUBMISSION_API||'').replace(/\/$/,'');
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const norm=s=>String(s||'').toLowerCase().replace(/\s+/g,' ').trim();
const plain=s=>{const d=document.createElement('textarea');d.innerHTML=String(s??'');let v=d.value;const x=document.createElement('div');x.innerHTML=v;return (x.textContent||x.innerText||'').replace(/\s+/g,' ').trim()};
const CARD_SEL='.mw-cloud-card,.mw-story,.mw-news-row,.mw-news-hero,article.card,.dating-card,.email-card,.mw-listing-row';
function ensure(){let host=document.querySelector('.mw-ask-maestro');if(host)return host;host=document.createElement('section');host.className='mw-ask-maestro';host.innerHTML='<form id="mw-ask-form"><div class="mw-ask-box"><input id="mw-ask-input" type="search" autocomplete="off" placeholder="Ask Maestro — search news, jobs, services, people, places and more…" aria-label="Ask Maestro"><button type="submit">SEARCH</button></div></form><div id="mw-search-results" class="mw-search-results" hidden></div>';let anchor=document.querySelector('.mw-brandbar');if(anchor)anchor.insertAdjacentElement('afterend',host);else{let mast=document.querySelector('.mw-masthead');if(mast)mast.insertAdjacentElement('beforebegin',host);else document.body.insertBefore(host,document.body.firstChild)}return host}
function local(q){const seen=new Set(),community=[],harvested=[];document.querySelectorAll(CARD_SEL).forEach(n=>{if(n.closest('#mw-search-results'))return;let txt=norm(n.innerText);if(!txt.includes(q))return;let title=(n.querySelector('h1,h2,h3')?.textContent||'Maestro record').trim(),desc=(n.querySelector('p,.desc,.summary')?.textContent||n.innerText||'').trim().slice(0,500),a=n.querySelector('a[href]'),href=a?.href||location.href,key=title+'|'+href;if(seen.has(key))return;seen.add(key);let r={title,description:desc,url:href};(n.classList.contains('mw-cloud-card')?community:harvested).push(r)});return{community,harvested}}
function setSearchMode(on){
 document.body.classList.toggle('mw-search-active',!!on);
 document.body.dataset.mwSearchMode=on?'1':'0';

 // Search is a dedicated results view. Hide/restore actual DOM nodes instead of relying
 // on page-specific CSS structure. This works identically on Index and section pages.
 [...document.body.children].forEach(n=>{
   if(n.matches('.mw-brandbar,.mw-ask-maestro,.mw-site-footer'))return;
   if(on){
     if(!n.hasAttribute('data-mw-search-display')){
       n.setAttribute('data-mw-search-display',n.style.display||'');
       n.setAttribute('data-mw-search-was-hidden',n.hidden?'1':'0');
     }
     n.hidden=true;
     n.style.setProperty('display','none','important');
   }else if(n.hasAttribute('data-mw-search-display')){
     n.style.removeProperty('display');
     let old=n.getAttribute('data-mw-search-display');
     if(old)n.style.display=old;
     n.hidden=n.getAttribute('data-mw-search-was-hidden')==='1';
     n.removeAttribute('data-mw-search-display');
     n.removeAttribute('data-mw-search-was-hidden');
   }
 });

 // Some generated pages place normal content inside the Ask Maestro wrapper.
 // During a search keep ONLY the search form and result container visible there.
 let ask=document.querySelector('.mw-ask-maestro');
 if(ask)[...ask.children].forEach(n=>{
   if(n.matches('#mw-ask-form,#mw-search-results,.mw-ask-box,form'))return;
   if(on){
     if(!n.hasAttribute('data-mw-search-inner-display'))
       n.setAttribute('data-mw-search-inner-display',n.style.display||'');
     n.style.setProperty('display','none','important');
   }else if(n.hasAttribute('data-mw-search-inner-display')){
     n.style.removeProperty('display');
     let old=n.getAttribute('data-mw-search-inner-display');
     if(old)n.style.display=old;
     n.removeAttribute('data-mw-search-inner-display');
   }
 });
}
function strictMatches(x,q){let hay=norm((x.title||'')+' '+(x.description||''));return hay.includes(q)}
let MW_INDEX_CACHE=null;
async function maestroGlobal(q){
 try{
   if(!MW_INDEX_CACHE){
     let r=await fetch('maestro_search_index.json?v=228',{cache:'no-store'});
     MW_INDEX_CACHE=r.ok?await r.json():[];
   }
   return (MW_INDEX_CACHE||[]).filter(x=>strictMatches(x,q)).slice(0,100);
 }catch(e){return[]}
}
function row(x,kind){let source=kind==='community'?'MAESTRO WORLD VIEW · COMMUNITY':kind==='harvested'?'MAESTRO WORLD VIEW · DATABASE':'WEB SEARCH';let img=esc(x.image_url||x.image||'logo1.png');return `<article class="mw-search-listing mw-listing-row ${kind}"><div class="mw-search-image"><img src="${img}" alt="" loading="lazy" onerror="this.onerror=null;this.src='logo1.png'"></div><div class="mw-search-body"><div class="mw-search-source">${source}</div><h3><a target="_blank" rel="noopener" href="${esc(x.url||'#')}">${esc(plain(x.title||'Result'))}</a></h3><p>${esc(plain(x.description||''))}</p><a class="mw-search-open" target="_blank" rel="noopener" href="${esc(x.url||'#')}">READ MORE</a></div></article>`}
function group(label,a,kind){if(!a.length)return'';return `<section class="mw-search-group"><h2>${esc(label)} <span>${a.length}</span></h2>${a.map(x=>row(x,kind)).join('')}</section>`}
function clearSearch(){let out=document.querySelector('#mw-search-results'),i=document.querySelector('#mw-ask-input');setSearchMode(false);if(out){out.hidden=true;out.innerHTML=''}if(i)i.value=''}
async function run(raw){
 let q=norm(raw);if(!q){clearSearch();return}
 let out=document.querySelector('#mw-search-results');
 setSearchMode(true);
 let l=local(q);
 out.hidden=false;
 out.innerHTML='<div class="mw-search-toolbar"><strong>RESULTS FOR “'+esc(raw.trim())+'”</strong><button type="button" id="mw-clear-search">CLEAR SEARCH</button></div><div class="mw-web-wait">Searching the web and Maestro database…</div>';
 document.querySelector('#mw-clear-search')?.addEventListener('click',clearSearch);

 // Run global Maestro DB and web search together.
 // The web provider already ranks results for the query, so do NOT throw away provider-returned
 // rows merely because the exact full query string is absent from title/snippet.
 let globalPromise=maestroGlobal(q);
 let webPromise=(async()=>{
   try{
     let r=await fetch(API()+'/api/search?q='+encodeURIComponent(raw.trim()),{cache:'no-store'});
     if(!r.ok)return[];
     let j=await r.json();
     return Array.isArray(j.results)?j.results:[];
   }catch(e){return[]}
 })();

 let [global,web]=await Promise.all([globalPromise,webPromise]);

 // De-duplicate Maestro DB rows against records already present on the open page.
 let seenDb=new Set([...l.community,...l.harvested].map(x=>norm(x.title)+'|'+norm(x.url)));
 global=global.filter(x=>{
   let k=norm(x.title)+'|'+norm(x.url);
   if(seenDb.has(k))return false;
   seenDb.add(k);return true;
 });

 // Preserve every distinct web row returned by the web-search provider.
 // Prefer URL as the identity; fall back to title+description when URL is unavailable.
 let seenWeb=new Set();
 web=web.filter(x=>{
   let k=norm(x.url)||norm(x.title)+'|'+norm(x.description);
   if(!k||seenWeb.has(k))return false;
   seenWeb.add(k);return true;
 });

 // Required order on ALL pages:
 // 1. WEB RESULTS
 // 2. MAESTRO DATABASE / harvested public records
 // 3. MAESTRO COMMUNITY / uploaded records
 out.innerHTML='<div class="mw-search-toolbar"><strong>RESULTS FOR “'+esc(raw.trim())+'”</strong><button type="button" id="mw-clear-search">CLEAR SEARCH</button></div>'
   +group('WEB RESULTS',web,'web')
   +group('MAESTRO DATABASE',[...l.harvested,...global],'harvested')
   +group('MAESTRO COMMUNITY',l.community,'community');

 document.querySelector('#mw-clear-search')?.addEventListener('click',clearSearch);

 if(!web.length&&!l.harvested.length&&!global.length&&!l.community.length)
   out.insertAdjacentHTML('beforeend','<p class="mw-search-empty">No results found for “'+esc(raw.trim())+'”.</p>');

 out.scrollIntoView({behavior:'smooth',block:'start'})
}
document.addEventListener('DOMContentLoaded',()=>{ensure();let f=document.querySelector('#mw-ask-form'),i=document.querySelector('#mw-ask-input');f?.addEventListener('submit',e=>{e.preventDefault();run(i.value)});i?.addEventListener('search',()=>{if(!i.value.trim())clearSearch()});});
})();
