function renderSettings(){
    return `
        <div class="settings-container animate-fade-in">
            <h3 class="settings-title">Workspace Settings</h3>
            <div class="form-group">
                <label class="form-label">Creator Name</label>
                <input id="creator-name-input" type="text" value="${escapeHTML(state.settings.creatorName||'')}" class="form-input">
            </div>
            <div class="integration-section">
                <h4 class="font-bold text-slate-800 mb-4">Integrations</h4>
                <div class="integration-card">
                    <div class="flex items-center gap-3">
                        <i class="fa-brands fa-youtube text-red-600 text-2xl"></i>
                        <div><div class="font-bold text-slate-800">YouTube</div><div class="text-xs text-slate-500">Not connected</div></div>
                    </div>
                    <button onclick="connectYouTube()" class="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 shadow-sm">Connect</button>
                </div>
            </div>
            <button onclick="saveSettings()" class="btn-save">Save Settings</button>
        </div>`;
}

window.saveSettings=function(){
    const input=document.getElementById('creator-name-input');
    if(input)state.settings.creatorName=input.value.trim()||'Creator';
    persistState();
    openCustomModal('Settings Saved','<p class="text-sm text-slate-600">Your workspace settings have been saved on this device.</p>');
};

window.connectYouTube=function(){
    openCustomModal('YouTube Connection','<p class="text-sm text-slate-600">YouTube OAuth is not connected yet. This button is ready for the secure OAuth flow when Firebase/Google Cloud is configured.</p>');
};