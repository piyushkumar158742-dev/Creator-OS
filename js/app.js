const STORAGE_KEY = 'vyro_creator_os_state';

const defaultState = {
    currentView: 'dashboard',
    videos: [
        { id:1,title:"I Spent 50 Hours In VR",status:"Editing",views:"1.2M",thumb:"https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80" },
        { id:2,title:"The Truth About Tech in 2026",status:"Script",views:"-",thumb:"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80" },
        { id:3,title:"My $10,000 Studio Tour",status:"Idea",views:"-",thumb:null }
    ],
    tasks:[
        {id:1,title:"Review sponsor contract",completed:false,priority:"high"},
        {id:2,title:"Record B-Roll for VR video",completed:true,priority:"medium"},
        {id:3,title:"Send thumbnail drafts to designer",completed:false,priority:"low"}
    ],
    brands:[
        {id:1,name:"TechCorp",status:"Negotiating",amount:"$5,000",logo:"fa-laptop"},
        {id:2,name:"VPN Secure",status:"Active",amount:"$3,500",logo:"fa-shield-halved"},
        {id:3,name:"EnergyDrink",status:"Completed",amount:"$2,000",logo:"fa-bolt"}
    ],
    events:[
        {id:1,title:"Publish VR Video",date:"2026-10-12",time:"10:00 AM",type:"video"},
        {id:2,title:"TechCorp Sponsor Call",date:"2026-10-18",time:"2:00 PM",type:"brand"}
    ],
    settings:{creatorName:"Awesome Creator"},
    pipelineSteps:["Idea","Script","Recording","Editing","Thumbnail","Published"]
};

let state = loadState();

function loadState(){
    try{
        const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));
        if(!saved) return structuredClone(defaultState);
        return {
            ...structuredClone(defaultState),
            ...saved,
            videos:saved.videos||defaultState.videos,
            tasks:saved.tasks||defaultState.tasks,
            brands:saved.brands||defaultState.brands,
            events:saved.events||defaultState.events,
            settings:{...defaultState.settings,...(saved.settings||{})}
        };
    }catch(error){
        console.warn('Could not load saved workspace state:',error);
        return structuredClone(defaultState);
    }
}

window.persistState = function(){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(error){console.warn('Could not save workspace state:',error);}
}

window.initApp=function(){try{navigate(state.currentView||'dashboard',false);}catch(error){showErrorBoundary(error);}}

window.showErrorBoundary = function(error){
    console.error('Vyro Critical Error:',error);
    document.getElementById('error-boundary').classList.remove('hidden');
    document.getElementById('error-message').textContent=error?.message||'A critical error occurred.';
}

window.escapeHTML = function(value=''){
    return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
}

window.openCustomModal = function(title,contentHTML){
    const modal=document.getElementById('global-modal');
    const content=document.getElementById('modal-content');
    content.innerHTML=`
        <div class="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 class="text-lg font-bold text-slate-900">${escapeHTML(title)}</h3>
            <button onclick="closeModal()" class="text-slate-400 hover:text-slate-700" aria-label="Close"><i class="fa-solid fa-xmark text-xl"></i></button>
        </div>
        <div class="p-5 sm:p-6 text-slate-600">${contentHTML}</div>`;
    modal.classList.remove('hidden');
    requestAnimationFrame(()=>content.classList.add('scale-100','opacity-100'));
}

window.closeModal = function(){
    const modal=document.getElementById('global-modal');
    const content=document.getElementById('modal-content');
    content.classList.remove('scale-100','opacity-100');
    content.classList.add('scale-95','opacity-0');
    setTimeout(()=>modal.classList.add('hidden'),180);
}

