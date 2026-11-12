import {state,save} from './store.js';
import {today,dateKey,uid} from './utils.js';
export function getTimer(){if(!state.timer)state.timer={mode:'work',duration:state.settings.work*60,remaining:state.settings.work*60,endAt:null,id:uid(),taskId:null,cycle:0};return state.timer;}
export function remaining(){const t=getTimer();return t.endAt?Math.min(t.duration,Math.max(0,Math.ceil((t.endAt-Date.now())/1000))):t.remaining;}
export function setMode(mode){const prev=getTimer();state.timer={...prev,mode,duration:state.settings[mode]*60,remaining:state.settings[mode]*60,endAt:null,id:uid()};save();}
export function toggle(){const t=getTimer();if(t.endAt){t.remaining=remaining();t.endAt=null;}else{if(t.remaining<=0)t.remaining=t.duration;t.endAt=Date.now()+t.remaining*1000;}save();}
export function reset(){const t=getTimer();t.remaining=state.settings[t.mode]*60;t.duration=t.remaining;t.endAt=null;t.id=uid();save();}
export function tick(){const t=getTimer();if(!t.endAt||remaining()>0)return null;const endedAt=t.endAt,mode=t.mode;
 if(mode==='work'&&!state.sessions.some(s=>s.id===t.id)){state.sessions.push({id:t.id,date:dateKey(new Date(endedAt)),minutes:t.duration/60,endedAt,taskId:t.taskId,demo:false});t.cycle++;}
 t.mode=mode==='work'?(t.cycle%4===0?'long':'short'):'work';t.duration=state.settings[t.mode]*60;t.remaining=t.duration;t.endAt=null;t.id=uid();save();return mode;
}
