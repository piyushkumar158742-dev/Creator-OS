function renderDashboard() {
    return `
        <div class="dashboard-layout animate-fade-in text-slate-800">
            <div class="stats-grid">
                ${[
                    { label: 'Total Views', value: '8.4M', icon: 'fa-eye', color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Subscribers', value: '452K', icon: 'fa-users', color: 'text-indigo-500', bg: 'bg-indigo-50' },
                    { label: 'Est. Revenue', value: '$12,450', icon: 'fa-dollar-sign', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Active Deals', value: '3', icon: 'fa-handshake', color: 'text-purple-500', bg: 'bg-purple-50' }
                ].map(stat => `
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon-wrapper ${stat.bg}${stat.color}">
                                <i class="fa-solid ${stat.icon}"></i>
                            </div>
                            <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <h3 class="text-slate-500 text-sm font-medium">${stat.label}</h3>
                        <div class="text-3xl font-bold mt-1">${stat.value}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="content-grid">
                <div class="stat-card">
                    <h3 class="text-lg font-bold mb-6">Recent Videos</h3>
                    <div class="flex flex-col gap-2">
                        ${state.videos.slice(0,3).map(video => `
                            <div class="recent-video-item" onclick="navigate('videos')">
                                <div class="w-24 h-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                                    ${video.thumb ? `<img src="${video.thumb}" class="w-full h-full object-cover">` : `<div class="w-full h-full flex items-center justify-center text-slate-400"><i class="fa-solid fa-video"></i></div>`}
                                </div>
                                <div>
                                    <h4 class="font-semibold text-sm truncate">${video.title}</h4>
                                    <span class="text-xs text-slate-500">${video.status}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}
