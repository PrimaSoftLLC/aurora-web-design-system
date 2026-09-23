import React from 'react';
import { DsIcon as Icon } from '../primitives/DsIcon.jsx';
import { useDsStrings } from '../primitives/DsStrings.jsx';
const Ds_OVERLAY=(ink,depth)=>{const c='color-mix(in oklab,'+ink+' '+depth+',transparent)';return 'linear-gradient(0deg,'+c+','+c+')'};
/** Interactive chip: selectable filter token or removable value token. */
export function DsChip({children,icon,selected=false,removable=false,onRemove,onClick,disabled=false,count}){
  const S=useDsStrings();
  const [h,setH]=React.useState(false);
  const interactive=!!onClick&&!disabled;
  return <span onClick={interactive?onClick:undefined} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    role={onClick?'button':undefined} tabIndex={interactive?0:undefined}
    onKeyDown={interactive?e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onClick(e)}}:undefined}
    style={{display:'inline-flex',alignItems:'center',gap:6,flex:'none',height:'var(--ds-control-h-sm)',
      padding:removable?'0 4px 0 10px':'0 10px',font:'var(--ds-type-ui)',whiteSpace:'nowrap',
      background:disabled?'var(--ds-surface-disabled)':selected?'var(--ds-brand-subtle)':h&&interactive?'var(--ds-surface-hover)':'var(--ds-surface)',
      backgroundImage:selected&&h&&interactive?Ds_OVERLAY('var(--ds-brand-text)','var(--ds-overlay-hover)'):undefined,
      color:disabled?'var(--ds-fg-disabled)':selected?'var(--ds-brand-text)':'var(--ds-fg)',
      border:'1px solid '+(selected?'var(--ds-brand-border)':'var(--ds-border)'),
      borderRadius:'var(--ds-radius-chip)',cursor:interactive?'pointer':'default',transition:'var(--ds-transition-control)'}}>
    {icon?<Icon name={icon} size="var(--ds-icon-sm)"/>:null}{children}
    {count!=null?<span style={{font:'var(--ds-type-eyebrow)',background:selected?'var(--ds-brand)':'var(--ds-neutral-bg)',color:selected?'var(--ds-on-brand)':'var(--ds-neutral-fg)',borderRadius:'var(--ds-radius-pill)',padding:'1px 6px'}}>{count}</span>:null}
    {removable?<button type="button" aria-label={S.remove} onClick={e=>{e.stopPropagation();onRemove&&onRemove()}}
      style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:20,height:20,padding:0,border:'none',
        borderRadius:'50%',background:'transparent',color:'inherit',cursor:'pointer'}}><Icon name="close" size="var(--ds-icon-xs)"/></button>:null}
  </span>;
}
