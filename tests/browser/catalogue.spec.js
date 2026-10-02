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
test('API references use real declarations, defaults and token source',async({page})=>{
 await buildCatalogue({root,outDir:`${root}/site`});const served=await serveRoot(`${root}/site`),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
 await page.route('**/*',r=>r.request().url().startsWith(served.url+'/')?r.continue():r.abort());
 try{
  for(const name of ['DsButton','DsCheckButton','DsChartLegend','DsChartTooltip','DsTabPanel']){
   await page.goto(`${served.url}/api/components/${name}.html`);
   await expect(page.getByRole('heading',{level:1}).first()).toHaveText(name);
   await expect(page.getByRole('table',{name:'Props '+name})).toBeVisible();
  }
  await page.goto(served.url+'/api/components/DsCheckButton.html');await expect(page.getByText('components/DsCheck/DsCheck.d.ts',{exact:true})).toBeVisible();
  await page.goto(served.url+'/api/components/DsButton.html');await expect(page.getByRole('row').filter({has:page.getByRole('rowheader',{name:'tone',exact:true})})).toContainText("'primary'");
  await page.goto(served.url+'/api/tokens.html');await expect(page.locator('#ds-brand')).toBeVisible();expect(errors).toEqual([]);
 }finally{served.server.closeAllConnections();await new Promise(r=>served.server.close(r));}
});

test('search, URL history and scope comparison preserve preview contracts',async({page})=>{
 const cards=await buildCatalogue({root,outDir:`${root}/site`}),served=await serveRoot(`${root}/site`);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(served.url+'/index.html#DsButton');await expect(page.locator('#title')).toHaveText('DsButton');
  await page.locator('#search').fill('CHECKBOX');await expect(page.locator('nav a[data-id="DsCheckButton"]')).toBeVisible();
  await page.locator('#search').fill('loading');await expect(page.locator('nav a[data-id="DsButton"]')).toBeVisible();
  await page.locator('#search').fill('not-a-card-12345');await expect(page.locator('#search-empty')).toBeVisible();
  await page.locator('#search').fill('');await page.locator('#theme').selectOption('RED2');await page.locator('#appearance').selectOption('dark');await page.locator('#density').selectOption('compact');
  await expect(page.frameLocator('#preview').locator('html')).toHaveAttribute('data-ds-theme','RED2');
  await page.reload();await expect(page.locator('#density')).toHaveValue('compact');await expect(page.frameLocator('#preview').locator('html')).toHaveAttribute('data-ds-appearance','dark');
  await page.locator('#compare').click();await expect(page.locator('#viewports iframe')).toHaveCount(4);
  const expected=[['DEFAULT','light','cozy'],['DEFAULT','dark','compact'],['RED2','light','cozy'],['RED2','dark','compact']];
  for(const[index,scope]of expected.entries()){
   const frame=page.frameLocator('#preview-'+index);for(const[axis,value]of ['theme','appearance','density'].map((axis,i)=>[axis,scope[i]]))await expect(frame.locator('html')).toHaveAttribute('data-ds-'+axis,value);
   const card=cards.find(c=>c.id==='DsButton');await expect(page.locator('#preview-'+index)).toHaveCSS('width',card.viewport.width+'px');
  }
  await page.reload();await expect(page.locator('#compare')).toHaveAttribute('aria-pressed','true');
  await page.locator('#compare').click();await page.goBack();await expect(page.locator('#viewports iframe')).toHaveCount(4);
  await page.goto(served.url+'/index.html?card=Monitoring&appearance=dark');await expect(page.frameLocator('#preview').locator('html')).toHaveAttribute('data-ds-appearance','dark');await expect(page.frameLocator('#preview').locator('#root [data-ds-appearance]').first()).toHaveAttribute('data-ds-appearance','light');
  await page.locator('#search').focus();await page.keyboard.type('DsButton');await page.keyboard.press('Tab');await expect(page.locator('nav a').first()).toBeFocused();
  await page.goto(served.url+'/index.html?card=%3Cscript%3E&theme=bad');await expect(page.locator('#card-error')).toBeVisible();await expect(page.locator('#missing-id')).toHaveText('<script>');await expect(page.locator('#viewports iframe')).toHaveCount(0);await expect(page.locator('#theme')).toHaveValue('DEFAULT');
  await page.locator('#return-catalogue').click();await expect(page.locator('#card-error')).toBeHidden();expect(errors).toEqual([]);
 }finally{served.server.closeAllConnections();await new Promise(r=>served.server.close(r));}
});
