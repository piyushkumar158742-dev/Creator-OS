function renderBrands() {
    return `
        <div class="brands-grid animate-fade-in">
            ${state.brands.map(brand => `
                <div class="brand-card">
                    <div class="brand-header">
                        <div class="brand-logo"><i class="fa-solid ${brand.logo}"></i></div>
                        <span class="brand-badge ${brand.status === 'Active' ? 'status-active' : brand.status === 'Negotiating' ? 'status-negotiating' : ''}">
                            ${brand.status}
                        </span>
                    </div>
                    <h3 class="text-xl font-bold mb-1">${brand.name}</h3>
                    <p class="text-slate-500 text-sm font-medium">Value: ${brand.amount}</p>
                    <div class="brand-actions">
                        <button class="btn-details">View Details</button>
                        <button class="btn-icon"><i class="fa-solid fa-envelope"></i></button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}
