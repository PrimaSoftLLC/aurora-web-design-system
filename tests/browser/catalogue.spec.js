import{test,expect}from'@playwright/test';import{buildCatalogue}from'../../tools/catalog/build.mjs';import{serveRoot}from'../../tools/baseline/render.mjs';import{fileURLToPath}from'node:url';
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
