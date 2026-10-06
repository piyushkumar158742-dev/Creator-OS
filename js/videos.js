function renderVideos() {
    return `
        <div class="video-pipeline-container animate-fade-in">
            <div class="flex items-center justify-between mb-6">
                <p class="text-slate-500">Manage your content pipeline.</p>
                <button class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium">New Video</button>
            </div>
            <div class="video-grid">
                ${state.videos.map(video => `
                    <div class="video-card" onclick="openVideoPipelineModal(${video.id})">
                        <div class="video-thumb-area">
                            ${video.thumb ? `<img src="${video.thumb}">` : `<i class="fa-solid fa-film text-3xl text-slate-300"></i>`}
                            <div class="status-badge">${video.status}</div>
                        </div>
                        <div class="video-details">
                            <h4 class="video-title">${video.title}</h4>
                            <div class="video-metrics">
                                <span><i class="fa-solid fa-chart-simple mr-1"></i> ${video.views !== '-' ? video.views : 'N/A'}</span>
                                <i class="fa-solid fa-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
