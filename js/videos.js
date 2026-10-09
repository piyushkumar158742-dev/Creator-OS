'use strict';
V.videos=()=>`<div class="video-library">
${S.videos.map(v=>`<button class="video-tile" onclick="vdetail(${v.id})"><div class="video-tile-thumb">${th(v)}</div><div class="video-tile-info"><span class="video-stage" style="--stage:${SC[ST.indexOf(v.status)]||SC[0]}">${esc(v.status)}</span><strong>${esc(v.title||'Untitled video')}</strong><small>${v.views?esc(v.views)+' views':'Not published yet'}</small><span class="video-tile-open">View details ↗</span></div></button>`).join('')}
<button class="video-tile video-tile-add" onclick="vm()"><span class="add-mark">+</span><strong>Add a video</strong><small>Create a new video project</small></button>
</div>`;
function vdetail(id){const v=S.videos.find(x=>x.id===id);if(!v)return;const idx=ST.indexOf(v.status);
ask(`<div class="video-detail-head"><div class="video-detail-thumb">${th(v)}</div><div class="video-detail-title"><span class="video-stage" style="--stage:${SC[idx]||SC[0]}">${esc(v.status)}</span><h3>${esc(v.title||'Untitled video')}</h3><p>${v.views?esc(v.views)+' views':'Not published yet'}</p></div></div>
<section class="video-detail-section"><h4>Production pipeline</h4><div class="video-stage-flow">${ST.map((s,i)=>`<button class="stage-step ${i===idx?'current':''} ${i<idx?'passed':''}" style="--stage:${SC[i]}" onclick="vstage(${id},${i})"><span>${i<idx?'✓':i+1}</span><small>${esc(s)}</small></button>`).join('')}</div><p class="detail-hint">Select any stage to move this video through production.</p></section>
<section class="video-detail-section"><h4>Video details</h4><div class="video-detail-grid"><div><span>Title</span><strong>${esc(v.title||'Untitled video')}</strong></div><div><span>Current stage</span><strong>${esc(v.status)}</strong></div><div><span>Views</span><strong>${v.views?esc(v.views):'—'}</strong></div><div><span>Thumbnail</span><strong>${v.thumb?'Custom thumbnail':'Generated placeholder'}</strong></div></div></section>
<section class="video-detail-section"><h4>Script & notes</h4><p class="video-notes">${esc(v.notes||'No script or notes added yet.')}</p></section>
<div class="acts"><button type="button" class="btn del" onclick="vdel(${id})">Delete</button><span class="sp"></span><button type="button" class="btn ghost" onclick="shut()">Close</button><button type="button" class="btn" onclick="vm(${id})">Edit details</button></div>`)}
function vstage(id,i){const v=S.videos.find(x=>x.id===id);if(!v||!ST[i])return;v.status=ST[i];save();vdetail(id);draw()}
function vm(id){const v=id?S.videos.find(x=>x.id===id):{id:uid(),status:'Idea'};if(!v)return;pend=null;
ask(`<h3>${id?'Edit video':'New video'}</h3><form class="f" onsubmit="vsave(event,${id||0})">${id||v.thumb?`<div id="pv">${th(v)}</div>`:`<div id="pv" class="new-video-preview" hidden></div>`}
<label>Title<input name="title" required maxlength="120" value="${esc(v.title||'')}"></label>
<label>Stage<select name="status">${ST.map(s=>`<option ${s===v.status?'selected':''}>${s}</option>`).join('')}</select></label>
<label>Views (once published)<input name="views" value="${esc(v.views||'')}" placeholder="e.g. 12K"></label>
<label>Thumbnail<input type="file" accept="image/*" onchange="vimg(this)"></label>
<label>Script and notes<textarea name="notes">${esc(v.notes||'')}</textarea></label>
<div class="acts">${id?`<button type="button" class="btn del" onclick="vdel(${id})">Delete</button><span class="sp"></span>`:''}<button type="button" class="btn ghost" onclick="shut()">Cancel</button><button class="btn">${id?'Save changes':'Create video'}</button></div></form>`)}
function vimg(i){const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,640/im.width),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);pend=c.toDataURL('image/jpeg',.72);$('#pv').hidden=false;$('#pv').innerHTML=th({thumb:pend})};im.onerror=()=>toast('That file is not a readable image.');im.src=r.result};r.readAsDataURL(f)}
function vsave(e,id){e.preventDefault();const f=new FormData(e.target),d={title:f.get('title').trim(),status:f.get('status'),views:f.get('views').trim(),notes:f.get('notes')};
if(id){const v=S.videos.find(x=>x.id===id);Object.assign(v,d);if(pend)v.thumb=pend}else S.videos.unshift({id:uid(),...d,...(pend?{thumb:pend}:{})});done(id?'Changes saved':'Video created')}
function vdel(id){if(confirm('Delete this video?')){S.videos=S.videos.filter(v=>v.id!==id);done('Video deleted')}}
function vmove(id,i){const v=S.videos.find(x=>x.id===id);if(v&&ST[i]){v.status=ST[i];save();draw()}}
function drop(e,s){e.preventDefault();const v=S.videos.find(x=>x.id===Number(e.dataTransfer.getData('text/plain')));if(v){v.status=s;save()}draw()}
