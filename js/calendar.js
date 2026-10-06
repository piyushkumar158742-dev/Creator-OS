window.renderCalendar = function() {
    const year = 2026;
    const month = 9;
    const monthName = new Date(year, month, 1).toLocaleString('en-US', { month: 'long' });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const events = (state.events || []).map(e => ({
        ...e,
        day: e.day || (e.date ? Number(String(e.date).split('-')[2]) : null)
    }));

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push('<div class="calendar-cell muted" aria-hidden="true"></div>');
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === 6;
        const dayEvents = events.filter(e => e.day === day);
        cells.push(`
            <button type="button" class="calendar-cell text-left ${isToday ? 'today' : ''}" onclick="selectCalendarDay(${day})">
                <span class="calendar-day-number">${day}</span>
                ${dayEvents.slice(0,2).map(e => `<div class="calendar-event-dot" title="${escapeHTML(e.title || 'Event')}"></div>`).join('')}
            </button>`);
    }

    return `
        <div class="calendar-layout animate-fade-in">
            <section class="calendar-panel">
                <div class="p-5 border-b border-slate-100 flex items-center justify-between gap-3">
                    <div>
                        <h3 class="text-xl font-bold text-slate-800">${monthName} ${year}</h3>
                        <p class="text-sm text-slate-500 mt-1">Deadlines and creator events</p>
                    </div>
                    <button type="button" onclick="openEventModal()" class="shrink-0 px-3 py-2 bg-midnight-50 text-midnight-700 rounded-lg text-sm font-semibold hover:bg-midnight-100">
                        <i class="fa-solid fa-plus mr-1"></i> Event
                    </button>
                </div>
                <div class="grid grid-cols-7 px-4 pt-3 text-center">
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
                    ${events.length ? events.map(e => `
                        <div class="agenda-item">
                            <div class="text-xs font-bold text-midnight-600 mb-1">Oct ${e.day || ''}</div>
                            <div class="font-bold text-slate-800">${escapeHTML(e.title || 'Event')}</div>
                            ${e.time ? `<div class="text-sm text-slate-500 mt-1"><i class="fa-regular fa-clock mr-1"></i>${escapeHTML(e.time)}</div>` : ''}
                        </div>`).join('') : '<div class="empty-state py-8">No upcoming events.</div>'}
                </div>
            </aside>
        </div>`;
};

window.selectCalendarDay = function(day) {
    const events = (state.events || []).filter(e => Number(String(e.date || '').split('-')[2]) === day || e.day === day);
    openCustomModal('October ' + day, events.length
        ? `<div class="space-y-2">${events.map(e => `<div class="p-3 rounded-xl bg-slate-50 border border-slate-100 font-semibold">${escapeHTML(e.title)}</div>`).join('')}</div>`
        : '<p class="text-sm text-slate-600">No events on this date.</p>');
};

window.openEventModal = function() {
    openCustomModal('Add Calendar Event', `
        <form onsubmit="saveCalendarEvent(event)" class="space-y-4">
            <input name="title" required placeholder="Event title" class="form-input">
            <input name="date" type="date" required class="form-input">
            <div class="flex justify-end gap-2">
                <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600">Cancel</button>
                <button type="submit" class="px-4 py-2 rounded-lg bg-midnight-600 text-white text-sm font-semibold">Add Event</button>
            </div>
        </form>`);
};

window.saveCalendarEvent = function(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    state.events = state.events || [];
    state.events.push({ id: Date.now(), title: String(data.get('title') || '').trim(), date: data.get('date') });
    persistState();
    closeModal();
    navigate('calendar', false);
};
