import React from 'react';
import { dsSlots } from './DsPageLayout.jsx';
/** Bordered content container: header row, scrollable body, optional footer. */
export function DsPanel({title,eyebrow,actions,children,footer,padding=true,scroll=false,height,flush=false,style,bodyStyle}){
  const [s,body]=dsSlots(children,['actions','footer'],{actions,footer});
  return <section style={{display:'flex',flexDirection:'column',minWidth:0,minHeight:0,height,
    background:'var(--ds-surface)',border:flush?'none':'1px solid var(--ds-border)',
    borderRadius:flush?0:'var(--ds-radius-panel)',overflow:'hidden',...style}}>
    {title||s.actions||eyebrow?<header style={{display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',flex:'none',
      minHeight:'var(--ds-toolbar-h)',padding:'0 var(--ds-pad-md)',borderBottom:'1px solid var(--ds-border)'}}>
      <div style={{minWidth:0,display:'flex',flexDirection:'column',gap:1}}>
        {eyebrow?<span style={{font:'var(--ds-type-eyebrow)',letterSpacing:'var(--ds-tracking-eyebrow)',textTransform:'uppercase',color:'var(--ds-fg-subtle)'}}>{eyebrow}</span>:null}
        {title?<h2 style={{margin:0,font:'var(--ds-type-section)',color:'var(--ds-fg-strong)',letterSpacing:'var(--ds-tracking-tight)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{title}</h2>:null}
      </div>
      {s.actions?<div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',flex:'none'}}>{s.actions}</div>:null}
    </header>:null}
    <div style={{flex:1,minHeight:0,minWidth:0,display:'flex',flexDirection:'column',
      padding:padding?'var(--ds-pad-md)':0,
      ...(scroll?{overflowY:'auto',overflowX:'hidden'}:{overflow:'visible'}),...bodyStyle}}>{body}</div>
    {s.footer?<footer style={{flex:'none',padding:'var(--ds-pad-sm) var(--ds-pad-md)',borderTop:'1px solid var(--ds-border)',
      background:'var(--ds-bg)',display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)'}}>{s.footer}</footer>:null}
  </section>;
}
