import React from 'react';
import { DsIcon as Icon } from '../primitives/DsIcon.jsx';
import { useDsStrings } from '../primitives/DsStrings.jsx';

/* Две модели, выбранные по месту:
   - tone="onHeader" — НАВИГАЦИЯ между разделами продукта: <nav> с кнопками,
     активная — aria-current="page". Каждый раздел — свой Tab-стоп, стрелки не нужны;
     role="tab" здесь был бы неправдой — за разделом не стоит tabpanel этой страницы.
   - underline / segmented — ВКЛАДКИ внутри страницы: role="tablist", один вход
     через Tab (roving tabindex), ← → Home End переводят фокус и выбирают вкладку
     (автоматическая активация). Связь с панелью — через idBase и DsTabPanel:
     вкладка получает aria-controls, панель — aria-labelledby. */
/** Внутри DsAppHeader — его <nav> уже ориентир. */
export const DsInHeader=React.createContext(false);
export function dsTabIds(idBase,id){return {tabId:idBase+'-tab-'+id,panelId:idBase+'-panel-'+id}}

/** Панель вкладки. Скрыта, пока вкладка не выбрана; подписана своей вкладкой. */
export function DsTabPanel({idBase,id,active,children,style}){
  const {tabId,panelId}=dsTabIds(idBase,id);
  return <div role="tabpanel" id={panelId} aria-labelledby={tabId} hidden={!active} tabIndex={0} style={style}>{active?children:null}</div>;
}

