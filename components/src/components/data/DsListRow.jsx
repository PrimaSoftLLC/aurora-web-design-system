import React from 'react';
import { DsIcon as Icon } from '../primitives/DsIcon.jsx';
import { DsStateIcon } from './DsStateIcon.jsx';
import { dsSlots } from '../layout/DsPageLayout.jsx';

/** One row of the object panel: state glyph, two-line identity, trailing value.
 *  Основная зона — кнопка (`as="button"`, по умолчанию), когда есть `onClick`;
 *  действия (`actions`) — её соседи, а не дети: кнопка в кнопке невалидна, и
 *  нажатие на действие не должно открывать строку. `as="div"` — строка без действия. */
export function DsListRow({title,subtitle,state,course,value,valueMeta,icon,active=false,selected=false,
  onClick,actions,badge,children,as='button'}){
  const [sl]=dsSlots(children,['actions','badge'],{actions,badge});
  const [h,setH]=React.useState(false);
  const clickable=as!=='div'&&!!onClick;
  const Main=clickable?'button':'div';
  return <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',width:'100%',minWidth:0,
      minHeight:'var(--ds-row-h-lg)',padding:'0 var(--ds-pad-sm)',borderRadius:'var(--ds-radius-md)',
      background:active||selected?'var(--ds-surface-selected)':h&&clickable?'var(--ds-surface-hover)':'transparent',
      boxShadow:active?'inset 2px 0 0 var(--ds-brand)':'none',
      transition:'background-color var(--ds-dur-fast) var(--ds-ease)'}}>
    <Main {...(clickable?{type:'button',onClick}:null)} aria-current={active?'true':undefined}
      style={{flex:1,minWidth:0,display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',alignSelf:'stretch',
        padding:'var(--ds-pad-tight) 0',margin:0,border:'none',background:'transparent',font:'inherit',color:'inherit',
        textAlign:'left',cursor:clickable?'pointer':'default',borderRadius:'var(--ds-radius-sm)'}}>
      {state?<DsStateIcon state={state} course={course} size={28}/>
        :icon?<span style={{flex:'none',display:'inline-flex',alignItems:'center',justifyContent:'center',width:28,height:28,
          borderRadius:'50%',background:'var(--ds-neutral-bg)',color:'var(--ds-fg-muted)'}}><Icon name={icon} size="var(--ds-icon-sm)"/></span>:null}
      <span style={{flex:1,minWidth:0}}>
        <span style={{display:'flex',alignItems:'center',gap:6,minWidth:0}}>
          <span style={{font:'var(--ds-type-body-strong)',color:'var(--ds-fg)',overflow:'hidden',
            textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{title}</span>
          {sl.badge}</span>
        {subtitle?<span style={{display:'block',font:'var(--ds-type-caption)',fontFamily:'var(--ds-font-mono)',
          color:'var(--ds-fg-subtle)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{subtitle}</span>:null}</span>
      {value!=null?<span style={{flex:'none',textAlign:'right'}}>
        <span style={{display:'block',font:'var(--ds-type-mono)',color:'var(--ds-fg)'}}>{value}</span>
        {valueMeta?<span style={{display:'block',font:'var(--ds-type-caption)',color:'var(--ds-fg-subtle)'}}>{valueMeta}</span>:null}</span>:null}
    </Main>
    {sl.actions?<span style={{flex:'none',display:'inline-flex',gap:2,opacity:h||active?1:.55,
      transition:'opacity var(--ds-dur-fast) var(--ds-ease)'}}>{sl.actions}</span>:null}
  </div>;
}
