'use strict';
const DS={Potential:'#98A2B3',Contacted:'#7A5AF8',Negotiating:'#FFB020',Active:'#2F4BFF',Completed:'#12B886'};
V.brands=()=>`<div class="deals">${S.brands.map(b=>`<article class="panel deal"><h3>${esc(b.name)}</h3><div class="amt">${money(b.amount)}</div><span class="tag" style="--c:${DS[b.status]||'#98A2B3'}">${esc(b.status)}</span><div class="acts" style="justify-content:flex-start"><button class="btn ghost" onclick="bm(${b.id})">Edit deal</button>${b.email?`<a class="btn ghost" href="mailto:${esc(b.email)}" style="text-decoration:none">Email</a>`:''}</div></article>`).join('')}
<button class="panel deal add" onclick="bm()"><b style="font-size:28px">+</b>Add a deal</button></div>`;
function bm(id){const b=id?S.brands.find(x=>x.id===id):{};ask(`<h3>${id?'Edit deal':'Add deal'}</h3><form class="f" onsubmit="bsave(event,${id||0})"><label>Brand<input name="name" required value="${esc(b.name||'')}"></label>
<label>Stage<select name="status">${Object.keys(DS).map(s=>`<option ${s===b.status?'selected':''}>${s}</option>`).join('')}</select></label>
<label>Deal value (${S.settings.cur})<input name="amount" type="number" min="0" step="1" value="${b.amount??''}"></label><label>Contact email<input name="email" type="email" value="${esc(b.email||'')}"></label>
<div class="acts">${id?`<button type="button" class="btn del" onclick="bdel(${id})">Delete</button><span class="sp"></span>`:''}<button type="button" class="btn ghost" onclick="shut()">Cancel</button><button class="btn">Save deal</button></div></form>`)}
function bsave(e,id){e.preventDefault();const f=new FormData(e.target),d={name:f.get('name').trim(),status:f.get('status'),amount:Number(f.get('amount'))||0,email:f.get('email').trim()};
if(id)Object.assign(S.brands.find(x=>x.id===id),d);else S.brands.push({id:uid(),...d});done('Deal saved')}
function bdel(id){if(confirm('Delete this deal?')){S.brands=S.brands.filter(b=>b.id!==id);done('Deal deleted')}}
