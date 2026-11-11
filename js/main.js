const $=s=>document.querySelector(s);
/* Visitor tracking: one visit per browser session, unique by a random id kept in this browser */
try{let v=localStorage.getItem('tp_vid');const isNew=!v;if(!v){v=uid()+uid();localStorage.setItem('tp_vid',v)}
 if(!sessionStorage.getItem('tp_t')){sessionStorage.setItem('tp_t','1');const x=Store.get();
  x.visits.push({vid:v,at:new Date().toISOString(),isNew,device:/mobile|android|iphone/i.test(navigator.userAgent)?'Mobile':'Desktop'});x.visits=x.visits.slice(-1000);Store.set(x)}}catch{}
const d=Store.get(),p=d.profile,ini=(p.name||'?').split(' ').map(w=>w[0]).slice(0,2).join('');
document.title=`${p.name} | ${p.role}`;
$('#logo').innerHTML=`${esc(ini)}<span>.</span>`;$('#name').textContent=p.name;$('#role').textContent=p.role;$('#intro').textContent=p.intro;$('#about-t').textContent=p.about;
$('#hbtns').innerHTML=(p.resume?`<a class="btn" href="${esc(safeUrl(p.resume))}" download="${esc(p.name.replace(/\s+/g,'_'))}_Resume.pdf">Download Resume</a>`:'<span class="btn dis">Resume coming soon</span>')+'<a class="btn ghost" href="#contact">Contact Me</a>';
const soc=`${p.linkedin?`<a href="${esc(safeUrl(p.linkedin))}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`:''}${p.github?`<a href="${esc(safeUrl(p.github))}" target="_blank" rel="noopener noreferrer">GitHub</a>`:''}`;
$('#soc').innerHTML=soc;
$('#photo').innerHTML=p.photo?`<img src="${esc(safeUrl(p.photo))}" alt="${esc(p.name)}" width="320" height="320">`:`<div class="ph">${esc(ini)}</div>`;
$('#sk').innerHTML=[...new Set(d.skills.map(s=>s.category||'Skills'))].map(c=>`<h3 class="sub rv">${esc(c)}</h3><div class="grid sk" style="margin-bottom:1.5rem">${d.skills.filter(s=>(s.category||'Skills')===c).map(s=>`<div class="card rv"><div class="row"><b>${esc(s.name)}</b><span>${+s.level}%</span></div><div class="bar" role="progressbar" aria-valuenow="${+s.level}" aria-valuemin="0" aria-valuemax="100" aria-label="${esc(s.name)}"><i style="width:${+s.level}%"></i></div></div>`).join('')}</div>`).join('');
$('#pj').innerHTML=d.projects.map(x=>`<article class="card pc rv">${x.image?`<img src="${esc(safeUrl(x.image))}" alt="${esc(x.title)}" loading="lazy">`:'<div class="pimg">&lt;/&gt;</div>'}<div class="pb"><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p>
<div class="tags">${(x.tech||[]).map(t=>`<span>${esc(t)}</span>`).join('')}</div><div class="btns">${safeUrl(x.github)?`<a class="btn sm" href="${esc(x.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`:''}${safeUrl(x.demo)?`<a class="btn sm ghost" href="${esc(x.demo)}" target="_blank" rel="noopener noreferrer">Live Demo</a>`:''}</div></div></article>`).join('');
$('#ed').innerHTML=d.education.map(e=>`<div class="card rv"><h3>${esc(e.title)}</h3><p>${esc(e.institute)}</p><small>${esc([e.period,e.score].filter(Boolean).join(' • '))}</small></div>`).join('');
$('#in').innerHTML=d.internships.map(i=>`<div class="card rv"><h4>${esc(i.title)}</h4><p>${esc(i.org)}</p><small>${esc([i.period,i.details].filter(Boolean).join(' • '))}</small></div>`).join('');
$('#ce').innerHTML=d.certifications.map(c=>`<div class="card rv"><h4>${esc(c.title)}</h4><p>${esc(c.org)}</p></div>`).join('');
$('#ci').innerHTML=`<p>Have an opportunity or a question? Send a message and I will reply soon.</p>${p.email?`<p>📧 <a href="mailto:${esc(p.email)}">${esc(p.email)}</a></p>`:''}${p.phone?`<p>📞 <a href="tel:${esc(p.phone)}">${esc(p.phone)}</a></p>`:''}${p.location?`<p>📍 ${esc(p.location)}</p>`:''}<div class="soc">${soc}</div>`;
$('#foot').textContent=`© ${new Date().getFullYear()} ${p.name}. All rights reserved.`;

/* theme, menu, reveal */
const tb=$('#theme'),setT=t=>{document.documentElement.dataset.theme=t;localStorage.setItem('theme',t);tb.textContent=t==='dark'?'☀️':'🌙'};setT(document.documentElement.dataset.theme);
tb.onclick=()=>setT(document.documentElement.dataset.theme==='dark'?'light':'dark');
$('#burger').onclick=e=>{const o=$('#links').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)};
$('#links').onclick=()=>$('#links').classList.remove('open');
document.querySelectorAll('.sec .card,.hero>.wrap>*,.hero .rv').forEach(n=>n.classList.add('rv'));
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('in')),{threshold:.1});document.querySelectorAll('.rv').forEach(n=>io.observe(n));

/* contact form (saved to the admin's Enquiries in this browser) */
$('#cf').onsubmit=e=>{e.preventDefault();const f=e.target,v=Object.fromEntries(new FormData(f)),t=k=>(v[k]||'').trim(),er={};
 if(t('name').length<2)er.name='Enter your name';if(!/^\S+@\S+\.\S+$/.test(t('email')))er.email='Enter a valid email';if(t('subject').length<3)er.subject='Enter a subject';if(t('message').length<10)er.message='Message must be at least 10 characters';
 f.querySelectorAll('label').forEach(l=>{const i=l.querySelector('input,textarea'),m=er[i.name]||'';l.querySelector('em').textContent=m;i.setAttribute('aria-invalid',!!m)});
 if(Object.keys(er).length)return;const x=Store.get();x.enquiries.push({id:uid(),name:t('name').slice(0,100),email:t('email').slice(0,150),subject:t('subject').slice(0,150),message:t('message').slice(0,3000),at:new Date().toISOString(),read:false});
 const s=$('#cs');if(Store.set(x)){s.className='ok';s.textContent='Thank you! Your message has been sent.';f.reset()}else{s.className='bad';s.textContent='Could not save your message.'}};
