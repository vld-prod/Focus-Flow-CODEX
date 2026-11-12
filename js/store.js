import {uid, today, shiftDay, dateKey, categories, priorities} from './utils.js';
export const STORAGE_KEY = 'focus-flow-v1';
export const defaults = {theme:'light',name:'Алекс',work:25,short:5,long:15,sound:true,dailyGoal:4};
export function blank(){return {version:1,settings:{...defaults},tasks:[],sessions:[],timer:null};}
function seed(){
 const state=blank(), day=today();
 const add=(title,category,time,duration,priority='medium',done=false,date=day)=>({id:uid(),title,description:'',category,time,duration,priority,done,date,createdAt:Date.now(),completedAt:done?new Date(`${date}T10:00:00`).getTime():null,demo:true});
 state.tasks=[add('Собрать концепцию нового проекта','work','09:00',60,'high',true),add('Утренняя прогулка без телефона','health','08:00',30,'low',true),add('Продумать структуру портфолио','work','11:30',45,'high'),add('Прочитать главу книги','learning','14:00',25),add('Подготовиться к встрече с командой','work','15:30',30),add('Оставить время для себя','personal','18:00',45,'low'),add('Разобрать заметки за неделю','personal','10:00',30,'medium',false,shiftDay(day,1)),add('Изучить новую технику иллюстрации','learning','12:00',45,'medium',false,shiftDay(day,2))];
 for(let i=1;i<=9;i++){const d=shiftDay(day,-i);for(let j=0;j<(i%3)+1;j++) state.tasks.push(add(['Завершить рабочую задачу','Уделить время развитию','Позаботиться о себе'][j],['work','learning','health'][j],'09:00',25,'medium',true,d)); for(let j=0;j<(i%4)+1;j++) state.sessions.push({id:uid(),date:d,minutes:25,endedAt:new Date(`${d}T${String(10+j).padStart(2,'0')}:00:00`).getTime(),taskId:null,demo:true});}
 state.sessions.push({id:uid(),date:day,minutes:25,endedAt:Date.now()-3600000,taskId:null,demo:true},{id:uid(),date:day,minutes:25,endedAt:Date.now()-1800000,taskId:null,demo:true});
 return state;
}
const validDay=v=> typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(new Date(`${v}T12:00:00`).getTime())&&dateKey(new Date(`${v}T12:00:00`))===v;
const finite=(v,min,max)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
const str=(v,max)=>typeof v==='string'&&v.length<=max;
export function validate(data){
 if(!data||data.version!==1||!data.settings||!Array.isArray(data.tasks)||!Array.isArray(data.sessions)||data.tasks.length>5000||data.sessions.length>20000) throw new Error('Неверный формат файла FOCUS FLOW.');
 const s=data.settings;
 if(!['light','dark'].includes(s.theme)||!str(s.name,40)||!finite(s.work,1,180)||!finite(s.short,1,60)||!finite(s.long,1,120)||!finite(s.dailyGoal,1,20)||typeof s.sound!=='boolean')throw new Error('В файле некорректные настройки.');
 const ids=new Set(); const tasks=data.tasks.map(t=>{
  if(!t||!str(t.id,100)||!t.id||ids.has(t.id)||!str(t.title,160)||!t.title.trim()||!str(t.description,4000)||!Object.hasOwn(categories,t.category)||!Object.hasOwn(priorities,t.priority)||!validDay(t.date)||!(t.time===''||typeof t.time==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(t.time))||!finite(t.duration,5,1440)||typeof t.done!=='boolean'||!finite(t.createdAt,0,8.64e15)||!(t.completedAt===null||finite(t.completedAt,0,8.64e15))) throw new Error('В файле обнаружена некорректная задача.');
  ids.add(t.id);return {id:t.id,title:t.title,description:t.description,category:t.category,priority:t.priority,date:t.date,time:t.time,duration:t.duration,done:t.done,createdAt:t.createdAt,completedAt:t.completedAt,demo:t.demo===true};
 });
 const sessionIds=new Set();const sessions=data.sessions.map(s=>{if(!s||!str(s.id,100)||!s.id||sessionIds.has(s.id)||!validDay(s.date)||!finite(s.minutes,1,180)||!finite(s.endedAt,0,8.64e15)||!(s.taskId===null||str(s.taskId,100)))throw new Error('В файле обнаружена некорректная сессия.');sessionIds.add(s.id);return {id:s.id,date:s.date,minutes:s.minutes,endedAt:s.endedAt,taskId:s.taskId,demo:s.demo===true};});
 let timer=null; const t=data.timer;
 if(t!=null){if(!['work','short','long'].includes(t.mode)||!finite(t.duration,1,10800)||!finite(t.remaining,0,10800)||!(t.endAt===null||finite(t.endAt,0,8.64e15))||!str(t.id,100)||!(t.taskId===null||str(t.taskId,100))||!finite(t.cycle,0,1e8))throw new Error('В файле некорректный таймер.');timer={mode:t.mode,duration:t.duration,remaining:t.remaining,endAt:t.endAt,id:t.id,taskId:t.taskId,cycle:t.cycle};}
 return {version:1,settings:{theme:s.theme,name:s.name,work:s.work,short:s.short,long:s.long,sound:s.sound,dailyGoal:s.dailyGoal},tasks,sessions,timer};
}
let storageError=null;
export function load(){try{const raw=localStorage.getItem(STORAGE_KEY);return raw?validate(JSON.parse(raw)):seed();}catch(error){storageError='Не удалось прочитать сохранённые данные. Сначала попробуйте экспортировать данные или проверьте доступ к хранилищу.';return blank();}}
export let state=load();
let listener=()=>{};
export const onStorageError=fn=>{listener=fn;if(storageError)fn(storageError);};
export function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));return true;}catch(error){listener('Браузер не сохранил изменения. Проверьте свободное место; пока можно экспортировать JSON.');return false;}}
export function replace(next){state=validate(next);save();}
