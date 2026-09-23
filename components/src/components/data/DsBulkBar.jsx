import React from 'react';
import { DsIcon as Icon } from '../primitives/DsIcon.jsx';
import { dsSlots } from '../layout/DsPageLayout.jsx';
import { useDsStrings } from '../primitives/DsStrings.jsx';

/** Contextual toolbar for what you can do with N selected rows. Absent at rest. */
export function DsBulkBar({count=0,total,noun,onSelectAll,onClear,actions,children,floating=true,style}){
  const S=useDsStrings();
  const [s]=dsSlots(children,['actions'],{actions});
  if(!count)return null;
  const all=total!=null&&count>=total;
  const link={flex:'none',display:'inline-flex',alignItems:'center',height:'var(--ds-control-h-sm)',padding:'0 var(--ds-gap-xs)',
    border:'none',background:'transparent',font:'var(--ds-type-body)',color:'var(--ds-brand-text)',cursor:'pointer',
    borderRadius:'var(--ds-radius-xs)',whiteSpace:'nowrap'};
  return <div role="toolbar" aria-label={S.bulk.toolbar(noun!=null?count+' '+noun:S.objects(count))}
    style={{display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',flex:'none',minWidth:0,maxWidth:'100%',
      padding:'var(--ds-pad-tight) var(--ds-pad-sm)',background:'var(--ds-surface-raised)',
      border:'1px solid '+(floating?'var(--ds-border-strong)':'var(--ds-border)'),
      borderRadius:'var(--ds-radius-container)',boxShadow:floating?'var(--ds-shadow-lg)':'none',...style}}>
    <span style={{display:'inline-flex',alignItems:'center',gap:'var(--ds-gap-xs)',flex:'none',height:'var(--ds-control-h-sm)',
      padding:'0 var(--ds-gap-sm)',borderRadius:'var(--ds-radius-pill)',background:'var(--ds-brand-subtle)',
      border:'1px solid var(--ds-brand-border)',color:'var(--ds-brand-text)',font:'var(--ds-type-body-strong)',
      fontVariantNumeric:'tabular-nums'}}>
      <Icon name="check_circle" size="var(--ds-icon-sm)"/>{count}</span>
    <span style={{font:'var(--ds-type-body)',color:'var(--ds-fg)',whiteSpace:'nowrap',flex:'none'}}>{S.bulk.selected}{noun!=null?' '+noun:''}</span>
    {onSelectAll&&total?<button type="button" style={link} onClick={()=>onSelectAll(!all)}>
      {all?S.bulk.deselectAll:S.bulk.selectAll(total)}</button>:null}
    {s.actions?<span aria-hidden="true" style={{flex:'none',width:1,alignSelf:'stretch',margin:'0 var(--ds-gap-2xs)',background:'var(--ds-border)'}}/>:null}
    <span style={{display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',minWidth:0}}>{s.actions}</span>
    {onClear?<button type="button" onClick={onClear} title={S.clearSelection} aria-label={S.clearSelection}
      style={{flex:'none',display:'inline-flex',alignItems:'center',justifyContent:'center',width:'var(--ds-control-h-sm)',
        height:'var(--ds-control-h-sm)',marginLeft:'var(--ds-gap-2xs)',border:'none',borderRadius:'var(--ds-radius-icon-button)',
        background:'transparent',color:'var(--ds-fg-muted)',cursor:'pointer'}}>
      <Icon name="close" size="var(--ds-icon-sm)"/></button>:null}
  </div>;
}
