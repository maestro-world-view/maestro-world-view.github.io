(()=>{
  const norm=s=>(s||"").toLowerCase().replace(/\s+/g," ").trim();
  const visibleItems=()=>Array.from(document.querySelectorAll(".mw-news-hero,.mw-news-row,.mw-listing-row"));
  document.addEventListener("click",e=>{
    const b=e.target.closest(".mw-trend-link[data-trend]");
    if(!b)return;
    const term=norm(b.dataset.trend);
    document.querySelectorAll(".mw-trend-link[data-trend]").forEach(x=>x.classList.toggle("active",x===b));
    visibleItems().forEach(el=>{el.style.display=(!term||norm(el.textContent).includes(term))?"":"none";});
  });
})();