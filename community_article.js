(()=>{
const api=()=>String(window.MAESTRO_SUBMISSION_API||"").replace(/\/$/,"");
const e=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const abs=u=>{u=String(u||"");return !u?"":/^https?:\/\//i.test(u)?u:api()+u};
const q=new URLSearchParams(location.search),id=q.get("id")||"",section=q.get("section")||"",type=q.get("type")||(section?"listing":"");
const stamp=v=>{try{return new Intl.DateTimeFormat(undefined,{year:"numeric",month:"long",day:"numeric"}).format(new Date(v))}catch{return""}};
const field=(label,value)=>value?`<p class="mw-article-field"><strong>${e(label)}:</strong> ${e(value)}</p>`:"";
const button=(label,url)=>url?`<p><a class="mw-source-button" target="_blank" rel="noopener" href="${e(abs(url))}">${e(label)}</a></p>`:"";
function shell(title,meta,image,body,extras){return `<article class="mw-community-article"><img class="mw-article-brand" src="logo1.png" alt="Maestro World View"><div class="mw-article-source"><img class="mw-source-icon" src="logo.png" alt=""><span>MAESTRO WORLD VIEW · COMMUNITY SUBMISSION</span></div><h1>${e(title)}</h1>${meta?`<div class="mw-article-meta">${meta}</div>`:""}${image?`<img class="mw-article-image" src="${e(abs(image))}" alt="">`:""}<div class="mw-article-body">${body}</div>${extras}<p class="mw-community-disclaimer">Community submission. User-provided content does not imply endorsement by Maestro World View.</p></article>`}
async function fetchOne(path){let r=await fetch(api()+path,{cache:"no-store"});if(!r.ok)throw Error("Unable to load submission");let a=await r.json(),x=a.find(v=>String(v.id)===id);if(!x)throw Error("Submission not found");return x}
async function run(){const host=document.getElementById("mw-community-article");if(!id||!type){host.innerHTML='<p class="mw-article-error">Submission not specified.</p>';return}try{let x,title,meta,image,body="",extras="";
 if(type==="resume"){x=await fetchOne("/api/resumes");title=[x.first_name,x.last_name].filter(Boolean).join(" ")||"Professional Resume";meta=[x.job_title,x.profession,x.organization,[x.city,x.country].filter(Boolean).join(" · "),stamp(x.created_at)].filter(Boolean).map(e).join(" · ");image=x.profile_image_url;body=e(x.resume_text||"Professional profile").replace(/\r?\n/g,"<br>");extras=field("Email",x.email)+button("OPEN ATTACHED RESUME",x.resume_url||x.resume_file_url);}
 else if(type==="dating"){x=await fetchOne("/api/dating");title=x.display_name||"Dating Profile";meta=[x.age?`Age ${x.age}`:"",[x.city,x.country].filter(Boolean).join(" · "),stamp(x.created_at)].filter(Boolean).map(e).join(" · ");image=x.photo_url||x.image_url;body=e(x.bio||"").replace(/\r?\n/g,"<br>");extras=field("Email",x.contact_email);}
 else {if(!section)throw Error("Section not specified");x=await fetchOne("/api/listings/"+encodeURIComponent(section));title=x.title||"Community Submission";meta=[x.contact_name,x.organization,[x.city,x.country].filter(Boolean).join(" · "),x.price,stamp(x.created_at)].filter(Boolean).map(e).join(" · ");image=x.image_url;body=e(x.description||"").replace(/\r?\n/g,"<br>");extras=field("Email",x.contact_email)+button("VISIT PUBLIC SOURCE",x.external_url||x.contact_url);}
 host.innerHTML=shell(title,meta,image,body,extras);document.title=title+" · Maestro World View";
 }catch(err){host.innerHTML='<p class="mw-article-error">'+e(err.message)+'</p>'}}
document.addEventListener("DOMContentLoaded",run);
})();
