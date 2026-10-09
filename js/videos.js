'use strict';
V.videos=()=>`<div class="board">${ST.map((s,i)=>{const L=S.videos.filter(v=>v.status===s);return`<section class="bin" style="--c:${SC[i]}" ondragover="event.preventDefault();this.classList.add('over')" ondragleave="this.classList.remove('over')" ondrop="drop(event,'${s}')"><header>${s}<span>${L.length}</span></header><div class="cards">
${L.map(v=>`<article class="card" draggable="true" ondragstart="event.dataTransfer.setData('text/plain',${v.id})" onclick="vm(${v.id})">${th(v)}<div class="bd"><strong>${esc(v.title)}</strong><small>${v.views?esc(v.views)+' views':'Not published yet'}</small><div class="mv" onclick="event.stopPropagation()">${i?`<button onclick="vmove(${v.id},${i-1})">← ${ST[i-1]}</button>`:''}${i<5?`<button onclick="vmove(${v.id},${i+1})">${ST[i+1]} →</button>`:''}</div></div></article>`).join('')||'<div class="empty">Drop a video here</div>'}</div></section>`}).join('')}</div>`;
function vm(id){const v=id?S.videos.find(x=>x.id===id):{id:uid(),status:'Idea'};if(!v)return;pend=null;
ask(`<h3>${id?'Edit video':'New video'}</h3><form class="f" onsubmit="vsave(event,${id||0})">${id||v.thumb?`<div id="pv">${th(v)}</div>`:`<div id="pv" class="new-video-preview" hidden></div>`}
<label>Title<input name="title" required maxlength="120" value="${esc(v.title||'')}"></label>
<label>Stage<select name="status">${ST.map(s=>`<option ${s===v.status?'selected':''}>${s}</option>`).join('')}</select></label>
<label>Views (once published)<input name="views" value="${esc(v.views||'')}" placeholder="e.g. 12K"></label>
<label>Thumbnail<input type="file" accept="image/*" onchange="vimg(this)"></label>
<label>Script and notes<textarea name="notes">${esc(v.notes||'')}</textarea></label>
<div class="acts">${id?`<button type="button" class="btn del" onclick="vdel(${id})">Delete</button><span class="sp"></span>`:''}<button type="button" class="btn ghost" onclick="shut()">Cancel</button><button class="btn">${id?'Save changes':'Create video'}</button></div></form>`)}
function vimg(i){const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,640/im.width),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);pend=c.toDataURL('image/jpeg',.72);$('#pv').innerHTML=th({thumb:pend})};im.onerror=()=>toast('That file is not a readable image.');im.src=r.result};r.readAsDataURL(f)}
function vsave(e,id){e.preventDefault();const f=new FormData(e.target),d={title:f.get('title').trim(),status:f.get('status'),views:f.get('views').trim(),notes:f.get('notes')};
if(id){const v=S.videos.find(x=>x.id===id);Object.assign(v,d);if(pend)v.thumb=pend}else S.videos.unshift({id:uid(),...d,...(pend?{thumb:pend}:{})});done(id?'Changes saved':'Video created')}
function vdel(id){if(confirm('Delete this video?')){S.videos=S.videos.filter(v=>v.id!==id);done('Video deleted')}}
function vmove(id,i){S.videos.find(v=>v.id===id).status=ST[i];save();draw()}
function drop(e,s){e.preventDefault();const v=S.videos.find(x=>x.id===Number(e.dataTransfer.getData('text/plain')));if(v){v.status=s;save()}draw()}
