import React from 'react';
import { DsIcon as Icon } from '../primitives/DsIcon.jsx';

/** Text / number / select / textarea field. Static top label, no floating notch. */
export function DsField({label,hint,error,required=false,as='input',type='text',value,defaultValue,onChange,placeholder,options=[],icon,suffix,mono=false,disabled=false,rows=3,width,id,labelMode='top',...rest}){
  const rid=React.useMemo(()=>id||'dsf-'+Math.random().toString(36).slice(2,8),[id]);
  const [foc,setFoc]=React.useState(false);
  const [dirty,setDirty]=React.useState(()=>String(defaultValue??'')!=='');
  const filled=value!==undefined?String(value)!=='':dirty;
  const notch=labelMode==='notch'&&!!label;
  // select and date inputs always render a value box, so their label can never sit centred
  const alwaysUp=as==='select'||type==='date'||type==='time'||type==='datetime-local'||type==='month';
  const up=notch&&(foc||filled||alwaysUp||!!placeholder);
  const bg=disabled?'var(--ds-surface-disabled)':'var(--ds-surface)';
  const shell={boxSizing:'border-box',display:'flex',alignItems:'center',gap:'var(--ds-gap-sm)',position:'relative',
    minHeight:as==='textarea'?undefined:'var(--ds-field-h)',padding:as==='textarea'?'8px 10px':'0 10px',
    background:bg,minWidth:0,transition:'var(--ds-transition-control)',color:disabled?'var(--ds-fg-disabled)':'var(--ds-fg)'};
  const inner={flex:1,width:'100%',minWidth:0,border:'none',outline:'none',background:'transparent',color:'inherit',
    font:mono?'var(--ds-type-mono)':'var(--ds-type-body)',padding:0,margin:0,appearance:as==='select'?'none':undefined,cursor:disabled?'not-allowed':as==='select'?'pointer':'text'};
  const common={id:rid,value,defaultValue,disabled,required,style:inner,
    placeholder:notch&&!up?undefined:placeholder,
    onChange:e=>{setDirty(e.target.value!=='');onChange&&onChange(e)},
    onFocus:()=>setFoc(true),onBlur:()=>setFoc(false),'aria-invalid':!!error||undefined,'aria-describedby':(error||hint)?rid+'-d':undefined,...rest};
  const baseLeft=icon?34:9;
  const notchLabel={position:'absolute',pointerEvents:'none',whiteSpace:'nowrap',maxWidth:'calc(100% - 20px)',overflow:'hidden',textOverflow:'ellipsis',
    left:up?baseLeft:baseLeft+4,padding:up?'0 4px':0,background:up?bg:'transparent',zIndex:1,
    top:up?0:(as==='textarea'?11:'50%'),transform:up?'translateY(-50%)':(as==='textarea'?'none':'translateY(-50%)'),
    font:up?'var(--ds-type-caption)':(mono?'var(--ds-type-mono)':'var(--ds-type-body)'),
    color:error?'var(--ds-danger-fg)':foc?'var(--ds-brand-text)':'var(--ds-fg-muted)',
    transition:'var(--ds-transition-control)'};
  return <div style={{display:'flex',flexDirection:'column',gap:6,width:width||'100%',minWidth:0}}>
    {label&&!notch?<label htmlFor={rid} style={{font:'var(--ds-type-caption)',fontWeight:'var(--ds-weight-medium)',color:'var(--ds-fg-muted)'}}>
      {label}{required?<span style={{color:'var(--ds-danger-solid)',marginLeft:3}}>*</span>:null}</label>:null}
    <div data-ds-field={error?'error':'default'} style={shell}>
      {notch?<label htmlFor={rid} style={notchLabel}>{label}{required?<span style={{color:'var(--ds-danger-solid)',marginLeft:3}}>*</span>:null}</label>:null}
      {icon?<Icon name={icon} size="var(--ds-icon)" style={{color:'var(--ds-fg-subtle)',flex:'none'}}/>:null}
      {as==='textarea'?<textarea rows={rows} {...common} style={{...inner,resize:'vertical',lineHeight:1.5,paddingTop:notch?6:0}}/>
        :as==='select'?<select {...common}>{options.map(o=>{const v=typeof o==='string'?o:o.value,l=typeof o==='string'?o:o.label;return <option key={v} value={v}>{l}</option>})}</select>
        :<input type={type} {...common}/>}
      {as==='select'?<Icon name="expand_more" size="var(--ds-icon)" style={{color:'var(--ds-fg-subtle)',flex:'none'}}/>
        :suffix?<span style={{font:'var(--ds-type-caption)',color:'var(--ds-fg-subtle)',flex:'none'}}>{suffix}</span>:null}
    </div>
    {error||hint?<span id={rid+'-d'} style={{font:'var(--ds-type-caption)',color:error?'var(--ds-danger-fg)':'var(--ds-fg-subtle)'}}>{error||hint}</span>:null}
  </div>;
}
