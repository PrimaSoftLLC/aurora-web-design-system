import React from 'react';
import { DsIcon as Icon } from '../primitives/DsIcon.jsx';
import { dsSlots } from '../layout/DsPageLayout.jsx';
import { useDsStrings } from '../primitives/DsStrings.jsx';

/** Page title block: breadcrumb, back arrow, title, meta and actions. */
export function DsPageHeader({title,eyebrow,breadcrumbs=[],onBack,meta,actions,tabs,children,border=true}){
  const S=useDsStrings();
  const [s]=dsSlots(children,['actions','meta','tabs'],{actions,meta,tabs});
  return <div style={{display:'flex',flexDirection:'column',gap:'var(--ds-gap-sm)',flex:'none',minWidth:0,
    padding:'var(--ds-pad-md) var(--ds-pad-md) '+(s.tabs?'0':'var(--ds-pad-md)'),
    background:'var(--ds-surface)',borderBottom:border?'1px solid var(--ds-border)':'none'}}>
    {breadcrumbs.length?<nav style={{display:'flex',alignItems:'center',gap:4,minWidth:0,font:'var(--ds-type-caption)',color:'var(--ds-fg-subtle)'}}>
      {breadcrumbs.map((b,i)=><React.Fragment key={i}>
        {i?<Icon name="chevron_right" size="var(--ds-icon-xs)" style={{color:'var(--ds-fg-subtle)'}}/>:null}
        {b.onClick?<button type="button" onClick={b.onClick} style={{border:'none',background:'transparent',padding:0,
          font:'inherit',color:'var(--ds-brand-text)',cursor:'pointer'}}>{b.label}</button>
          :<span style={{whiteSpace:'nowrap'}}>{b.label}</span>}</React.Fragment>)}</nav>:null}
    <div style={{display:'flex',alignItems:'center',gap:'var(--ds-gap-sm-plus)',minWidth:0}}>
      {onBack?<button type="button" aria-label={S.back} onClick={onBack} style={{flex:'none',display:'flex',
        alignItems:'center',justifyContent:'center',width:'var(--ds-control-h)',height:'var(--ds-control-h)',
        border:'1px solid var(--ds-border-field)',borderRadius:'var(--ds-radius-control)',background:'var(--ds-surface)',
        color:'var(--ds-fg)',cursor:'pointer'}}><Icon name="arrow_back" size="var(--ds-icon)"/></button>:null}
      <div style={{minWidth:0,display:'flex',flexDirection:'column',gap:1}}>
        {eyebrow?<span style={{font:'var(--ds-type-eyebrow)',letterSpacing:'var(--ds-tracking-eyebrow)',
          textTransform:'uppercase',color:'var(--ds-fg-subtle)'}}>{eyebrow}</span>:null}
        <h1 style={{margin:0,font:'var(--ds-type-title)',color:'var(--ds-fg-strong)',
          letterSpacing:'var(--ds-tracking-tight)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{title}</h1>
      </div>
      {s.meta?<div style={{display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',flex:'none'}}>{s.meta}</div>:null}
      {s.actions?<div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',flex:'none'}}>{s.actions}</div>:null}
    </div>
    {s.tabs}</div>;
}
