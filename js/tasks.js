function renderTasks(){
    const groups=[
        {key:'open',title:'To-Do',items:state.tasks.filter(t=>!t.completed)},
        {key:'done',title:'Done',items:state.tasks.filter(t=>t.completed)}
    ];
    return `
        <div class="tasks-container animate-fade-in">
            <div class="task-board">
                <div class="task-header">
                    <div><h3 class="text-lg font-bold text-slate-800">To-Do List</h3><p class="text-sm text-slate-500 mt-1">Keep your next actions clear.</p></div>
                    <button onclick="openTaskModal()" class="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100"><i class="fa-solid fa-plus mr-1"></i>Add Task</button>
                </div>
                ${groups.map(group=>`
                    <div class="task-list">
                        <div class="px-5 py-3 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400">${group.title}</div>
                        ${group.items.length?group.items.map(task=>`
                            <div class="task-item">
                                <button onclick="toggleTask(${task.id})" class="task-checkbox ${task.completed?'completed':''}" aria-label="Toggle task"><i class="fa-solid fa-check text-xs"></i></button>
                                <span class="task-title ${task.completed?'completed':''}">${escapeHTML(task.title)}</span>
                                <span class="task-priority priority-${task.priority}">${task.priority}</span>
                            </div>`).join(''):'<div class="empty-state py-6">No tasks here.</div>'}
                    </div>`).join('')}
            </div>
        </div>`;
}

window.openTaskModal=function(){
    openCustomModal('Add Task',`
        <form onsubmit="addTask(event)" class="space-y-4">
            <div><label class="form-label">Task</label><input name="title" required class="form-input" placeholder="What needs to be done?"></div>
            <div><label class="form-label">Priority</label><select name="priority" class="form-input"><option value="high">High</option><option value="medium" selected>Medium</option><option value="low">Low</option></select></div>
            <div class="flex justify-end gap-2"><button type="button" onclick="closeModal()" class="px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button><button class="px-4 py-2 bg-midnight-600 text-white rounded-lg text-sm font-semibold">Add Task</button></div>
        </form>`);
};