'use strict';
/* =========================================================
   Creator OS — V1 frontend prototype (Vanilla JS)
   Sections: 1 Helpers · 2 Sample data (swap for Firebase /
   YouTube API) · 3 Modal + forms · 4 Views · 5 Actions · 6 Boot
   ========================================================= */

/* ---------- 1. Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const uid = () => Math.random().toString(36).slice(2, 9);
const find = (arr, id) => arr.find(x => x.id === id);
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const day = n => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
const today = () => day(0);
const parse = s => new Date(s + 'T00:00:00');
const money = n => '$' + Number(n || 0).toLocaleString();
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const hue = s => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) * 7 % 360;
const grad = s => `linear-gradient(135deg,hsl(${hue(s)} 75% 68%),hsl(${(hue(s) + 45) % 360} 75% 58%))`;
const niceDate = s => s === today() ? 'Today' : s === day(1) ? 'Tomorrow' : parse(s).toLocaleDateString('en', { month: 'short', day: 'numeric' });
const cap = s => s[0].toUpperCase() + s.slice(1);

const PAGES = [['home', 'Home', '⌂'], ['videos', 'Videos', '▶'], ['pipeline', 'Pipeline', '⇄'], ['todo', 'To-Do', '✓'], ['brands', 'Brands', '◆'], ['calendar', 'Calendar', '▦']];
const PRI = ['high', 'medium', 'low'];
const STATUS = ['Lead', 'Negotiating', 'Active', 'Completed'];
const TYPE_COLOR = { task: '#0a84ff', video: '#af52de', brand: '#ff9f0a', event: '#30d158' };
const defaultChecklist = () => ['Title finalized', 'Script approved', 'Filmed', 'Edited', 'Thumbnail ready', 'Description & tags', 'Scheduled'].map(t => ({ t, d: false }));

/* ---------- 2. Sample data (replace with Firebase / YouTube API later) ---------- */
const series = (base, trend, seed) => Array.from({ length: 90 }, (_, i) =>
  Math.round(base * (1 + i * trend / 90) * (1 + .18 * Math.sin(i / 4 + seed) + .08 * Math.sin(i * 1.7))));

const YT = { // TODO: fetch from YouTube Data / Analytics API
  stats: [
    { k: 'Subscribers', v: '248.3K', d: '+3.2%' }, { k: 'Views', v: '12.4M', d: '+8.7%' },
    { k: 'Watch time', v: '684K hrs', d: '+5.1%' }, { k: 'Videos', v: '142', d: '+4' }],
  charts: [
    { k: 'Views', color: '#0a84ff', data: series(140000, .35, 1) },
    { k: 'Subscribers gained', color: '#af52de', data: series(900, .25, 3) }]
};

