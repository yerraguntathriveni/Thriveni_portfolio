/* Admin portal. Client-side only: password is stored as a salted SHA-256 hash in this browser. */
const app=document.getElementById('app');
const FIELDS={
 projects:[['title','Title'],['description','Description','textarea'],['tech','Technologies (comma separated)'],['image','Project image','image'],['github','GitHub link','url'],['demo','Live demo link','url']],
 skills:[['category','Category (e.g. Backend Technologies)'],['name','Skill'],['level','Level (0-100)','number']],
 education:[['title','Qualification'],['institute','Institute'],['period','Period'],['score','Score / CGPA']],
 internships:[['title','Title'],['org','Organization'],['period','Period'],['details','Details','textarea']],
 certifications:[['title','Title'],['org','Issuer']]};
const PF=[['name','Full name'],['role','Role'],['intro','Short introduction (home)','textarea'],['about','About me','textarea'],['email','Email'],['phone','Phone'],['location','Location'],['linkedin','LinkedIn URL'],['github','GitHub URL']];
const TABS=['overview',...Object.keys(FIELDS),'profile','theme','enquiries'];
let d=Store.get(),tab='overview',edit=null,msg=null,creds='';
const REQ=['title','name','institute','org','description'];
const hash=async(p,s)=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s+p)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const getAuth=()=>{try{return JSON.parse(localStorage.getItem('tp2_auth'))||DEFAULT_AUTH}catch{return DEFAULT_AUTH}};
const ok=()=>sessionStorage.getItem('tp_ok')==='1';
const fmt=i=>new Date(i).toLocaleString(),dkey=i=>{const t=new Date(i);return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`};
const readURL=f=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(f)});
const resize=(f,max)=>new Promise(async(res,rej)=>{const i=new Image();i.onload=()=>{const s=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.82))};i.onerror=rej;i.src=await readURL(f)});
const save=()=>{if(!Store.set(d))d=Store.get();render()};

function render(){
 if(!crypto.subtle){app.innerHTML='<div class="center"><p class="bad">Open this page via http://localhost or https:// (secure context required).</p></div>';return}
 if(!ok()){app.innerHTML=`<div class="center"><form class="card form login" data-f="login"><h2>Admin Login</h2><label>Username<input name="un" required autocomplete="username"></label><label>Password<input type="password" name="pw" required autocomplete="current-password"></label><button class="btn">Login</button>${msg?`<p class="bad">${esc(msg)}</p>`:''}</form></div>`;return}
 app.innerHTML=`<div class="adm"><aside><h3>Admin</h3>${TABS.map(t=>`<button class="${t===tab?'on':''}" data-a="tab:${t}">${t}</button>`).join('')}<button data-a="logout">Logout</button></aside>
 <main class="wrap">${msg?`<p class="${msg[0]}" role="status">${esc(msg[1])}</p>`:''}${panel()}</main></div>`}

function panel(){
 if(tab==='overview')return overview();if(tab==='profile')return profile();if(tab==='theme')return themeTab();if(tab==='enquiries')return enquiries();return crud(tab)}
function overview(){
 const v=d.visits,today=dkey(new Date().toISOString()),mo=today.slice(0,7),uniq=new Set(v.map(x=>x.vid)).size,cnt={},mon={};
 v.forEach(x=>{const k=dkey(x.at);cnt[k]=(cnt[k]||0)+1;mon[k.slice(0,7)]=(mon[k.slice(0,7)]||0)+1});
 const days=[...Array(14)].map((_,i)=>{const k=dkey(new Date(Date.now()-(13-i)*864e5).toISOString());return[k,cnt[k]||0]}),mx=Math.max(1,...days.map(x=>x[1]));
 const stats=[['Unique visitors',uniq],['Total visits',v.length],['Visits today',cnt[today]||0],['Visits this month',mon[mo]||0],['Projects',d.projects.length],['Enquiries',`${d.enquiries.length} (${d.enquiries.filter(e=>!e.read).length} new)`]];
 return`<div class="grid st">${stats.map(([a,b])=>`<div class="card stat"><small>${a}</small><b>${esc(b)}</b></div>`).join('')}</div>
 <p><small>Visitor data is recorded in the browser you open the site with (no server), so visits from other devices are not included.</small></p>
 <h3 class="sub">Daily visits (last 14 days)</h3><div class="chart card">${days.map(([k,n])=>`<div title="${k}: ${n}"><i style="height:${n/mx*100}%"></i><small>${k.slice(5)}</small></div>`).join('')}</div>
 <h3 class="sub">Monthly visits</h3><div class="tbl card"><table><thead><tr><th>Month</th><th>Visits</th></tr></thead><tbody>${Object.entries(mon).sort().reverse().map(([m,n])=>`<tr><td>${m}</td><td>${n}</td></tr>`).join('')||'<tr><td colspan=2>No visits yet</td></tr>'}</tbody></table></div>
 <h3 class="sub">Recent visitor activity</h3><div class="tbl card"><table><thead><tr><th>Date & time</th><th>Device</th><th>Type</th></tr></thead><tbody>${[...v].reverse().slice(0,10).map(x=>`<tr><td>${fmt(x.at)}</td><td>${esc(x.device)}</td><td>${x.isNew?'New visitor':'Returning'}</td></tr>`).join('')||'<tr><td colspan=3>No visits yet</td></tr>'}</tbody></table></div>`}
function crud(k){
 const o=edit&&edit.k===k?(edit.id?d[k].find(x=>x.id===edit.id):{}):null;
 const fld=([n,l,t])=>{let v=o[n]??'';if(Array.isArray(v))v=v.join(', ');
  return t==='textarea'?`<label>${l}<textarea name="${n}" rows="4" ${REQ.includes(n)?'required':''}>${esc(v)}</textarea></label>`
  :t==='image'?`<label>${l}<input type="file" name="${n}" accept="image/*">${v?`<img class="thumb" src="${esc(v)}" alt="">`:''}</label>`
  :`<label>${l}<input name="${n}" type="${t||'text'}" value="${esc(v)}" ${REQ.includes(n)?'required':''} ${t==='number'?'min="0" max="100"':''}></label>`};
 return`<div class="row"><h3 class="sub" style="text-transform:capitalize">${k}</h3>${o?'':`<button class="btn sm" data-a="add:${k}">+ Add</button>`}</div>
 ${o?`<form class="card form" data-f="item" data-k="${k}" data-id="${esc(edit.id||'')}">${FIELDS[k].map(fld).join('')}<div class="btns"><button class="btn">Save</button><button type="button" class="btn ghost" data-a="cancel">Cancel</button></div></form>`:''}
 ${d[k].length?d[k].map(x=>`<div class="card row item"><span>${esc(x.title||x.name)}<small> ${esc(x.org||x.institute||(x.level!=null?x.level+'%':''))}</small></span><span class="btns"><button class="btn sm ghost" data-a="edit:${k}:${x.id}">Edit</button><button class="btn sm danger" data-a="del:${k}:${x.id}">Delete</button></span></div>`).join(''):'<p>No items yet.</p>'}`}
function profile(){const p=d.profile;return`
 <div class="card form"><h3>Profile photo</h3>${p.photo?`<img class="thumb" src="${esc(p.photo)}" alt="Profile">`:''}<input type="file" accept="image/jpeg,image/png,image/webp" data-up="photo" aria-label="Upload photo">${p.photo?'<button class="btn sm danger" data-a="delphoto">Delete photo</button>':''}</div>
 <div class="card form"><h3>Resume (PDF, max 1.5MB) – used by the Download Resume button</h3>${p.resume?`<a href="${esc(p.resume)}" download="resume.pdf">Download current resume</a>`:''}<input type="file" accept="application/pdf" data-up="resume" aria-label="Upload resume">${p.resume?'<button class="btn sm danger" data-a="delresume">Delete resume</button>':''}</div>
 <form class="card form" data-f="profile"><h3>Personal information</h3>${PF.map(([n,l,t])=>`<label>${l}${t?`<textarea name="${n}" rows="4">${esc(p[n])}</textarea>`:`<input name="${n}" value="${esc(p[n])}">`}</label>`).join('')}<button class="btn">Save</button></form>
 <form class="card form" data-f="pw"><h3>Admin username &amp; password</h3><label>Current password<input type="password" name="cur" required></label><label>New username (optional)<input name="un" value="${esc(getAuth().u)}"></label><label>New password (min 8, optional)<input type="password" name="nw" minlength="8"></label><button class="btn">Update login</button>${creds?`<p>To make this the login for the deployed site, replace <b>DEFAULT_AUTH</b> in js/data.js with:</p><code>const DEFAULT_AUTH=${esc(creds)};</code>`:''}</form>
 <div class="card form"><h3>Backup / publish data</h3><p>Browser storage is per device. Export to back up or move your content to another browser, then import it there.</p><div class="btns"><button class="btn sm" data-a="export">Export data (JSON)</button><label class="btn sm ghost" style="cursor:pointer">Import data<input type="file" accept="application/json" data-up="import" hidden></label></div></div>`}
function themeTab(){const s=d.settings,o=(m,c)=>Object.entries(m).map(([k,l])=>`<option value="${k}" ${k===c?'selected':''}>${l}</option>`).join('');
 return`<form class="card form" data-f="theme"><h3>Theme</h3><label>Colour palette<select name="palette">${o(Object.fromEntries(Object.entries(PALETTES).map(([k,v])=>[k,v.n])),s.palette)}</select></label>
 <p>${Object.values(PALETTES).map(p=>`<span class="sw" title="${p.n}" style="background:linear-gradient(90deg,${p.l[0]},${p.l[1]})"></span>`).join('')}</p>
 <label>Default mode (visitors can still toggle)<select name="mode">${o({auto:'Match device',light:'Light',dark:'Dark'},s.mode)}</select></label>
 <label>Heading font<select name="font">${o({modern:'Modern sans-serif',elegant:'Elegant serif'},s.font)}</select></label><button class="btn">Save theme</button></form>`}
function enquiries(){const l=[...d.enquiries].reverse();return l.length?l.map(q=>`<div class="card item enq ${q.read?'':'unread'}"><div class="row"><b>${esc(q.subject)}</b><small>${fmt(q.at)}</small></div><p><b>${esc(q.name)}</b> · <a href="mailto:${esc(q.email)}">${esc(q.email)}</a></p><p>${esc(q.message)}</p>
 <div class="btns"><button class="btn sm ghost" data-a="read:${q.id}">Mark ${q.read?'unread':'read'}</button><button class="btn sm danger" data-a="delq:${q.id}">Delete</button></div></div>`).join(''):'<p>No enquiries yet.</p>'}

const acts={
 tab:k=>{tab=k;edit=null;msg=null;render()},add:k=>{edit={k};render()},edit:(k,id)=>{edit={k,id};render()},cancel:()=>{edit=null;render()},
 del:(k,id)=>{if(confirm('Delete this item?')){d[k]=d[k].filter(x=>x.id!==id);msg=['ok','Deleted.'];save()}},
 logout:()=>{sessionStorage.removeItem('tp_ok');msg=null;render()},
 delphoto:()=>{d.profile.photo='';save()},delresume:()=>{d.profile.resume='';save()},
 read:id=>{const q=d.enquiries.find(x=>x.id===id);q.read=!q.read;save()},delq:id=>{if(confirm('Delete enquiry?')){d.enquiries=d.enquiries.filter(x=>x.id!==id);save()}},
 export:()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(d,null,2)],{type:'application/json'}));a.download='portfolio-data.json';a.click()}};
const forms={
 async login(f){const a=getAuth(),v=new FormData(f);if(v.get('un').trim().toLowerCase()===a.u.toLowerCase()&&await hash(v.get('pw'),a.salt)===a.h){sessionStorage.setItem('tp_ok','1');msg=null}else msg='Invalid username or password';render()},
 async item(f){const k=f.dataset.k,id=f.dataset.id,o=id?d[k].find(x=>x.id===id):{id:uid()},v=new FormData(f);
  try{for(const [n,,t] of FIELDS[k]){if(t==='image'){const file=v.get(n);if(file&&file.size)o[n]=await resize(file,800)}else if(n==='tech')o[n]=v.get(n).split(',').map(s=>s.trim()).filter(Boolean);
   else if(t==='number')o[n]=Math.max(0,Math.min(100,+v.get(n)||0));else o[n]=v.get(n).trim()}}catch{msg=['bad','Could not read the image'];return render()}
  if(!id)d[k].push(o);edit=null;msg=['ok','Saved. The public portfolio is updated.'];save()},
 profile(f){const v=new FormData(f);PF.forEach(([n])=>d.profile[n]=v.get(n).trim());msg=['ok','Saved. The public portfolio is updated.'];save()},
 async pw(f){const v=new FormData(f),a=getAuth();if(await hash(v.get('cur'),a.salt)!==a.h){msg=['bad','Current password is wrong'];return render()}
  const salt=uid()+uid(),n={u:v.get('un').trim()||a.u,salt,h:await hash(v.get('nw')||v.get('cur'),salt)};localStorage.setItem('tp2_auth',JSON.stringify(n));creds=JSON.stringify(n);msg=['ok','Login details updated for this browser.'];render()},
 theme(f){const v=new FormData(f);d.settings={palette:v.get('palette'),mode:v.get('mode'),font:v.get('font')};localStorage.removeItem('theme');if(d.settings.mode!=='auto')document.documentElement.dataset.theme=d.settings.mode;applyPalette(d.settings);msg=['ok','Theme saved. The public site now uses it.'];save()}};
app.onclick=e=>{const b=e.target.closest('[data-a]');if(b){const[a,...r]=b.dataset.a.split(':');acts[a]?.(...r)}};
app.onsubmit=e=>{e.preventDefault();forms[e.target.dataset.f]?.(e.target)};
app.onchange=async e=>{const t=e.target,f=t.files&&t.files[0],u=t.dataset.up;if(!u||!f)return;
 try{if(u==='photo')d.profile.photo=await resize(f,500);
  else if(u==='resume'){if(f.size>1.5*1048576){msg=['bad','Resume is too large (max 1.5MB)'];return render()}d.profile.resume=await readURL(f)}
  else if(u==='import'){const j=JSON.parse(await f.text());if(!j||typeof j!=='object'||!j.profile)throw 0;d={...structuredClone(DEF),...j}}
  msg=['ok','Updated.'];save()}catch{msg=['bad','Invalid file'];render()}};
render();
