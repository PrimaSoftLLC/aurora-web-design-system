import {searchCards} from './search.js';
import {familyFor} from './families.js';
import {parseState,stateUrl,comparisonScopes} from './state.js';
const cards=await(await fetch('cards.json')).json();
let state=parseState(new URL(location.href),cards),renderedKey=null,frames=[];
const nav=document.getElementById('cards'),viewports=document.getElementById('viewports'),search=document.getElementById('search'),compare=document.getElementById('compare');
function save(push=false){history[push?'pushState':'replaceState'](null,'',stateUrl(location.href,state));}
function drawNavigation(){
 const found=searchCards(cards,state.query),groups=new Map();nav.replaceChildren();
 document.getElementById('count').textContent=`${found.length} из ${cards.length} карточек`;
 document.getElementById('search-empty').hidden=found.length>0;
 for(const card of found){const name=familyFor(card.id)?.title??card.group;if(!groups.has(name))groups.set(name,[]);groups.get(name).push(card);}
 for(const[name,items]of groups){const h=document.createElement('h2');h.textContent=name;nav.append(h);
  for(const card of items){const link=document.createElement('a');link.href=stateUrl(location.href,{...state,cardId:card.id});link.dataset.id=card.id;link.textContent=card.title;
   if(card.id===state.cardId)link.setAttribute('aria-current','page');
   link.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;event.preventDefault();state={...state,cardId:card.id,unknown:false};save(true);render();});nav.append(link);}
 }
}
function scopeFrame(record){
 const scope=state.compare?record.fixed:state.scope;
 for(const[name,value]of Object.entries(scope))record.element.contentDocument?.documentElement?.setAttribute('data-ds-'+name,value);
 const caption=`${scope.theme} / ${scope.appearance} / ${scope.density}`;
 record.caption.textContent=caption;record.element.title=record.card.title+' — '+caption;
}
function referenceLinks(card){
 const target=document.getElementById('reference-links');target.replaceChildren();
 for(const ref of [...(card.apiPaths??[]),...(card.documentationPath?[{name:'Описание',path:card.documentationPath}]:[])]){
  const link=document.createElement('a'),url=new URL(ref.path,location.href);for(const[name,value]of Object.entries(state.scope))url.searchParams.set(name,value);
  link.href=url;link.textContent=ref.name==='Описание'?ref.name:'API '+ref.name;if(target.childNodes.length)target.append(document.createTextNode(' · '));target.append(link);
 }
}
function render(){
 for(const[name,value]of Object.entries(state.scope)){document.documentElement.setAttribute('data-ds-'+name,value);document.getElementById(name).value=value;}
 search.value=state.query;compare.setAttribute('aria-pressed',String(state.compare));compare.disabled=state.unknown;drawNavigation();
 const card=cards.find(card=>card.id===state.cardId),error=document.getElementById('card-error');error.hidden=!!card;
 if(!card){document.getElementById('title').textContent='Карточка не найдена';document.getElementById('subtitle').textContent='Выберите карточку в навигации или вернитесь к началу.';document.getElementById('missing-id').textContent=state.cardId;viewports.replaceChildren();document.getElementById('reference-links').replaceChildren();frames=[];renderedKey=null;document.getElementById('local-note').hidden=true;return;}
 document.getElementById('title').textContent=card.title;document.getElementById('subtitle').textContent=card.subtitle;document.getElementById('local-note').hidden=card.scopeMode!=='local';referenceLinks(card);
 const key=card.id+'|'+state.compare;
 if(key!==renderedKey){
  viewports.replaceChildren();frames=[];viewports.className=state.compare?'preview-matrix':'single-preview';
  for(const[index,fixed]of (state.compare?comparisonScopes:[state.scope]).entries()){
   const panel=document.createElement('figure'),caption=document.createElement('figcaption'),scroll=document.createElement('div'),frame=document.createElement('iframe');
   panel.className='preview-panel';scroll.className='preview-scroll';frame.id=state.compare?'preview-'+index:'preview';frame.style.width=card.viewport.width+'px';frame.style.height=card.viewport.height+'px';
   const record={element:frame,caption,fixed,card};frames.push(record);frame.addEventListener('load',()=>scopeFrame(record));
   const url=new URL(card.previewPath,location.href);for(const[name,value]of Object.entries(fixed))url.searchParams.set(name,value);frame.src=url;
   panel.append(caption,scroll);scroll.append(frame);viewports.append(panel);
  }
  renderedKey=key;
 }
 for(const record of frames)scopeFrame(record);
}
search.addEventListener('input',()=>{state.query=search.value;save();drawNavigation();});
for(const name of ['theme','appearance','density'])document.getElementById(name).addEventListener('change',event=>{state.scope[name]=event.target.value;save(true);render();});
compare.addEventListener('click',()=>{state.compare=!state.compare;save(true);render();});
document.getElementById('return-catalogue').addEventListener('click',()=>{state={...state,cardId:cards[0].id,query:'',unknown:false};save(true);render();});
for(const event of ['popstate','hashchange'])window.addEventListener(event,()=>{state=parseState(new URL(location.href),cards);render();});
render();