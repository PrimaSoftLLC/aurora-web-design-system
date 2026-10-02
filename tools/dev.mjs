import { createServer } from 'node:http';
import { watch, readFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve, relative, extname, sep, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCatalogue } from './catalog/build.mjs';
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'};
export async function startDev({root,port=5173}){
 const scratch=resolve(root,'.tmp/dev');mkdirSync(scratch,{recursive:true});
 let generation=0,current,lastError=null,running=false,pending=false,timer,closed=false;
 const clients=new Set();
 const send=(event,data)=>{for(const res of clients)res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);};
 const rebuild=async()=>{
  if(running){pending=true;return;}running=true;
  const output=join(scratch,`generation-${++generation}`);
  try{await buildCatalogue({root,outDir:output});const previous=current;current=output;lastError=null;send('reload',generation);if(previous)rmSync(previous,{recursive:true,force:true});}
  catch(error){lastError=error.message;send('error',lastError);if(current)rmSync(output,{recursive:true,force:true});else throw error;}
  finally{running=false;if(pending&&!closed){pending=false;await rebuild();}}
 };
 await rebuild();
 const server=createServer((req,res)=>{
  try{
   const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
   if(pathname==='/__events'){res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'});res.write(': connected\n\n');clients.add(res);if(lastError)res.write(`event: error\ndata: ${JSON.stringify(lastError)}\n\n`);req.on('close',()=>clients.delete(res));return;}
   const path=resolve(current,pathname==='/'?'index.html':'.'+pathname);const rel=relative(current,path);
   if(rel==='..'||rel.startsWith(`..${sep}`)||isAbsolute(rel)||rel.includes('.git')){res.writeHead(403);res.end();return;}
   let bytes=readFileSync(path);res.setHeader('Content-Type',mime[extname(path)]??'application/octet-stream');
   if(extname(path)==='.html')bytes=bytes.toString().replace('</head>','<script>window.__AURORA_DEV__=true</script></head>');res.end(bytes);
  }catch{res.writeHead(404);res.end();}
 });
 await new Promise(r=>server.listen(port,'127.0.0.1',r));
 const excluded=/^(?:\.git|node_modules|dist|site|\.tmp|\.worktrees|\.superpowers)(?:\/|$)|^(?:tokens\.json|tokens\.css|tokens\/scoped\.css|components\/bundle\.(?:js|css)|lint\/tokens.allowed.json|runtime\.js|components\.js)$/;
 const watcher=watch(root,{recursive:true},(_,filename)=>{if(!filename||closed)return;const name=String(filename).replaceAll('\\','/');if(excluded.test(name))return;clearTimeout(timer);timer=setTimeout(()=>{rebuild().catch(error=>{lastError=error.message;send('error',lastError);});},80);});
 return{url:`http://127.0.0.1:${server.address().port}`,close:async()=>{closed=true;clearTimeout(timer);watcher.close();while(running)await new Promise(r=>setTimeout(r,20));for(const res of clients)res.end();await new Promise(r=>server.close(r));}};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const root=fileURLToPath(new URL('../',import.meta.url));const dev=await startDev({root});console.log(`Aurora catalogue: ${dev.url}`);
 for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{await dev.close();process.exit(0);});
}
