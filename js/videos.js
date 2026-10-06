window.renderVideos = function(){
    return `
        <div class="video-pipeline-container animate-fade-in">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div><h3 class="text-lg font-bold text-slate-800">Videos Pipeline</h3><p class="text-sm text-slate-500">Manage your content pipeline and move videos through each stage.</p></div>
                <button onclick="openNewVideoModal()" class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"><i class="fa-solid fa-plus mr-2"></i>New Video</button>
            </div>
            <div class="video-grid">
                ${state.videos.map(video=>`
                    <article class="video-card" onclick="openVideoPipelineModal(${video.id})">
                        <div class="video-thumb-area">
                            ${video.thumb?`<img src="${video.thumb}" alt="">`:'<i class="fa-solid fa-film text-3xl text-slate-300"></i>'}
                            <div class="status-badge">${escapeHTML(video.status)}</div>
                        </div>
                        <div class="video-details">
                            <h4 class="video-title">${escapeHTML(video.title)}</h4>
                            <div class="video-metrics"><span><i class="fa-solid fa-chart-simple mr-1"></i> ${video.views!=='-'?escapeHTML(video.views):'N/A'}</span><span class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><i class="fa-solid fa-arrow-right"></i></span></div>
                        </div>
                    </article>`).join('')}
            </div>
        </div>`;
}

window.openVideoPipelineModal=function(videoId){
    const video=state.videos.find(v=>v.id===videoId);
    if(!video)return;
    const currentIndex=Math.max(0,state.pipelineSteps.indexOf(video.status));
    openCustomModal('Edit Video',`
        <div class="space-y-5">
            <div><label class="form-label">Title</label><input id="edit-video-title" class="form-input" value="${escapeHTML(video.title)}"></div>
            <div><label class="form-label">Pipeline stage</label><select id="edit-video-status" class="form-input">${state.pipelineSteps.map((step,i)=>`<option ${i===currentIndex?'selected':''}>${escapeHTML(step)}</option>`).join('')}</select></div>
            <div><label class="form-label">Script / notes</label><textarea id="edit-video-notes" class="form-input min-h-28">${escapeHTML(video.notes||'')}</textarea></div>
            <div class="flex justify-between gap-2 pt-2">
                <button onclick="deleteVideo(${video.id})" class="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50">Delete</button>
                <div class="flex gap-2"><button onclick="closeModal()" class="px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button><button onclick="saveVideoEdit(${video.id})" class="px-4 py-2 rounded-lg bg-midnight-600 text-white text-sm font-semibold">Save</button></div>
            </div>
        </div>`);
};

window.saveVideoEdit=function(id){
    const video=state.videos.find(v=>v.id===id);
    if(!video)return;
    video.title=document.getElementById('edit-video-title').value.trim()||video.title;
    video.status=document.getElementById('edit-video-status').value;
    video.notes=document.getElementById('edit-video-notes').value;
    persistState();closeModal();navigate('videos',false);
};

window.deleteVideo=function(id){
    if(!confirm('Delete this video?'))return;
    state.videos=state.videos.filter(v=>v.id!==id);
    persistState();closeModal();navigate('videos',false);
};