const state = {
  page: 'home', cal: new Date(), sel: today(), todoOpen: {},
  stages: [
    { id: 'idea', name: 'Idea', color: '#af52de' }, { id: 'script', name: 'Script', color: '#0a84ff' },
    { id: 'rec', name: 'Recording', color: '#ff375f' }, { id: 'edit', name: 'Editing', color: '#ff9f0a' },
    { id: 'thumb', name: 'Thumbnail', color: '#ffcc00' }, { id: 'pub', name: 'Published', color: '#30d158', locked: true }],
  videos: [
    { id: 'v1', title: 'I Built a Full Website in 10 Minutes with AI', idea: 'Speed-build challenge using only prompts.', stage: 'script', thumb: '', sponsor: 'b1', budget: 1200, priority: 'high', deadline: day(5), notes: 'Show the final result in the first 20 seconds.', checklist: defaultChecklist().map((c, i) => ({ ...c, d: i < 1 })), scripts: [{ name: 'Draft 1', text: 'HOOK: What if you could ship a site before your coffee gets cold?\n\n1. Intro\n2. The prompt\n3. Live build\n4. Result' }, { name: 'Short version', text: 'Cut to 8 minutes. Skip the setup section.' }] },
    { id: 'v2', title: 'My 2026 Creator Desk Setup', idea: 'Tour of the studio upgrade.', stage: 'rec', thumb: '', sponsor: 'b3', budget: 600, priority: 'medium', deadline: day(2), notes: '', checklist: defaultChecklist().map((c, i) => ({ ...c, d: i < 2 })), scripts: [{ name: 'Outline', text: 'Desk → Lights → Audio → Cable management' }] },
    { id: 'v3', title: '5 Free Tools Every Creator Needs', idea: 'Roundup of free tools.', stage: 'idea', thumb: '', sponsor: '', budget: 0, priority: 'low', deadline: day(18), notes: '', checklist: defaultChecklist(), scripts: [{ name: 'Script v1', text: '' }] },
    { id: 'v4', title: 'How I Edit 10x Faster', idea: 'Workflow and shortcuts breakdown.', stage: 'edit', thumb: '', sponsor: 'b3', budget: 800, priority: 'high', deadline: day(3), notes: 'Sponsor wants a mid-roll mention.', checklist: defaultChecklist().map((c, i) => ({ ...c, d: i < 3 })), scripts: [{ name: 'Final', text: 'Locked.' }] },
    { id: 'v5', title: 'Why Most Channels Stall at 10K', idea: 'Data-driven look at growth plateaus.', stage: 'thumb', thumb: '', sponsor: '', budget: 300, priority: 'medium', deadline: day(7), notes: '', checklist: defaultChecklist().map((c, i) => ({ ...c, d: i < 4 })), scripts: [{ name: 'Final', text: 'Locked.' }] },
    { id: 'v6', title: 'A Day in the Life of a Full-Time Creator', idea: 'Vlog style.', stage: 'pub', thumb: '', sponsor: 'b5', budget: 500, priority: 'low', deadline: day(-9), notes: '', checklist: defaultChecklist().map(c => ({ ...c, d: true })), scripts: [{ name: 'Final', text: 'Published.' }] }],
  tasks: [
    { id: 't1', title: 'Record intro for desk setup video', due: day(0), pri: 'high', done: false, subs: [{ t: 'Set up lights', d: true }, { t: 'Check mic levels', d: false }] },
    { id: 't2', title: 'Reply to Lumen Audio contract', due: day(0), pri: 'high', done: false, subs: [] },
    { id: 't3', title: 'Export 4K master for editing video', due: day(1), pri: 'medium', done: false, subs: [] },
    { id: 't4', title: 'Design thumbnail variants', due: day(1), pri: 'medium', done: false, subs: [{ t: 'Variant A', d: false }, { t: 'Variant B', d: false }] },
    { id: 't5', title: 'Plan Q4 content calendar', due: day(4), pri: 'low', done: false, subs: [] },
    { id: 't6', title: 'Send invoice to Pixelforge', due: day(7), pri: 'medium', done: false, subs: [] },
    { id: 't7', title: 'Update channel banner', due: day(-2), pri: 'low', done: true, subs: [] },
    { id: 't8', title: 'Film B-roll for sponsor segment', due: day(10), pri: 'low', done: false, subs: [] }],
  brands: [
    { id: 'b1', name: 'Lumen Audio', status: 'Active', deals: [{ id: 'd1', title: 'Sponsored integration', amount: 4500, deadline: day(6), paid: false, video: 'v1' }, { id: 'd2', title: 'Instagram reel', amount: 1500, deadline: day(-10), paid: true, video: '' }] },
    { id: 'b2', name: 'Nordkit', status: 'Negotiating', deals: [{ id: 'd3', title: 'Dedicated video', amount: 8000, deadline: day(21), paid: false, video: '' }] },
    { id: 'b3', name: 'Pixelforge', status: 'Active', deals: [{ id: 'd4', title: 'Mid-roll ad', amount: 3200, deadline: day(3), paid: false, video: 'v4' }] },
    { id: 'b4', name: 'Brewdesk', status: 'Lead', deals: [{ id: 'd5', title: 'Product review', amount: 1200, deadline: day(30), paid: false, video: '' }] },
    { id: 'b5', name: 'Flowstate', status: 'Completed', deals: [{ id: 'd6', title: 'Pre-roll', amount: 2800, deadline: day(-20), paid: true, video: 'v6' }] }],
  events: [
    { id: 'e1', title: 'Studio rental', date: day(2) }, { id: 'e2', title: 'Collab call with Mia', date: day(4) }, { id: 'e3', title: 'Q4 planning day', date: day(12) }]
};
const allDeals = () => state.brands.flatMap(b => b.deals.map(d => ({ ...d, brand: b })));
const dealRef = id => state.brands.flatMap(b => b.deals).find(d => d.id === id);

/* ---------- 3. Modal + forms ---------- */
let cur = null, sIdx = 0; // current video + active script tab
function openModal(html) { const m = $('#modal'); m.innerHTML = `<div class="sheet">${html}</div>`; m.hidden = false; }
function closeModal() { const m = $('#modal'); m.hidden = true; m.innerHTML = ''; cur = null; render(); }

