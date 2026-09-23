import React from 'react';
import { DsIcon as Icon } from '../primitives/DsIcon.jsx';
import { usePress } from './DsButton.jsx';
const Ds_OVERLAY=(ink,depth)=>{const c='color-mix(in oklab,'+ink+' '+depth+',transparent)';return 'linear-gradient(0deg,'+c+','+c+')'};
const DsIB_SIZE={sm:'var(--ds-control-h-sm)',md:'var(--ds-control-h)',lg:'var(--ds-control-h-lg)'};

/** Square icon-only button. `label` is required — it becomes the aria-label and the title. */
export function DsIconButton({icon,label,tone='ghost',size='md',active,loading=false,disabled=false,dot=false,rotate,onClick,...rest}){
  const off=disabled||loading;
  const {hover:h,pressed:p,handlers,rest:own}=usePress(off,rest);
  let bg='transparent',fg='var(--ds-fg-muted)',bd='1px solid transparent';
  if(tone==='secondary'){bg='var(--ds-surface)';bd='1px solid var(--ds-border-field)';fg='var(--ds-fg)'}
  if(tone==='primary'){bg='var(--ds-brand)';fg='var(--ds-on-brand)'}
  if(tone==='danger'){fg='var(--ds-danger-solid)'}
  if(tone==='onHeader'){fg='var(--ds-header-icon-fg)'}
  if(active){bg='var(--ds-brand-subtle)';fg='var(--ds-brand-text)'}
  /* a filled or tinted icon button answers with an overlay in its own ink; the
     unfilled tones still move their ground. */
  let ov;
  const depth=p?'var(--ds-overlay-press)':'var(--ds-overlay-hover)';
  if((h||p)&&!off&&(tone==='primary'||active))ov=Ds_OVERLAY(fg,depth);
  else if((h||p)&&!off&&tone==='onHeader'){bg='var(--ds-header-hover)';if(p)ov=Ds_OVERLAY(fg,depth)}
  else if((h||p)&&!off)bg=p?'var(--ds-surface-active)':'var(--ds-surface-hover)';
  if(off){fg='var(--ds-fg-disabled)';bg='transparent'}
  /* `active` — устойчивое выбранное состояние (кнопка-переключатель), не нажатие:
     задан — кнопка объявляет aria-pressed; не задан — это обычная кнопка. */
  return <button type="button" aria-label={label} title={label} disabled={off} onClick={off?undefined:onClick}
    aria-pressed={active==null?undefined:!!active} {...own} {...handlers}
    style={{boxSizing:'border-box',display:'inline-flex',alignItems:'center',justifyContent:'center',flex:'none',
      width:DsIB_SIZE[size],height:DsIB_SIZE[size],padding:0,borderRadius:'var(--ds-radius-icon-button)',border:bd,background:bg,backgroundImage:ov,color:fg,
      position:'relative',cursor:off?'not-allowed':'pointer',transition:'var(--ds-transition-control)'}}>
    {loading?<span aria-hidden="true" style={{width:14,height:14,borderRadius:'50%',border:'2px solid currentColor',borderTopColor:'transparent',animation:'ds-spin 700ms linear infinite'}}/>
      :<Icon name={icon} size={size==='sm'?'var(--ds-icon-sm)':'var(--ds-icon)'} rotate={rotate}/>}
    {dot&&!off?<span aria-hidden="true" style={{position:'absolute',top:5,right:5,width:7,height:7,borderRadius:'50%',
      background:'var(--ds-accent-mark)',border:'1px solid '+(bg==='transparent'?'var(--ds-surface)':bg)}}/>:null}
  </button>;
}