/** Tab rail. `onHeader` for the header, `underline` in content, `segmented` for small switches. */
export function DsTabs({items=[],active,onChange,tone='underline',stack=true,idBase,'aria-label':ariaLabel}){
  const S=useDsStrings();
  const inHeader=React.useContext(DsInHeader);
  const listRef=React.useRef(null);
  const onHeader=tone==='onHeader';
  const ids=id=>idBase?dsTabIds(idBase,id):{};
  const onKey=e=>{
    const tabs=Array.from(listRef.current.querySelectorAll('[role="tab"]'));
    const i=tabs.indexOf(e.target);if(i<0)return;
    let n=null;
    if(e.key==='ArrowRight')n=(i+1)%tabs.length;
    else if(e.key==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;
    else if(e.key==='Home')n=0;
    else if(e.key==='End')n=tabs.length-1;
    if(n==null)return;
    e.preventDefault();tabs[n].focus();
    if(onChange)onChange(items[n].id);
  };
  const tabProps=it=>{const on=it.id===active,{tabId,panelId}=ids(it.id);
    return {role:'tab','aria-selected':on,tabIndex:on||(active==null&&it===items[0])?0:-1,id:tabId,'aria-controls':panelId}};
  if(tone==='segmented')return <div ref={listRef} role="tablist" aria-label={ariaLabel} onKeyDown={onKey} style={{display:'inline-flex',gap:2,padding:2,
    background:'var(--ds-bg-sunken)',border:'1px solid var(--ds-border)',borderRadius:'var(--ds-radius-control)'}}>
    {items.map(it=>{const on=it.id===active;
      return <button key={it.id} type="button" {...tabProps(it)} onClick={()=>onChange&&onChange(it.id)}
        style={{display:'inline-flex',alignItems:'center',gap:6,height:'var(--ds-control-h-sm)',padding:'0 12px',border:'none',
          borderRadius:'calc(var(--ds-radius-control) - 2px)',cursor:'pointer',font:'var(--ds-type-ui)',
          background:on?'var(--ds-surface)':'transparent',color:on?'var(--ds-fg-strong)':'var(--ds-fg-muted)',
          boxShadow:on?'var(--ds-shadow-xs)':'none',transition:'var(--ds-transition-control)'}}>
        {it.icon?<Icon name={it.icon} size="var(--ds-icon-sm)"/>:null}{it.label}</button>;})}
  </div>;
  const stacked=onHeader&&stack;
  const rail={display:'flex',alignItems:'stretch',gap:onHeader?2:'var(--ds-gap-md)',minWidth:0,
    height:onHeader?'var(--ds-header-h)':undefined,borderBottom:onHeader?'none':'1px solid var(--ds-border)'};
  /* В шапке ориентир <nav> ставит DsAppHeader; вне шапки — ставим его сами. */
  if(onHeader){const Wrap=inHeader?'div':'nav';
    return <Wrap aria-label={inHeader?undefined:(ariaLabel||S.tabs.nav)} style={rail}>
    {items.map(it=><Tab key={it.id} it={it} on={it.id===active} onHeader stacked={stacked} onChange={onChange}
      a11y={{'aria-current':it.id===active?'page':undefined}}/>)}
  </Wrap>;}
  return <div ref={listRef} role="tablist" aria-label={ariaLabel} onKeyDown={onKey} style={rail}>
    {items.map(it=><Tab key={it.id} it={it} on={it.id===active} onHeader={false} stacked={false} onChange={onChange} a11y={tabProps(it)}/>)}
  </div>;
}
function Tab({it,on,onHeader,stacked,onChange,a11y}){
  const [h,setH]=React.useState(false);
  const fg=onHeader?(on?'var(--ds-header-tab-fg-active)':'var(--ds-header-fg-muted)'):(on?'var(--ds-brand-text)':'var(--ds-fg-muted)');
  /* A tab count uses the tenant accent on every band (--ds-header-badge-*).
     Keep both placements borderless: the count is read from contrasting ink. */
  const badgeBg='var(--ds-header-badge-bg)';
  const badgeFg='var(--ds-header-badge-fg)';
  /* icon-only ink rule from the header band: a glyph carries no text mass, so an
     unselected tab's glyph gets --ds-header-icon-fg, not the muted label value. */
  const iconFg=onHeader&&!on?'var(--ds-header-icon-fg)':undefined;
  const icon=it.icon?<Icon name={it.icon} size="var(--ds-icon)" style={{color:iconFg}}/>:null;
  return <button type="button" {...a11y} onClick={()=>onChange&&onChange(it.id)}
    onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{position:'relative',display:'inline-flex',flexDirection:stacked?'column':'row',
      alignItems:'center',justifyContent:'center',gap:stacked?2:'var(--ds-gap-sm)',flex:'none',
      padding:stacked?'0 10px':(onHeader?'0 14px':'0 0 10px'),height:onHeader?'100%':undefined,
      border:'none',background:onHeader&&(on||h)?'var(--ds-header-hover)':'transparent',
      font:stacked?'var(--ds-type-caption)':'var(--ds-type-ui)',lineHeight:stacked?1.1:undefined,
      color:fg,cursor:'pointer',whiteSpace:'nowrap',transition:'var(--ds-transition-control)'}}>
    {stacked&&icon?<span style={{position:'relative',display:'inline-flex',flex:'none'}}>{icon}
      {it.badge!=null?<span style={{position:'absolute',top:-5,left:'58%',height:14,minWidth:14,padding:'0 3px',
        display:'grid',placeItems:'center',borderRadius:'var(--ds-radius-pill)',font:'var(--ds-type-eyebrow)',lineHeight:1,
        background:badgeBg,color:badgeFg,boxSizing:'content-box'}}>{it.badge}</span>:null}</span>:icon}
    {it.label}
    {it.badge!=null&&!(stacked&&icon)?<span style={{font:'var(--ds-type-eyebrow)',minWidth:16,padding:'1px 5px',textAlign:'center',
      borderRadius:'var(--ds-radius-pill)',background:badgeBg,color:badgeFg}}>{it.badge}</span>:null}
    <span aria-hidden="true" style={{position:'absolute',left:onHeader?10:0,right:onHeader?10:0,bottom:0,height:onHeader?3:2,
      borderRadius:onHeader?'var(--ds-radius-pill) var(--ds-radius-pill) 0 0':'var(--ds-radius-pill)',
      background:on?(onHeader?'var(--ds-header-indicator)':'var(--ds-brand)'):'transparent'}}/>
  </button>;
}
