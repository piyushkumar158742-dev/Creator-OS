'use strict';
V.settings=()=>`<div class="set">
<section class="panel"><header><h3>Workspace</h3></header><div class="pad">
<label>Your name<input id="sn" value="${esc(S.settings.name||'Creator')}" maxlength="20" oninput="this.value=this.value.slice(0,20)" autocomplete="nickname"></label>
<fieldset class="currency-picker"><legend>Currency</legend><div class="currency-options">
${[['₹','INR'],['$','USD'],['€','EUR'],['£','GBP']].map(([symbol,code])=>`<button type="button" class="currency-choice ${(S.settings.cur||'₹')===symbol?'selected':''}" data-currency="${symbol}" aria-pressed="${(S.settings.cur||'₹')===symbol}" onclick="scurrency('${symbol}')"><strong>${symbol}</strong><span>${code}</span></button>`).join('')}
</div><input type="hidden" id="sc" value="${S.settings.cur||'₹'}"></fieldset>
<div class="acts"><button class="btn" onclick="ssave()">Save settings</button></div>
</div></section>
<section class="panel"><header><h3>YouTube</h3></header><div class="pad"><p>Connect your channel when Firebase and YouTube API access are configured.</p><div class="acts"><button class="btn ghost" onclick="toast('YouTube sign-in needs Firebase configured first.')">Connect channel</button></div></div></section>
<section class="panel"><header><h3>Your data</h3></header><div class="pad"><p>Export a backup of this workspace or reset local data.</p><div class="acts"><button class="btn ghost" onclick="sexp()">Export backup</button><button class="btn del" onclick="srst()">Reset workspace</button></div></div></section>
</div>`;
function scurrency(symbol){const input=$('#sc');if(input)input.value=symbol;document.querySelectorAll('.currency-choice').forEach(b=>{const on=b.dataset.currency===symbol;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on))})}
function ssave(){const name=$('#sn').value.trim().slice(0,20)||'Creator';S.settings.name=name;S.settings.cur=$('#sc').value||'₹';save();draw();toast('Settings saved')}
function sexp(){const a=document.createElement('a');const url=URL.createObjectURL(new Blob([JSON.stringify(S,null,2)],{type:'application/json'}));a.href=url;a.download='vyro-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function srst(){if(confirm('Erase all videos, tasks, deals and events on this device?')){S=seed();save();go('home');toast('Workspace reset')}}
