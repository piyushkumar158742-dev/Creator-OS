/* Vyro backend: Firebase Auth + Firestore sync, plus read-only YouTube channel stats.
   Firebase web config and OAuth client IDs are public identifiers, not server secrets. */
(function(){
'use strict';
const CFG='vyro_backend_config_v1';
let auth=null,db=null,user=null,saveTimer=null,googleTokenClient=null,ready=false;
const $=s=>document.querySelector(s);
const say=m=>{if(typeof toast==='function')toast(m);else alert(m)};
const cfg=()=>{try{return JSON.parse(localStorage.getItem(CFG)||'{}')}catch(e){return {}}};
function saveCfg(c){localStorage.setItem(CFG,JSON.stringify(c))}
function firebaseAvailable(){return !!(window.firebase&&firebase.initializeApp&&firebase.auth&&firebase.firestore)}
function configure(){
 const c=cfg();
 if(!c.firebaseApiKey||!c.firebaseProjectId||!c.firebaseAppId)return {ok:false,reason:'Add your Firebase web config in Settings first.'};
 if(ready&&auth&&db)return {ok:true};
 if(!firebaseAvailable())return {ok:false,reason:'Firebase SDK did not load. Check your internet connection and reload.'};
 try{
  let app=firebase.apps.find(a=>a.name==='vyro-app');
  if(!app)app=firebase.initializeApp({apiKey:c.firebaseApiKey,authDomain:c.firebaseAuthDomain||c.firebaseProjectId+'.firebaseapp.com',projectId:c.firebaseProjectId,appId:c.firebaseAppId},'vyro-app');
  auth=app.auth();db=app.firestore();ready=true;
  auth.onAuthStateChanged(async u=>{
   user=u||null;
   window.VyroBackend.user=user;
   if(user){
    try{const ref=db.collection('users').doc(user.uid).collection('workspace').doc('main');const snap=await ref.get();if(snap.exists&&window.S&&typeof save==='function'){const cloud=snap.data().state;if(cloud&&typeof cloud==='object'){S={...seed(),...cloud,settings:{...seed().settings,...cloud.settings}};if(typeof load==='function'&&Array.isArray(S.settings.pipelineStages))ST=S.settings.pipelineStages.slice();save();if(typeof draw==='function')draw()}}else if(window.S)queueSync(window.S);say('Signed in. Workspace sync is ready.')}catch(e){console.error(e);say('Signed in, but workspace sync failed. Check Firestore setup and rules.')}
   }
   document.dispatchEvent(new CustomEvent('vyro-auth-change',{detail:{user}}));
  });
  return {ok:true};
 }catch(e){console.error(e);return {ok:false,reason:e.message||'Firebase setup failed.'}}
}
function queueSync(state){if(!user||!db||!state)return;clearTimeout(saveTimer);saveTimer=setTimeout(async()=>{try{await db.collection('users').doc(user.uid).collection('workspace').doc('main').set({state:JSON.parse(JSON.stringify(state)),updatedAt:firebase.firestore.FieldValue.serverTimestamp()})}catch(e){console.error('Vyro cloud sync:',e);say('Cloud save failed. Check Firestore rules; this device still has a local copy.')}},700)}
async function signGoogle(){const x=configure();if(!x.ok){say(x.reason);return}try{await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())}catch(e){console.error(e);say(authError(e))}}
async function signEmail(mode){const x=configure();if(!x.ok){say(x.reason);return}const email=($('#backend-email')?.value||'').trim(),pass=$('#backend-password')?.value||'';if(!email||!pass){say('Enter your email and password.');return}try{if(mode==='create')await auth.createUserWithEmailAndPassword(email,pass);else await auth.signInWithEmailAndPassword(email,pass)}catch(e){say(authError(e))}}
function authError(e){return ({'auth/unauthorized-domain':'Add the Creator OS GitHub Pages URL to Firebase Authentication → Settings → Authorized domains.','auth/operation-not-allowed':'Enable this sign-in method in Firebase Authentication → Sign-in method.','auth/popup-blocked':'Allow pop-ups for Creator OS and try again.','auth/invalid-credential':'Email/password is incorrect, or this account does not exist.'})[e.code]||e.message||'Sign-in failed.'}
async function signOut(){if(auth)await auth.signOut();say('Signed out of Creator OS cloud sync.')}
function connectYouTube(){
 const c=cfg();if(!c.youtubeClientId||!c.youtubeApiKey){say('Add your YouTube OAuth Client ID and API key in Settings first.');return}
 if(!window.google?.accounts?.oauth2){say('Google authorization did not load. Check your connection and reload.');return}
 googleTokenClient=google.accounts.oauth2.initTokenClient({client_id:c.youtubeClientId,scope:'https://www.googleapis.com/auth/youtube.readonly',callback:async response=>{
  if(response.error){say('YouTube authorization was not completed.');return}
  try{
   const res=await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&mine=true&key='+encodeURIComponent(c.youtubeApiKey),{headers:{Authorization:'Bearer '+response.access_token}});
   const data=await res.json();if(!res.ok||!data.items?.length)throw new Error(data.error?.message||'No YouTube channel was returned for this Google account.');
   const ch=data.items[0];S.settings.youtubeChannel={id:ch.id,title:ch.snippet.title,thumbnail:ch.snippet.thumbnails?.default?.url||'',subscribers:ch.statistics.hiddenSubscriberCount?null:Number(ch.statistics.subscriberCount||0),views:Number(ch.statistics.viewCount||0),videoCount:Number(ch.statistics.videoCount||0),connectedAt:new Date().toISOString()};
   if(typeof save==='function')save();if(typeof draw==='function')draw();say('YouTube channel connected. Stats are now available on your dashboard.');
  }catch(e){console.error(e);say(e.message||'Could not fetch YouTube channel data. Check API access and quota.')}
 }});
 googleTokenClient.requestAccessToken({prompt:'consent'});
}
function disconnectYouTube(){if(window.S?.settings){delete S.settings.youtubeChannel;save();draw();say('YouTube channel disconnected from this workspace.')} }
function saveSettingsFromForm(){
 const c=cfg();
 c.firebaseApiKey=$('#fb-api-key')?.value.trim()||'';c.firebaseAuthDomain=$('#fb-auth-domain')?.value.trim()||'';c.firebaseProjectId=$('#fb-project-id')?.value.trim()||'';c.firebaseAppId=$('#fb-app-id')?.value.trim()||'';c.youtubeClientId=$('#yt-client-id')?.value.trim()||'';c.youtubeApiKey=$('#yt-api-key')?.value.trim()||'';
 saveCfg(c);const result=configure();if(result.ok)say('Connection settings saved. You can now sign in.');else say('Settings saved on this device. '+result.reason);
}
function status(){return {configured:ready,user,config:cfg()}}
window.VyroBackend={configure,queueSync,signGoogle,signEmail,signOut,connectYouTube,disconnectYouTube,saveSettingsFromForm,status,user:null};
document.addEventListener('DOMContentLoaded',()=>{const x=configure();if(!x.ok)console.info('Vyro backend not configured yet:',x.reason)});
})();