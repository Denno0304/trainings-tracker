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
let remote = { data: {}, updatedAt: 0 };
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/health') { res.setHeader('Content-Type', 'application/json'); res.end('{"ok":true}'); return; }
  if (url.pathname === '/api/state') {
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'POST') {
      let body = ''; for await (const part of req) body += part;
      const payload = JSON.parse(body); remote = { data: payload.data, updatedAt: payload.clientUpdatedAt };
      res.end('{"applied":true}');
    } else res.end(JSON.stringify(remote));
    return;
  }
  const target = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
  if (!target.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  try {
    const body = baselineHtml && url.pathname === '/' ? baselineHtml : await readFile(target);
    res.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webmanifest': 'application/manifest+json' })[extname(target)] || 'text/plain');
    res.end(body);
  } catch { res.writeHead(404).end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;
const profile = await mkdtemp(join(tmpdir(), 'training-qa-'));
let browser;
try {
  browser = await omowright.connectPipe({ browserPath: process.env.TEST_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', browserArgs: ['--headless', '--no-first-run', `--user-data-dir=${profile}`], storageRoot: profile, dialogPolicy: { accept: true } });
  const page = await browser.newTab('about:blank');
  await page.goto(origin);
  await omowright.emulate(page, { width: 390, height: 844, deviceScaleFactor: 1, mobile: true, hasTouch: true });
  const snapshot = await page.snapshot({ interactive: true });
  console.log(omowright.compactSnapshot(snapshot).slice(0, 900));
  console.log('VIEWPORT',await page.evaluate(() => ({innerWidth,innerHeight})));
  await writeFile(join(evidence, process.argv.includes('--baseline') ? 'before.png' : 'after.png'), await page.screenshot());
  // Fill the companion value first: the previous auto-advance then steals
  // focus on the very first digit of a multi-digit weight.
  const weight = '.weight-input[data-ex="ua-machine-chest"][data-set="1"]';
  const reps = '.reps-input[data-ex="ua-machine-chest"][data-set="1"]';
  await page.locator(reps).fill('10');
  await page.locator(weight).click();
  await page.keyboard.type('85,5');
  const observed = await page.evaluate(() => ({ value: document.querySelector('.weight-input[data-ex="ua-machine-chest"][data-set="1"]').value, focusSet: document.activeElement.dataset.set }));
  console.log('INPUT_REPRO', JSON.stringify(observed));
  assert.equal(observed.value, '85,5', 'A multi-digit decimal weight must remain in the same field');
  assert.equal(observed.focusSet, '1', 'Typing must not advance to another set');
  console.log('PASS: multi-digit decimal input');
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => document.activeElement.className), 'reps-input');
  await page.locator(reps).fill('12');
  assert.equal(await page.evaluate(() => document.querySelector('.weight-input').value), '85,5');
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => document.activeElement.dataset.set), '2');
  console.log('PASS: Enter moves only when explicitly requested');
  await page.locator('.weight-input[data-set="2"]').fill('25.75');
  await page.locator('.reps-input[data-set="2"]').fill('1.5');
  assert.equal(await page.evaluate(() => document.querySelector('.reps-input[data-set="2"]').getAttribute('aria-invalid')), 'true');
  await page.locator('.reps-input[data-set="2"]').fill('10');
  assert.equal(await page.evaluate(() => document.querySelector('.reps-input[data-set="2"]').getAttribute('aria-invalid')), 'false');
  console.log('PASS: decimal separators and invalid repetition feedback');
  await page.locator('[data-input-action="previous"]').click();
  assert.equal(await page.evaluate(()=>document.activeElement.className),'weight-input');
  await page.locator('[data-input-action="next"]').click();
  assert.equal(await page.evaluate(()=>document.activeElement.className),'reps-input');
  await page.locator('[data-input-action="done"]').click();
  console.log('PASS: explicit iPhone input toolbar previous/next/done');
  await page.locator('nav [data-page="info"]').click();
  await page.locator('nav [data-page="training"]').click();
  assert.equal(await page.evaluate(() => document.querySelector('.weight-input').value), '85,5');
  await page.goto(origin);
  assert.equal(await page.evaluate(() => document.querySelector('.weight-input').value), '85,5');
  console.log('PASS: input survives navigation and reload');
  // A delayed server response must not replace a draft typed while it was in flight.
  const race = await page.evaluate(async () => {
    const originalFetch = window.fetch;
    let resolveRequest;
    const old = localStorage.getItem(STORAGE_KEY);
    __syncEndpoint = location.origin + '/api/state';
    window.fetch = () => new Promise(resolve => { resolveRequest = resolve; });
    const pending = syncPull({});
    while (!resolveRequest) await Promise.resolve();
    const input = document.querySelector('.weight-input');
    input.focus(); input.value = '92,5'; input.dispatchEvent(new Event('input', {bubbles:true}));
    resolveRequest({ok:true,json:async()=>({updatedAt:Date.now()+99999,data:{'ua-machine-chest':{1:{w:'1',r:'1'}}}})});
    const result = await pending;
    window.fetch = originalFetch;
    pendingRemote = false; window.__syncReady = false; clearTimeout(__pushTimer);
    syncDiscover = async () => null;
    return {result, value:input.value, stored:loadData()['ua-machine-chest'][1].w, connected:input.isConnected};
  });
  assert.deepEqual(race,{result:'deferred',value:'92,5',stored:'92,5',connected:true});
  await page.locator('[data-input-action="done"]').click();
  console.log('PASS: in-flight server pull preserves live input and DOM focus');
  // Run remaining scenarios against a repeatable fixture, not personal data.
  await page.evaluate(() => {
    pendingRemote = false;
    const data = {__history__:[{date:'2026-01-10',day:'lower-a',entries:{'la-legpress':{1:{w:'40',r:'12'}}}}],__rotation__:{index:0}};
    saveData(data,true); currentView='upper-a'; renderAll();
  });
  await page.locator('nav [data-page="verlauf"]').click();
  assert.equal(await page.evaluate(() => document.querySelector('#history-exercise').textContent.includes('Beinpresse (einseitig)')),true);
  console.log('PASS: archived single-leg exercises remain accessible in history');
  await page.locator('nav [data-page="info"]').click();
  const legacyServer = await page.evaluate(() => {
    const data=loadData(); data.__sync__={updatedAt:1,endpoint:'https://sync.example.test/api/state'};
    saveData(data,true); renderAll();
    return {value:document.getElementById('server-url').value,candidate:syncCandidates()[0],rejectCredentials:!validSyncEndpoint('https://user:password@sync.example.test/api/state')};
  });
  assert.deepEqual(legacyServer,{value:'https://sync.example.test/api/state',candidate:'https://sync.example.test/api/state',rejectCredentials:true});
  await page.locator('#server-url').fill('https://other.example.test/api/state');
  await page.locator('[onclick="configureSync()"]' ).click();
  assert.equal(await page.evaluate(()=>configuredSyncEndpoint()),'https://other.example.test/api/state');
  console.log('PASS: private server configuration retains legacy endpoint and saves only on device');
  await page.evaluate(() => exportBackup());
  assert.equal(await page.evaluate(() => JSON.parse(document.getElementById('backup-area').value).__history__[0].entries['la-legpress'][1].w),'40');
  const unsafe = await page.evaluate(() => {
    try { validateBackup({'ua-machine-chest':{1:{w:'<img src=x onerror=alert(1)>',r:'10'}}}); return false; } catch { return true; }
  });
  assert.equal(unsafe,true);
  await page.locator('#backup-area').fill('{}');
  await page.evaluate(() => importBackup());
  assert.equal(await page.evaluate(() => loadData().__history__.length),0);
  assert.equal(await page.evaluate(() => Object.keys(localStorage).some(k=>k.startsWith(STORAGE_KEY+'-backup-'))),true);
  console.log('PASS: backup roundtrip, malformed value rejection, safety copy');
  await page.locator('nav [data-page="training"]').click();
  const completed = await page.evaluate(() => {
    let data = loadData();
    DAYS['upper-a'].exercises.forEach(ex=>{
      data[ex.id]={}; for(let s=1;s<=ex.sets;s++) data[ex.id][s]={w:'20',r:'10'};
    });
    saveData(data,true); renderAll();
    toggleDone('ua-machine-chest');
    const checked = loadData().__done__['ua-machine-chest'];
    finishTraining('upper-a');
    const after = loadData();
    return {checked, next:currentRotationDay(after), sessions:after.__history__.length};
  });
  assert.deepEqual(completed,{checked:true,next:'lower-a',sessions:1});
  const duplicateCount = await page.evaluate(() => { finishTraining('upper-a'); return loadData().__history__.length; });
  assert.equal(duplicateCount,1);
  console.log('PASS: explicit exercise completion, session history, rotation, duplicate guard');
  const timer = await page.evaluate(async () => {
    startTimer('ua-machine-chest',1,document.querySelector('.timer-btn'));
    await new Promise(resolve=>setTimeout(resolve,1250));
    return {active:Object.keys(window.__timers).length,text:document.getElementById('timer-run-ua-machine-chest').textContent};
  });
  assert.equal(timer.active,0); assert.equal(timer.text,'Pause beendet');
  console.log('PASS: rest timer completes');
  const storageFailure = await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new DOMException('quota','QuotaExceededError'); };
    const input = document.querySelector('.weight-input'); input.focus(); input.value='77,5'; input.dispatchEvent(new Event('input',{bubbles:true}));
    const result = {memory:loadData()['ua-machine-chest'][1].w,error:document.getElementById('save-status').classList.contains('error')};
    Storage.prototype.setItem=original; saveData(loadData(),true);
    return result;
  });
  assert.deepEqual(storageFailure,{memory:'77,5',error:true});
  await page.locator('[data-input-action="done"]').click();
  console.log('PASS: storage failure is visible and draft remains recoverable');
  await page.evaluate(() => {
    const data=loadData();
    data.__history__.unshift({date:'2026-01-10',day:'upper-a',entries:{'ua-machine-chest':{1:{w:'15',r:'10'}}}});
    saveData(data,true);__verlaufEx='ua-machine-chest';
  });
  await page.locator('nav [data-page="verlauf"]').click();
  const chart = await page.evaluate(async () => {
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const canvas=document.getElementById('verlauf-canvas');
    const pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
    return {painted:pixels.some(value=>value>0),delta:document.querySelector('.hist-row .h-delta').textContent};
  });
  assert.equal(chart.painted,true);assert.equal(chart.delta,'↑ +5');
  console.log('PASS: populated history chart paints and shows correct improvement');
  // Fresh captures of all screens, both themes, two sizes, including the end.
  const captures = [];
  for (const width of [390,1440]) {
    for (const theme of ['dark','light']) {
      const sid = await page.resolveSessionId();
      await page.cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:theme}]},sid);
      for (const view of ['upper-a','lower-a','upper-b','lower-b','verlauf','info','schwach']) {
        await page.evaluate(`currentView=${JSON.stringify(view)};renderAll();window.scrollTo(0,0)`);
        await omowright.emulate(page,{width,height:844,deviceScaleFactor:1,mobile:width<768,hasTouch:width<768});
        const dims = await page.evaluate(() => ({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
        assert.equal(dims.width,width,'Viewport must match evidence label');
        assert.ok(dims.scrollWidth<=width,'No horizontal overflow on '+view);
        for (const position of (view==='info' ? ['top','server','end'] : ['top','end'])) {
          await page.evaluate(position==='top'?'window.scrollTo(0,0)':position==='server'?"document.getElementById('server-url').scrollIntoView({block:'center'})":'window.scrollTo(0,document.documentElement.scrollHeight)');
          const file = `${view}-${width}-${theme}-${position}.png`;
          await writeFile(join(evidence,file),await page.screenshot({clip:{x:0,y:await page.evaluate(()=>scrollY),width,height:844}}));
          captures.push(file);
        }
      }
    }
  }
  await writeFile(join(evidence,'captures.json'),JSON.stringify(captures,null,2));
  await page.evaluate("currentView='upper-a';renderAll();window.scrollTo(0,0)");
  await omowright.emulate(page,{width:320,height:700,deviceScaleFactor:1,mobile:true,hasTouch:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  console.log('PASS: '+captures.length+' captures; all screens at 390/1440px in light/dark; 320px stress check');
  await page.evaluate(async () => { const reg = await navigator.serviceWorker.ready; if (!navigator.serviceWorker.controller) await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true})); });
  await page.cdp.send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0},await page.resolveSessionId());
  await page.goto(origin);
  assert.equal(await page.evaluate(()=>document.querySelector('h1').textContent),'Unterkörper A');
  console.log('PASS: installed app shell reloads offline');
  await writeFile(join(evidence,'result.json'),JSON.stringify({status:'PASS',captures:captures.length,browser:'Microsoft Edge, mobile emulation; no physical iPhone',scenarios:15},null,2));
} catch (error) {
  console.error('FAIL:',error.message, error.stack?.split('\n').filter(line=>line.includes('tests/browser.mjs')).join('\n'));
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  server.closeAllConnections();
  await new Promise(done => server.close(done));
  await rm(profile, { recursive: true, force: true });
}

