import React from 'react';
import { DsIcon as Icon } from '../primitives/DsIcon.jsx';
const DsBANNER_ICON={info:'info',success:'check_circle',warning:'warning',danger:'error',neutral:'info'};
import { dsSlots } from '../layout/DsPageLayout.jsx';
import { useDsStrings } from '../primitives/DsStrings.jsx';
/** Permanent in-page message. Tinted ground, 1px line, no left accent bar. */
export function DsBanner({tone='info',title,children,actions,onClose,compact=false}){
  const S=useDsStrings();
  const [s,body]=dsSlots(children,['actions'],{actions});
  const hasBody=body.some(c=>typeof c==='string'?c.trim():c!=null&&c!==false);
  const role=tone==='danger'?'alert':'status';
  return <div role={role} style={{display:'flex',gap:'var(--ds-gap-sm-plus)',alignItems:'flex-start',
    padding:compact?'var(--ds-pad-tight) var(--ds-pad-sm)':'var(--ds-pad-sm) var(--ds-pad-md)',
    background:'var(--ds-'+tone+'-bg)',border:'1px solid var(--ds-'+tone+'-line)',
    borderRadius:'var(--ds-radius-container)',color:'var(--ds-'+tone+'-fg)',minWidth:0}}>
    <Icon name={DsBANNER_ICON[tone]} size="var(--ds-icon)" style={{height:'calc(var(--ds-text-14) * var(--ds-lh-normal))',color:'var(--ds-'+tone+'-solid)'}}/>
    <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',gap:4}}>
      {title?<div style={{font:'var(--ds-type-body-strong)',color:'var(--ds-'+tone+'-fg)'}}>{title}</div>:null}
      {hasBody?<div style={{font:'var(--ds-type-body)',color:'var(--ds-fg-muted)',textWrap:'pretty'}}>{body}</div>:null}
      {s.actions?<div style={{display:'flex',gap:'var(--ds-gap-sm)',marginTop:4}}>{s.actions}</div>:null}
    </div>
    {onClose?<button type="button" aria-label={S.close} onClick={onClose}
      style={{display:'flex',alignItems:'center',justifyContent:'center',width:24,height:24,flex:'none',padding:0,
        border:'none',background:'transparent',color:'inherit',cursor:'pointer',borderRadius:'var(--ds-radius-xs)'}}>
      <Icon name="close" size="var(--ds-icon-sm)"/></button>:null}
  </div>;
}
