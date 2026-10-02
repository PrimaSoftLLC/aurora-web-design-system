import assert from'node:assert/strict';import{readFileSync,writeFileSync,rmSync}from'node:fs';import{join}from'node:path';
import{startDev}from'../tools/dev.mjs';import{fixtureRoot}from'./helpers/build-root.js';
const root=fixtureRoot();let dev;
const waitFor=async predicate=>{const end=Date.now()+15000;while(Date.now()<end){if(await predicate())return;await new Promise(r=>setTimeout(r,50));}throw Error('dev event timed out');};
try{
 dev=await startDev({root,port:0});assert.equal((await fetch(dev.url)).status,200);
 assert.equal((await fetch(dev.url+'/%2e%2e%2fpackage.json')).status,403);
 const events=await fetch(dev.url+'/__events');const reader=events.body.getReader();let received='';
 const pump=(async()=>{while(true){const r=await reader.read();if(r.done)return;received+=new TextDecoder().decode(r.value);}})();
 const tokens=join(root,'tokens/source.json');const original=readFileSync(tokens,'utf8');const invalid=JSON.parse(original);invalid.color.tokens[0].value='{ds-broken-reference}';writeFileSync(tokens,JSON.stringify(invalid));
 await waitFor(()=>received.includes('event: error')&&received.includes('ds-broken-reference'));
 assert.equal((await fetch(dev.url)).status,200,'previous successful output remains readable with explicit error event');
 const path=join(root,'components/Example/preview.html');writeFileSync(path,readFileSync(path,'utf8').replace('hello','recovered'));
 writeFileSync(tokens,original);await waitFor(()=>received.includes('event: reload'));
 await waitFor(async()=> (await(await fetch(dev.url+'/components/Example/preview.html')).text()).includes('recovered'));
 await reader.cancel();await pump;
}finally{if(dev)await dev.close();rmSync(root,{recursive:true,force:true});}
console.log('dev-server: loopback, traversal rejection, explicit build error and recovery passed');
