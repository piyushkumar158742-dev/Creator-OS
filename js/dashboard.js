'use strict';
function timeline(){const s=new Date();s.setHours(0,0,0,0);s.setDate(s.getDate()-2);const D=[...Array(14)].map((_,i)=>{const x=new Date(s);x.setDate(s.getDate()+i);return x}),ds=D.map(iso),td=iso(new Date());
return`<div class="tl"><div class="tl-in"><div class="tl-head"><span></span><div>${D.map(d=>`<i class="${iso(d)===td?'now':''}">${'SMTWTFS'[d.getDay()]}<b>${d.getDate()}</b></i>`).join('')}</div></div>
${[['Videos','video'],['Brands','brand'],['Other','other']].map(([n,k])=>`<div class="tl-row"><em>${n}</em><div class="tl-track">${S.events.filter(e=>(e.type||'other')===k&&ds.includes(e.date)).map(e=>{const i=ds.indexOf(e.date);return`<button class="clip ${k}" style="grid-column:${i+1}/span ${Math.min(3,14-i)}" onclick="calSel('${e.date}');go('calendar')"><b>${esc(e.title)}</b>${esc(e.time||'')}</button>`}).join('')}</div></div>`).join('')}
<u class="head"></u></div></div>`}

V.home=()=>{const{videos:v,brands:b}=S;
const up=S.events.filter(e=>e.date>=iso(new Date())).sort(byDate).slice(0,4);
return`<h2 class="hi">${esc(S.settings.name)}'s workspace</h2>
<section class="strip" aria-label="Channel overview">
  <div><b>452K</b><span>Subscribers</span></div>
  <div><b>8.4M</b><span>Total views</span></div>
  <div><b>${b.length}</b><span>Brands</span></div>
  <div><b>${v.length}</b><span>Videos</span></div>
</section>
<section class="panel"><header><h3>Next two weeks</h3><button class="lnk" onclick="go('calendar')">Open schedule</button></header>${timeline()}</section>
<section class="panel"><header><h3>Coming up</h3><button class="lnk" onclick="go('calendar')">Open calendar</button></header>
${up.map(e=>`<button class="row" onclick="calSel('${e.date}');go('calendar')"><div><strong>${esc(e.title)}</strong><small>${fmt(e.date)} ${esc(e.time||'')}</small></div></button>`).join('')||'<div class="empty">Nothing scheduled.</div>'}
</section>`};
