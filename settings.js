function renderSettings() {
    return `
        <div class="settings-container animate-fade-in">
            <h3 class="settings-title">Workspace Settings</h3>
            
            <div class="form-group">
                <label class="form-label">Creator Name</label>
                <input type="text" value="Awesome Creator" class="form-input">
            </div>
            
            <div class="integration-section">
                <h4 class="font-bold text-slate-800 mb-4">Integrations</h4>
                <div class="integration-card">
                    <div class="flex items-center gap-3">
                        <i class="fa-brands fa-youtube text-red-600 text-2xl"></i>
                        <div>
                            <div class="font-bold text-slate-800">YouTube Data API</div>
                            <div class="text-xs text-slate-500">Not Connected</div>
                        </div>
                    </div>
                    <button class="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 shadow-sm">Connect</button>
                </div>
            </div>

            <button class="btn-save">Save Settings</button>
        </div>
    `;
}
