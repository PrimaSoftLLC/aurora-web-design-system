import React from 'react';
import { DsIcon as Icon } from '../primitives/DsIcon.jsx';
import { useDsStrings } from '../primitives/DsStrings.jsx';
const DsTOAST_ICON={neutral:'info',info:'info',success:'check_circle',warning:'warning',danger:'error'};

/** Transient message. Inverse ground so it never competes with a DsBanner. */
export function DsToast({tone='neutral',children,action,actionLabel,onClose,icon}){
  const S=useDsStrings();
  const accent=tone==='neutral'?'var(--ds-fg-on-inverse)':'var(--ds-'+tone+'-fg-on-inverse)';
  return <div role={tone==='danger'?'alert':'status'} style={{display:'flex',alignItems:'center',gap:'var(--ds-gap-sm-plus)',
    minHeight:'var(--ds-control-h-lg)',maxWidth:520,padding:'var(--ds-pad-tight) var(--ds-pad-sm) var(--ds-pad-tight) var(--ds-pad-md)',
    background:'var(--ds-surface-inverse)',color:'var(--ds-fg-on-inverse)',
    borderRadius:'var(--ds-radius-md)',boxShadow:'var(--ds-shadow-lg)'}}>
    {tone!=='neutral'||icon?<Icon name={icon||DsTOAST_ICON[tone]} size="var(--ds-icon)" style={{color:accent||'inherit'}}/>:null}
    <span style={{flex:1,minWidth:0,font:'var(--ds-type-body)'}}>{children}</span>
    {action?<button type="button" onClick={action} style={{flex:'none',border:'none',background:'transparent',
      font:'var(--ds-type-ui)',color:'var(--ds-fg-action-on-inverse)',cursor:'pointer',padding:'0 4px',
      textDecoration:'underline',textUnderlineOffset:2}}>{actionLabel||S.undo}</button>:null}
    {onClose?<button type="button" aria-label={S.close} onClick={onClose} style={{flex:'none',display:'flex',
      alignItems:'center',justifyContent:'center',width:24,height:24,padding:0,border:'none',background:'transparent',
      color:'inherit',cursor:'pointer',borderRadius:'var(--ds-radius-xs)'}}><Icon name="close" size="var(--ds-icon-sm)"/></button>:null}
  </div>;
}

/** Fixed stack for toasts. Bottom-centre; newest last. */
export function DsToastStack({children,position='bottom-center'}){
  const pos={bottom:24,left:position==='bottom-center'?'50%':undefined,right:position==='bottom-right'?24:undefined,
    transform:position==='bottom-center'?'translateX(-50%)':undefined};
  return <div style={{position:'fixed',zIndex:60,display:'flex',flexDirection:'column',gap:'var(--ds-gap-sm)',
    alignItems:position==='bottom-right'?'flex-end':'center',...pos}}>{children}</div>;
}
