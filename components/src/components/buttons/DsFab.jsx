import React from 'react';
import { DsIcon as Icon } from '../primitives/DsIcon.jsx';
import { usePress } from './DsButton.jsx';

const Ds_OVERLAY=(ink,depth)=>{const c='color-mix(in oklab,'+ink+' '+depth+',transparent)';return 'linear-gradient(0deg,'+c+','+c+')'};

/** Floating action button. Pill when it carries a label, circle when icon-only. */
export function DsFab({icon='add',label,extended=false,tone='primary',size='md',disabled=false,onClick,...rest}){
  const {hover:h,pressed:p,handlers,rest:own}=usePress(disabled,rest);
  const d=size==='sm'?40:size==='lg'?56:48;
  const bg=tone==='accent'?'var(--ds-accent)':tone==='surface'?'var(--ds-surface)':'var(--ds-brand)';
  const fg=tone==='accent'?'var(--ds-accent-on)':tone==='surface'?'var(--ds-fg)':'var(--ds-on-brand)';
  const ov=(h||p)&&!disabled?(tone==='surface'?undefined:Ds_OVERLAY(fg,p?'var(--ds-overlay-press)':'var(--ds-overlay-hover)')):undefined;
  return <button type="button" aria-label={label} title={label} disabled={disabled} onClick={disabled?undefined:onClick}
    {...own} {...handlers}
    style={{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:'var(--ds-gap-sm)',flex:'none',
      height:d,width:extended?'auto':d,padding:extended?'0 '+(d/3)+'px':0,
      borderRadius:extended?'var(--ds-radius-pill)':'var(--ds-radius-circle)',
      border:tone==='surface'?'1px solid var(--ds-border)':'none',
      background:disabled?'var(--ds-surface-disabled)':(tone==='surface'&&(h||p)?(p?'var(--ds-surface-active)':'var(--ds-surface-hover)'):bg),backgroundImage:ov,
      color:disabled?'var(--ds-fg-disabled)':fg,
      font:'var(--ds-type-body-strong)',cursor:disabled?'not-allowed':'pointer',
      boxShadow:disabled?'none':h?'var(--ds-shadow-lg)':'var(--ds-shadow-md)',
      transition:'var(--ds-transition-control)'}}>
    <Icon name={icon} size={size==='sm'?18:24}/>{extended?<span>{label}</span>:null}</button>;
}
