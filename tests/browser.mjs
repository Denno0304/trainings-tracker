import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { resolve, join, extname, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const skill = process.env.OMOWRIGHT_SKILL || 'C:/Users/pc/.codex/plugins/cache/sisyphuslabs/omo/5.1.21/skills/browser';
const { loadOmowright } = await import(pathToFileURL(join(skill, 'scripts/omowright.mjs')));
const { omowright } = await loadOmowright();
const root = resolve(import.meta.dirname, '..');
const baselineHtml = process.argv.includes('--baseline') ? execFileSync('git',['show','27b80203b09b994963d57c8ddde2a9e4fb341662:index.html'],{cwd:root}) : null;
const evidence = resolve(root, '../qa');
await mkdir(evidence, { recursive: true });
const previous = process.argv.includes('--previous-version');
const previousFile = pathname => previous ? execFileSync('git',['show','a713af9c5b4ea66934c95d741a9638beff679c08:'+(pathname==='/'?'index.html':pathname.slice(1))],{cwd:root}) : null;
let apiRequests = 0;
const server = createServer(async (req,res) => {
  const url=new URL(req.url,'http://localhost');
  if(url.pathname.startsWith('/api/')) {apiRequests++;res.writeHead(404).end();return;}
  const target=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if(!target.startsWith(root+sep)){res.writeHead(403).end();return;}
  try {
    const body=baselineHtml&&url.pathname==='/'?baselineHtml:previousFile(url.pathname)||await readFile(target);
    res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.webmanifest':'application/manifest+json'})[extname(target)]||'text/plain');res.end(body);
  }catch{res.writeHead(404).end();}
});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const origin=`http://127.0.0.1:${server.address().port}`;
const profile=await mkdtemp(join(tmpdir(),'training-qa-'));
let browser;
const groups=[];
const pass=label=>{groups.push(label);console.log('PASS:',label);};
try {
  browser=await omowright.connectPipe({browserPath:process.env.TEST_BROWSER||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',browserArgs:['--headless','--no-first-run',`--user-data-dir=${profile}`],storageRoot:profile,dialogPolicy:{accept:true}});
  const page=await browser.newTab('about:blank');
  page.on('console',entry=>{if(entry.type==='error')console.log('BROWSER_ERROR',entry.text);});
  const sid=await page.resolveSessionId();
  await page.cdp.send('Network.enable',{},sid);
  const requests=[];
  const stopRequests=page.cdp.on('Network.requestWillBeSent',(event,meta)=>{if(meta.sessionId===sid)requests.push({url:event.request.url,method:event.request.method});});
  await page.goto(origin);
  await omowright.emulate(page,{width:390,height:844,deviceScaleFactor:1,mobile:true,hasTouch:true});
  const weight='.weight-input[data-ex="ua-machine-chest"][data-set="1"]';
  const reps='.reps-input[data-ex="ua-machine-chest"][data-set="1"]';
  if(!baselineHtml) {
    assert.equal(await page.evaluate(()=>document.querySelector('.weight-input').disabled),true,'Old values must not be editable as today’s workout before explicit start');
    assert.equal(await page.evaluate(()=>document.querySelector('.weight-input').value),'');
    await page.locator('[data-action="start-workout"]').click();
    assert.equal(await page.evaluate(()=>document.querySelector('.weight-input').disabled),false);
    pass('new workout starts explicitly with empty fields');
  }
  await page.locator(reps).fill('10');await page.locator(weight).click();await page.keyboard.type('85,5');
  const observed=await page.evaluate(()=>({value:document.querySelector('.weight-input').value,set:document.activeElement.dataset.set}));
  if(observed.value!=='85,5')console.log('INPUT_STATE',await page.evaluate(()=>({focus:document.activeElement.outerHTML,inputs:[...document.querySelectorAll('input')].slice(0,4).map(i=>({value:i.value,disabled:i.disabled})),draft:loadData().__drafts__})));
  console.log('INPUT_REPRO',JSON.stringify(observed));assert.deepEqual(observed,{value:'85,5',set:'1'});
  pass('multi-digit decimal input keeps focus');
  await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.className),'reps-input');
  await page.locator(reps).fill('12');await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.set),'2');
  await page.locator('.weight-input[data-set="2"]').fill('25.75');
  await page.locator('.reps-input[data-set="2"]').fill('1.5');
  assert.equal(await page.evaluate(()=>document.querySelector('.reps-input[data-set="2"]').getAttribute('aria-invalid')),'true');
  await page.locator('.reps-input[data-set="2"]').fill('10');
  await page.locator('[data-input-action="previous"]').click();assert.equal(await page.evaluate(()=>document.activeElement.className),'weight-input');
  await page.locator('[data-input-action="next"]').click();assert.equal(await page.evaluate(()=>document.activeElement.className),'reps-input');
  await page.locator('[data-input-action="done"]').click();
  pass('decimal validation and explicit keyboard/toolbar navigation');
  const firstId=await page.evaluate(()=>loadData().__drafts__['upper-a'].id);
  await page.locator('nav [data-page="info"]').click();await page.locator('nav [data-page="training"]').click();
  await page.goto(origin);
  assert.equal(await page.evaluate(()=>loadData().__drafts__['upper-a'].id),firstId);
  assert.equal(await page.evaluate(()=>document.querySelector('.weight-input').value),'85,5');
  pass('unfinished draft survives tab changes and reload');
  const oldHistory=await page.evaluate(()=>{
    const data=loadData();data.__history__=[{date:'2026-01-10',day:'upper-a',entries:{'ua-machine-chest':{1:{w:'60',r:'10'},2:{w:'60',r:'9'},3:{w:'55',r:'12'}}}},{date:'2026-01-11',day:'lower-a',entries:{'la-legpress':{1:{w:'40',r:'12'}}}}];
    data.__sync__={endpoint:'https://unused.example.invalid/api/state',pending:true};
    localStorage.setItem(STORAGE_KEY+'-server-url','https://unused.example.invalid/api/state');
    data.__drafts__['upper-a'].startedAt-=86400000;saveData(data,true);renderAll();return JSON.stringify(data.__history__);
  });
  await page.locator('[data-action="copy-last"]').click();
  const copied=await page.evaluate(()=>({first:loadData()['ua-machine-chest'][1],third:loadData()['ua-machine-chest'][3],done:!!loadData().__done__?.['ua-machine-chest'],history:JSON.stringify(loadData().__history__)}));
  assert.deepEqual(copied.first,{w:'85,5',r:'12'});assert.deepEqual(copied.third,{w:'55',r:'12'});assert.equal(copied.done,false);assert.equal(copied.history,oldHistory);
  pass('copy-last fills only empty fields, leaves completion and history untouched');
  await page.goto(origin);
  assert.equal(await page.evaluate(()=>loadData().__drafts__['upper-a'].id),firstId);
  assert.equal(await page.evaluate(()=>document.querySelector('.weight-input').value),'85,5');
  pass('draft survives across a calendar-day boundary');
  await page.locator('.rotation-picker button[aria-label="Unterkörper A"]').click();
  await page.locator('[data-action="start-workout"]').click();
  await page.locator('.weight-input').fill('30');await page.locator('.reps-input').fill('8');await page.locator('[data-input-action="done"]').click();
  await page.locator('.rotation-picker button[aria-label="Oberkörper A"]').click();
  assert.equal(await page.evaluate(()=>document.querySelector('.weight-input').value),'85,5');
  assert.equal(await page.evaluate(()=>loadData()['la-bulgarian'][1].w),'30');
  pass('different workout drafts remain separate');
  await page.evaluate(()=>{const data=loadData();data.__today__.date='2026-01-01';saveData(data,true);});
  await page.goto(origin);assert.equal(await page.evaluate(()=>document.querySelector('h1').textContent),'Unterkörper A');
  await page.locator('.rotation-picker button[aria-label="Oberkörper A"]').click();
  pass('reopening after a date change selects the most recent unfinished draft');
  const cancelled=await page.evaluate(()=>{const original=confirm;window.confirm=()=>false;finishTraining('upper-a');window.confirm=original;return{count:loadData().__history__.length,id:workoutDraft(loadData(),'upper-a').id};});
  assert.deepEqual(cancelled,{count:2,id:firstId});pass('cancel incomplete finish preserves draft');
  await page.evaluate(()=>{
    document.querySelectorAll('.weight-input,.reps-input').forEach(input=>{input.value=input.classList.contains('weight-input')?'20':'10';input.dispatchEvent(new Event('input',{bubbles:true}));});
  });
  await page.locator('#card-ua-machine-chest .check-btn').click();
  assert.equal(await page.evaluate(()=>loadData().__done__['ua-machine-chest']),true);
  await page.locator('button[onclick="finishTraining(\'upper-a\')"]').click();
  const finished=await page.evaluate(()=>({count:loadData().__history__.length,draft:workoutDraft(loadData(),'upper-a'),value:document.querySelector('.weight-input').value,disabled:document.querySelector('.weight-input').disabled,next:currentRotationDay(loadData()),previous:document.querySelector('.previous').textContent}));
  assert.deepEqual(finished,{count:3,draft:null,value:'',disabled:true,next:'lower-a',previous:'Zuletzt 20 kg'});
  await page.evaluate(()=>finishTraining('upper-a'));assert.equal(await page.evaluate(()=>loadData().__history__.length),3);
  pass('finish saves one session, clears only its draft, and keeps last values visible');
  await page.locator('[data-action="start-workout"]').click();await page.locator('[data-action="copy-last"]').click();
  assert.equal(await page.evaluate(()=>document.querySelector('.weight-input').value),'20');
  assert.equal(await page.evaluate(()=>!!loadData().__done__?.['ua-machine-chest']),false);
  const secondId=await page.evaluate(()=>workoutDraft(loadData(),'upper-a').id);assert.notEqual(secondId,firstId);
  await page.locator('button[onclick="finishTraining(\'upper-a\')"]').click();
  assert.equal(await page.evaluate(()=>loadData().__history__.length),4);
  pass('same-day new workout with identical values is a distinct session');
  await page.locator('[data-action="start-workout"]').click();await page.locator(weight).fill('77,5');await page.locator('[data-input-action="done"]').click();
  const restartId=await page.evaluate(()=>workoutDraft(loadData(),'upper-a').id);
  await page.locator('button[onclick="clearCurrentDay(\'upper-a\')"]').click();
  assert.notEqual(await page.evaluate(()=>workoutDraft(loadData(),'upper-a').id),restartId);
  assert.equal(await page.evaluate(()=>document.querySelector('.weight-input').value),'');assert.equal(await page.evaluate(()=>loadData().__history__.length),4);
  assert.equal(await page.evaluate(()=>loadData()['la-bulgarian'][1].w),'30');
  pass('explicit restart preserves history and other-day drafts');
  await page.locator(weight).fill('77,5');await page.locator(reps).fill('9');await page.locator('[data-input-action="done"]').click();
  const timer=await page.evaluate(async()=>{startTimer('ua-machine-chest',1,document.querySelector('.timer-btn'));await new Promise(resolve=>setTimeout(resolve,1250));return{active:Object.keys(window.__timers).length,text:document.getElementById('timer-run-ua-machine-chest').textContent};});
  assert.deepEqual(timer,{active:0,text:'Pause beendet'});pass('rest timer completes');
  await page.locator('nav [data-page="verlauf"]').click();
  assert.equal(await page.evaluate(()=>document.querySelector('#history-exercise').textContent.includes('Beinpresse (einseitig)')),true);
  await page.locator('#history-exercise').selectOption('ua-machine-chest');
  const chart=await page.evaluate(async()=>{await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));const c=document.getElementById('verlauf-canvas');return{painted:c.getContext('2d').getImageData(0,0,c.width,c.height).data.some(v=>v>0),delta:document.querySelector('.hist-row .h-delta').textContent};});
  assert.equal(chart.painted,true);assert.equal(chart.delta,'= gleich');pass('history retains archived exercises and paints multi-session charts');
  await page.locator('nav [data-page="info"]').click();await page.evaluate(()=>exportBackup());
  const backup=await page.evaluate(()=>document.getElementById('backup-area').value);
  const parsed=JSON.parse(backup);assert.equal(parsed.__history__.length,4);assert.equal(parsed['ua-machine-chest'][1].w,'77,5');assert.equal(parsed.__sync__,undefined);assert.equal(Object.keys(parsed.__drafts__).length,2);
  await page.evaluate(()=>document.getElementById('backup-file').scrollIntoView({block:'center'}));
  const fileTarget=await page.evaluate(()=>{
    const input=document.getElementById('backup-file'),rect=input.getBoundingClientRect();
    const x=rect.left+rect.width/2,y=rect.bottom-4;
    window.__qaFileClick=false;
    input.addEventListener('click',event=>{window.__qaFileClick=true;event.preventDefault();},{once:true});
    return{x,y,height:rect.height,hit:document.elementFromPoint(x,y)===input};
  });
  assert.ok(fileTarget.height>=44);assert.equal(fileTarget.hit,true);
  await page.mouse.click(fileTarget.x,fileTarget.y);
  assert.equal(await page.evaluate(()=>window.__qaFileClick),true);
  await writeFile(join(evidence,'file-input-hit-area.json'),JSON.stringify(fileTarget,null,2));
  pass('file chooser has an active touch target of at least 44px');
  const downloadDir=await mkdtemp(join(evidence,'download-'));
  await page.cdp.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:downloadDir,eventsEnabled:true});
  const downloadPromise=page.waitForEvent('download',{timeout:10000});
  await page.locator('button[onclick="downloadBackup()"]') .click();
  const download=await downloadPromise;
  const downloadFile=resolve(downloadDir,download.suggestedFilename());
  assert.ok(downloadFile.startsWith(downloadDir+sep));
  let downloaded;
  for(let i=0;i<100;i++) {try{downloaded=await readFile(downloadFile,'utf8');break;}catch{await new Promise(resolve=>setTimeout(resolve,20));}}
  assert.equal(JSON.parse(downloaded).__history__.length,4);
  assert.equal(JSON.parse(downloaded).__drafts__['upper-a'].id,parsed.__drafts__['upper-a'].id);
  pass('manual backup download contains complete local data');
  // Exercise the real File input and File.text parser without personal data.
  await writeFile(join(evidence,'fixture-backup.json'),backup);
  await page.evaluate(()=>{saveData({__history__:[],__workoutSchema__:1,__drafts__:{}},true);renderAll();});
  await page.locator('#backup-file').setInputFiles(join(evidence,'fixture-backup.json'));
  await page.evaluate(async()=>{for(let i=0;i<100&&!loadData().__drafts__?.['upper-a'];i++)await new Promise(resolve=>setTimeout(resolve,20));});
  assert.equal(await page.evaluate(()=>loadData()['ua-machine-chest'][1].w),'77,5');
  assert.equal(await page.evaluate(()=>loadData().__history__.length),4);
  assert.equal(await page.evaluate(()=>Object.keys(localStorage).some(k=>k.startsWith(STORAGE_KEY+'-backup-'))),true);
  pass('JSON file restore retains history and multiple open drafts with safety copy');
  const invalid=await page.evaluate(()=>{try{validateBackup({__drafts__:{'upper-a':{id:'bad',startedAt:'yesterday'}}});return false;}catch{return true;}});assert.equal(invalid,true);
  await page.locator('details:has(#backup-area) summary').click();
  await page.locator('#backup-area').fill('{"ua-machine-chest":{"1":{"w":"<img src=x>","r":"10"}}}');
  await page.evaluate(()=>importBackup());assert.equal(await page.evaluate(()=>loadData().__history__.length),4);
  pass('invalid backups are rejected without replacing data');
  await page.locator('nav [data-page="training"]').click();
  const quota=await page.evaluate(()=>{currentView='upper-a';renderAll();const original=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new DOMException('quota','QuotaExceededError');};const input=document.querySelector('.weight-input');input.focus();input.value='78,5';input.dispatchEvent(new Event('input',{bubbles:true}));const result={w:loadData()['ua-machine-chest'][1].w,error:document.getElementById('save-status').classList.contains('error')};Storage.prototype.setItem=original;saveData(loadData(),true);return result;});
  assert.deepEqual(quota,{w:'78,5',error:true});await page.locator('[data-input-action="done"]').click();pass('storage error remains visible and draft stays recoverable');
  const failedRestart=await page.evaluate(()=>{
    const before=loadData();const original=Storage.prototype.setItem;
    Storage.prototype.setItem=()=>{throw new DOMException('quota','QuotaExceededError');};
    startTraining('upper-a',true);
    const result={id:workoutDraft(loadData(),'upper-a').id,w:loadData()['ua-machine-chest'][1].w};
    Storage.prototype.setItem=original;saveData(loadData(),true);
    return{...result,oldId:before.__drafts__['upper-a'].id};
  });
  assert.equal(failedRestart.id,failedRestart.oldId);assert.equal(failedRestart.w,'78,5');
  pass('failed restart keeps the existing draft and values');
  const migrations=await page.evaluate(()=>{
    const completed={__history__:[{date:'2026-01-10',day:'upper-a',entries:{'ua-machine-chest':{1:{w:'60',r:'10'}}}}],'ua-machine-chest':{1:{w:'60',r:'10'}}};
    const unfinished=JSON.parse(JSON.stringify(completed));unfinished['ua-machine-chest'][1].w='62,5';
    migrateWorkouts(completed);migrateWorkouts(unfinished);
    return{completedDraft:workoutDraft(completed,'upper-a'),unfinished:!!workoutDraft(unfinished,'upper-a'),value:unfinished['ua-machine-chest'][1].w};
  });assert.deepEqual(migrations,{completedDraft:null,unfinished:true,value:'62,5'});pass('legacy migration distinguishes saved values and changed unfinished entries');
  const captures=[];
  for(const width of [390,1440])for(const theme of ['dark','light']){
    await page.cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:theme}]},sid);
    for(const view of ['upper-a','lower-a','upper-b','lower-b','verlauf','info','schwach']){
      await page.evaluate(`currentView=${JSON.stringify(view)};renderAll();window.scrollTo(0,0)`);
      await omowright.emulate(page,{width,height:844,deviceScaleFactor:1,mobile:width<768,hasTouch:width<768});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow on '+view);
      for(const position of (view==='info'?['top','backup','end']:['top','end'])){
        await page.evaluate(position==='top'?'window.scrollTo(0,0)':position==='backup'?"document.getElementById('backup-card').scrollIntoView({block:'start'})":'window.scrollTo(0,document.documentElement.scrollHeight)');
        const name=`${view}-${width}-${theme}-${position}.png`;await writeFile(join(evidence,name),await page.screenshot({clip:{x:0,y:await page.evaluate(()=>scrollY),width,height:844}}));captures.push(name);
      }
    }
    // Capture idle and active lifecycle states at the same size and theme.
    await page.evaluate("(()=>{window.__qaSaved=loadData();const idle=loadData();delete idle.__drafts__['upper-a'];saveData(idle,true);currentView='upper-a';renderAll();window.scrollTo(0,0)})()");
    const name=`upper-a-${width}-${theme}-idle.png`;await writeFile(join(evidence,name),await page.screenshot({clip:{x:0,y:0,width,height:844}}));captures.push(name);
    await page.evaluate('saveData(window.__qaSaved,true);delete window.__qaSaved;renderAll()');
  }
  await writeFile(join(evidence,'captures.json'),JSON.stringify(captures,null,2));pass(`${captures.length} fresh captures across routes, themes, sizes and lifecycle states`);
  await omowright.emulate(page,{width:320,height:700,deviceScaleFactor:1,mobile:true,hasTouch:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));pass('320px overflow check');
  assert.equal(apiRequests,0);
  assert.ok(requests.length>5,'Network observation must include actual app asset requests');
  assert.ok(requests.every(r=>r.method==='GET'&&(r.url.startsWith(origin+'/')||r.url.startsWith('blob:'))),JSON.stringify(requests.filter(r=>r.method!=='GET'||!r.url.startsWith(origin+'/'))));
  assert.ok(await page.evaluate(()=>document.querySelector('meta[http-equiv="Content-Security-Policy"]').content.includes("connect-src 'none'")));
  pass('no API calls, external requests or uploads while logging and restoring');
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));});
  await page.cdp.send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0},sid);
  await page.goto(origin);
  assert.equal(await page.evaluate(()=>document.querySelector('h1').textContent),'Oberkörper A');assert.equal(await page.evaluate(()=>document.querySelector('.weight-input').value),'78,5');
  pass('offline reload resumes correct unfinished workout');
  stopRequests();
  await writeFile(join(evidence,'result.json'),JSON.stringify({status:'PASS',groups,captures:captures.length,apiRequests,requests:requests.length,browser:'Microsoft Edge with mobile emulation; no physical iPhone'},null,2));
}catch(error){console.error('FAIL:',error.message,error.stack?.split('\n').filter(l=>l.includes('tests/browser.mjs')).join('\n'));process.exitCode=1;}
finally{if(browser)await browser.close();server.closeAllConnections();await new Promise(done=>server.close(done));if(profile.startsWith(join(tmpdir(),'training-qa-')))await rm(profile,{recursive:true,force:true});}
