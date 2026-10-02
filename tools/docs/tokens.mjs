import {escapeHtml} from './markdown.mjs';
export function renderTokenReference(model){
 const descriptions=new Map();
 for(const section of Object.values(model.source))for(const token of section?.tokens??[])descriptions.set('--'+token.name,token.usage??'');
 const entries=model.names.map(name=>({name,usage:descriptions.get(name)??'Типографическая роль.',values:Object.fromEntries(Object.entries(model.sets).map(([scope,values])=>[scope,values[name]])),aliases:model.aliases[name],density:{cozy:model.density.cozy[name]??null,compact:model.density.compact[name]??null}}));
 const value=text=>text===null?'—':`<code>${escapeHtml(text)}</code>`;
 const rows=entries.map(entry=>`<tr id="${escapeHtml(entry.name.slice(2))}"><th scope="row"><code>${escapeHtml(entry.name)}</code></th><td>${escapeHtml(entry.usage)}</td>${Object.values(entry.values).map(v=>`<td>${value(v)}</td>`).join('')}<td>${value(entry.density.cozy)}</td><td>${value(entry.density.compact)}</td><td>${entry.aliases.map(name=>`<a href="#${escapeHtml(name.slice(2))}">${escapeHtml(name)}</a>`).join(', ')}</td></tr>`).join('');
 return{entries,html:`<p>Справочник генерируется из той же модели tokens/source.json, что и CSS. Бренд, оформление и плотность независимы.</p><div class="table-scroll"><table><caption>Публичные CSS-токены</caption><thead><tr><th scope="col">Имя</th><th scope="col">Применение</th><th scope="col">DEFAULT light</th><th scope="col">DEFAULT dark</th><th scope="col">RED2 light</th><th scope="col">RED2 dark</th><th scope="col">Cozy</th><th scope="col">Compact</th><th scope="col">Aliases</th></tr></thead><tbody>${rows}</tbody></table></div>`};
}