// bind = "kind:id" → input edits the object live (video / brand / deal / script)
function field(label, name, val = '', type = 'text', opts = [], bind = '') {
  const b = bind ? `data-o="${bind}" data-k="${name}"` : '';
  let el;
  if (type === 'select') el = `<select name="${name}" ${b}>${opts.map(o => { const [v, t] = Array.isArray(o) ? o : [o, cap(o)]; return `<option value="${esc(v)}" ${v == val ? 'selected' : ''}>${esc(t)}</option>`; }).join('')}</select>`;
  else if (type === 'textarea') el = `<textarea name="${name}" rows="3" ${b}>${esc(val)}</textarea>`;
  else el = `<input name="${name}" type="${type}" value="${esc(val)}" ${b}>`;
  return `<label>${label}${el}</label>`;
}
function formModal(title, fields, onSave, extra = '') {
  openModal(`<h2>${title}</h2><form id="f">${fields}<div class="row end">${extra}<span class="grow"></span><button type="button" class="btn ghost" data-act="close">Cancel</button><button class="btn primary">Save</button></div></form>`);
  $('#f').onsubmit = e => { e.preventDefault(); onSave(Object.fromEntries(new FormData(e.target))); closeModal(); };
}

const thumb = v => v.thumb ? `<img src="${esc(v.thumb)}" alt="">` : `<div class="ph" style="background:${grad(v.title)}">${esc(v.title.slice(0, 2))}</div>`;

function openVideo(id, tab = 'details') {
  if (!cur || cur.id !== id) sIdx = 0;
  cur = find(state.videos, id);
  const v = cur, b = 'video:' + id, done = v.checklist.filter(c => c.d).length;
  const tabs = ['details', 'scripts', 'checklist'].map(t => `<button class="tab ${t === tab ? 'on' : ''}" data-act="vtab" data-t="${t}">${cap(t)}${t === 'checklist' ? ` ${done}/${v.checklist.length}` : ''}</button>`).join('');
  let body = '';
  if (tab === 'details') body = `<div class="thumb lg">${thumb(v)}</div>
    ${field('Title', 'title', v.title, 'text', [], b)}${field('Idea', 'idea', v.idea, 'textarea', [], b)}
    <div class="grid2">
      ${field('Stage', 'stage', v.stage, 'select', state.stages.map(s => [s.id, s.name]), b)}${field('Priority', 'priority', v.priority, 'select', PRI, b)}
      ${field('Sponsor', 'sponsor', v.sponsor, 'select', [['', 'None'], ...state.brands.map(x => [x.id, x.name])], b)}${field('Budget ($)', 'budget', v.budget, 'number', [], b)}
      ${field('Deadline', 'deadline', v.deadline, 'date', [], b)}${field('Thumbnail URL', 'thumb', v.thumb, 'url', [], b)}
    </div>${field('Notes', 'notes', v.notes, 'textarea', [], b)}`;
  if (tab === 'scripts') {
    const s = v.scripts[sIdx] || v.scripts[0], sb = 'script:' + v.scripts.indexOf(s);
    body = `<div class="tabs">${v.scripts.map((x, i) => `<button class="tab ${x === s ? 'on' : ''}" data-act="sidx" data-i="${i}">${esc(x.name)}</button>`).join('')}<button class="tab" data-act="script-add">+ New</button></div>
      ${field('Script name', 'name', s.name, 'text', [], sb)}${field('Script', 'text', s.text, 'textarea', [], sb).replace('rows="3"', 'rows="12"')}
      ${v.scripts.length > 1 ? `<button class="btn danger sm" data-act="script-del">Delete this script</button>` : ''}`;
  }
  if (tab === 'checklist') body = `<div class="bar" style="margin-bottom:14px"><i style="width:${done / v.checklist.length * 100 || 0}%"></i></div>
    ${v.checklist.map((c, i) => `<div class="row task ${c.d ? 'done' : ''}"><button class="chk ${c.d ? 'on' : ''}" data-act="vcheck" data-i="${i}">✓</button><span class="tt" data-act="vcheck" data-i="${i}">${esc(c.t)}</span><button class="ico" data-act="vcheck-del" data-i="${i}">✕</button></div>`).join('')}
    <input data-add="check" placeholder="Add checklist item and press Enter" style="margin-top:12px">`;
  openModal(`<div class="mh"><h2>${esc(v.title)}</h2><button class="ico" data-act="close">✕</button></div><div class="tabs">${tabs}</div>${body}
    <div class="row end"><button class="btn danger" data-act="video-del" data-id="${id}">Delete</button><span class="grow"></span><button class="btn primary" data-act="close">Done</button></div>`);
}

