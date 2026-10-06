const PIPELINE_GRADIENTS=['linear-gradient(135deg,#4f46e5,#7c3aed)','linear-gradient(135deg,#0f766e,#14b8a6)','linear-gradient(135deg,#be123c,#f97316)','linear-gradient(135deg,#1d4ed8,#06b6d4)','linear-gradient(135deg,#7c2d12,#eab308)','linear-gradient(135deg,#334155,#64748b)'];
const PIPELINE_EMOJIS=['🎬','🚀','🎥','⚡','🔥','✨','🎯','💡','🧠','🎮'];

function videoThumbHTML(video, small=false){
    if(video.thumb) return `<img src="${video.thumb}" alt="">`;
    const gradient=video.thumbGradient || PIPELINE_GRADIENTS[Math.abs(Number(video.id)||0)%PIPELINE_GRADIENTS.length];
    const emoji=video.thumbEmoji || PIPELINE_EMOJIS[Math.abs(Number(video.id)||0)%PIPELINE_EMOJIS.length];
    return `<div class="w-full h-full flex items-center justify-center" style="background:${gradient}"><span class="pipeline-thumb-text">${emoji}</span></div>`;
}

window.renderVideos = function(){
    const stages=state.pipelineSteps||['Idea','Script','Recording','Editing','Thumbnail','Published'];
    return `
        <div class="video-pipeline-container animate-fade-in">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div><h3 class="text-lg font-bold text-slate-800">Videos Pipeline</h3><p class="text-sm text-slate-500">Move each video through your production workflow.</p></div>
                <button type="button" onclick="openNewVideoModal()" class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"><i class="fa-solid fa-plus mr-2"></i>New Video</button>
            </div>
            <div class="pipeline-board">
                ${stages.map((stage,index)=>{
                    const videos=state.videos.filter(v=>v.status===stage);
                    return `
                        <section class="pipeline-column" data-stage="${escapeHTML(stage)}" ondragover="allowPipelineDrop(event)" ondrop="dropPipelineVideo(event,'${escapeHTML(stage)}')">
                            <div class="pipeline-column-header flex items-center justify-between gap-2">
                                <div class="flex items-center gap-2 min-w-0"><span class="w-2.5 h-2.5 rounded-full bg-midnight-500 shrink-0"></span><h4 class="font-bold text-sm text-slate-800 truncate">${escapeHTML(stage)}</h4></div>
                                <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">${videos.length}</span>
                            </div>
                            <div class="pipeline-column-body">
                                ${videos.length ? videos.map(video=>`
                                    <article class="pipeline-card" draggable="true" ondragstart="dragPipelineVideo(event,${video.id})" onclick="openVideoPipelineModal(${video.id})">
                                        <div class="pipeline-thumb">${videoThumbHTML(video)}</div>
                                        <div class="pipeline-card-content">
                                            <div class="pipeline-card-title">${escapeHTML(video.title)}</div>
                                            <div class="text-xs text-slate-400 mt-1">${video.views && video.views!=='-' ? escapeHTML(video.views)+' views' : 'Not published yet'}</div>
                                            <div class="pipeline-card-actions" onclick="event.stopPropagation()">
                                                ${index>0?`<button type="button" class="pipeline-move-btn" onclick="moveVideoToStage(${video.id},${index-1})">← ${escapeHTML(stages[index-1])}</button>`:''}
                                                ${index<stages.length-1?`<button type="button" class="pipeline-move-btn" onclick="moveVideoToStage(${video.id},${index+1})">Next →</button>`:''}
                                            </div>
                                        </div>
                                    </article>`).join('') : '<div class="pipeline-empty">Drop a video here</div>'}
                            </div>
                        </section>`;
                }).join('')}
            </div>
        </div>`;
};

window.dragPipelineVideo=function(event,id){event.dataTransfer.setData('text/plain',String(id));event.currentTarget.classList.add('dragging');};
window.allowPipelineDrop=function(event){event.preventDefault();};
window.dropPipelineVideo=function(event,stage){
    event.preventDefault();
    const id=Number(event.dataTransfer.getData('text/plain'));
    moveVideoToStageByName(id,stage);
};
window.moveVideoToStage=function(id,index){
    const stage=(state.pipelineSteps||[])[index];
    if(stage) moveVideoToStageByName(id,stage);
};
window.moveVideoToStageByName=function(id,stage){
    const video=state.videos.find(v=>v.id===id);
    if(!video)return;
    video.status=stage;
    persistState();
    navigate('videos',false);
};

window.openVideoPipelineModal=function(videoId){
    const video=state.videos.find(v=>v.id===videoId);
    if(!video)return;
    const index=Math.max(0,(state.pipelineSteps||[]).indexOf(video.status));
    openCustomModal('Edit Video',`
        <div class="space-y-5">
            <div><label class="form-label">Title</label><input id="edit-video-title" class="form-input" value="${escapeHTML(video.title)}"></div>
            <div class="thumbnail-picker">
                <div id="edit-thumb-preview" class="thumbnail-preview">${videoThumbHTML(video)}</div>
                <label class="form-label">Thumbnail image</label>
                <input id="edit-video-image" type="file" accept="image/*" class="form-input" onchange="previewVideoImage(event,'edit-thumb-preview')">
                <p class="text-xs text-slate-400 mt-1">Upload an image or keep the generated thumbnail.</p>
            </div>
            <div><label class="form-label">Script / notes</label><textarea id="edit-video-notes" class="form-input min-h-28">${escapeHTML(video.notes||'')}</textarea></div>
            <div class="flex justify-between gap-2 pt-2">
                <button type="button" onclick="deleteVideo(${video.id})" class="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50">Delete</button>
                <div class="flex gap-2">
                    <button type="button" onclick="closeModal()" class="px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
                    ${index<(state.pipelineSteps||[]).length-1?`<button type="button" onclick="moveVideoToStage(${video.id},${index+1})" class="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold">Next Stage</button>`:''}
                    <button type="button" onclick="saveVideoEdit(${video.id})" class="px-4 py-2 rounded-lg bg-midnight-600 text-white text-sm font-semibold">Save</button>
                </div>
            </div>
        </div>`);
};

window.previewVideoImage=function(event,targetId){
    const file=event.target.files?.[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=()=>{const target=document.getElementById(targetId);if(target)target.innerHTML=`<img src="${reader.result}" alt="Thumbnail preview">`;};
    reader.readAsDataURL(file);
};

window.saveVideoEdit=function(id){
    const video=state.videos.find(v=>v.id===id);
    if(!video)return;
    video.title=document.getElementById('edit-video-title').value.trim()||video.title;
    video.notes=document.getElementById('edit-video-notes').value;
    const file=document.getElementById('edit-video-image')?.files?.[0];
    if(file){
        const reader=new FileReader();
        reader.onload=()=>{video.thumb=reader.result;video.thumbGradient=null;persistState();closeModal();navigate('videos',false);};
        reader.readAsDataURL(file);
        return;
    }
    persistState();closeModal();navigate('videos',false);
};

window.deleteVideo=function(id){
    if(!confirm('Delete this video?'))return;
    state.videos=state.videos.filter(v=>v.id!==id);
    persistState();closeModal();navigate('videos',false);
};