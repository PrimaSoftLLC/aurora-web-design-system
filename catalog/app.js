const cards=await(await fetch('cards.json')).json();
const nav=document.getElementById('cards'),frame=document.getElementById('preview');
const scope={theme:'DEFAULT',appearance:'light',density:'cozy'};
document.getElementById('count').textContent=`${cards.length} карточек`;
for(const group of [...new Set(cards.map(c=>c.group))].sort()){
 const h=document.createElement('h2');h.textContent=group;nav.append(h);
 for(const card of cards.filter(c=>c.group===group)){const a=document.createElement('a');a.href='#'+card.id;a.dataset.id=card.id;a.textContent=card.title;nav.append(a);}
}
function applyScope(){for(const[k,v]of Object.entries(scope)){document.documentElement.setAttribute(`data-ds-${k}`,v);frame.contentDocument?.documentElement?.setAttribute(`data-ds-${k}`,v);}}
function show(){const card=cards.find(c=>c.id===decodeURIComponent(location.hash.slice(1)))??cards[0];document.getElementById('title').textContent=card.title;document.getElementById('subtitle').textContent=card.subtitle;frame.src=card.previewPath;frame.style.height=card.viewport.height+'px';for(const a of nav.querySelectorAll('a')){if(a.dataset.id===card.id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}}
for(const name of Object.keys(scope))document.getElementById(name).addEventListener('change',e=>{scope[name]=e.target.value;applyScope();});
frame.addEventListener('load',applyScope);window.addEventListener('hashchange',show);show();
