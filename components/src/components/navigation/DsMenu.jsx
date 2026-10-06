import React from 'react';
import { DsIcon as Icon } from '../primitives/DsIcon.jsx';
import { useDsLayer } from '../layout/DsDialog.jsx';

/** Anchored popover menu. Wraps its own trigger and closes on outside click or Escape.
 *
 *  Клавиатура по паттерну menu button (WAI-ARIA APG): Enter / Space / ↓ на триггере
 *  открывают меню и ставят фокус на первый пункт, ↑ — на последний; внутри ↑ ↓
 *  ходят по пунктам по кругу, Home / End — к краям; Tab закрывает меню и уводит
 *  фокус дальше; Escape и выбор пункта закрывают меню и ВОЗВРАЩАЮТ фокус на триггер.
 *  Escape идёт через общий стек слоёв — меню в диалоге закрывается само, диалог остаётся. */
export function DsMenu({trigger,items=[],onSelect,align='start',width=240,header,footer,open:openProp,onOpenChange}){
  const [openState,setOpenState]=React.useState(false);
  const open=openProp!=null?openProp:openState;
  const setOpen=v=>{onOpenChange?onOpenChange(v):setOpenState(v)};
  const ref=React.useRef(null),menuRef=React.useRef(null),focusAt=React.useRef('first');
  const menuId=React.useId();
  const triggerEl=()=>ref.current&&ref.current.querySelector('[aria-haspopup]');
  const itemEls=()=>menuRef.current?Array.from(menuRef.current.querySelectorAll('[role="menuitem"]:not([disabled])')):[];
  const close=(restore)=>{setOpen(false);if(restore){const t=triggerEl();if(t&&t.focus)t.focus()}};
  useDsLayer(open,()=>close(true));
  React.useEffect(()=>{if(!open)return;
    const els=itemEls();const el=focusAt.current==='last'?els[els.length-1]:els[0];
    if(el)el.focus();focusAt.current='first';
    const away=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};
    document.addEventListener('mousedown',away);
    return()=>document.removeEventListener('mousedown',away);},[open]);
  /* The trigger owns the ARIA state, not the wrapper: the wrapper is a layout span and
     cannot take focus. Interactive triggers (DsButton or a native button) render
     a real <button>, so Tab, Enter and Space work natively and the click bubbles here. */
  const onTriggerKey=e=>{
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();focusAt.current=e.key==='ArrowUp'?'last':'first';setOpen(true)}
  };
  const triggerNode=React.isValidElement(trigger)
    ? React.cloneElement(trigger,{'aria-haspopup':'menu','aria-expanded':open,'aria-controls':open?menuId:undefined,
        onKeyDown:e=>{onTriggerKey(e);if(trigger.props.onKeyDown)trigger.props.onKeyDown(e)}})
    : trigger;
  const onMenuKey=e=>{
    const els=itemEls();if(!els.length)return;
    const i=els.indexOf(document.activeElement);
    const go=n=>{e.preventDefault();els[(n+els.length)%els.length].focus()};
    if(e.key==='ArrowDown')go(i+1);
    else if(e.key==='ArrowUp')go(i<0?els.length-1:i-1);
    else if(e.key==='Home')go(0);
    else if(e.key==='End')go(els.length-1);
    else if(e.key==='Tab')setOpen(false);
  };
  return <span ref={ref} style={{position:'relative',display:'inline-flex'}}>
    <span onClick={()=>setOpen(!open)} style={{display:'inline-flex'}}>{triggerNode}</span>
    {open?<div ref={menuRef} id={menuId} role="menu" onKeyDown={onMenuKey} style={{position:'absolute',top:'calc(100% + 6px)',zIndex:40,
      left:align==='start'?0:'auto',right:align==='end'?0:'auto',width,maxHeight:320,overflowY:'auto',
      padding:'var(--ds-gap-xs)',background:'var(--ds-surface-raised)',border:'1px solid var(--ds-border)',
      borderRadius:'var(--ds-radius-md)',boxShadow:'var(--ds-shadow-md)'}}>
      {header?<div style={{padding:'var(--ds-pad-tight) var(--ds-pad-sm)',borderBottom:'1px solid var(--ds-divider)',
        marginBottom:'var(--ds-gap-xs)'}}>{header}</div>:null}
      {items.map((it,i)=>it.divider?<span key={'d'+i} role="separator" style={{display:'block',height:1,
        background:'var(--ds-divider)',margin:'var(--ds-gap-xs) 0'}}/>
        :<MenuItem key={it.id||i} it={it} onSelect={()=>{close(true);onSelect&&onSelect(it);it.onClick&&it.onClick()}}/>)}
      {footer?<div style={{padding:'var(--ds-pad-tight) var(--ds-pad-sm)',borderTop:'1px solid var(--ds-divider)',
        marginTop:'var(--ds-gap-xs)'}}>{footer}</div>:null}
    </div>:null}</span>;
}
function MenuItem({it,onSelect}){
  const [h,setH]=React.useState(false);
  const danger=it.tone==='danger';
  return <button type="button" role="menuitem" tabIndex={-1} disabled={it.disabled} onClick={it.disabled?undefined:onSelect}
    onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',width:'100%',textAlign:'left',
      minHeight:'var(--ds-control-h)',padding:'0 var(--ds-pad-sm)',border:'none',borderRadius:'var(--ds-radius-sm)',
      background:h&&!it.disabled?(danger?'var(--ds-danger-bg)':'var(--ds-surface-hover)'):'transparent',
      color:it.disabled?'var(--ds-fg-disabled)':danger?'var(--ds-danger-fg)':'var(--ds-fg)',
      font:'var(--ds-type-ui)',cursor:it.disabled?'not-allowed':'pointer'}}>
    {it.icon?<Icon name={it.icon} size="var(--ds-icon)" style={{color:it.disabled||danger?undefined:'var(--ds-fg-muted)'}}/>:null}
    <span style={{flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{it.label}</span>
    {it.shortcut?<span style={{font:'var(--ds-type-caption)',fontFamily:'var(--ds-font-mono)',color:'var(--ds-fg-subtle)'}}>{it.shortcut}</span>:null}
    {it.checked?<Icon name="check" size="var(--ds-icon-sm)" style={{color:'var(--ds-brand)'}}/>:null}</button>;
}

/** The header user pill plus its menu. */
export function DsUserMenu({name,email,avatarSrc,items=[],onSelect}){
  return <DsMenu align="end" width={260} onSelect={onSelect}
    header={<div style={{display:'flex',flexDirection:'column',gap:2}}>
      <span style={{font:'var(--ds-type-body-strong)',color:'var(--ds-fg)'}}>{name}</span>
      {email?<span style={{font:'var(--ds-type-caption)',color:'var(--ds-fg-subtle)'}}>{email}</span>:null}</div>}
    items={items}
    trigger={<button type="button"
      style={{display:'inline-flex',alignItems:'center',gap:'var(--ds-gap-sm)',height:'var(--ds-control-h-sm)',
        padding:avatarSrc?'0 6px 0 2px':'0 4px 0 10px',background:'var(--ds-header-chip-bg)',
        border:'1px solid var(--ds-header-chip-border)',borderRadius:'var(--ds-radius-pill)',
        font:'var(--ds-type-ui)',color:'var(--ds-header-fg)',cursor:'pointer',whiteSpace:'nowrap',
        margin:0,appearance:'none',textAlign:'left'}}>
      {avatarSrc?<img src={avatarSrc} alt="" style={{width:'var(--ds-icon-lg)',height:'var(--ds-icon-lg)',borderRadius:'var(--ds-radius-circle)',objectFit:'cover'}}/>:null}
      {name}<Icon name="expand_more" size="var(--ds-icon-sm)"/>
    </button>}/>;
}
