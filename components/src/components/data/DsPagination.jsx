import React from 'react';
import { DsIconButton } from '../buttons/DsIconButton.jsx';
import { useDsStrings } from '../primitives/DsStrings.jsx';

/** Range label + page-size select + page steppers. Sized for a panel footer. */
export function DsPagination({page=0,pageSize=25,length=0,pageSizeOptions=[10,25,50,100],
  onPageChange,onPageSizeChange,compact=false}){
  const S=useDsStrings();
  const last=Math.max(0,Math.ceil(length/pageSize)-1);
  const from=length===0?0:page*pageSize+1;
  const to=Math.min(length,(page+1)*pageSize);
  const go=p=>onPageChange&&onPageChange(Math.min(last,Math.max(0,p)));
  return <div style={{display:'flex',alignItems:'center',gap:'var(--ds-gap-sm-plus)',flexWrap:'wrap',minWidth:0}}>
    {!compact&&onPageSizeChange?<label style={{display:'inline-flex',alignItems:'center',gap:'var(--ds-gap-sm)',
      font:'var(--ds-type-caption)',color:'var(--ds-fg-muted)'}}>{S.pagination.rows}
      <select value={pageSize} onChange={e=>onPageSizeChange(Number(e.target.value))}
        style={{height:'var(--ds-control-h-sm)',padding:'0 6px',border:'1px solid var(--ds-border-field)',
          borderRadius:'var(--ds-radius-xs)',background:'var(--ds-surface)',color:'var(--ds-fg)',font:'var(--ds-type-caption)'}}>
        {pageSizeOptions.map(o=><option key={o} value={o}>{o}</option>)}</select></label>:null}
    <span style={{font:'var(--ds-type-caption)',fontFamily:'var(--ds-font-mono)',color:'var(--ds-fg-muted)',whiteSpace:'nowrap'}}>
      {S.pagination.range(from,to,length)}</span>
    <span style={{display:'inline-flex',gap:2}}>
      {!compact?<DsIconButton icon="first_page" label={S.pagination.first} size="sm" disabled={page<=0} onClick={()=>go(0)}/>:null}
      <DsIconButton icon="chevron_left" label={S.pagination.prev} size="sm" disabled={page<=0} onClick={()=>go(page-1)}/>
      <DsIconButton icon="chevron_right" label={S.pagination.next} size="sm" disabled={page>=last} onClick={()=>go(page+1)}/>
      {!compact?<DsIconButton icon="last_page" label={S.pagination.last} size="sm" disabled={page>=last} onClick={()=>go(last)}/>:null}
    </span></div>;
}
