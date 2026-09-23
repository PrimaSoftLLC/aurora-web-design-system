// Поведенческий тест №10: 0, отрицательные и диапазон от нуля — реальные значения.
/* Запуск: node tests/DsFilterMenu.test.js [путь к bundle.js]
   Нужен jsdom (npm i -D jsdom). Проверяет собранный бандл, а не исходник:
   ловит и ошибку в коде, и бандл, пересобранный не из того исходника. */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require=createRequire(import.meta.url);
const {JSDOM}=require('jsdom');
const ROOT=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const dom=new JSDOM('<!doctype html><div id=r></div>',{runScripts:'outside-only'});
const w=dom.window;
w.eval(fs.readFileSync(path.join(ROOT,'components/lib/react.production.min.js'),'utf8'));
w.eval(fs.readFileSync(path.join(ROOT,'components/lib/react-dom.production.min.js'),'utf8'));
w.eval(fs.readFileSync(process.argv[2]||path.join(ROOT,'components/bundle.js'),'utf8'));
const NS=Object.keys(w).find(k=>k.startsWith('AuroraWebDesignSystem_'));const {DsFilterMenu}=w[NS];
const {React,ReactDOM}=w; w.IS_REACT_ACT_ENVIRONMENT=true;
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
function mount(props){const el=w.document.createElement('div');w.document.body.appendChild(el);
  let applied;const root=ReactDOM.createRoot(el);
  w.ReactDOM.flushSync(()=>root.render(React.createElement(DsFilterMenu,{label:'L',...props,onApply:v=>{applied=v}})));
  w.ReactDOM.flushSync(()=>el.querySelector('button').click());
  return {el,inputs:()=>[...el.querySelectorAll('input')],apply:()=>{w.ReactDOM.flushSync(()=>[...el.querySelectorAll('button')].find(b=>b.textContent==='Применить').click());return applied},
    type:(i,v)=>{const inp=el.querySelectorAll('input')[i];const set=Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype,'value').set;
      w.ReactDOM.flushSync(()=>{set.call(inp,v);inp.dispatchEvent(new w.Event('input',{bubbles:true}))})}};}
let m=mount({type:'number',value:0});ok(m.inputs()[0].value==='0','number: 0 показывается как 0');
ok(m.apply()===0,'number: Apply без правок отдаёт 0 (число)');
m=mount({type:'number',value:-5});ok(m.inputs()[0].value==='-5','number: отрицательное показывается');
m=mount({type:'number',value:null});ok(m.inputs()[0].value==='','number: null — пустое поле');
m.type(0,'0');ok(m.apply()===0,'number: ввод «0» даёт число 0, а не строку');
m=mount({type:'number',value:7});m.type(0,'');ok(m.apply()===null,'number: стёртое поле даёт null');
m=mount({type:'number-range',value:{from:0,to:100}});ok(m.inputs()[0].value==='0'&&m.inputs()[1].value==='100','range: диапазон от нуля показывается');
m.type(1,'');const r=m.apply();ok(r.from===0&&r.to===null,'range: {from:0,to:null} после очистки «До»');
m=mount({type:'number-range',value:undefined});m.type(0,'-10');const r2=m.apply();ok(r2.from===-10&&r2.to===null,'range: из пустого — {from:-10,to:null}');
m=mount({type:'string',value:'abc'});m.type(0,'');ok(m.apply()===null,'string: стёртое поле даёт null');
// индикатор активного фильтра на триггере
const trig=v=>{const el=w.document.createElement('div');w.document.body.appendChild(el);w.ReactDOM.flushSync(()=>ReactDOM.createRoot(el).render(React.createElement(DsFilterMenu,{label:'L',type:'number-range',value:v})));return el.querySelector('button').textContent.includes('filter_alt')};
ok(trig({from:0,to:null}),'триггер: диапазон от нуля — фильтр активен');
ok(!trig({from:null,to:null}),'триггер: пустой диапазон — не активен');
ok(!trig({from:'',to:''}),'триггер: старый формат {from:"",to:""} — не активен');
ok(trig(0),'триггер: 0 — фильтр активен');
if(fails){console.error(fails+' FAIL');process.exit(1)}console.log('все проверки прошли');