function openBrand(id) {
  const b = find(state.brands, id), bind = 'brand:' + id;
  const tot = b.deals.reduce((s, d) => s + +d.amount, 0), paid = b.deals.filter(d => d.paid).reduce((s, d) => s + +d.amount, 0);
  openModal(`<div class="mh"><h2>${esc(b.name)}</h2><button class="ico" data-act="close">✕</button></div>
    <div class="grid2">${field('Brand name', 'name', b.name, 'text', [], bind)}${field('Status', 'status', b.status, 'select', STATUS.map(s => [s, s]), bind)}</div>
    <div class="sums"><div><small>Total</small><b>${money(tot)}</b></div><div><small>Paid</small><b class="pos">${money(paid)}</b></div><div><small>Pending</small><b class="warn">${money(tot - paid)}</b></div></div>
    <div class="ch"><b>Deals</b><button class="btn sm" data-act="deal-add" data-id="${id}">+ Add deal</button></div>
    ${b.deals.map(d => { const o = `data-o="deal:${d.id}"`; return `<div class="deal">
      <input value="${esc(d.title)}" ${o} data-k="title" placeholder="Deal title"><input type="number" value="${d.amount}" ${o} data-k="amount">
      <input type="date" value="${d.deadline}" ${o} data-k="deadline">
      <select ${o} data-k="video"><option value="">No video</option>${state.videos.map(v => `<option value="${v.id}" ${v.id === d.video ? 'selected' : ''}>${esc(v.title)}</option>`).join('')}</select>
      <button class="chip ${d.paid ? 'paid' : 'pending'}" data-act="deal-paid" data-id="${d.id}" data-b="${id}">${d.paid ? 'Paid' : 'Pending'}</button>
      <button class="ico" data-act="deal-del" data-id="${d.id}" data-b="${id}">✕</button></div>`; }).join('') || '<p class="mut">No deals yet — add the first one.</p>'}
    <div class="row end"><button class="btn danger" data-act="brand-del" data-id="${id}">Delete brand</button><span class="grow"></span><button class="btn primary" data-act="close">Done</button></div>`);
}

function taskForm(id, due) {
  const t = id ? find(state.tasks, id) : { title: '', due: due || today(), pri: 'medium' };
  formModal(id ? 'Edit task' : 'New task', field('Task', 'title', t.title) + `<div class="grid2">${field('Due date', 'due', t.due, 'date')}${field('Priority', 'pri', t.pri, 'select', PRI)}</div>`,
    v => { if (!v.title.trim()) return; id ? Object.assign(t, v) : state.tasks.unshift({ id: uid(), done: false, subs: [], ...v }); },
    id ? `<button type="button" class="btn danger" data-act="task-del" data-id="${id}">Delete</button>` : '');
}
function eventForm(id, date) {
  const e = id ? find(state.events, id) : { title: '', date: date || state.sel };
  formModal(id ? 'Edit event' : 'New event', field('Event title', 'title', e.title) + field('Date', 'date', e.date, 'date'),
    v => { if (!v.title.trim()) return; id ? Object.assign(e, v) : state.events.push({ id: uid(), ...v }); },
    id ? `<button type="button" class="btn danger" data-act="event-del" data-id="${id}">Delete</button>` : '');
}
function stageForm(id) {
  const s = id ? find(state.stages, id) : { name: '', color: '#0a84ff' };
  formModal(id ? 'Edit stage' : 'New stage', field('Stage name', 'name', s.name) + field('Color', 'color', s.color, 'color'),
    v => { if (!v.name.trim()) return; if (id) Object.assign(s, v); else { const k = state.stages.findIndex(x => x.locked); state.stages.splice(k < 0 ? state.stages.length : k, 0, { id: uid(), ...v }); } },
    id && !s.locked ? `<button type="button" class="btn danger" data-act="stage-del" data-id="${id}">Delete stage</button>` : '');
}

