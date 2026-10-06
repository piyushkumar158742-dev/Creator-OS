function renderCalendar() {
    return `
        <div class="calendar-layout animate-fade-in">
            <div class="calendar-main">
                <div class="calendar-header">
                    <h3 class="text-xl font-bold text-slate-800">October 2026</h3>
                </div>
                <div class="calendar-grid">
                    ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => `<div class="day-name">${day}</div>`).join('')}
                    ${Array.from({length: 35}).map((_, i) => {
                        const day = i - 3 > 0 && i - 3 <= 31 ? i - 3 : '';
                        const isToday = day === 6;
                        const hasEvent = day === 12 || day === 18;
                        return `
                        <div class="calendar-cell ${isToday ? 'today' : ''}">
                            <span class="date-number ${isToday ? 'today' : ''}">${day}</span>${hasEvent ? `<div class="event-indicator"></div>` : ''}
                        </div>`
                    }).join('')}
                </div>
            </div>
            <div class="agenda-sidebar">
                <div class="p-4 border-b border-slate-200 bg-white rounded-t-2xl">
                    <h3 class="font-bold text-slate-800">Agenda</h3>
                </div>
                <div class="agenda-list">
                    <div class="agenda-item">
                        <div class="text-xs font-bold text-indigo-500 mb-1">Oct 12</div>
                        <div class="font-bold text-slate-800">Publish VR Video</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
