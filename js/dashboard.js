'use strict';
function timeline(){const s=new Date();s.setHours(0,0,0,0);s.setDate(s.getDate()-2);const D=[...Array(14)].map((_,i)=>{const x=new Date(s);x.setDate(s.getDate()+i);return x}),ds=D.map(iso),td=iso(new Date());
return`<div class="tl"><div class="tl-in"><div class="tl-head"><span></span><div>${D.map(d=>`<i class="${iso(d)===td?'now':''}">${'SMTWTFS'[d.getDay()]}<b>${d.getDate()}</b></i>`).join('')}</div></div>
${[['Videos','video'],['Brands','brand'],['Other','other']].map(([n,k])=>`<div class="tl-row"><em>${n}</em><div class="tl-track">${S.events.filter(e=>(e.type||'other')===k&&ds.includes(e.date)).map(e=>{const i=ds.indexOf(e.date);return`<button class="clip ${k}" style="grid-column:${i+1}/span ${Math.min(3,14-i)}" onclick="calSel('${e.date}');go('calendar')"><b>${esc(e.title)}</b>${esc(e.time||'')}</button>`}).join('')}</div></div>`).join('')}
<u class="head"></u></div></div>`}

V.home=()=>{const{videos:v,tasks:t,brands:b}=S,td=iso(new Date()),open=t.filter(x=>!x.completed),pub=v.filter(x=>x.status==='Published').length,h=new Date().getHours();
const deals=b.filter(x=>x.status!=='Completed'),up=S.events.filter(e=>e.date>=td).sort(byDate).slice(0,3);
return`<h2 class="hi">${h<12?'Good morning':h<18?'Good afternoon':'Good evening'}, ${esc(S.settings.name)}.</h2>
<section class="strip">${[['In production',v.length-pub],['Published',pub],['Open tasks',open.length],['Open deal value',money(deals.reduce((a,x)=>a+x.amount,0))]].map(([l,n])=>`<div><b>${n}</b><span>${l}</span></div>`).join('')}</section>
<section class="panel"><header><h3>Next two weeks</h3><button class="lnk" onclick="go('calendar')">Open schedule</button></header>${timeline()}</section>
<div class="two"><section class="panel"><header><h3>Pipeline</h3><button class="lnk" onclick="go('videos')">Open pipeline</button></header><div class="pad">
${v.length?`<div class="seg">${ST.map((s,i)=>`<i style="flex:${v.filter(x=>x.status===s).length};background:${SC[i]}"></i>`).join('')}</div><div class="legend">${ST.map((s,i)=>`<span style="--c:${SC[i]}">${s} ${v.filter(x=>x.status===s).length}</span>`).join('')}</div>`:'<div class="empty">No videos yet. Add your first idea.</div>'}</div>
${v.slice(0,3).map(x=>`<button class="row" onclick="vm(${x.id})">${th(x)}<div><strong>${esc(x.title)}</strong><small>${x.status}</small></div></button>`).join('')}</section>
<div><section class="panel"><header><h3>To-do next</h3><button class="lnk" onclick="go('tasks')">All tasks</button></header>
${open.slice(0,4).map(x=>`<button class="row" onclick="tk(${x.id})"><span class="chk"></span><div><strong>${esc(x.title)}</strong></div><span class="tag ${x.priority}">${x.priority}</span></button>`).join('')||'<div class="empty">All clear. Nothing waiting on you.</div>'}</section>
<section class="panel"><header><h3>Coming up</h3></header>${up.map(e=>`<button class="row" onclick="calSel('${e.date}');go('calendar')"><div><strong>${esc(e.title)}</strong><small>${fmt(e.date)} ${esc(e.time||'')}</small></div></button>`).join('')||'<div class="empty">Nothing scheduled.</div>'}</section></div></div>`};