window.openNewVideoModal = function(){
    const gradients=PIPELINE_GRADIENTS||['linear-gradient(135deg,#4f46e5,#7c3aed)'];
    const emojis=PIPELINE_EMOJIS||['🎬'];
    const randomGradient=gradients[Math.floor(Math.random()*gradients.length)];
    const randomEmoji=emojis[Math.floor(Math.random()*emojis.length)];
    openCustomModal('Create New Video',`
        <form onsubmit="createVideo(event)" class="space-y-4">
            <div><label class="form-label">Video title</label><input name="title" required maxlength="120" class="form-input" placeholder="Enter your video title"></div>
            <div class="thumbnail-picker">
                <div id="new-video-thumb-preview" class="thumbnail-preview" style="background:${randomGradient}"><span class="pipeline-thumb-text">${randomEmoji}</span></div>
                <label class="form-label">Thumbnail</label>
                <input name="thumbnail" id="new-video-image" type="file" accept="image/*" class="form-input" onchange="previewVideoImage(event,'new-video-thumb-preview')">
                <p class="text-xs text-slate-400 mt-1">Upload an image or use the generated thumbnail.</p>
            </div>
            <div><label class="form-label">Idea / notes</label><textarea name="notes" class="form-input min-h-24" placeholder="Optional"></textarea></div>
            <div class="flex justify-end gap-2 pt-2"><button type="button" onclick="closeModal()" class="px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button><button type="submit" class="px-4 py-2 rounded-lg bg-midnight-600 text-white text-sm font-semibold">Create Video</button></div>
        </form>`);
}

window.createVideo=function(event){
    event.preventDefault();
    const data=new FormData(event.target);
    const title=String(data.get('title')||'').trim();
    const video={id:Date.now(),title,status:'Idea',views:'-',thumb:null,thumbGradient:document.getElementById('new-video-thumb-preview')?.style.background||'',thumbEmoji:document.querySelector('#new-video-thumb-preview .pipeline-thumb-text')?.textContent||'🎬',notes:String(data.get('notes')||'')};
    const file=document.getElementById('new-video-image')?.files?.[0];
    if(file){
        const reader=new FileReader();
        reader.onload=()=>{video.thumb=reader.result;video.thumbGradient=null;video.thumbEmoji=null;state.videos.unshift(video);persistState();closeModal();navigate('videos',false);};
        reader.readAsDataURL(file);
        return;
    }
    state.videos.unshift(video);
    persistState();closeModal();navigate('videos',false);
};

window.toggleTask=function(id){
    const task=state.tasks.find(t=>t.id===id);
    if(!task)return;
    task.completed=!task.completed;
    persistState();
    if(state.currentView==='tasks') navigate('tasks',false); else renderDashboardIntoContainer();
};

window.addTask=function(event){
    event.preventDefault();
    const data=new FormData(event.target);
    state.tasks.push({id:Date.now(),title:data.get('title').trim(),completed:false,priority:data.get('priority')});
    persistState(); closeModal(); navigate('tasks',false);
};

window.showNotifications=function(){
    const pending=state.tasks.filter(t=>!t.completed).length;
    openCustomModal('Notifications',`
        <div class="space-y-3">
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-100"><b>${pending} task${pending===1?'':'s'} pending</b><p class="text-sm text-slate-500 mt-1">Review your To-Do list for the next action.</p></div>
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-100"><b>Creator OS is running locally</b><p class="text-sm text-slate-500 mt-1">Connect Firebase and YouTube later to replace demo data with your real workspace.</p></div>
        </div>`);
};

window.renderDashboardIntoContainer = function(){
    const container=document.getElementById('view-container');
    if(container && state.currentView==='dashboard') container.innerHTML=renderDashboard();
}

window.addEventListener('resize',()=>{if(window.innerWidth>900)closeMobileNav();});
document.addEventListener('DOMContentLoaded',initApp);

// Keep shared application functions available to HTML onclick handlers.
window.__VYRO_READY__ = true;



window.toggleGlobalTheme=function(){
 const dark=!document.documentElement.classList.contains('theme-dark');
 document.documentElement.classList.toggle('theme-dark',dark);
 document.body.classList.toggle('theme-dark',dark);
 localStorage.setItem('vyro-theme',dark?'dark':'light');
 const btn=document.querySelector('[aria-label="Toggle theme"]');
 if(btn)btn.innerHTML=dark?'<i class="fa-solid fa-sun"></i>':'<i class="fa-solid fa-moon"></i>';
};
(function(){
 const dark=localStorage.getItem('vyro-theme')==='dark';
 document.documentElement.classList.toggle('theme-dark',dark);
 document.body.classList.toggle('theme-dark',dark);
 document.addEventListener('DOMContentLoaded',()=>{
   const btn=document.querySelector('[aria-label="Toggle theme"]');
   if(btn)btn.innerHTML=dark?'<i class="fa-solid fa-sun"></i>':'<i class="fa-solid fa-moon"></i>';
 });
})();
