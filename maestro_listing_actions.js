/* MAESTRO WORLD VIEW V24.33 - safe Share + My Bookmarks enhancement.
   Browser-local only: no database writes, no account/login, no collector changes. */
(function(){
'use strict';
var STORE='mw_listing_bookmarks_v1';
var CARD_SELECTOR='article';

function load(){try{var x=JSON.parse(localStorage.getItem(STORE)||'[]');return Array.isArray(x)?x:[];}catch(e){return [];}}
function save(x){try{localStorage.setItem(STORE,JSON.stringify(x));}catch(e){} updateCount();}
function absolute(h){try{return new URL(h,location.href).href;}catch(e){return h||location.href;}}
function titleOf(card){var h=card.querySelector('h1,h2,h3,.title,.headline');return (h&&h.textContent||document.title||'Maestro World View listing').trim();}
function sectionOf(){
  try{
    var s=(localStorage.getItem('mw_web_section')||'').trim();
    if(s)return s;
  }catch(e){}
  var p=(location.pathname.split('/').pop()||'').replace('.html','').replace(/_/g,' ');
  return p||'Saved';
}
function sourceLink(card){
  var links=card.querySelectorAll('a[href]'), best=null;
  for(var i=0;i<links.length;i++){
    var a=links[i],h=(a.getAttribute('href')||'').trim();
    if(!h||h==='#'||/^javascript:/i.test(h))continue;
    if(a.classList.contains('mw-share-button')||a.classList.contains('mw-bookmark-button'))continue;
    if(a.classList.contains('mw-source-button')||a.classList.contains('stat-open'))return a;
    if(/^https?:\/\//i.test(h)&&!best)best=a;
  }
  return best;
}
function keyFor(url,title){return (url||'')+'|'+(title||'');}
function isSaved(url,title){var key=keyFor(url,title);return load().some(function(x){return x.key===key;});}
function setBookmarkState(btn,url,title){
  var yes=isSaved(url,title);
  btn.textContent=yes?'★ BOOKMARKED':'☆ BOOKMARK';
  btn.setAttribute('aria-pressed',yes?'true':'false');
}
function flash(btn,msg,old){btn.textContent=msg;setTimeout(function(){btn.textContent=old;},1200);}
function updateCount(){
  var n=load().length;
  var el=document.getElementById('mw-my-bookmarks-link');
  if(el)el.textContent='★ MY BOOKMARKS ('+n+')';
}
function addBookmarksLink(){
  if(document.getElementById('mw-my-bookmarks-link'))return;
  var a=document.createElement('a');
  a.id='mw-my-bookmarks-link';a.className='mw-my-bookmarks-link';
  a.href='bookmarks.html';a.setAttribute('aria-label','Open My Bookmarks');
  document.body.appendChild(a);updateCount();
}
function enhance(card){
  if(!card||card.dataset.mwListingActions==='1')return;
  var link=sourceLink(card); if(!link)return;
  var href=absolute(link.getAttribute('href')), title=titleOf(card);
  var host=link.parentElement; if(!host)return;
  card.dataset.mwListingActions='1';
  var wrap=document.createElement('span');wrap.className='mw-listing-actions';
  var share=document.createElement('button');share.type='button';share.className='mw-listing-action mw-share-button';share.textContent='SHARE';share.setAttribute('aria-label','Share '+title);
  var book=document.createElement('button');book.type='button';book.className='mw-listing-action mw-bookmark-button';setBookmarkState(book,href,title);
  share.addEventListener('click',function(){
    if(navigator.share){navigator.share({title:title,url:href}).catch(function(){});return;}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(href).then(function(){flash(share,'COPIED','SHARE');}).catch(function(){});return;}
    try{var ta=document.createElement('textarea');ta.value=href;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();flash(share,'COPIED','SHARE');}catch(e){}
  });
  book.addEventListener('click',function(){
    var arr=load(),key=keyFor(href,title),idx=arr.findIndex(function(x){return x.key===key;});
    if(idx>=0)arr.splice(idx,1);
    else arr.unshift({key:key,title:title,url:href,section:sectionOf(),saved_at:new Date().toISOString()});
    save(arr);setBookmarkState(book,href,title);
    if(document.getElementById('mw-bookmarks-page'))renderBookmarksPage();
  });
  wrap.appendChild(share);wrap.appendChild(book);host.appendChild(wrap);
}
function scan(root){
  if(!root)return;
  if(root.matches&&root.matches(CARD_SELECTOR))enhance(root);
  var cards=root.querySelectorAll?root.querySelectorAll(CARD_SELECTOR):[];
  for(var i=0;i<cards.length;i++)enhance(cards[i]);
}
function esc(s){var d=document.createElement('div');d.textContent=s==null?'':String(s);return d.innerHTML;}
function renderBookmarksPage(){
  var root=document.getElementById('mw-bookmarks-page');if(!root)return;
  var arr=load();
  if(!arr.length){root.innerHTML='<div class="mw-bookmarks-empty">No bookmarks yet. Use ☆ BOOKMARK on any Maestro listing.</div>';return;}
  var html='<div class="mw-bookmarks-grid">';
  arr.forEach(function(x,i){
    var title=x.title||'Saved listing',url=x.url||'#',section=x.section||'Saved',when='';
    try{when=x.saved_at?new Date(x.saved_at).toLocaleString():'';}catch(e){}
    html+='<article class="mw-bookmark-card" data-bookmark-index="'+i+'"><div class="mw-bookmark-section">'+esc(section)+'</div><h2>'+esc(title)+'</h2>'+(when?'<div class="mw-bookmark-date">Saved '+esc(when)+'</div>':'')+'<div class="mw-bookmark-controls"><a class="mw-bookmark-open" href="'+esc(url)+'" target="_blank" rel="noopener">OPEN</a><button type="button" class="mw-bookmark-share" data-url="'+esc(url)+'" data-title="'+esc(title)+'">SHARE</button><button type="button" class="mw-bookmark-remove" data-key="'+esc(x.key||keyFor(url,title))+'">REMOVE</button></div></article>';
  });
  html+='</div>';root.innerHTML=html;
  root.querySelectorAll('.mw-bookmark-remove').forEach(function(b){b.addEventListener('click',function(){var key=this.getAttribute('data-key'),a=load().filter(function(x){return x.key!==key;});save(a);renderBookmarksPage();scan(document);});});
  root.querySelectorAll('.mw-bookmark-share').forEach(function(b){b.addEventListener('click',function(){var u=this.getAttribute('data-url'),t=this.getAttribute('data-title');if(navigator.share){navigator.share({title:t,url:u}).catch(function(){});}else if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(u);this.textContent='COPIED';var self=this;setTimeout(function(){self.textContent='SHARE';},1200);}});});
}
function boot(){
  if(!document.getElementById('mw-listing-actions-style')){
    var s=document.createElement('style');s.id='mw-listing-actions-style';
    s.textContent='.mw-listing-actions{display:inline-flex;gap:8px;flex-wrap:wrap;margin-left:8px;vertical-align:middle}.mw-listing-action,.mw-bookmark-share,.mw-bookmark-remove,.mw-bookmark-open{appearance:none;border:1px solid #596273;border-radius:999px;background:#151b24;color:#fff!important;font:700 12px Arial,sans-serif;padding:10px 14px;cursor:pointer;line-height:1;text-decoration:none!important}.mw-listing-action:hover,.mw-bookmark-share:hover,.mw-bookmark-remove:hover,.mw-bookmark-open:hover{background:#222b38}.mw-bookmark-button[aria-pressed="true"]{border-color:#d8d8d8;background:#262d37}.mw-my-bookmarks-link{position:fixed;right:18px;bottom:18px;z-index:9998;background:#151b24;color:#fff!important;border:1px solid #596273;border-radius:999px;padding:12px 16px;font:700 12px Arial,sans-serif;text-decoration:none!important;box-shadow:0 4px 18px rgba(0,0,0,.28)}.mw-bookmarks-note{opacity:.8;margin-bottom:18px}.mw-bookmarks-grid{display:grid;gap:14px}.mw-bookmark-card{border:1px solid #303846;border-radius:14px;padding:16px;background:#111720}.mw-bookmark-card h2{margin:6px 0 8px;font-size:18px}.mw-bookmark-section,.mw-bookmark-date{font:700 11px Arial,sans-serif;opacity:.72;text-transform:uppercase}.mw-bookmark-controls{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.mw-bookmarks-empty{padding:22px;border:1px solid #303846;border-radius:14px}@media(max-width:650px){.mw-listing-actions{margin:8px 0 0 0;display:flex}.mw-listing-action{padding:10px 12px}.mw-my-bookmarks-link{right:12px;bottom:12px;padding:11px 13px}}';
    document.head.appendChild(s);
  }
  addBookmarksLink();renderBookmarksPage();scan(document);
  if(document.body)new MutationObserver(function(ms){ms.forEach(function(m){for(var i=0;i<m.addedNodes.length;i++){var n=m.addedNodes[i];if(n.nodeType===1)scan(n);}});}).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();