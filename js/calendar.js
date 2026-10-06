function renderCalendar() {
    const year = 2026;
    const month = 9; // October, zero-based.
    const monthName = new Date(year, month, 1).toLocaleString('en-US', { month: 'long' });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const events = [
        { day: 12, title: 'Publish VR Video', time: '10:00 AM', type: 'video' },
        { day: 18, title: 'TechCorp Sponsor Call', time: '2:00 PM', type: 'brand' }
    ];

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push('<div class="calendar-cell muted"></div>');
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === 6;
        const dayEvents = events.filter(e => e.day === day);
        cells.push(`
            <button class="calendar-cell text-left ${isToday ? 'today' : ''}" onclick="selectCalendarDay(${day})">
                <span class="calendar-day-number">${day}</span>
                ${dayEvents.map(e => `<div class="calendar-event-dot" title="${e.title}"></div>`).join('')}
            </button>
        `);
    }
    while (cells.length < 42) cells.push('<div class="calendar-cell muted"></div>');

    return `
        <div class="calendar-layout animate-fade-in">
            <section class="calendar-panel">
                <div class="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 class="text-xl font-bold text-slate-800">${monthName} ${year}</h3>
                        <p class="text-sm text-slate-500 mt-1">Deadlines and creator events</p>
                    </div>
                    <button onclick="openEventModal()" class="px-3 py-2 bg-midnight-50 text-midnight-700 rounded-lg text-sm font-semibold hover:bg-midnight-100">
                        <i class="fa-solid fa-plus mr-1"></i> Event
                    </button>
                </div>
                <div class="grid grid-cols-7 px-4 pt-4 text-center">
                    ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => `<div class="text-xs font-bold text-slate-400 py-2">${d}</div>`).join('')}
                </div>
                <div class="calendar-grid">${cells.join('')}</div>
            </section>

            <aside class="agenda-panel">
                <div class="p-5 border-b border-slate-100">
                    <h3 class="text-lg font-bold text-slate-800">Agenda</h3>
                    <p class="text-sm text-slate-500 mt-1">Upcoming connected events</p>
                </div>
                <div class="p-5 space-y-3">
                    ${events.map(e => `
                        <div class="agenda-item">
                            <div class="text-xs font-bold text-midnight-600 mb-1">Oct ${e.day}</div>
                            <div class="font-bold text-slate-800">${e.title}</div>
                            <div class="text-sm text-slate-500 mt-1"><i class="fa-regular fa-clock mr-1"></i>${e.time}</div>
                        </div>
                    `).join('')}
                </div>
            </aside>
        </div>
    `;
}

window.selectCalendarDay = function(day) {
    openCustomModal('October ' + day, '<p class="text-sm text-slate-600">Calendar events for this date will appear here as connected data is added.</p>');
};

window.openEventModal = function() {
    openCustomModal('Add Calendar Event', `
        <form onsubmit="saveCalendarEvent(event)" class="space-y-4">
            <input name="title" required placeholder="Event title" class="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-midnight-500">
            <input name="date" type="date" required class="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-midnight-500">
            <div class="flex justify-end gap-2">
                <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600">Cancel</button>
                <button class="px-4 py-2 rounded-lg bg-midnight-600 text-white text-sm font-semibold">Add Event</button>
            </div>
        </form>
    `);
};

window.saveCalendarEvent = function(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    state.events = state.events || [];
    state.events.push({ id: Date.now(), title: data.get('title'), date: data.get('date') });
    persistState();
    closeModal();
    openCustomModal('Event Added', '<p class="text-sm text-slate-600">The event has been added to your workspace.</p>');
};
