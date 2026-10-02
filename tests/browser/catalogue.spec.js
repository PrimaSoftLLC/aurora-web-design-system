import{test,expect}from'@playwright/test';import{buildCatalogue}from'../../tools/catalog/build.mjs';import{serveRoot}from'../../tools/baseline/render.mjs';import{fileURLToPath}from'node:url';
import{startDev}from'../../tools/dev.mjs';import{fixtureRoot}from'../helpers/build-root.js';import{readFileSync,writeFileSync,rmSync}from'node:fs';import{join}from'node:path';
const root=fileURLToPath(new URL('../../',import.meta.url));
test('all catalogue pages render from local files without runtime errors',async({page})=>{
 const cards=await buildCatalogue({root,outDir:`${root}/site`});const served=await serveRoot(`${root}/site`);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await page.route('**/*',r=>r.request().url().startsWith(served.url+'/')?r.continue():r.abort('blockedbyclient'));
 try{
  await page.goto(served.url+'/index.html');await expect(page.locator('nav a')).toHaveCount(69);
  await page.locator('nav a[data-id="DsButton"]').click();await expect(page.locator('h1')).toHaveText('DsButton');
  await page.locator('#theme').selectOption('RED2');await expect(page.locator('html')).toHaveAttribute('data-ds-theme','RED2');
  for(const card of cards){await page.setViewportSize(card.viewport);await page.goto(served.url+'/'+card.previewPath);await page.evaluate(()=>document.fonts.ready);
   if(await page.locator('#root').count())await expect.poll(async()=>page.evaluate(()=>document.getElementById('root').childNodes.length>0||document.querySelector('[role="dialog"]')!==null),{message:`${card.id}: React root or visible portal must render`}).toBe(true);
   expect(errors,card.id).toEqual([]);
  }
 }finally{served.server.closeAllConnections();await new Promise(r=>served.server.close(r));}
});
test('direct dev preview displays failed builds and reloads after recovery',async({page})=>{
 const fixture=fixtureRoot();let dev;
 try{
  dev=await startDev({root:fixture,port:0});await page.goto(dev.url+'/components/Example/preview.html');await expect(page.locator('#root')).toHaveText('hello');
  const path=join(fixture,'tokens/source.json'),original=readFileSync(path,'utf8');writeFileSync(path,'invalid JSON');
  await expect(page.locator('[role="alert"]')).toBeVisible();await expect(page.locator('#root')).toHaveText('hello');
  const example=join(fixture,'components/Example/preview.html');writeFileSync(example,readFileSync(example,'utf8').replace('hello','recovered'));writeFileSync(path,original);
  await expect(page.locator('#root')).toHaveText('recovered');await expect(page.locator('[role="alert"]')).toHaveCount(0);
 }finally{await test.step('leave preview',()=>page.goto('about:blank'));if(dev)await test.step('close dev server',()=>dev.close());rmSync(fixture,{recursive:true,force:true});}
});
