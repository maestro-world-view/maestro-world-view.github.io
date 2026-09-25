(()=>{
const api=()=>String(window.MAESTRO_SUBMISSION_API||"").replace(/\/$/,"");
const e=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const abs=u=>{u=String(u||"");return !u?"":/^https?:\/\//i.test(u)?u:api()+u};
const q=new URLSearchParams(location.search), id=q.get("id")||"", section=q.get("section")||"";
const stamp=v=>{try{return new Intl.DateTimeFormat(undefined,{year:"numeric",month:"long",day:"numeric"}).format(new Date(v))}catch{return""}};
async function run(){const host=document.getElementById("mw-community-article");if(!id||!section){host.innerHTML='<p class="mw-article-error">Article not specified.</p>';return}
 try{const r=await fetch(api()+"/api/listings/"+encodeURIComponent(section),{cache:"no-store"});if(!r.ok)throw Error("Unable to load article");const a=await r.json();const x=a.find(v=>String(v.id)===id);if(!x)throw Error("Article not found");
 const image=abs(x.image_url)||"logo1.png";const meta=[x.contact_name,x.organization,[x.city,x.country].filter(Boolean).join(" · "),stamp(x.created_at)].filter(Boolean).map(e).join(" · ");
 host.innerHTML=`<article class="mw-community-article"><img class="mw-article-brand" src="logo1.png" alt="Maestro World View"><div class="mw-article-source"><img class="mw-source-icon" src="logo.png" alt=""><span>MAESTRO WORLD VIEW · COMMUNITY SUBMISSION</span></div><h1>${e(x.title||"Community Submission")}</h1>${meta?`<div class="mw-article-meta">${meta}</div>`:""}${image&&image!=="logo1.png"?`<img class="mw-article-image" src="${e(image)}" alt="">`:""}<div class="mw-article-body">${e(x.description||"").replace(/\r?\n/g,"<br>")}</div>${x.external_url||x.contact_url?`<p><a class="mw-source-button" target="_blank" rel="noopener" href="${e(x.external_url||x.contact_url)}">VISIT PUBLIC SOURCE</a></p>`:""}<p class="mw-community-disclaimer">Community submission. User-provided content does not imply endorsement by Maestro World View.</p></article>`;
 document.title=(x.title||"Community Submission")+" · Maestro World View";
 }catch(err){host.innerHTML='<p class="mw-article-error">'+e(err.message)+'</p>'}}
document.addEventListener("DOMContentLoaded",run);
})();