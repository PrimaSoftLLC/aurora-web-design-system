import React from 'react';
import { DsIcon as Icon } from '../primitives/DsIcon.jsx';

/** Horizontal step indicator. Numbered, brand-filled current step, tick when done. */
export function DsStepper({steps=[],active=0,onSelect,completed}){
  const done=i=>completed?completed.includes(i):i<active;
  return <ol style={{display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',margin:0,padding:0,listStyle:'none',
    minWidth:0,overflowX:'auto',scrollbarWidth:'none'}}>
    {steps.map((s,i)=>{const cur=i===active,fin=done(i),clickable=!!onSelect&&(fin||cur);
      const ring=cur?'var(--ds-brand)':fin?'var(--ds-success-solid)':'var(--ds-border-strong)';
      return <li key={s.id||i} style={{display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',flex:'none',minWidth:0}}>
        <button type="button" disabled={!clickable} onClick={clickable?()=>onSelect(i):undefined}
          aria-current={cur?'step':undefined}
          style={{display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',padding:'4px 4px 4px 0',border:'none',
            background:'transparent',cursor:clickable?'pointer':'default',minWidth:0}}>
          <span style={{flex:'none',display:'inline-flex',alignItems:'center',justifyContent:'center',width:24,height:24,
            borderRadius:'50%',border:'var(--ds-border-width-strong) solid '+ring,
            background:cur?'var(--ds-brand)':fin?'var(--ds-success-solid)':'transparent',
            color:cur?'var(--ds-on-brand)':fin?'var(--ds-on-solid)':'var(--ds-fg-subtle)',font:'var(--ds-type-eyebrow)'}}>
            {fin?<Icon name="check" size="var(--ds-icon-xs)"/>:i+1}</span>
          <span style={{minWidth:0,textAlign:'left'}}>
            <span style={{display:'block',font:'var(--ds-type-ui)',whiteSpace:'nowrap',
              color:cur?'var(--ds-brand-text)':fin?'var(--ds-fg)':'var(--ds-fg-muted)'}}>{s.label}</span>
            {s.hint?<span style={{display:'block',font:'var(--ds-type-caption)',color:'var(--ds-fg-subtle)',whiteSpace:'nowrap'}}>{s.hint}</span>:null}</span>
        </button>
        {i<steps.length-1?<span aria-hidden="true" style={{flex:'none',width:32,height:1,
          background:fin?'var(--ds-success-line)':'var(--ds-border)'}}/>:null}
      </li>;})}
  </ol>;
}
