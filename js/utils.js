export const $ = (q, root = document) => root.querySelector(q);
export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const dateKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const parseDay = key => new Date(`${key}T12:00:00`);
export const shiftDay = (key, delta) => { const d = parseDay(key); d.setDate(d.getDate()+delta); return dateKey(d); };
export const today = () => dateKey();
export const humanDate = (key, options={day:'numeric', month:'long'}) => new Intl.DateTimeFormat('ru-RU', options).format(parseDay(key));
export const minutesLabel = n => n >= 60 ? `${Math.floor(n/60)} ч${n%60 ? ` ${n%60} мин` : ''}` : `${n} мин`;
export const categories = {work:{label:'Работа',color:'#557767'},personal:{label:'Личное',color:'#c6906d'},learning:{label:'Развитие',color:'#8a84ac'},health:{label:'Здоровье',color:'#96aa5d'}};
export const priorities = {high:'Высокий',medium:'Средний',low:'Низкий'};
const paths = {
 grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
 tasks:'<rect x="4" y="3" width="16" height="18" rx="3"/><path d="m8 9 1 1 2-2m3 1h3m-9 6 1 1 2-2m3 1h3"/>',
 timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6m-3 0v3m6 0 2-2"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h1m6 0h1m-8 3h1"/>',
 chart:'<path d="M4 3v17h17M8 15v-4m5 4V7m5 8V4"/>',
 settings:'<path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h6l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3z"/><circle cx="12" cy="12" r="3"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 chevron:'<path d="m9 5 7 7-7 7"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
 moon:'<path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z"/>',
 play:'<path d="m9 5 11 7-11 7z"/>',
 pause:'<path d="M8 5v14M16 5v14"/>',
 reset:'<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
 edit:'<path d="m15 4 5 5M4 20l5-1L21 7l-5-5L4 14z"/>',
 trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 flame:'<path d="M13 2c2 6-3 6-1 10 2 0 3-2 3-3 6 5 4 13-3 13C4 22 1 13 8 7c-1 4 1 5 2 5-2-5 3-5 3-10Z"/>',
 leaf:'<path d="M20 3C8 2 2 8 5 15s17 7 15-12Z M5 20 16 8"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
 upload:'<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>',
 grip:'<circle cx="9" cy="6" r=".7"/><circle cx="15" cy="6" r=".7"/><circle cx="9" cy="12" r=".7"/><circle cx="15" cy="12" r=".7"/><circle cx="9" cy="18" r=".7"/><circle cx="15" cy="18" r=".7"/>',
 volume:'<path d="m12 4-6 5H3v6h3l6 5zM16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
 bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 3c-1 1-1 1-1 3m0 3h.01"/>'
};
export const icon = (name, cls='') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.grid}</svg>`;
export function streak(state) { const days = new Set([...state.tasks.filter(t=>t.done&&t.completedAt).map(t=>dateKey(new Date(t.completedAt))),...state.sessions.map(s=>s.date)]); let key=today(), count=0; if(!days.has(key)) key=shiftDay(key,-1); while(days.has(key)){count++;key=shiftDay(key,-1);} return count; }
