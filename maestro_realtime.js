(function(){
 const qs=new URLSearchParams(location.search);
 const incoming=qs.get('place');
 if(incoming)localStorage.setItem('maestro_place',incoming);
 window.MAESTRO_PLACE=incoming||localStorage.getItem('maestro_place')||'';

 // V21.2: remove every legacy/static Maestro header before creating one authoritative header.
 document.querySelectorAll('.mw-brandbar,.mw-masthead,.mw-v20-head,.mw-v21-header').forEach(function(x){x.remove();});
 const isHome=/\/(?:index\.html)?$/.test(location.pathname)||location.pathname==='/' ;
 const bar=document.createElement('header');
 bar.className='mw-brandbar mw-v212-brandbar mw-v214-brandbar';
 bar.innerHTML='<div class="mw-v218-header">'
   +'<div class="mw-v218-spacer" aria-hidden="true"></div>'
   +'<a class="mw-v218-logo" href="index.html"><img src="logo1.png" alt="Maestro World View"></a>'
   +'<div class="mw-v218-controls">'+(isHome?'':'<a class="mw-v218-home" href="index.html">HOME</a>')+'<span class="mw-v218-live">● LIVE · 5 MIN</span></div>'
   +'</div>';
 document.body.insertBefore(bar,document.body.firstChild);

 // Keep Ask Maestro directly below the masthead.
 const ask=document.querySelector('.mw-ask-maestro'); if(ask) bar.insertAdjacentElement('afterend',ask);


 // V21.3: Dating and Resume Bank are community-upload-only pages.
 const path=(location.pathname||'').toLowerCase();
 if(path.endsWith('/dating.html')||path.endsWith('/maestro_dating.html')){
   document.body.classList.add('mw-community-dating-only');
   document.querySelectorAll('.dating-grid,.mw-dating-stream,[data-source="harvested"]').forEach(function(x){
     if(!x.closest('#submitted-dating')) x.remove();
   });
 }
 if(path.endsWith('/resumes.html')||path.endsWith('/resume.html')||path.endsWith('/maestro_resume_bank.html')){
   document.body.classList.add('mw-community-resume-only');
   document.querySelectorAll('.resume-grid,.mw-resume-stream,[data-source="harvested"]').forEach(function(x){
     if(!x.closest('#submitted-resumes')) x.remove();
   });
 }
 // Fallback artwork must remain fully visible, never portrait-cropped.
 document.querySelectorAll('.mw-people-bank img').forEach(function(img){
   const src=(img.getAttribute('src')||'').toLowerCase();
   if(src.includes('logo1.png')) img.dataset.fallback='maestro';
 });

 // One universal footer only.
 document.querySelectorAll('.mw-site-footer').forEach(function(x){x.remove();});
 const foot=document.createElement('footer');
 foot.className='mw-site-footer';
 foot.innerHTML='<div><strong>MAESTRO WORLD VIEW</strong></div><div><a href="disclaimer.html" target="_blank" rel="noopener noreferrer">Disclaimer</a><span aria-hidden="true"> · </span><a href="mailto:maestro.world.view@gmail.com">Inquiries: maestro.world.view@gmail.com</a></div>';
 document.body.appendChild(foot);
 setTimeout(function(){location.reload()},300000);
})();
