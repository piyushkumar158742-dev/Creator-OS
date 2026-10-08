'use strict';
const KEY='vyro_creator_os_state',ST=['Idea','Script','Recording','Editing','Thumbnail','Published'],SC=['#98A2B3','#2F4BFF','#7A5AF8','#FFB020','#FF2D6F','#12B886'];
const GR=['linear-gradient(135deg,#2F4BFF,#7A5AF8)','linear-gradient(135deg,#FF2D6F,#FFB020)','linear-gradient(135deg,#12B886,#2F4BFF)','linear-gradient(135deg,#101828,#7A5AF8)'],EM=['🎬','🚀','🎥','⚡','🔥','💡','🎯','🧠'];
const TT={home:'Desk',videos:'Pipeline',tasks:'To-do',brands:'Deals',calendar:'Schedule',settings:'Settings'};
const $=s=>document.querySelector(s),pad=n=>String(n).padStart(2,'0'),uid=()=>Date.now()*10+Math.floor(Math.random()*10);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const money=n=>S.settings.cur+Number(n||0).toLocaleString('en-IN');
const byDate=(a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||''));
const fmt=d=>new Date(d+'T00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'});
function seed(){const t=new Date(),d=n=>{const x=new Date(t);x.setDate(t.getDate()+n);return iso(x)};
return{view:'home',settings:{name:'Creator',cur:'₹'},
videos:[{id:1,title:'I Spent 50 Hours In VR',status:'Editing',views:'1.2M',notes:''},{id:2,title:'The Truth About Tech in 2026',status:'Script',views:'',notes:''},{id:3,title:'My ₹10,000 Studio Tour',status:'Idea',views:'',notes:''}],
tasks:[{id:1,title:'Review sponsor contract',completed:false,priority:'high'},{id:2,title:'Record B-roll for VR video',completed:true,priority:'medium'},{id:3,title:'Send thumbnail drafts to designer',completed:false,priority:'low'}],
brands:[{id:1,name:'TechCorp',status:'Negotiating',amount:5000,email:''},{id:2,name:'VPN Secure',status:'Active',amount:3500,email:''},{id:3,name:'EnergyDrink',status:'Completed',amount:2000,email:''}],
events:[{id:1,title:'Publish VR video',date:d(3),time:'10:00',type:'video'},{id:2,title:'TechCorp sponsor call',date:d(6),time:'14:00',type:'brand'}]}}
function load(){const s=seed();try{const o=JSON.parse(localStorage.getItem(KEY));if(!o)return s;
const n={...s,...o,settings:{...s.settings,...o.settings,name:o.settings?.name||o.settings?.creatorName||s.settings.name}};
n.view=TT[o.view]?o.view:'home';
n.videos=(n.videos||[]).map(v=>({...v,status:ST.includes(v.status)?v.status:'Idea',views:v.views==='-'?'':v.views||''}));
n.brands=(n.brands||[]).map(b=>({...b,amount:Number(String(b.amount).replace(/[^0-9.]/g,''))||0}));
n.events=(n.events||[]).filter(e=>/^\d{4}-\d\d-\d\d$/.test(e.date||''));return n}catch(e){return s}}
let S=load(),cal=(d=>({y:d.getFullYear(),m:d.getMonth(),sel:iso(d)}))(new Date()),pend=null;
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));return true}catch(e){toast('Storage is full. Use a smaller thumbnail or export your data in Settings.');return false}}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2800)}
function ask(h){$('#sheet').innerHTML=h;$('#modal').hidden=false;$('#sheet input,#sheet select,#sheet textarea')?.focus()}
function shut(){$('#modal').hidden=true;pend=null}
const th=v=>`<div class="th">${v.thumb?`<img src="${esc(v.thumb)}" alt="">`:`<div class="gt" style="background:${GR[v.id%4]}">${EM[v.id%8]}</div>`}</div>`;
const done=(fn)=>{save();shut();draw();fn&&toast(fn)};
const V={};
