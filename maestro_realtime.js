(function(){
 const qs=new URLSearchParams(location.search);
 const incoming=qs.get('place');
 if(incoming)localStorage.setItem('maestro_place',incoming);
 const place=incoming||localStorage.getItem('maestro_place')||'';
 window.MAESTRO_PLACE=place;
 const bar=document.createElement('div');
 bar.className='mw-brandbar';
 bar.innerHTML='<div class="mw-head-line mw-head-line-1"><a class="mw-live-brand" href="index.html"><img src="logo.png" alt="Maestro World View"><div class="mw-logo"><span>MAESTRO WORLD VIEW</span></div></a><div class="mw-focus">'+(place?'FOCUS: '+place.toUpperCase():'GLOBAL INTELLIGENCE')+'</div></div><div class="mw-head-line mw-head-line-2"><div class="mw-byline"><em>Brought to you by Maestro World View</em></div><div class="mw-status">● LIVE · 5 MIN</div></div>';
 document.body.insertBefore(bar,document.body.firstChild);
 const ask=document.querySelector('.mw-ask-maestro'); if(ask) bar.insertAdjacentElement('afterend',ask);
 const foot=document.createElement('div');foot.className='mw-credit';foot.innerHTML='BROUGHT TO YOU BY <strong>MAESTRO WORLD VIEW</strong>';document.body.appendChild(foot);
 setTimeout(function(){location.reload()},300000);
})();