(function(){
 const qs=new URLSearchParams(location.search);
 const incoming=qs.get('place');
 if(incoming)localStorage.setItem('maestro_place',incoming);
 window.MAESTRO_PLACE=incoming||localStorage.getItem('maestro_place')||'';

 // Remove any generator/legacy masthead before inserting the single V22.4 masthead.
 document.querySelectorAll('.mw-brandbar,.mw-masthead,.mw-v20-head,.mw-v21-header').forEach(x=>x.remove());

 const isHome=/\/(?:index\.html)?$/.test(location.pathname)||location.pathname==='/';
 const bar=document.createElement('header');
 bar.className='mw-brandbar mw-v224-brandbar';
 bar.innerHTML='<div class="mw-v224-header">'
   +'<div class="mw-v224-spacer" aria-hidden="true"></div>'
   +'<a class="mw-v224-logo" href="index.html"><img src="logo1.png" alt="Maestro World View"></a>'
   +'<div class="mw-v224-controls">'+(isHome?'':'<a class="mw-v224-home" href="index.html">HOME</a>')+'<span class="mw-v224-live">● LIVE · 5 MIN</span></div>'
   +'</div>';
 document.body.insertBefore(bar,document.body.firstChild);

 bar.querySelectorAll('.mw-v224-home,.mw-v224-logo').forEach(a=>a.addEventListener('click',()=>{
   try{
     localStorage.removeItem("mw_web_country");
     localStorage.removeItem("mw_web_city");
     localStorage.removeItem("mw_web_section");
     localStorage.removeItem("maestro_place");
   }catch(e){}
 }));

 const ask=document.querySelector('.mw-ask-maestro');
 if(ask)bar.insertAdjacentElement('afterend',ask);

 // Community-only presentation remains enforced.
 const path=(location.pathname||'').toLowerCase();
 if(path.endsWith('/dating.html')||path.endsWith('/maestro_dating.html')){
   document.body.classList.add('mw-community-dating-only');
   document.querySelectorAll('.dating-grid,.mw-dating-stream,[data-source="harvested"]').forEach(x=>{
     if(!x.closest('#submitted-dating'))x.remove();
   });
 }
 if(path.endsWith('/resumes.html')||path.endsWith('/resume.html')||path.endsWith('/maestro_resume_bank.html')){
   document.body.classList.add('mw-community-resume-only');
   document.querySelectorAll('.resume-grid,.mw-resume-stream,[data-source="harvested"]').forEach(x=>{
     if(!x.closest('#submitted-resumes'))x.remove();
   });
 }

 document.querySelectorAll('.mw-site-footer').forEach(x=>x.remove());
 const foot=document.createElement('footer');
 foot.className='mw-site-footer';
 foot.innerHTML='<div><strong>MAESTRO WORLD VIEW</strong></div><div><a href="disclaimer.html" target="_blank" rel="noopener noreferrer">Disclaimer</a><span aria-hidden="true"> · </span><a href="mailto:maestro.world.view@gmail.com">Inquiries: maestro.world.view@gmail.com</a></div>';
 document.body.appendChild(foot);
 setTimeout(()=>location.reload(),300000);
})();