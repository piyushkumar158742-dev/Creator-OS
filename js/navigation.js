const navItems=[
 {id:'videos',icon:'fa-play',label:'Videos',description:'Plan and publish'},
 {id:'tasks',icon:'fa-check',label:'To-Do',description:'Keep moving'},
 {id:'brands',icon:'fa-handshake',label:'Brands',description:'Deals and partners'},
 {id:'calendar',icon:'fa-calendar',label:'Calendar',description:'Your schedule'}
];
window.renderNav=function(){};
window.navigate=function(viewId,animate=true){
 const valid=['dashboard',...navItems.map(x=>x.id),'settings'];
 if(!valid.includes(viewId))viewId='dashboard';
 state.currentView=viewId; persistState();
 const title=document.getElementById('current-view-title'); const container=document.getElementById('view-container');
 if(title)title.textContent=viewId==='dashboard'?'Dashboard':viewId.charAt(0).toUpperCase()+viewId.slice(1);
 if(!container)return;
 if(animate){container.classList.add('view-changing');setTimeout(()=>container.classList.remove('view-changing'),220);}
 switch(viewId){
  case 'dashboard':container.innerHTML=renderDashboard();break;
  case 'videos':container.innerHTML=renderVideos();break;
  case 'tasks':container.innerHTML=renderTasks();break;
  case 'brands':container.innerHTML=renderBrands();break;
  case 'calendar':container.innerHTML=renderCalendar();break;
  case 'settings':container.innerHTML=renderSettings();break;
  default:container.innerHTML=renderDashboard();
 }
};