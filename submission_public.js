(()=>{
 const api=()=>String(window.MAESTRO_SUBMISSION_API||"").replace(/\/$/,"");
 const e=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
 const date=s=>{try{return new Date(s).toLocaleDateString(undefined,{month:"short",day:"2-digit",year:"numeric"})}catch{return""}};
 async function g(p){try{let r=await fetch(api()+p,{cache:"no-store"});return r.ok?await r.json():[]}catch{return[]}}
 const img=x=>x?api()+x:"logo1.png";
 window.loadSubmittedResumes=async()=>{let h=document.querySelector("#submitted-resumes");if(!h)return;let a=await g("/api/resumes");h.innerHTML=a.map(x=>`<article class="mw-submit-card mw-story" data-country="${e(x.country)}" data-city="${e(x.city)}" data-type="resume">${x.profile_image_url?`<img class="mw-feed-image" src="${e(api()+x.profile_image_url)}" alt="">`:""}<h2>${e(x.first_name+" "+(x.last_name||""))}</h2><h3>${e(x.headline||x.current_role||"Professional profile")}</h3><div>${e([x.current_role,x.company,x.city,x.country].filter(Boolean).join(" · "))}</div><p>${e(x.summary||"")}</p><p><b>Skills:</b> ${e(x.skills||"")}</p>${x.linkedin_url?`<a target="_blank" rel="noopener" href="${e(x.linkedin_url)}">Professional Link</a>`:""} ${x.resume_url?`<a target="_blank" rel="noopener" href="${e(api()+x.resume_url)}">Resume file</a>`:""}</article>`).join("")};
 window.loadSubmittedDating=async()=>{let h=document.querySelector("#submitted-dating");if(!h)return;let a=await g("/api/dating");h.innerHTML=a.map(x=>`<article class="dating-card mw-story" data-country="${e(x.country)}" data-city="${e(x.city)}" data-type="dating">${x.photo_url?`<img class="pic" src="${e(api()+x.photo_url)}" alt="">`:""}<div class="dating-copy"><h2>${e(x.first_name+" "+(x.last_name||""))}, ${e(x.age)}</h2><h3>${e(x.headline||"Dating profile")}</h3><div>${e([x.gender,x.occupation,x.city,x.country].filter(Boolean).join(" · "))}</div><p>${e(x.bio||"")}</p><p><b>Interests:</b> ${e(x.interests||"")}</p><p><b>Looking for:</b> ${e(x.relationship_goal||"")}</p>${x.contact_url?`<a target="_blank" rel="noopener" href="${e(x.contact_url)}">CONTACT / PROFILE</a>`:""}</div></article>`).join("")};
 function communityCard(x,section){
   const meta=[x.city,x.country,date(x.created_at)].filter(Boolean).join(" · ");
   const contact=x.external_url||x.contact_url||"";
   return `<article class="mw-news-row mw-story mw-community-card" data-country="${e(x.country)}" data-city="${e(x.city)}" data-type="${e(section)}" data-community-id="${e(x.id)}"><img class="mw-feed-image" src="${e(img(x.image_url))}" alt="" onerror="this.src='logo1.png'"><div class="mw-news-row-copy"><div class="mw-news-meta mw-community-meta"><img class="mw-source-icon" src="logo.png" alt=""><span>Maestro World View · ${e(meta)}</span></div><div class="mw-user-badge">MAESTRO WORLD VIEW · COMMUNITY SUBMISSION</div><h3>${contact?`<a target="_blank" rel="noopener" href="${e(contact)}">${e(x.title)}</a>`:e(x.title)}</h3><p>${e(x.description||"")}</p>${x.organization?`<div class="mw-community-detail">${e(x.organization)}</div>`:""}${x.price?`<div class="mw-community-price">${e(x.price)}</div>`:""}${contact?`<a class="mw-source-button" target="_blank" rel="noopener" href="${e(contact)}">OPEN / CONTACT</a>`:""}</div></article>`;
 }
 window.loadSubmittedListings=async function(section){
   let h=document.querySelector("#submitted-community");if(!h)return;
   const latest=document.querySelector(".mw-latest");
   if(latest && h.parentElement!==latest) latest.appendChild(h);
   let a=await g("/api/listings/"+encodeURIComponent(section));
   a=[...a].sort((A,B)=>String(B.created_at||"").localeCompare(String(A.created_at||"")));
   h.innerHTML=a.map(x=>communityCard(x,section)).join("");
   try{window.dispatchEvent(new Event("maestro:community-updated"))}catch{}
 };
 window.startSubmittedListings=function(section){
   window.loadSubmittedListings(section);
   if(window.__mwCommunityTimer)clearInterval(window.__mwCommunityTimer);
   window.__mwCommunityTimer=setInterval(()=>window.loadSubmittedListings(section),30000);
 };
})();