/* ---------- 4. Views ---------- */
function chart(data, color, i) {
  const W = 600, H = 170, max = Math.max(...data), min = Math.min(...data);
  const line = data.map((v, k) => `${k ? 'L' : 'M'}${(k / 89 * W).toFixed(1)} ${(H - 12 - (v - min) / (max - min || 1) * (H - 30)).toFixed(1)}`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="g${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".25"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
  <path d="${line}L${W} ${H}L0 ${H}Z" fill="url(#g${i})"/><path d="${line}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>`;
}
function calItems() {
  const o = [];
  state.tasks.forEach(t => t.due && o.push({ type: 'task', id: t.id, date: t.due, label: t.title, done: t.done }));
  state.videos.forEach(v => v.deadline && o.push({ type: 'video', id: v.id, date: v.deadline, label: v.title }));
  allDeals().forEach(d => d.deadline && o.push({ type: 'brand', id: d.id, date: d.deadline, label: `${d.brand.name}: ${d.title}`, done: d.paid }));
  state.events.forEach(e => o.push({ type: 'event', id: e.id, date: e.date, label: e.title }));
  return o;
}
const stageOf = id => state.stages.find(s => s.id === id) || state.stages[0];
const bucket = t => t.done ? 'Done' : (!t.due || t.due > day(1)) ? 'Upcoming' : t.due <= today() ? 'Today' : 'Tomorrow';

const views = {};
views.home = () => {
  const h = new Date().getHours(), up = calItems().filter(i => i.date >= today() && !i.done).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);
  const apps = [['New video', '▶', '#ff375f,#ff9f0a', 'video-new'], ['Pipeline', '⇄', '#0a84ff,#5e5ce6', 'go', 'pipeline'], ['Add task', '✓', '#30d158,#30b0c7', 'task-new'], ['Brands', '◆', '#ff9f0a,#ff375f', 'go', 'brands'], ['Calendar', '▦', '#af52de,#5e5ce6', 'go', 'calendar'], ['Event', '+', '#64d2ff,#0a84ff', 'event-new']];
  return {
    title: `Good ${h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'}, Alex`,
    actions: `<button class="btn primary" data-act="video-new">+ New video</button>`,
    html: `<div class="stats">${YT.stats.map(s => `<div class="card stat"><span>${s.k}</span><b>${s.v}</b><em class="${s.d[0] === '-' ? 'neg' : 'pos'}">${s.d} <small>vs previous 90 days</small></em></div>`).join('')}</div>
    <div class="two">${YT.charts.map((c, i) => `<div class="card"><div class="ch"><b>${c.k}</b><small>Last 90 days</small></div>${chart(c.data, c.color, i)}</div>`).join('')}</div>
    <div class="two"><div class="card"><div class="ch"><b>Coming up</b><button class="link" data-act="go" data-p="calendar">Open calendar</button></div>
      ${up.map(i => `<div class="row item" data-act="open-item" data-type="${i.type}" data-id="${i.id}"><i class="dot" style="--c:${TYPE_COLOR[i.type]}"></i><span>${esc(i.label)}</span><small>${niceDate(i.date)}</small></div>`).join('')}</div>
    <div class="card"><div class="ch"><b>Creator apps</b></div><div class="apps">${apps.map(a => `<button class="app-tile" data-act="${a[3]}" data-p="${a[4] || ''}"><i style="--g:linear-gradient(135deg,${a[2]})">${a[1]}</i>${a[0]}</button>`).join('')}</div></div></div>`
  };
};

views.videos = () => ({
  title: 'Videos', actions: `<button class="btn primary" data-act="video-new">+ Add video</button>`,
  html: `<div class="grid3">${state.videos.map(v => { const s = stageOf(v.stage), d = v.checklist.filter(c => c.d).length, br = find(state.brands, v.sponsor);
    return `<div class="card vcard" data-act="video-open" data-id="${v.id}"><div class="thumb">${thumb(v)}</div><div class="vbody"><b>${esc(v.title)}</b>
    <div class="meta"><span class="chip stagechip" style="--c:${s.color}">${esc(s.name)}</span><span class="chip ${v.priority}">${v.priority}</span>${br ? `<span class="chip">${esc(br.name)}</span>` : ''}</div>
    <div class="bar"><i style="width:${d / v.checklist.length * 100}%"></i></div><small>${d}/${v.checklist.length} done · Due ${v.deadline ? niceDate(v.deadline) : '—'} · ${money(v.budget)}</small></div></div>`; }).join('')}</div>`
});

views.pipeline = () => ({
  title: 'Pipeline', actions: `<button class="btn" data-act="stage-new">+ Add stage</button><button class="btn primary" data-act="video-new">+ New video</button>`,
  html: `<div class="board">${state.stages.map((s, i) => { const list = state.videos.filter(v => v.stage === s.id);
    return `<div class="col" style="--c:${s.color}" data-drop="stage" data-stage="${s.id}"><div class="colh"><i class="dot"></i><b>${esc(s.name)}</b><span class="count">${list.length}</span><span class="grow"></span>
      <button class="ico" title="Move left" data-act="stage-move" data-id="${s.id}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>‹</button><button class="ico" title="Move right" data-act="stage-move" data-id="${s.id}" data-dir="1" ${i === state.stages.length - 1 ? 'disabled' : ''}>›</button>
      <button class="ico" title="Rename / color / delete" data-act="stage-edit" data-id="${s.id}">⋯</button></div>
      ${list.map(v => `<div class="pcard" draggable="true" data-drag="video:${v.id}" data-act="video-open" data-id="${v.id}"><b>${esc(v.title)}</b><div class="meta"><span class="chip ${v.priority}">${v.priority}</span><small>${v.deadline ? niceDate(v.deadline) : ''}</small></div></div>`).join('')}
      <button class="addcard" data-act="video-new" data-stage="${s.id}">+ Add video</button></div>`; }).join('')}</div>`
});

