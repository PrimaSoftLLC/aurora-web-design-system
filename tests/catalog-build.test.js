import assert from'node:assert/strict';import{readFileSync,writeFileSync,rmSync}from'node:fs';import{join}from'node:path';import{fileURLToPath}from'node:url';
import{buildCatalogue}from'../tools/catalog/build.mjs';import{readCards}from'../tools/catalog/index.mjs';import{renderPreview}from'../tools/catalog/preview.mjs';import{fixtureRoot}from'./helpers/build-root.js';
const root=fileURLToPath(new URL('../',import.meta.url));assert.equal(readCards(root).length,69);
const fixture=fixtureRoot();try{
 const cards=await buildCatalogue({root:fixture,outDir:join(fixture,'site')});assert.equal(cards.length,2);
 const path=join(fixture,'components/Example/preview.html');const original=readFileSync(path,'utf8');
 writeFileSync(path,original.replace('</body>','<script>const label="filename.svg";</script></body>'));
 await buildCatalogue({root:fixture,outDir:join(fixture,'site')});
 writeFileSync(join(fixture,'components/Example/icon.svg'),'<svg xmlns="http://www.w3.org/2000/svg"></svg>');
 writeFileSync(path,original.replace('</body>','<img src="icon.svg?v=1#part"></body>'));
 await buildCatalogue({root:fixture,outDir:join(fixture,'site')});assert.ok(readFileSync(join(fixture,'site/components/Example/icon.svg')).length);
 const rendered=readFileSync(join(fixture,'site/components/Example/preview.html'),'utf8');assert.ok(rendered.includes('icon.svg?v=1#part'));assert.ok(!rendered.includes('unpkg.com'));
 writeFileSync(join(fixture,'components/Example/nested.css'),'@import "example.css"; .icon {background:url(icon.svg?v=2#part)}');
 writeFileSync(join(fixture,'components/Example/example.css'),'@import "nested.css";');
 writeFileSync(path,original.replace('</head>','<link rel="stylesheet" href="example.css"></head>'));
 rmSync(join(fixture,'site/components/Example/icon.svg'));
 await buildCatalogue({root:fixture,outDir:join(fixture,'site')});assert.ok(readFileSync(join(fixture,'site/components/Example/icon.svg')).length);
 rmSync(join(fixture,'components/Example/icon.svg'));
 await assert.rejects(buildCatalogue({root:fixture,outDir:join(fixture,'site')}),/missing.*icon.svg/);
 writeFileSync(join(fixture,'components/Example/nested.css'),'@import "https://example.com/external.css";');
 await assert.rejects(buildCatalogue({root:fixture,outDir:join(fixture,'site')}),/external asset/);
 writeFileSync(path,original);
 writeFileSync(join(fixture,'components/Example/README.md'),'');await buildCatalogue({root:fixture,outDir:join(fixture,'site')});
 writeFileSync(path,original.replace('</body>','<img src="missing.svg"></body>'));await assert.rejects(buildCatalogue({root:fixture,outDir:join(fixture,'site')}),/missing.*missing.svg/);
 writeFileSync(path,original.replace('height=180','viewport="bad"'));assert.throws(()=>readCards(fixture),/invalid viewport/);
 writeFileSync(path,original.replace('height=180','id="overview"'));assert.throws(()=>readCards(fixture),/duplicate/i);
}finally{rmSync(fixture,{recursive:true,force:true});}
console.log('catalog-build: discovery, metadata, assets with query/hash, empty docs and errors passed');
