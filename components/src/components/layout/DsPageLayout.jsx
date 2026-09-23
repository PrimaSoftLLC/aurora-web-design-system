import React from 'react';

/* Region props also accept a child carrying slot="<name>", so a shell can be
   composed from static markup — a template — and not only from JSX props.
   `data-slot` is accepted as well, because some static-markup hosts reserve the
   bare `slot` attribute for their own shadow-DOM slotting. Props win when both
   are given. */
export function dsSlots(children,names,given){
  const out=Object.assign({},given),rest=[];
  React.Children.forEach(children,c=>{const s=c&&c.props&&(c.props.slot||c.props['data-slot']);
    if(s&&names.indexOf(s)>=0&&!out[s])out[s]=c;else rest.push(c)});
  return[out,rest];
}

/** App shell: fixed header, optional side panels, one scrolling main region. */
export function DsPageLayout({header,pageHeader,left,right,children,leftWidth,rightWidth=360,gap=true,footer}){
  const [s,main]=dsSlots(children,['header','pageHeader','left','right','footer'],{header,pageHeader,left,right,footer});
  return <div style={{height:'100%',minHeight:0,display:'flex',flexDirection:'column',background:'var(--ds-bg)',color:'var(--ds-fg)'}}>
    {s.header}
    {s.pageHeader}
    <div style={{flex:1,minHeight:0,display:'flex',gap:gap?'var(--ds-gap-sm-plus)':0,padding:gap?'var(--ds-gap-sm-plus)':0,minWidth:0}}>
      {s.left?<aside style={{flex:'none',width:leftWidth||'var(--ds-panel-w)',minWidth:0,display:'flex',flexDirection:'column',minHeight:0}}>{s.left}</aside>:null}
      <main style={{flex:1,minWidth:0,minHeight:0,display:'flex',flexDirection:'column',gap:gap?'var(--ds-gap-sm-plus)':0}}>{main}</main>
      {s.right?<aside style={{flex:'none',width:rightWidth,minWidth:0,display:'flex',flexDirection:'column',gap:gap?'var(--ds-gap-sm-plus)':0,minHeight:0}}>{s.right}</aside>:null}
    </div>
    {s.footer}</div>;
}
