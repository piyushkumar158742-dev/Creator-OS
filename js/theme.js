'use strict';
function applyTheme(){
  const mode=S.settings&&S.settings.theme==='dark'?'dark':'light';
  document.documentElement.setAttribute('data-theme',mode);
  const button=document.getElementById('theme-toggle');
  if(button){
    button.textContent=mode==='dark'?'☀':'◐';
    button.setAttribute('aria-label',mode==='dark'?'Switch to light mode':'Switch to dark mode');
    button.title=mode==='dark'?'Switch to light mode':'Switch to dark mode';
  }
}
function toggleTheme(){
  const previous=S.settings.theme==='dark'?'dark':'light';
  S.settings.theme=previous==='dark'?'light':'dark';
  if(!save()){S.settings.theme=previous;applyTheme();return}
  applyTheme();
  toast(S.settings.theme==='dark'?'Dark mode enabled':'Light mode enabled');
}
applyTheme();
