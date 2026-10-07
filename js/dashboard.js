window.renderDashboard = function(){
    const pending=state.tasks.filter(t=>!t.completed).slice(0,4);
    return `
        <div class="dashboard-layout animate-fade-in"><section class="dashboard-hero"><div><span class="dashboard-eyebrow">✦ CREATOR WORKSPACE</span><h1>Your creator command center<span>.</span></h1><p>Plan content, track performance and keep every deal moving.</p></div><div class="dashboard-hero-actions"><button type="button" onclick="openNewVideoModal()" class="hero-primary"><i class="fa-solid fa-plus"></i> New Video</button><button type="button" onclick="navigate('calendar')" class="hero-secondary"><i class="fa-regular fa-calendar"></i> Calendar</button></div></section>
            <div class="stats-grid">
                ${[
                    {label:'Total Views',value:'8.4M',icon:'fa-eye',color:'text-blue-500',bg:'bg-blue-50'},
                    {label:'Subscribers',value:'452K',icon:'fa-users',color:'text-indigo-500',bg:'bg-indigo-50'},
                    {label:'Est. Revenue',value:'$12,450',icon:'fa-dollar-sign',color:'text-emerald-500',bg:'bg-emerald-50'},
                    {label:'Active Deals',value:String(state.brands.filter(b=>b.status!=='Completed').length),icon:'fa-handshake',color:'text-purple-500',bg:'bg-purple-50'}
                ].map(stat=>`
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon-wrapper ${stat.bg} ${stat.color}"><i class="fa-solid ${stat.icon}"></i></div>
                            <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <h3 class="text-slate-500 text-sm font-medium">${stat.label}</h3>
                        <div class="text-3xl font-bold mt-1 text-slate-800">${stat.value}</div>
                    </div>`).join('')}
            </div>

            <div class="dashboard-content-grid">
                <section class="dashboard-panel">
                    <div class="flex items-center justify-between mb-5">
                        <div><h3 class="text-lg font-bold text-slate-800">Recent Videos</h3><p class="text-sm text-slate-500 mt-1">Your latest content</p></div>
                        <button onclick="navigate('videos')" class="text-sm font-semibold text-midnight-600 hover:text-midnight-800">View all <i class="fa-solid fa-arrow-right ml-1"></i></button>
                    </div>
                    <div class="flex flex-col gap-2">
                        ${state.videos.slice(0,4).map(video=>`
                            <div class="recent-video-item" onclick="openVideoPipelineModal(${video.id})">
                                <div class="recent-thumb w-24 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                    ${video.thumb?`<img src="${video.thumb}" class="w-full h-full object-cover" alt="">`:'<div class="w-full h-full flex items-center justify-center text-slate-400"><i class="fa-solid fa-video"></i></div>'}
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h4 class="font-semibold text-sm text-slate-800 truncate">${escapeHTML(video.title)}</h4>
                                    <span class="text-xs text-slate-500">${escapeHTML(video.status)}</span>
                                </div>
                                <i class="fa-solid fa-chevron-right text-xs text-slate-300"></i>
                            </div>`).join('')}
                    </div>
                </section>

                <section class="dashboard-panel">
                    <div class="flex items-center justify-between mb-5">
                        <div><h3 class="text-lg font-bold text-slate-800">Priority Tasks</h3><p class="text-sm text-slate-500 mt-1">What needs attention</p></div>
                        <button onclick="navigate('tasks')" class="w-8 h-8 rounded-lg bg-midnight-50 text-midnight-700 hover:bg-midnight-100" aria-label="Open tasks"><i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                    <div class="space-y-2">
                        ${pending.length?pending.map(task=>`
                            <button onclick="toggleTask(${task.id})" class="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-left">
                                <span class="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0"></span>
                                <span class="text-sm font-medium text-slate-700 flex-1 truncate">${escapeHTML(task.title)}</span>
                                <span class="task-priority priority-${task.priority}">${task.priority}</span>
                            </button>`).join(''):'<div class="empty-state py-8">All caught up.</div>'}
                    </div>
                </section>
            </div>
        </div>`;
}