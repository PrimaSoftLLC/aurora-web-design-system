import React from 'react';
import { DsInHeader } from './DsTabs.jsx';
import { dsSlots } from '../layout/DsPageLayout.jsx';
import { DsIcon as Icon } from '../primitives/DsIcon.jsx';
import { DsHeaderChip } from './DsMenu.jsx';
import { useDsStrings } from '../primitives/DsStrings.jsx';
/** Fixed product header. Neutral chrome; every colour comes from --ds-header-*. */
export function DsAppHeader({product='Aurora',section,logoSrc,env,children,actions,user,scrolled=false}){
  const S=useDsStrings();
  const [s,nav]=dsSlots(children,['actions'],{actions});
  return <header style={{display:'flex',alignItems:'center',gap:'var(--ds-gap-md)',flex:'none',
    height:'var(--ds-header-h)',padding:'0 var(--ds-pad-md)',background:'var(--ds-header-bg)',
    color:'var(--ds-header-fg)',borderBottom:'1px solid var(--ds-header-border)',
    boxShadow:scrolled?'var(--ds-shadow-sm)':'none',transition:'box-shadow var(--ds-dur) var(--ds-ease)'}}>
    <div style={{display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',flex:'none',minWidth:0}}>
      {logoSrc?<span style={{width:34,height:34,flex:'none',display:'grid',placeItems:'center',
        background:'var(--ds-header-plate)',borderRadius:'var(--ds-radius-md)'}}>
        <img src={logoSrc} alt="" style={{width:26,height:26,objectFit:'contain',display:'block'}}/></span>:null}
      <span style={{font:'var(--ds-type-section)',color:'var(--ds-header-fg)',letterSpacing:'var(--ds-tracking-tight)',whiteSpace:'nowrap'}}>{product}</span>
      {env?<span style={{font:'var(--ds-type-eyebrow)',letterSpacing:'var(--ds-tracking-eyebrow)',textTransform:'uppercase',
        background:'var(--ds-header-env-bg)',color:'var(--ds-header-env-fg)',borderRadius:'var(--ds-radius-xs)',padding:'2px 6px',flex:'none',marginLeft:4}}>{env}</span>:null}
      {section?<><span aria-hidden="true" style={{width:1,height:18,background:'var(--ds-header-border)',margin:'0 4px',flex:'none'}}/>
        <span style={{font:'var(--ds-type-ui)',color:'var(--ds-header-fg-muted)',whiteSpace:'nowrap'}}>{section}</span></>:null}
    </div>
    {nav.length?<nav aria-label={S.tabs.nav} style={{display:'flex',alignItems:'stretch',gap:2,flex:'0 1 auto',minWidth:0,alignSelf:'stretch',
      overflowX:'auto',overflowY:'hidden',scrollbarWidth:'none',WebkitOverflowScrolling:'touch',
      maskImage:'linear-gradient(to right,#000 0,#000 calc(100% - 24px),transparent 100%)',
      WebkitMaskImage:'linear-gradient(to right,#000 0,#000 calc(100% - 24px),transparent 100%)'}}><DsInHeader.Provider value={true}>{nav}</DsInHeader.Provider></nav>:null}
    <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',flex:'none'}}>
      {s.actions}
      {user?<DsHeaderChip>{user}</DsHeaderChip>:null}
    </div>
  </header>;
}
