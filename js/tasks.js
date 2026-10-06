function renderTasks() {
    return `
        <div class="tasks-container animate-fade-in">
            <div class="task-board">
                <div class="task-header">
                    <h3 class="text-lg font-bold text-slate-800">Master To-Do List</h3>
                    <button class="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold">Add Task</button>
                </div>
                <div class="task-list">
                    ${state.tasks.map(task => `
                        <div class="task-item">
                            <div class="task-checkbox ${task.completed ? 'completed' : ''}">
                                <i class="fa-solid fa-check text-xs"></i>
                            </div>
                            <span class="task-title ${task.completed ? 'completed' : ''}">${task.title}</span>
                            <span class="task-priority priority-${task.priority}">${task.priority}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}
