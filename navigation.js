const navItems = [
    { id: 'dashboard', icon: 'fa-house', label: 'Dashboard' },
    { id: 'videos', icon: 'fa-play', label: 'Videos Pipeline' },
    { id: 'tasks', icon: 'fa-check-double', label: 'To-Do List' },
    { id: 'brands', icon: 'fa-handshake', label: 'Brands & CRM' },
    { id: 'calendar', icon: 'fa-calendar-days', label: 'Calendar' },
    { id: 'settings', icon: 'fa-gear', label: 'Settings' }
];

function renderNav() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.innerHTML = navItems.map(item => `
        <button onclick="navigate('${item.id}')" 
            class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl app-transition
            ${state.currentView === item.id 
                ? 'bg-midnight-50 text-midnight-700 shadow-sm border border-midnight-100/50' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}">
            <i class="fa-solid ${item.icon} w-5 text-center ${state.currentView === item.id ? 'text-midnight-600' : 'text-slate-400'}"></i>
            ${item.label}
        </button>
    `).join('');
}

function navigate(viewId) {
    state.currentView = viewId;
    document.getElementById('current-view-title').textContent = navItems.find(i => i.id === viewId).label;
    renderNav();
    
    const container = document.getElementById('view-container');
    container.style.opacity = 0;
    
    setTimeout(() => {
        switch(viewId) {
            case 'dashboard': container.innerHTML = renderDashboard(); break;
            case 'videos': container.innerHTML = renderVideos(); break;
            case 'tasks': container.innerHTML = renderTasks(); break;
            case 'brands': container.innerHTML = renderBrands(); break;
            case 'calendar': container.innerHTML = renderCalendar(); break;
            case 'settings': container.innerHTML = renderSettings(); break;
        }
        container.style.opacity = 1;
    }, 150);
}
