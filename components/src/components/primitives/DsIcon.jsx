import React from 'react';

/* Optical nudge, in em, for glyphs whose ink is not centred in the em box.
   Measured: `navigation` ink sits 0.0225em high, so it is pushed back down and
   rotates about the true ink centre. One table, one place to extend it. */
const Ds_ICON_NUDGE={navigation:-0.0225};

/** The system's only icon primitive: a Material Symbols glyph as element text. */
export function DsIcon({name,size='var(--ds-icon)',rotate,label,style,...rest}){
  const n=Ds_ICON_NUDGE[name]||0;
  return <span className="material-symbols-outlined" role={label?'img':undefined}
    aria-hidden={label?undefined:'true'} aria-label={label}
    style={{fontSize:size,width:size,height:size,lineHeight:1,display:'inline-grid',placeItems:'center',flex:'none',
      fontVariationSettings:"'wght' 400",marginTop:n?(-n)+'em':undefined,
      transform:rotate?'rotate('+rotate+'deg)':undefined,...style}} {...rest}>{name}</span>;
}
