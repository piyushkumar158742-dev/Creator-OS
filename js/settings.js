'use strict';
V.settings=()=>{const bc=window.VyroBackend?.status?.()||{};const ch=S.settings.youtubeChannel;return `<div class="set user-settings">
<section class="panel"><header><h3>Workspace</h3></header><div class="pad">
<label>Your name<input id="sn" value="${esc(S.settings.name||'Creator')}" maxlength="20" oninput="this.value=this.value.slice(0,20)" autocomplete="nickname"></label>
<fieldset class="currency-picker"><legend>Currency</legend><div class="currency-options">
${[['₹','INR'],['$','USD'],['€','EUR'],['£','GBP']].map(([symbol,code])=>`<button type="button" class="currency-choice ${(S.settings.cur||'₹')===symbol?'selected':''}" data-currency="${symbol}" aria-pressed="${(S.settings.cur||'₹')===symbol}" onclick="scurrency('${symbol}')"><strong>${symbol}</strong><span>${code}</span></button>`).join('')}
</div><input type="hidden" id="sc" value="${S.settings.cur||'₹'}"></fieldset>
<div class="acts"><button class="btn" onclick="ssave()">Save settings</button></div>
</div></section>
<section class="panel"><header><h3>Account</h3><span class="tag ${bc.user?'low':'medium'}">${bc.user?'Connected':'Not connected'}</span></header><div class="pad">
<p class="backend-help">${bc.user?'Signed in as '+esc(bc.user.email||bc.user.displayName||'Google account'):'Sign in to sync your workspace across devices.'}</p>
${bc.user?'<div class="acts"><button class="btn ghost" onclick="VyroBackend.signOut()">Sign out</button></div>':`<div class="acts"><button class="btn" onclick="VyroBackend.signGoogle()">Continue with Google</button></div><div class="backend-grid auth-fields"><label>Email<input id="backend-email" type="email" placeholder="you@example.com" autocomplete="email"></label><label>Password<input id="backend-password" type="password" minlength="6" placeholder="At least 6 characters" autocomplete="current-password"></label></div><div class="acts"><button class="btn ghost" onclick="VyroBackend.signEmail('login')">Sign in with email</button><button class="btn ghost" onclick="VyroBackend.signEmail('create')">Create account</button></div>`}
</div></section>
<section class="panel"><header><h3>YouTube channel</h3><span class="tag ${ch?'low':'medium'}">${ch?'Connected':'Not connected'}</span></header><div class="pad">
${ch?`<div class="channel-card">${ch.thumbnail?`<img src="${esc(ch.thumbnail)}" alt="">`:''}<div><strong>${esc(ch.title)}</strong><small>${esc(ch.id)}</small><p>${ch.subscribers===null?'Subscribers hidden':Number(ch.subscribers||0).toLocaleString('en-IN')+' subscribers'} · ${Number(ch.views||0).toLocaleString('en-IN')} views · ${Number(ch.videoCount||0).toLocaleString('en-IN')} videos</p></div></div>`:'<p class="backend-help">Connect your channel to show its statistics on your dashboard. Vyro requests read-only YouTube access.</p>'}
<div class="acts"><button class="btn" onclick="VyroBackend.connectYouTube()">${ch?'Reconnect channel':'Connect YouTube channel'}</button>${ch?'<button class="btn ghost" onclick="VyroBackend.disconnectYouTube()">Disconnect</button>':''}</div>
</div></section>
<section class="panel"><header><h3>Your data</h3></header><div class="pad"><p>Keep a backup or reset your workspace.</p><div class="acts"><button class="btn ghost" onclick="sexp()">Export backup</button><button class="btn del" onclick="srst()">Reset workspace</button></div></div></section>
</div>`};
function scurrency(symbol){const input=$('#sc');if(input)input.value=symbol;document.querySelectorAll('.currency-choice').forEach(b=>{const on=b.dataset.currency===symbol;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on))})}
function ssave(){const name=$('#sn').value.trim().slice(0,20)||'Creator';S.settings.name=name;S.settings.cur=$('#sc').value||'₹';save();draw();toast('Settings saved')}
function sexp(){const a=document.createElement('a');const url=URL.createObjectURL(new Blob([JSON.stringify(S,null,2)],{type:'application/json'}));a.href=url;a.download='vyro-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function srst(){confirmUI('Reset your workspace?','This will erase all videos, tasks, deals and events saved on this device. This cannot be undone.','Reset workspace',()=>{S=seed();save();go('home');toast('Workspace reset')})}
document.addEventListener('vyro-auth-change',()=>{if(S?.view==='settings'||S?.view==='admin')if(typeof draw==='function')draw()});
