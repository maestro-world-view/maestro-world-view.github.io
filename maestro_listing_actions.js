/* MAESTRO WORLD VIEW V24.31 - safe listing Share + Bookmark enhancement.
   Presentation only: no database writes, no collector changes, no page-generator replacement. */
(function(){
'use strict';
var STORE='mw_listing_bookmarks_v1';
var CARD_SELECTOR='article';
var LINK_SELECTOR='a.mw-source-button[href],a.stat-open[href],a[href*="http"]';

function load(){try{var x=JSON.parse(localStorage.getItem(STORE)||'[]');return Array.isArray(x)?x:[];}catch(e){return [];}}
function save(x){try{localStorage.setItem(STORE,JSON.stringify(x));}catch(e){}}
function absolute(h){try{return new URL(h,location.href).href;}catch(e){return h||location.href;}}
function titleOf(card){var h=card.querySelector('h1,h2,h3,.title,.headline');return (h&&h.textContent||document.title||'Maestro World View listing').trim();}
function sourceLink(card){
  var links=card.querySelectorAll('a[href]'), best=null;
  for(var i=0;i<links.length;i++){
    var a=links[i],h=(a.getAttribute('href')||'').trim();
    if(!h||h==='#'||/^javascript:/i.test(h))continue;
    if(a.classList.contains('mw-share-button')||a.classList.contains('mw-bookmark-button'))continue;
    if(/^https?:\/\//i.test(h)){best=a;break;}
    if(!best && (a.classList.contains('mw-source-button')||a.classList.contains('stat-open')))best=a;
  }
  return best;
}
function keyFor(url,title){return (url||'')+'|'+(title||'');}
function setBookmarkState(btn,url,title){
  var key=keyFor(url,title),yes=load().some(function(x){return x.key===key;});
  btn.textContent=yes?'★ BOOKMARKED':'☆ BOOKMARK';
  btn.setAttribute('aria-pressed',yes?'true':'false');
}
function flash(btn,msg,old){btn.textContent=msg;setTimeout(function(){btn.textContent=old;},1200);}
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
    if(idx>=0)arr.splice(idx,1);else arr.unshift({key:key,title:title,url:href,saved_at:new Date().toISOString()});
    save(arr);setBookmarkState(book,href,title);
  });
  wrap.appendChild(share);wrap.appendChild(book);host.appendChild(wrap);
}
function scan(root){
  if(!root)return;
  if(root.matches&&root.matches(CARD_SELECTOR))enhance(root);
  var cards=root.querySelectorAll?root.querySelectorAll(CARD_SELECTOR):[];
  for(var i=0;i<cards.length;i++)enhance(cards[i]);
}
function boot(){
  if(!document.getElementById('mw-listing-actions-style')){
    var s=document.createElement('style');s.id='mw-listing-actions-style';
    s.textContent='.mw-listing-actions{display:inline-flex;gap:8px;flex-wrap:wrap;margin-left:8px;vertical-align:middle}.mw-listing-action{appearance:none;border:1px solid #596273;border-radius:999px;background:#151b24;color:#fff;font:700 12px Arial,sans-serif;padding:10px 14px;cursor:pointer;line-height:1}.mw-listing-action:hover{background:#222b38}.mw-bookmark-button[aria-pressed="true"]{border-color:#d8d8d8;background:#262d37}@media(max-width:650px){.mw-listing-actions{margin:8px 0 0 0;display:flex}.mw-listing-action{padding:10px 12px}}';
    document.head.appendChild(s);
  }
  scan(document);
  if(document.body)new MutationObserver(function(ms){ms.forEach(function(m){for(var i=0;i<m.addedNodes.length;i++){var n=m.addedNodes[i];if(n.nodeType===1)scan(n);}});}).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
