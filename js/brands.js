function renderBrands(){
    return `
        <div class="brands-grid animate-fade-in">
            ${state.brands.map(brand=>`
                <article class="brand-card">
                    <div class="brand-header">
                        <div class="brand-logo"><i class="fa-solid ${brand.logo}"></i></div>
                        <span class="brand-badge ${brand.status==='Active'?'status-active':brand.status==='Negotiating'?'status-negotiating':''}">${escapeHTML(brand.status)}</span>
                    </div>
                    <h3 class="text-xl font-bold mb-1 text-slate-800">${escapeHTML(brand.name)}</h3>
                    <p class="text-slate-500 text-sm font-medium">Value: ${escapeHTML(brand.amount)}</p>
                    <div class="brand-actions">
                        <button onclick="openBrandModal(${brand.id})" class="btn-details">View Details</button>
                        <button onclick="openBrandMessage(${brand.id})" class="btn-icon" aria-label="Contact brand"><i class="fa-solid fa-envelope"></i></button>
                    </div>
                </article>`).join('')}
            <button onclick="openBrandModal()" class="brand-card add-brand-card">
                <div class="brand-logo"><i class="fa-solid fa-plus"></i></div>
                <h3 class="text-lg font-bold text-slate-800 mt-4">Add New Brand</h3>
                <p class="text-sm text-slate-500 mt-1">Create a deal or brand record.</p>
            </button>
        </div>`;
}

window.openBrandModal=function(id){
    const brand=id?state.brands.find(b=>b.id===id):null;
    openCustomModal(brand?'Brand Details':'Add Brand',`
        <form onsubmit="saveBrand(event,${id||'null'})" class="space-y-4">
            <div><label class="form-label">Brand name</label><input name="name" required value="${brand?escapeHTML(brand.name):''}" class="form-input" placeholder="Brand name"></div>
            <div><label class="form-label">Status</label><select name="status" class="form-input">${['Potential','Contacted','Negotiating','Active','Completed'].map(s=>`<option ${brand?.status===s?'selected':''}>${s}</option>`).join('')}</select></div>
            <div><label class="form-label">Deal value</label><input name="amount" value="${brand?escapeHTML(brand.amount):''}" class="form-input" placeholder="$5,000"></div>
            <div class="flex justify-end gap-2"><button type="button" onclick="closeModal()" class="px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button><button class="px-4 py-2 bg-midnight-600 text-white rounded-lg text-sm font-semibold">Save</button></div>
        </form>`);
};

window.saveBrand=function(event,id){
    event.preventDefault();
    const data=new FormData(event.target);
    if(id&&id!=='null'){
        const brand=state.brands.find(b=>b.id===Number(id));
        if(brand){brand.name=data.get('name').trim();brand.status=data.get('status');brand.amount=data.get('amount').trim()||'-';}
    }else{
        state.brands.push({id:Date.now(),name:data.get('name').trim(),status:data.get('status'),amount:data.get('amount').trim()||'-',logo:'fa-building'});
    }
    persistState();closeModal();navigate('brands',false);
};

window.openBrandMessage=function(id){
    const brand=state.brands.find(b=>b.id===id);
    if(brand)openCustomModal('Contact '+brand.name,`<p class="text-sm">Add the brand email/contact details here once the CRM fields are connected.</p>`);
};