'use strict';
function draw(){document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('on',b.dataset.nav===S.view));$('#title').textContent=TT[S.view];
try{$('#main').innerHTML=V[S.view]()}catch(e){console.error(e);$('#main').innerHTML='<div class="panel"><div class="empty">Something broke while drawing this page. Open Settings and reset the workspace, then reload.</div></div>'}}
function go(v){S.view=v;save();draw();scrollTo(0,0)}
function tick(){$('#clock').textContent=new Date().toLocaleString('en-IN',{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
document.addEventListener('keydown',e=>{if(e.key==='Escape')shut()});
tick();setInterval(tick,30000);draw();
