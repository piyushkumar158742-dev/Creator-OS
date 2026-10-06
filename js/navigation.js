const navItems=[
    {id:'dashboard',icon:'fa-house',label:'Dashboard'},
    {id:'videos',icon:'fa-play',label:'Videos Pipeline'},
    {id:'tasks',icon:'fa-check-double',label:'To-Do List'},
    {id:'brands',icon:'fa-handshake',label:'Brands & CRM'},
    {id:'calendar',icon:'fa-calendar-days',label:'Calendar'},
    {id:'settings',icon:'fa-gear',label:'Settings'}
];

window.renderNav = function(){
    const navMenu=document.getElementById('nav-menu');
    if(!navMenu)return;
    navMenu.innerHTML=navItems.map(item=>`
        <button onclick="navigate('${item.id}')" class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl app-transition ${state.currentView===item.id?'bg-midnight-50 text-midnight-700 shadow-sm border border-midnight-100/50':'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}">
            <i class="fa-solid ${item.icon} w-5 text-center ${state.currentView===item.id?'text-midnight-600':'text-slate-400'}"></i>
            <span>${item.label}</span>
        </button>`).join('');
}

window.navigate = function(viewId,animate=true){
    const valid=navItems.some(i=>i.id===viewId);
    if(!valid)viewId='dashboard';
    state.currentView=viewId;
    persistState();
    const active=navItems.find(i=>i.id===viewId);
    const title=document.getElementById('current-view-title');
    const container=document.getElementById('view-container');
    if(title)title.textContent=active.label;
    renderNav();
    closeMobileNav();
    if(!container)return;
    if(animate)container.style.opacity='0';
    const render=()=>{
        switch(viewId){
            case 'dashboard':container.innerHTML=renderDashboard();break;
            case 'videos':container.innerHTML=renderVideos();break;
            case 'tasks':container.innerHTML=renderTasks();break;
            case 'brands':container.innerHTML=renderBrands();break;
            case 'calendar':container.innerHTML=renderCalendar();break;
            case 'settings':container.innerHTML=renderSettings();break;
            default:container.innerHTML='<div class="empty-state">View not found.</div>';
        }
        container.style.opacity='1';
    };
    animate?setTimeout(render,120):render();
}