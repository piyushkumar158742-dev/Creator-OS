/* Vyro backend: Firebase Auth + Firestore sync, plus read-only YouTube channel stats.
   Firebase web config and OAuth client IDs are public identifiers, not server secrets. */
(function(){
'use strict';
const CFG='vyro_backend_config_v1';
let auth=null,db=null,user=null,saveTimer=null,googleTokenClient=null,ready=false;
const $=s=>document.querySelector(s);
const say=m=>{if(typeof toast==='function')toast(m);else alert(m)};
const DEFAULT_CFG={firebaseApiKey:'AIzaSyCoiNZ0WtsxrC-rHX-xGEkQkWIurnj5J4k',firebaseAuthDomain:'vyro-cd2fd.firebaseapp.com',firebaseProjectId:'vyro-cd2fd',firebaseAppId:'1:574510502743:web:947b8e4e768de1025ea412'};
const cfg=()=>{try{return {...DEFAULT_CFG,...JSON.parse(localStorage.getItem(CFG)||'{}')}}catch(e){return {...DEFAULT_CFG}}};
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
    try{const ref=db.collection('users').doc(user.uid).collection('workspace').doc('main');const snap=await ref.get();if(snap.exists&&window.S&&typeof save==='function'){const cloud=snap.data().state;if(cloud&&typeof cloud==='object'){const requestedView=new URLSearchParams(window.location.search).get('admin')==='1'?'admin':null;S={...seed(),...cloud,settings:{...seed().settings,...cloud.settings}};if(requestedView)S.view=requestedView;if(typeof load==='function'&&Array.isArray(S.settings.pipelineStages))ST=S.settings.pipelineStages.slice();save();if(typeof draw==='function')draw()}}else if(window.S)queueSync(window.S);say('Signed in. Workspace sync is ready.')}catch(e){console.error(e);say('Signed in, but workspace sync failed. Check Firestore setup and rules.')}
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
async function youtubeRequest(path,token,key){
 const res=await fetch('https://www.googleapis.com/youtube/v3/'+path+(path.includes('?')?'&':'?')+'key='+encodeURIComponent(key),{headers:{Authorization:'Bearer '+token}});
 let data={};try{data=await res.json()}catch(e){}
 if(!res.ok)throw new Error(data.error?.message||'YouTube API request failed ('+res.status+').');
 return data;
}
async function syncChannelVideos(channel,token,key){
 const uploads=channel.contentDetails?.relatedPlaylists?.uploads;
 if(!uploads)throw new Error('YouTube did not return an uploads playlist for this channel.');
 const items=[];let pageToken='';
 // Import the 200 most recent uploads to keep first sync fast and within API quotas.
 for(let page=0;page<4;page++){
  const q=new URLSearchParams({part:'snippet,contentDetails',playlistId:uploads,maxResults:'50'});
  if(pageToken)q.set('pageToken',pageToken);
  const data=await youtubeRequest('playlistItems?'+q.toString(),token,key);
  items.push(...(data.items||[]));pageToken=data.nextPageToken||'';
  if(!pageToken)break;
 }
 const ids=items.map(x=>x.contentDetails?.videoId||x.snippet?.resourceId?.videoId).filter(Boolean);
 const stats={};
 for(let i=0;i<ids.length;i+=50){
  const q=new URLSearchParams({part:'statistics,snippet',id:ids.slice(i,i+50).join(',')});
  const data=await youtubeRequest('videos?'+q.toString(),token,key);
  (data.items||[]).forEach(v=>{stats[v.id]=v.statistics||{}});
 }
 const stages=Array.isArray(ST)&&ST.length?ST:['Idea','Script','Recording','Editing','Thumbnail','Published'];
 const published=stages.includes('Published')?'Published':stages[stages.length-1];
 return items.map(item=>{
  const sn=item.snippet||{},id=item.contentDetails?.videoId||sn.resourceId?.videoId;
  if(!id)return null;
  const stat=stats[id]||{};
  return {id:Date.now()*1000+Math.floor(Math.random()*100000),youtubeVideoId:id,title:sn.title||'Untitled YouTube video',status:published,views:String(stat.viewCount||'0'),notes:'Imported from YouTube · '+(sn.publishedAt?new Date(sn.publishedAt).toLocaleDateString():'Publication date unavailable'),thumb:sn.thumbnails?.maxres?.url||sn.thumbnails?.high?.url||sn.thumbnails?.medium?.url||sn.thumbnails?.default?.url||'',youtubeUrl:'https://www.youtube.com/watch?v='+id,publishedAt:sn.publishedAt||''};
 }).filter(Boolean);
}
function connectYouTube(){
 const c=cfg();if(!c.youtubeClientId||!c.youtubeApiKey){say('Add your YouTube OAuth Client ID and API key in Settings first.');return}
 if(!window.google?.accounts?.oauth2){say('Google authorization did not load. Check your connection and reload.');return}
 googleTokenClient=google.accounts.oauth2.initTokenClient({client_id:c.youtubeClientId,scope:'https://www.googleapis.com/auth/youtube.readonly',callback:async response=>{
  if(response.error){say('YouTube authorization was not completed.');return}
  try{
   say('Connecting YouTube and syncing your latest videos…');
   const data=await youtubeRequest('channels?part=snippet,statistics,contentDetails&mine=true',response.access_token,c.youtubeApiKey);
   if(!data.items?.length)throw new Error('No YouTube channel was returned for this Google account.');
   const ch=data.items[0];
   const imported=await syncChannelVideos(ch,response.access_token,c.youtubeApiKey);
   // Replace starter/demo workspace content with the connected channel's real videos.
   S.settings.youtubeChannel={id:ch.id,title:ch.snippet.title,thumbnail:ch.snippet.thumbnails?.default?.url||'',subscribers:ch.statistics.hiddenSubscriberCount?null:Number(ch.statistics.subscriberCount||0),views:Number(ch.statistics.viewCount||0),videoCount:Number(ch.statistics.videoCount||0),connectedAt:new Date().toISOString(),lastSyncedAt:new Date().toISOString(),syncedVideoCount:imported.length};
   S.videos=imported;
   S.tasks=[];S.brands=[];S.events=[];
   if(typeof save==='function'&&!save())throw new Error('Your browser could not save the synced workspace. Free up storage and try again.');
   if(typeof draw==='function')draw();
   say('YouTube connected. Imported '+imported.length+' videos into Pipeline; cleared demo tasks, deals, and calendar events.');
  }catch(e){console.error(e);say(e.message||'Could not sync YouTube data. Check API access, key restrictions, and quota.')}
 }});
 googleTokenClient.requestAccessToken({prompt:'consent'});
}
function disconnectYouTube(){
 if(!window.S?.settings){say('Workspace is not ready yet. Refresh and try again.');return}
 try{
  const previous=S.settings.youtubeChannel;
  if(!previous){say('No YouTube channel is connected.');return}
  delete S.settings.youtubeChannel;
  // Remove only videos imported from YouTube; keep videos created manually in Vyro.
  S.videos=(S.videos||[]).filter(v=>!v.youtubeVideoId);
  if(typeof save==='function'&&!save()){
   S.settings.youtubeChannel=previous;
   say('Could not disconnect because the workspace could not be saved. Export a backup or free browser storage, then try again.');
   return;
  }
  if(typeof draw==='function')draw();
  say('YouTube channel disconnected from Vyro. Your manually created videos and Google workspace sign-in are unchanged.');
 }catch(e){
  console.error('YouTube disconnect failed:',e);
  say('Could not disconnect the channel: '+(e.message||'unexpected error'));
 }
}
function saveSettingsFromForm(){
 const c=cfg();
 c.firebaseApiKey=$('#fb-api-key')?.value.trim()||'';c.firebaseAuthDomain=$('#fb-auth-domain')?.value.trim()||'';c.firebaseProjectId=$('#fb-project-id')?.value.trim()||'';c.firebaseAppId=$('#fb-app-id')?.value.trim()||'';c.youtubeClientId=$('#yt-client-id')?.value.trim()||'';c.youtubeApiKey=$('#yt-api-key')?.value.trim()||'';
 saveCfg(c);const result=configure();if(result.ok)say('Connection settings saved. You can now sign in.');else say('Settings saved on this device. '+result.reason);
}
function status(){return {configured:ready,user,config:cfg()}}
window.VyroBackend={configure,queueSync,signGoogle,signEmail,signOut,connectYouTube,disconnectYouTube,saveSettingsFromForm,status,user:null};
document.addEventListener('DOMContentLoaded',()=>{const x=configure();if(!x.ok)console.info('Vyro backend not configured yet:',x.reason)});
})();