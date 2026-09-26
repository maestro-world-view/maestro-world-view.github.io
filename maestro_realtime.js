(function(){
 const qs=new URLSearchParams(location.search);
 const incoming=qs.get('place');
 if(incoming)localStorage.setItem('maestro_place',incoming);
 const place=incoming||localStorage.getItem('maestro_place')||'';
 window.MAESTRO_PLACE=place;
 const bar=document.createElement('div');
 bar.className='mw-brandbar';
 var isHome=/\/(?:index\.html)?$/.test(location.pathname)||location.pathname==='/' ;
 bar.innerHTML='<div class="mw-v21-header"><a class="mw-header-logo" href="index.html"><img src="logo1.png" alt="Maestro World View"></a><div class="mw-v21-titleblock"><div class="mw-logo"><span>MAESTRO WORLD VIEW</span></div><div class="mw-byline"><em>Brought to you by Maestro World View</em></div></div><div class="mw-v21-right">'+(isHome?'':'<a class="mw-header-home" href="index.html">HOME</a>')+'<div class="mw-status">● LIVE · 5 MIN</div></div></div>';
 document.body.insertBefore(bar,document.body.firstChild);
 bar.querySelectorAll('.mw-v218-home').forEach(a=>a.addEventListener('click',()=>{try{localStorage.removeItem("mw_web_country");localStorage.removeItem("mw_web_city");localStorage.removeItem("mw_web_section");localStorage.removeItem("maestro_place")}catch(e){}})); document.querySelectorAll('.mw-masthead').forEach(x=>x.remove());
 const ask=document.querySelector('.mw-ask-maestro'); if(ask) bar.insertAdjacentElement('afterend',ask);
 // Universal footer. The disclaimer page itself receives the same footer.
 const foot=document.createElement('footer');
 foot.className='mw-site-footer';
 foot.innerHTML='<div><strong>MAESTRO WORLD VIEW</strong></div><div><a href="disclaimer.html">Disclaimer</a><span aria-hidden="true"> · </span><a href="mailto:maestro.world.view@gmail.com">Inquiries: maestro.world.view@gmail.com</a></div>';
 document.body.appendChild(foot);
 setTimeout(function(){location.reload()},300000);
})();