const taskRow = t => { const open = state.todoOpen[t.id], sd = t.subs.filter(s => s.d).length;
  return `<div class="task ${t.done ? 'done' : ''}"><div class="row"><button class="chk ${t.done ? 'on' : ''}" data-act="task-toggle" data-id="${t.id}">✓</button><span class="tt" data-act="task-edit" data-id="${t.id}">${esc(t.title)}</span>
    ${t.subs.length ? `<small>${sd}/${t.subs.length}</small>` : ''}<span class="chip ${t.pri}">${t.pri}</span><small class="${t.due && t.due < today() && !t.done ? 'late' : ''}">${t.due ? niceDate(t.due) : 'No date'}</small><button class="ico" data-act="task-open" data-id="${t.id}">${open ? '▴' : '▾'}</button></div>
    ${open ? `<div class="subs">${t.subs.map((s, i) => `<div class="row"><button class="chk sm ${s.d ? 'on' : ''}" data-act="sub-toggle" data-id="${t.id}" data-i="${i}">✓</button><span>${esc(s.t)}</span></div>`).join('')}<input class="subin" data-sub="${t.id}" placeholder="Add subtask and press Enter"></div>` : ''}</div>`; };
views.todo = () => {
  const g = { Today: [], Tomorrow: [], Upcoming: [], Done: [] }; state.tasks.forEach(t => g[bucket(t)].push(t));
  return { title: 'To-Do', actions: `<button class="btn primary" data-act="task-new">+ Add task</button>`,
    html: Object.entries(g).map(([k, l]) => `<div class="card sect"><div class="ch"><b>${k}</b><span class="count">${l.length}</span></div>${l.sort((a, b) => PRI.indexOf(a.pri) - PRI.indexOf(b.pri)).map(taskRow).join('') || '<p class="mut">Nothing here.</p>'}</div>`).join('') };
};

views.brands = () => ({
  title: 'Brands', actions: `<button class="btn primary" data-act="brand-new">+ Add brand</button>`,
  html: `<div class="grid3">${state.brands.map(b => {
    const tot = b.deals.reduce((s, d) => s + +d.amount, 0), paid = b.deals.filter(d => d.paid).reduce((s, d) => s + +d.amount, 0), next = b.deals.filter(d => !d.paid && d.deadline).map(d => d.deadline).sort()[0];
    return `<div class="card brand-card" data-act="brand-open" data-id="${b.id}"><div class="top2"><div class="blogo" style="background:${grad(b.name)}">${esc(b.name[0])}</div><div class="grow"><b>${esc(b.name)}</b></div><span class="chip st-${b.status}">${b.status}</span></div>
      <div class="kv"><small>Payment</small><b>${money(tot)}</b></div><div class="kv"><small>Next deadline</small><b>${next ? niceDate(next) : '—'}</b></div>
      <div class="bar"><i style="width:${tot ? paid / tot * 100 : 0}%"></i></div><small>${money(paid)} paid · ${b.deals.length} deal${b.deals.length === 1 ? '' : 's'}</small></div>`; }).join('')}</div>`
});

