import React from 'react';

const Ds_OVERLAY=(ink,depth)=>{const c='color-mix(in oklab,'+ink+' '+depth+',transparent)';return 'linear-gradient(0deg,'+c+','+c+')'};

/** Slide toggle. Brand-filled when on; label sits to the right. */
export function DsSwitch({label,description,checked=false,disabled=false,onChange}){
  const [h,setH]=React.useState(false);
  return <label onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{display:'inline-flex',alignItems:description?'flex-start':'center',gap:'var(--ds-gap-sm)',cursor:disabled?'not-allowed':'pointer'}}>
    <input type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={onChange} readOnly={!onChange}
      style={{position:'absolute',opacity:0,width:0,height:0}}/>
    <span aria-hidden="true" style={{flex:'none',position:'relative',width:36,height:20,marginTop:description?2:0,
      borderRadius:'var(--ds-radius-pill)',
      background:disabled?'var(--ds-surface-disabled)':checked?'var(--ds-brand)':'var(--ds-border-control)',
      backgroundImage:h&&!disabled?Ds_OVERLAY(checked?'var(--ds-on-brand)':'var(--ds-fg)','var(--ds-overlay-hover)'):undefined,
      border:'1px solid '+(disabled?'var(--ds-border)':checked?'var(--ds-brand)':'var(--ds-border-control)'),
      transition:'background-color var(--ds-dur-fast) var(--ds-ease)'}}>
      <span style={{position:'absolute',top:2,left:checked?18:2,width:14,height:14,borderRadius:'50%',
        background:'var(--ds-on-brand)',boxShadow:'var(--ds-shadow-xs)',transition:'left var(--ds-dur-fast) var(--ds-ease)'}}/>
    </span>
    <span style={{minWidth:0}}>
      <span style={{font:'var(--ds-type-body)',color:disabled?'var(--ds-fg-disabled)':'var(--ds-fg)',display:'block'}}>{label}</span>
      {description?<span style={{font:'var(--ds-type-caption)',color:'var(--ds-fg-subtle)',display:'block',marginTop:2}}>{description}</span>:null}
    </span>
  </label>;
}
