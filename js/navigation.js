const navItems=[{id:'videos',label:'Videos'},{id:'tasks',label:'To-Do'},{id:'brands',label:'Brands'},{id:'calendar',label:'Calendar'}];
window.renderNav=function(){};
window.navigate=function(viewId,animate=true){
 const valid=['dashboard','videos','tasks','brands','calendar','settings'];
 if(!valid.includes(viewId))viewId='dashboard';
 state.currentView=viewId; persistState();
 document.querySelectorAll('[data-nav]').forEach(el=>el.classList.toggle('active',el.dataset.nav===viewId));
 const container=document.getElementById('view-container'); if(!container)return;
 if(animate)container.classList.add('view-changing');
 switch(viewId){
  case'dashboard':container.innerHTML=renderDashboard();break;
  case'videos':container.innerHTML=renderVideos();break;
  case'tasks':container.innerHTML=renderTasks();break;
  case'brands':container.innerHTML=renderBrands();break;
  case'calendar':container.innerHTML=renderCalendar();break;
  case'settings':container.innerHTML=renderSettings();break;
  default:container.innerHTML=renderDashboard();
 }
 if(animate)setTimeout(()=>container.classList.remove('view-changing'),180);
};