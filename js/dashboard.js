window.renderDashboard = function(){
    const videos=state.videos||[];
    const tasks=state.tasks||[];
    const brands=state.brands||[];
    const events=state.events||[];
    const pending=tasks.filter(t=>!t.completed).slice(0,4);
    const activeDeals=brands.filter(b=>b.status!=='Completed').length;
    const pipeline=state.pipelineSteps||['Idea','Script','Recording','Editing','Thumbnail','Published'];
    const published=videos.filter(v=>v.status==='Published').length;
    const completion=videos.length?Math.round((published/videos.length)*100):0;
    const upcoming=events.slice(0,3);

    return `
    <div class="dashboard-v3 animate-fade-in">
        <section class="dash-welcome">
            <div>
                
                <h1>Dashboard</h1><span class="v3-date">October 2026</span>
                
            </div>
            
        </section>

        <section class="dash-metrics">
            <div class="metric-main"><span>Views</span><strong>8.4M</strong><small>↗ 12% <em>vs last 90 days</em></small></div>
            <div class="metric"><i class="fa-solid fa-users"></i><span>Subscribers</span><strong>452K</strong><small>+8.4%</small></div>
            <div class="metric"><i class="fa-solid fa-bolt"></i><span>In progress</span><strong>${videos.filter(v=>v.status!=='Published').length}</strong><small>${videos.length} total</small></div>
            <div class="metric"><i class="fa-solid fa-handshake"></i><span>Deals</span><strong>${activeDeals}</strong><small>${brands.length} brands</small></div>
        </section>

        <section class="dash-workspace">
            <div class="dash-left">
                <article class="dash-card growth-card">
                    <div class="dash-card-head"><div><h2>Views</h2></div><span class="range-pill">90d</span></div>
                    <div class="growth-number">8.4M <span>+12%</span></div>
                    <div class="growth-chart"><div class="growth-lines"><i></i><i></i><i></i><i></i></div><svg viewBox="0 0 760 220" preserveAspectRatio="none"><defs><linearGradient id="gfill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#6366f1" stop-opacity=".18"/><stop offset="1" stop-color="#6366f1" stop-opacity="0"/></linearGradient></defs><path d="M0 180 C50 165 70 175 115 140 S185 155 225 120 S290 135 330 98 S390 112 430 82 S500 110 540 65 S620 72 660 45 S720 55 760 20 L760 220 L0 220Z" fill="url(#gfill)"></path><path d="M0 180 C50 165 70 175 115 140 S185 155 225 120 S290 135 330 98 S390 112 430 82 S500 110 540 65 S620 72 660 45 S720 55 760 20" fill="none" stroke="#6366f1" stroke-width="4" stroke-linecap="round"></path></svg><div class="growth-axis"><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div></div>
                </article>

                <article class="dash-card pipeline-card-v2">
                    <div class="dash-card-head"><div><h2>Pipeline</h2></div><button type="button" onclick="navigate('videos')" class="dash-text-btn">View all</button></div>
                    <div class="stage-track">${pipeline.map((stage,i)=>{const count=videos.filter(v=>v.status===stage).length;return `<button type="button" onclick="navigate('videos')" class="stage-step"><span class="stage-index">${i+1}</span><strong>${escapeHTML(stage)}</strong><b>${count}</b></button>`}).join('')}</div>
                </article>
            </div>

            <aside class="dash-right">
                <article class="dash-card today-card">
                    <div class="dash-card-head"><div><h2>Today</h2></div><button type="button" onclick="navigate('tasks')" class="dash-icon-btn"><i class="fa-solid fa-arrow-right"></i></button></div>
                    <div class="focus-list">${pending.length?pending.map(t=>`<button type="button" onclick="toggleTask(${t.id})" class="focus-item"><span class="focus-check"></span><span>${escapeHTML(t.title)}</span><small>${escapeHTML(t.priority||'Normal')}</small></button>`).join(''):'<div class="empty-state py-8">Nothing urgent. Enjoy the day.</div>'}</div>
                    <button type="button" onclick="navigate('tasks')" class="focus-footer">View tasks <i class="fa-solid fa-arrow-right"></i></button>
                </article>
                <article class="dash-card quick-card">
                    
                    <h2>New video</h2>
                    
                    <button type="button" onclick="openNewVideoModal()" class="quick-btn"><i class="fa-solid fa-plus"></i> Create video</button>
                </article>
            </aside>
        </section>

        <section class="dash-bottom">
            <article class="dash-card list-card"><div class="dash-card-head"><div><h2>Recent videos</h2></div><button type="button" onclick="navigate('videos')" class="dash-text-btn">View all</button></div><div class="video-list-v2">${videos.slice(0,4).map(v=>`<button type="button" onclick="openVideoPipelineModal(${v.id})"><span class="video-mini-thumb">${v.thumb?`<img src="${v.thumb}" alt="">`:`<span>🎬</span>`}</span><span><strong>${escapeHTML(v.title)}</strong><small>${escapeHTML(v.status)}</small></span><i class="fa-solid fa-chevron-right"></i></button>`).join('')||'<div class="empty-state py-6">No videos yet.</div>'}</div></article>
            <article class="dash-card list-card"><div class="dash-card-head"><div><h2>Upcoming</h2></div><button type="button" onclick="navigate('calendar')" class="dash-text-btn">Calendar</button></div><div class="schedule-list">${upcoming.map(e=>`<button type="button" onclick="navigate('calendar')"><span class="schedule-date"><b>${escapeHTML(String(e.day||String(e.date||'').split('-')[2]||''))}</b><small>OCT</small></span><span><strong>${escapeHTML(e.title||'Event')}</strong><small>${escapeHTML(e.time||'Upcoming')}</small></span></button>`).join('')||'<div class="empty-state py-6">Your schedule is clear.</div>'}</div></article>
        </section>
    </div>`;
};