views.calendar = () => {
  const c = state.cal, m = c.getMonth(), start = new Date(c.getFullYear(), m, 1); start.setDate(1 - start.getDay());
  const items = calItems(), chipHTML = i => `<div class="cchip ${i.done ? 'done' : ''}" style="--c:${TYPE_COLOR[i.type]}" draggable="true" data-drag="${i.type}:${i.id}" data-act="open-item" data-type="${i.type}" data-id="${i.id}" title="${esc(i.label)}">${esc(i.label)}</div>`;
  let cells = '';
  for (let k = 0; k < 42; k++) { const d = new Date(start); d.setDate(start.getDate() + k); const ds = iso(d), its = items.filter(i => i.date === ds);
    cells += `<div class="day ${d.getMonth() !== m ? 'out' : ''} ${ds === today() ? 'today' : ''} ${ds === state.sel ? 'sel' : ''}" data-drop="day" data-date="${ds}" data-act="day-sel"><span class="n">${d.getDate()}</span>${its.slice(0, 3).map(chipHTML).join('')}${its.length > 3 ? `<small>+${its.length - 3} more</small>` : ''}</div>`; }
  const ag = items.filter(i => i.date === state.sel);
  return { title: 'Calendar', actions: `<button class="btn" data-act="cal-nav" data-n="-1">‹</button><button class="btn" data-act="cal-nav" data-n="0">Today</button><button class="btn" data-act="cal-nav" data-n="1">›</button><button class="btn primary" data-act="event-new">+ Add event</button>`,
    html: `<div class="card"><div class="ch"><b style="font-size:19px">${c.toLocaleDateString('en', { month: 'long', year: 'numeric' })}</b><small>Drag items to another day to reschedule</small></div>
      <div class="cal">${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="dow">${d}</div>`).join('')}${cells}</div>
      <div class="legend">${Object.entries(TYPE_COLOR).map(([k, v]) => `<span><i class="dot" style="--c:${v}"></i>${cap(k)}s</span>`).join('')}</div></div>
      <div class="card" style="margin-top:16px"><div class="ch"><b>${parse(state.sel).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</b><button class="btn sm" data-act="event-new">+ Add event</button></div>
      ${ag.map(i => `<div class="row item" data-act="open-item" data-type="${i.type}" data-id="${i.id}"><i class="dot" style="--c:${TYPE_COLOR[i.type]}"></i><span>${esc(i.label)}</span><small>${cap(i.type)}</small></div>`).join('') || '<p class="mut">Nothing scheduled. Add an event to plan this day.</p>'}</div>` };
};

function render() {
  const v = views[state.page]();
  $('#title').textContent = v.title; $('#actions').innerHTML = v.actions || '';
  $('#view').innerHTML = `<div class="fade">${v.html}</div>`;
  $('#nav').innerHTML = PAGES.map(p => `<button class="${p[0] === state.page ? 'on' : ''}" data-act="go" data-p="${p[0]}"><i>${p[2]}</i>${p[1]}</button>`).join('');
  document.title = `${v.title} · Creator OS`;
}

/* ---------- 5. Actions (single delegated click handler) ---------- */
const A = {
  go: d => { location.hash = d.p; },
  close: closeModal,
  'video-new': d => { const v = { id: uid(), title: 'Untitled video', idea: '', stage: d.stage || state.stages[0].id, thumb: '', sponsor: '', budget: 0, priority: 'medium', deadline: day(14), notes: '', checklist: defaultChecklist(), scripts: [{ name: 'Script v1', text: '' }] }; state.videos.unshift(v); openVideo(v.id); },
  'video-open': d => openVideo(d.id),
  'video-del': d => { if (!confirm('Delete this video?')) return; state.videos = state.videos.filter(v => v.id !== d.id); allDeals().forEach(x => { if (x.video === d.id) dealRef(x.id).video = ''; }); closeModal(); },
  vtab: d => openVideo(cur.id, d.t),
  sidx: d => { sIdx = +d.i; openVideo(cur.id, 'scripts'); },
  'script-add': () => { cur.scripts.push({ name: `Script v${cur.scripts.length + 1}`, text: '' }); sIdx = cur.scripts.length - 1; openVideo(cur.id, 'scripts'); },
  'script-del': () => { cur.scripts.splice(sIdx, 1); sIdx = 0; openVideo(cur.id, 'scripts'); },
  vcheck: d => { const c = cur.checklist[+d.i]; c.d = !c.d; openVideo(cur.id, 'checklist'); },
  'vcheck-del': d => { cur.checklist.splice(+d.i, 1); openVideo(cur.id, 'checklist'); },
  // pipeline stages
  'stage-new': () => stageForm(), 'stage-edit': d => stageForm(d.id),
  'stage-move': d => { const a = state.stages, i = a.findIndex(s => s.id === d.id), j = i + +d.dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; render(); },
  'stage-del': d => { const s = find(state.stages, d.id); if (s.locked) return; if (!confirm(`Delete "${s.name}"? Its videos move to the previous stage.`)) return; const i = state.stages.indexOf(s), to = state.stages[i ? i - 1 : 1].id; state.videos.forEach(v => { if (v.stage === s.id) v.stage = to; }); state.stages.splice(i, 1); closeModal(); },
  // tasks
  'task-new': () => taskForm(), 'task-edit': d => taskForm(d.id),
  'task-toggle': d => { const t = find(state.tasks, d.id); t.done = !t.done; render(); },
  'task-open': d => { state.todoOpen[d.id] = !state.todoOpen[d.id]; render(); },
  'task-del': d => { state.tasks = state.tasks.filter(t => t.id !== d.id); closeModal(); },
  'sub-toggle': d => { const s = find(state.tasks, d.id).subs[+d.i]; s.d = !s.d; render(); },
  // brands
  'brand-new': () => formModal('New brand', field('Brand name', 'name') + field('Status', 'status', 'Lead', 'select', STATUS.map(s => [s, s])), v => { if (v.name.trim()) state.brands.push({ id: uid(), deals: [], ...v }); }),
  'brand-open': d => openBrand(d.id),
  'brand-del': d => { if (!confirm('Delete this brand and its deals?')) return; state.brands = state.brands.filter(b => b.id !== d.id); state.videos.forEach(v => { if (v.sponsor === d.id) v.sponsor = ''; }); closeModal(); },
  'deal-add': d => { find(state.brands, d.id).deals.push({ id: uid(), title: 'New deal', amount: 0, deadline: day(14), paid: false, video: '' }); openBrand(d.id); },
  'deal-paid': d => { const x = dealRef(d.id); x.paid = !x.paid; openBrand(d.b); },
  'deal-del': d => { const b = find(state.brands, d.b); b.deals = b.deals.filter(x => x.id !== d.id); openBrand(d.b); },
  // calendar
  'cal-nav': d => { state.cal = +d.n ? new Date(state.cal.getFullYear(), state.cal.getMonth() + +d.n, 1) : new Date(); if (!+d.n) state.sel = today(); render(); },
  'day-sel': d => { state.sel = d.date; render(); },
  'event-new': d => eventForm(null, d.date), 'event-del': d => { state.events = state.events.filter(e => e.id !== d.id); closeModal(); },
  'open-item': d => ({ task: () => taskForm(d.id), video: () => openVideo(d.id), brand: () => openBrand(allDeals().find(x => x.id === d.id).brand.id), event: () => eventForm(d.id) })[d.type]()
};
document.addEventListener('click', e => {
  if (e.target === $('#modal')) return closeModal();
  const el = e.target.closest('[data-act]'); if (!el || el.matches('input,select,textarea')) return;
  if (el.dataset.act === 'day-sel' && e.target.closest('.cchip')) return; // chip click wins over day click
  A[el.dataset.act]?.(el.dataset);
});

// Live-edit bound inputs inside modals: data-o="kind:id" data-k="field"
const LOOKUP = { video: id => find(state.videos, id), brand: id => find(state.brands, id), deal: id => dealRef(id), script: i => cur.scripts[+i] };
$('#modal').addEventListener('input', e => {
  const t = e.target, o = t.dataset.o; if (!o) return;
  const [kind, id] = o.split(':'), obj = LOOKUP[kind](id);
  if (obj) obj[t.dataset.k] = t.type === 'number' ? +t.value : t.value;
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('#modal').hidden) return closeModal();
  const t = e.target; if (e.key !== 'Enter' || !t.value?.trim()) return;
  if (t.dataset.add === 'check') { cur.checklist.push({ t: t.value.trim(), d: false }); openVideo(cur.id, 'checklist'); $('[data-add]').focus(); }
  if (t.dataset.sub) { const id = t.dataset.sub; find(state.tasks, id).subs.push({ t: t.value.trim(), d: false }); render(); $(`[data-sub="${id}"]`)?.focus(); }
});

// Drag & drop: pipeline cards (reorder + move between stages) and calendar items (reschedule)
let drag = null;
const clearOver = () => document.querySelectorAll('.over').forEach(x => x.classList.remove('over'));
document.addEventListener('dragstart', e => { const el = e.target.closest('[data-drag]'); if (!el) return; drag = el.dataset.drag; e.dataTransfer.setData('text/plain', drag); e.dataTransfer.effectAllowed = 'move'; setTimeout(() => el.classList.add('dragging')); });
document.addEventListener('dragend', () => { drag = null; clearOver(); document.querySelectorAll('.dragging').forEach(x => x.classList.remove('dragging')); });
document.addEventListener('dragover', e => {
  const z = e.target.closest('[data-drop]'); if (!z || !drag) return;
  if (z.dataset.drop === 'stage' && !drag.startsWith('video:')) return;
  e.preventDefault(); if (!z.classList.contains('over')) { clearOver(); z.classList.add('over'); }
});
document.addEventListener('drop', e => {
  const z = e.target.closest('[data-drop]'); if (!z || !drag) return; e.preventDefault();
  const [type, id] = drag.split(':');
  if (z.dataset.drop === 'stage') { if (type !== 'video') return; const before = e.target.closest('[data-drag]')?.dataset.drag.split(':')[1]; moveVideo(id, z.dataset.stage, before); }
  else moveItem(type, id, z.dataset.date);
  drag = null; render();
});
function moveVideo(id, stage, beforeId) {
  const v = find(state.videos, id), arr = state.videos; arr.splice(arr.indexOf(v), 1); v.stage = stage;
  const i = beforeId && beforeId !== id ? arr.findIndex(x => x.id === beforeId) : -1; i < 0 ? arr.push(v) : arr.splice(i, 0, v);
}
function moveItem(type, id, date) { // TODO: persist to Firebase
  if (type === 'task') find(state.tasks, id).due = date;
  if (type === 'video') find(state.videos, id).deadline = date;
  if (type === 'brand') dealRef(id).deadline = date;
  if (type === 'event') find(state.events, id).date = date;
}

/* ---------- 6. Boot ---------- */
const route = () => { const p = location.hash.slice(1); state.page = views[p] ? p : 'home'; window.scrollTo(0, 0); render(); };
window.addEventListener('hashchange', route);
route();
