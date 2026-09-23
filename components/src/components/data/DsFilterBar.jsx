import React from 'react';
import { DsIcon as Icon } from '../primitives/DsIcon.jsx';
import { useDsStrings } from '../primitives/DsStrings.jsx';

/** Toolbar: search, applied-filter chips, density switch, actions. */
export function DsFilterBar({search='',onSearch,searchPlaceholder:searchPlaceholderProp,filters=[],onRemoveFilter,onClearAll,
  children,resultCount,density,onDensityChange}){
  const S=useDsStrings();
  const searchPlaceholder=searchPlaceholderProp??S.search;
  return <div style={{display:'flex',flexDirection:'column',gap:'var(--ds-gap-sm)',minWidth:0}}>
    <div style={{display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',flexWrap:'wrap',minWidth:0}}>
      <div data-ds-field="default" style={{display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',flex:'1 1 220px',minWidth:180,maxWidth:360,
        height:'var(--ds-control-h)',padding:'0 10px',background:'var(--ds-surface)',
        transition:'var(--ds-transition-control)'}}>
        <Icon name="search" size="var(--ds-icon)" style={{color:'var(--ds-fg-subtle)'}}/>
        <input value={search} placeholder={searchPlaceholder} onChange={e=>onSearch&&onSearch(e.target.value)}
          aria-label={searchPlaceholder}
          style={{flex:1,minWidth:0,border:'none',outline:'none',background:'transparent',font:'var(--ds-type-body)',color:'var(--ds-fg)'}}/>
        {search?<button type="button" aria-label={S.clear} onClick={()=>onSearch&&onSearch('')}
          style={{border:'none',background:'transparent',color:'var(--ds-fg-subtle)',cursor:'pointer',display:'flex',padding:0}}>
          <Icon name="close" size="var(--ds-icon-sm)"/></button>:null}
      </div>
      {children}
      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)'}}>
        {resultCount!=null?<span style={{font:'var(--ds-type-caption)',color:'var(--ds-fg-muted)',whiteSpace:'nowrap'}}>{resultCount}</span>:null}
        {onDensityChange?<span style={{display:'inline-flex',border:'1px solid var(--ds-border-field)',borderRadius:'var(--ds-radius-control)',overflow:'hidden'}}>
          {[['cozy','density_medium'],['compact','density_small']].map(([d,ic])=>
            <button key={d} type="button" aria-label={d} aria-pressed={density===d} onClick={()=>onDensityChange(d)}
              style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:'var(--ds-control-h)',border:'none',cursor:'pointer',
                background:density===d?'var(--ds-brand-subtle)':'var(--ds-surface)',color:density===d?'var(--ds-brand-text)':'var(--ds-fg-muted)'}}>
              <Icon name={ic} size="var(--ds-icon-sm)"/></button>)}
        </span>:null}
      </div>
    </div>
    {filters.length?<div style={{display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',flexWrap:'wrap'}}>
      <span style={{font:'var(--ds-type-eyebrow)',letterSpacing:'var(--ds-tracking-eyebrow)',textTransform:'uppercase',color:'var(--ds-fg-subtle)'}}>{S.filters}</span>
      {filters.map(fl=><span key={fl.id} style={{display:'inline-flex',alignItems:'center',gap:6,height:'var(--ds-control-h-sm)',
        padding:'0 4px 0 10px',background:'var(--ds-brand-subtle)',border:'1px solid var(--ds-brand-border)',
        borderRadius:'var(--ds-radius-chip)',font:'var(--ds-type-caption)',color:'var(--ds-brand-text)',whiteSpace:'nowrap'}}>
        <span style={{color:'var(--ds-fg-muted)'}}>{fl.label}</span><b style={{fontWeight:'var(--ds-weight-semibold)'}}>{fl.value}</b>
        <button type="button" aria-label={S.removeItem(fl.label)} onClick={()=>onRemoveFilter&&onRemoveFilter(fl.id)}
          style={{display:'inline-flex',width:18,height:18,alignItems:'center',justifyContent:'center',border:'none',
            background:'transparent',color:'inherit',cursor:'pointer',borderRadius:'50%'}}><Icon name="close" size="var(--ds-icon-xs)"/></button>
      </span>)}
      {onClearAll?<button type="button" onClick={onClearAll}
        style={{border:'none',background:'transparent',font:'var(--ds-type-ui)',color:'var(--ds-fg-muted)',cursor:'pointer',padding:'0 4px',textDecoration:'underline',textUnderlineOffset:2}}>{S.clearAll}</button>:null}
    </div>:null}
  </div>;
}
