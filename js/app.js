const state = {
    currentView: 'dashboard',
    videos: [
        { id: 1, title: "I Spent 50 Hours In VR", status: "Editing", views: "1.2M", thumb: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=300&q=80" },
        { id: 2, title: "The Truth About Tech in 2026", status: "Script", views: "-", thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80" },
        { id: 3, title: "My $10,000 Studio Tour", status: "Idea", views: "-", thumb: null }
    ],
    tasks: [
        { id: 1, title: "Review sponsor contract", completed: false, priority: "high" },
        { id: 2, title: "Record B-Roll for VR video", completed: true, priority: "medium" }
    ],
    brands: [
        { id: 1, name: "TechCorp", status: "Negotiating", amount: "$5,000", logo: "fa-laptop" },
        { id: 2, name: "VPN Secure", status: "Active", amount: "$3,500", logo: "fa-shield-halved" }
    ],
    pipelineSteps: ["Idea", "Script", "Recording", "Editing", "Thumbnail", "Published"]
};

function initApp() {
    try {
        renderNav();
        navigate(state.currentView);
    } catch (error) {
        showErrorBoundary(error);
    }
}

function showErrorBoundary(error) {
    console.error("Vyro Critical Error:", error);
    document.getElementById('error-boundary').classList.remove('hidden');
    document.getElementById('error-message').textContent = error.message;
}

function openCustomModal(title, contentHTML) {
    const modal = document.getElementById('global-modal');
    const content = document.getElementById('modal-content');
    
    content.innerHTML = `
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 class="text-lg font-bold text-slate-900">${title}</h3>
            <button onclick="closeModal()" class="text-slate-400 hover:text-slate-700"><i class="fa-solid fa-xmark text-xl"></i></button>
        </div>
        <div class="p-6 text-slate-600">${contentHTML}</div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('global-modal');
    const content = document.getElementById('modal-content');
    
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

document.addEventListener('DOMContentLoaded', initApp);
