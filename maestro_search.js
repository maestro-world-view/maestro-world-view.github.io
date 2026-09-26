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
 // Search is global. Location filtering remains selected in the UI but must not constrain
 // Ask Maestro results. Only content cards are released; header/filter chrome is untouched.
 document.querySelectorAll(CARD_SEL).forEach(n=>{
   if(n.closest('#mw-search-results'))return;
   if(on){
     if(!n.hasAttribute('data-mw-search-hidden'))n.setAttribute('data-mw-search-hidden',n.hidden?'1':'0');
     n.hidden=false;
   }else if(n.hasAttribute('data-mw-search-hidden')){
     n.hidden=n.getAttribute('data-mw-search-hidden')==='1';
     n.removeAttribute('data-mw-search-hidden');
   }
 });
}
function strictMatches(x,q){let hay=norm((x.title||'')+' '+(x.description||''));return hay.includes(q)}
function row(x,kind){let source=kind==='community'?'MAESTRO WORLD VIEW · COMMUNITY':kind==='harvested'?'MAESTRO WORLD VIEW · DATABASE':'WEB SEARCH';let img=esc(x.image_url||x.image||'logo1.png');return `<article class="mw-search-listing mw-listing-row ${kind}"><div class="mw-search-image"><img src="${img}" alt="" loading="lazy" onerror="this.onerror=null;this.src='logo1.png'"></div><div class="mw-search-body"><div class="mw-search-source">${source}</div><h3><a target="_blank" rel="noopener" href="${esc(x.url||'#')}">${esc(plain(x.title||'Result'))}</a></h3><p>${esc(plain(x.description||''))}</p><a class="mw-search-open" target="_blank" rel="noopener" href="${esc(x.url||'#')}">READ MORE</a></div></article>`}
function group(label,a,kind){if(!a.length)return'';return `<section class="mw-search-group"><h2>${esc(label)} <span>${a.length}</span></h2>${a.map(x=>row(x,kind)).join('')}</section>`}
function clearSearch(){let out=document.querySelector('#mw-search-results'),i=document.querySelector('#mw-ask-input');setSearchMode(false);if(out){out.hidden=true;out.innerHTML=''}if(i)i.value=''}
async function run(raw){let q=norm(raw);if(!q){clearSearch();return}let out=document.querySelector('#mw-search-results');setSearchMode(true);let l=local(q);out.hidden=false;out.innerHTML='<div class="mw-search-toolbar"><strong>RESULTS FOR “'+esc(raw.trim())+'”</strong><button type="button" id="mw-clear-search">CLEAR SEARCH</button></div>'+group('MAESTRO COMMUNITY',l.community,'community')+group('MAESTRO DATABASE',l.harvested,'harvested')+'<div class="mw-web-wait">Searching the web…</div>';document.querySelector('#mw-clear-search')?.addEventListener('click',clearSearch);try{let r=await fetch(API()+'/api/search?q='+encodeURIComponent(raw.trim()),{cache:'no-store'}),j=r.ok?await r.json():{};out.querySelector('.mw-web-wait')?.remove();let web=(j.results||[]).filter(x=>strictMatches(x,q));let html=group('WEB RESULTS',web,'web');if(html)out.insertAdjacentHTML('beforeend',html);if(!l.community.length&&!l.harvested.length&&!web.length)out.insertAdjacentHTML('beforeend','<p class="mw-search-empty">No results found for “'+esc(raw.trim())+'”.</p>')}catch{out.querySelector('.mw-web-wait')?.remove();if(!l.community.length&&!l.harvested.length)out.insertAdjacentHTML('beforeend','<p class="mw-search-empty">No Maestro matches found. Web search is temporarily unavailable.</p>')}out.scrollIntoView({behavior:'smooth',block:'start'})}
document.addEventListener('DOMContentLoaded',()=>{ensure();let f=document.querySelector('#mw-ask-form'),i=document.querySelector('#mw-ask-input');f?.addEventListener('submit',e=>{e.preventDefault();run(i.value)});i?.addEventListener('search',()=>{if(!i.value.trim())clearSearch()});});
})();
