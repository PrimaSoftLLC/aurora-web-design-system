import React from 'react';
import { DsIcon as Icon } from '../primitives/DsIcon.jsx';
import { dsSlots } from '../layout/DsPageLayout.jsx';

/** Why this area is blank, and the one action that fills it. Replaces bare "No data". */
export function DsEmptyState({icon='inbox',title,description,action,secondary,children,tone='neutral',size='md'}){
  const [s]=dsSlots(children,['action','secondary'],{action,secondary});
  const sm=size==='sm';
  return <div role="status" style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',
    gap:sm?'var(--ds-gap-sm)':'var(--ds-gap-sm-plus)',padding:sm?'var(--ds-pad-lg) var(--ds-pad-md)':'var(--ds-pad-xl) var(--ds-pad-lg)',
    minWidth:0}}>
    <Icon name={icon} size={sm?32:44} style={{color:tone==='neutral'?'var(--ds-fg-subtle)':'var(--ds-'+tone+'-solid)'}}/>
    <div style={{display:'flex',flexDirection:'column',gap:4,maxWidth:'34ch'}}>
      <span style={{font:sm?'var(--ds-type-body-strong)':'var(--ds-type-section)',color:'var(--ds-fg)'}}>{title}</span>
      {description?<span style={{font:'var(--ds-type-body)',color:'var(--ds-fg-muted)',textWrap:'pretty'}}>{description}</span>:null}
    </div>
    {s.action||s.secondary?<div style={{display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',marginTop:sm?0:4,flexWrap:'wrap',justifyContent:'center'}}>
      {s.action}{s.secondary}</div>:null}
  </div>;
}
