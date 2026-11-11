/* Shared storage layer + default content (taken from the resume). Edits made in the admin dashboard live in localStorage. */
const KEY='tp2_data',gh='https://github.com/yerraguntathriveni';
const DEFAULT_AUTH={u:'admin',salt:'tp-static-salt-2026',h:'4e4d9f6cce9876f10241e3b7f65fe634c2ca84f53a4b8d2c9f136d75820938e8'};
const PALETTES={
 emerald:{n:'Emerald',l:['#047857','#0ea5e9'],d:['#34d399','#38bdf8']},
 ocean:{n:'Ocean Blue',l:['#2563eb','#06b6d4'],d:['#60a5fa','#22d3ee']},
 sunset:{n:'Sunset Orange',l:['#c2410c','#e11d48'],d:['#fb923c','#fb7185']},
 violet:{n:'Royal Violet',l:['#7c3aed','#db2777'],d:['#a78bfa','#f472b6']},
 indigo:{n:'Indigo',l:['#4f46e5','#06b6d4'],d:['#818cf8','#22d3ee']}};
const sk=(c,l)=>l.map(([name,level])=>({id:'s'+name.replace(/\W/g,''),category:c,name,level}));
const DEF={
 profile:{name:'Yerragunta Thriveni',role:'Java Full Stack Developer',
  intro:'Motivated Computer Science Engineering graduate skilled in Java, HTML5, CSS, JavaScript and MySQL, passionate about building responsive, user-friendly applications.',
  about:'I am a motivated and enthusiastic Computer Science Engineering graduate (Sri Venkateshwara Institute of Technology, 2022–2026) with knowledge of Java Full Stack Development, frontend technologies and web application development. I am skilled in Java, HTML5, CSS, JavaScript and MySQL, and passionate about developing responsive and user-friendly applications. My goal is to start my career as a Java Full Stack Developer and keep growing through real-world projects.',
  email:'yerraguntathriveni@email.com',phone:'9652588185',location:'Anantapur, Andhra Pradesh, India',
  linkedin:'https://www.linkedin.com/in/yerragunta-thriveni-6779b2327/',github:gh,photo:'',resume:'resume/Yerragunta_Thriveni_Resume.pdf'},
 skills:[...sk('Programming Languages',[['Java',85],['JavaScript',75]]),...sk('Frontend Technologies',[['HTML5',90],['CSS3',85]]),...sk('Backend Technologies',[['Core Java',85],['JDBC',75],['Servlets',70]]),...sk('Database',[['MySQL',80]])],
 projects:[
  {id:'p1',title:'Underwater Image Enhancement via Weighted Wavelet Visual Perception Fusion',description:'Improves underwater image quality using Python/MATLAB. Enhances clarity, visibility and contrast with weighted wavelet transformation formulas, applying digital image processing concepts for better visual perception and evaluating performance metrics.',tech:['Python','MATLAB','Digital Image Processing','Wavelet Transform'],image:'',github:gh,demo:''},
  {id:'p2',title:'E-Commerce Website',description:'A responsive e-commerce website with product listings, search and cart functionality.',tech:['HTML5','CSS3','JavaScript'],image:'',github:gh,demo:''}],
 education:[{id:'e1',title:'B.Tech – Computer Science & Engineering',institute:'Sri Venkateshwara Institute of Technology',period:'2022 – 2026',score:'7.8/10 CGPA'},
  {id:'e2',title:'Intermediate',institute:'SLN Jr College',period:'2021 – 2022',score:'5.0'},{id:'e3',title:'10th Class',institute:'Navathe EM High School',period:'2019 – 2020',score:'8.8'}],
 internships:[{id:'i1',title:'Web Development and Mobile Application Development',org:'ROOMAN Technologies Pvt Ltd.',period:'',details:''},{id:'i2',title:'Artificial Intelligence',org:'Skill Dzire',period:'',details:''}],
 certifications:[{id:'c1',title:'Web Development and Mobile Application',org:'ROOMAN Technologies Pvt Ltd.'},{id:'c2',title:'Digital Image Processing',org:'NPTEL SWAYAM'}],
 settings:{palette:'emerald',mode:'auto',font:'modern'},
 enquiries:[],visits:[]};
const Store={
 get(){try{const s=JSON.parse(localStorage.getItem(KEY));return s?{...structuredClone(DEF),...s}:structuredClone(DEF)}catch{return structuredClone(DEF)}},
 set(d){try{localStorage.setItem(KEY,JSON.stringify(d));return true}catch{alert('Browser storage is full. Use a smaller image or PDF.');return false}}};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl=u=>u&&(/^(https?|data):/i.test(u)||!/^[a-z][a-z0-9+.-]*:/i.test(u))?u:'';
function applyPalette(s){const p=PALETTES[s.palette]||PALETTES.emerald;let e=document.getElementById('tp-pal');if(!e){e=document.createElement('style');e.id='tp-pal';document.head.appendChild(e)}
 e.textContent=`html[data-theme=light]{--pr:${p.l[0]};--pr2:${p.l[1]}}html[data-theme=dark]{--pr:${p.d[0]};--pr2:${p.d[1]}}`+(s.font==='elegant'?'h1,h2,h3,.logo{font-family:Georgia,"Times New Roman",serif}':'')}
const _s=Store.get().settings;
document.documentElement.dataset.theme=localStorage.getItem('theme')||(_s.mode!=='auto'?_s.mode:matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
applyPalette(_s);
