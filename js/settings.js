'use strict';
V.settings=()=>{const bc=window.VyroBackend?.status?.()||{config:{}};const c=bc.config||{};const ch=S.settings.youtubeChannel;return `<div class="set backend-settings">
<section class="panel"><header><h3>Workspace</h3></header><div class="pad">
<label>Your name<input id="sn" value="${esc(S.settings.name||'Creator')}" maxlength="20" oninput="this.value=this.value.slice(0,20)" autocomplete="nickname"></label>
<fieldset class="currency-picker"><legend>Currency</legend><div class="currency-options">
${[['₹','INR'],['$','USD'],['€','EUR'],['£','GBP']].map(([symbol,code])=>`<button type="button" class="currency-choice ${(S.settings.cur||'₹')===symbol?'selected':''}" data-currency="${symbol}" aria-pressed="${(S.settings.cur||'₹')===symbol}" onclick="scurrency('${symbol}')"><strong>${symbol}</strong><span>${code}</span></button>`).join('')}
</div><input type="hidden" id="sc" value="${S.settings.cur||'₹'}"></fieldset>
<div class="acts"><button class="btn" onclick="ssave()">Save settings</button></div>
</div></section>
<section class="panel"><header><h3>Connect Firebase</h3><span class="tag ${bc.user?'low':'medium'}">${bc.user?'Connected':'Setup required'}</span></header><div class="pad">
<p class="backend-help">Firebase stores your workspace online and syncs it across devices. Start with the free Spark plan. These values come from your own Firebase project; Creator OS does not create a project for you.</p>
<div class="backend-grid">
<label>Web API key<input id="fb-api-key" value="${esc(c.firebaseApiKey||'')}" placeholder="AIza..." autocomplete="off"></label>
<label>Auth domain<input id="fb-auth-domain" value="${esc(c.firebaseAuthDomain||'')}" placeholder="your-project.firebaseapp.com" autocomplete="off"></label>
<label>Project ID<input id="fb-project-id" value="${esc(c.firebaseProjectId||'')}" placeholder="your-project-id" autocomplete="off"></label>
<label>App ID<input id="fb-app-id" value="${esc(c.firebaseAppId||'')}" placeholder="1:123456:web:abc..." autocomplete="off"></label>
</div>
<div class="acts"><button class="btn" onclick="VyroBackend.saveSettingsFromForm()">Save connection settings</button></div>
<div class="backend-auth">
<p id="backend-auth-status">${bc.user?'Signed in as '+esc(bc.user.email||bc.user.displayName||'Google account'):'Sign in to enable private cloud sync.'}</p>
<div class="acts">${bc.user?'<button class="btn ghost" onclick="VyroBackend.signOut()">Sign out</button>':'<button class="btn" onclick="VyroBackend.signGoogle()">Continue with Google</button>'}</div>
<div class="backend-grid auth-fields"><label>Email<input id="backend-email" type="email" placeholder="you@example.com" autocomplete="email"></label><label>Password<input id="backend-password" type="password" minlength="6" placeholder="At least 6 characters" autocomplete="current-password"></label></div>
<div class="acts"><button class="btn ghost" onclick="VyroBackend.signEmail('login')">Sign in with email</button><button class="btn ghost" onclick="VyroBackend.signEmail('create')">Create account</button></div>
</div>
<details class="backend-instructions"><summary>How to set up Firebase for free</summary><ol><li>Open <a href="https://console.firebase.google.com/" target="_blank" rel="noopener">Firebase Console</a> and create a project on the Spark plan.</li><li>Add a Web app in Project settings and paste its apiKey, authDomain, projectId and appId above.</li><li>In Authentication → Sign-in method, enable Google and Email/Password.</li><li>In Authentication → Settings → Authorized domains, add <code>piyushkumar158742-dev.github.io</code>.</li><li>Create a Cloud Firestore database in test/production mode, then apply the secure rules shown in the repository file <code>firestore.rules</code>.</li></ol></details>
</div></section>
<section class="panel"><header><h3>YouTube channel</h3><span class="tag ${ch?'low':'medium'}">${ch?'Connected':'Not connected'}</span></header><div class="pad">
${ch?`<div class="channel-card">${ch.thumbnail?`<img src="${esc(ch.thumbnail)}" alt="">`:''}<div><strong>${esc(ch.title)}</strong><small>${esc(ch.id)}</small><p>${ch.subscribers===null?'Subscribers hidden':Number(ch.subscribers||0).toLocaleString('en-IN')+' subscribers'} · ${Number(ch.views||0).toLocaleString('en-IN')} views · ${Number(ch.videoCount||0).toLocaleString('en-IN')} videos</p></div></div>`:'<p class="backend-help">Connect your channel to show real channel statistics on your dashboard. This requests read-only YouTube access and does not upload or change videos.</p>'}
<div class="backend-grid"><label>YouTube OAuth Client ID<input id="yt-client-id" value="${esc(c.youtubeClientId||'')}" placeholder="...apps.googleusercontent.com" autocomplete="off"></label><label>YouTube API key<input id="yt-api-key" value="${esc(c.youtubeApiKey||'')}" placeholder="AIza..." autocomplete="off"></label></div>
<div class="acts"><button class="btn ghost" onclick="VyroBackend.saveSettingsFromForm()">Save connection settings</button><button class="btn" onclick="VyroBackend.connectYouTube()">${ch?'Reconnect channel':'Connect YouTube channel'}</button>${ch?'<button class="btn del" onclick="VyroBackend.disconnectYouTube()">Disconnect</button>':''}</div>
<details class="backend-instructions"><summary>How to set up YouTube access for free</summary><ol><li>Open <a href="https://console.cloud.google.com/" target="_blank" rel="noopener">Google Cloud Console</a> and create/select a project.</li><li>Enable <strong>YouTube Data API v3</strong> in APIs &amp; Services → Library.</li><li>Configure the OAuth consent screen and create an OAuth Client ID of type <strong>Web application</strong>.</li><li>Add this exact origin under Authorized JavaScript origins: <code>https://piyushkumar158742-dev.github.io</code>.</li><li>Create an API key. Restrict it to YouTube Data API v3 and restrict the website referrer to <code>https://piyushkumar158742-dev.github.io/*</code>.</li><li>Paste the OAuth Client ID and API key above. For personal testing, add your Google account as a test user if the consent screen is in Testing.</li></ol></details>
</div></section>
<section class="panel"><header><h3>Your data</h3></header><div class="pad"><p>Export a backup of this workspace or reset local data.</p><div class="acts"><button class="btn ghost" onclick="sexp()">Export backup</button><button class="btn del" onclick="srst()">Reset workspace</button></div></div></section>
</div>`};
function scurrency(symbol){const input=$('#sc');if(input)input.value=symbol;document.querySelectorAll('.currency-choice').forEach(b=>{const on=b.dataset.currency===symbol;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on))})}
function ssave(){const name=$('#sn').value.trim().slice(0,20)||'Creator';S.settings.name=name;S.settings.cur=$('#sc').value||'₹';save();draw();toast('Settings saved')}
function sexp(){const a=document.createElement('a');const url=URL.createObjectURL(new Blob([JSON.stringify(S,null,2)],{type:'application/json'}));a.href=url;a.download='vyro-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function srst(){confirmUI('Reset your workspace?','This will erase all videos, tasks, deals and events saved on this device. This cannot be undone.','Reset workspace',()=>{S=seed();save();go('home');toast('Workspace reset')})}
document.addEventListener('vyro-auth-change',()=>{if(S?.view==='settings'&&typeof draw==='function')draw()});
