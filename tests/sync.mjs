import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const start = source.indexOf('async function syncPull(');
const end = source.indexOf('\n}',start)+2;
const implementation = source.slice(start,end);
async function scenario(local, remote, expected) {
  const state = { pushed:0, loaded:0, status:null };
  const context = vm.createContext({
    __syncing:false,localRevision:0,pendingRemote:false,
    syncDiscover:async()=>'/api/state',
    syncFetch:async()=>({ok:true,json:async()=>remote}),
    loadData:()=>local,
    syncHasContent:data=>!!data?.__history__?.length,
    document:{activeElement:{matches:()=>false}},
    syncStashLocal:()=>{},validateBackup:data=>data,
    saveData:()=>{state.loaded++;return true;},renderAll:()=>{},
    setSyncStatus:status=>{state.status=status;},
    syncPush:async()=>{state.pushed++;},Date
  });
  vm.runInContext(implementation,context);
  const result = await vm.runInContext('syncPull({})',context);
  assert.deepEqual({result,...state},expected);
}
const local = at => ({__history__:[{date:'2026-10-29',day:'upper-a',entries:{}}],__sync__:{updatedAt:at}});
const remote = at => ({updatedAt:at,data:local(at)});
await scenario(local(200),remote(100),{result:'pushed',pushed:1,loaded:0,status:null});
console.log('PASS: newer legacy local data without pending flag is uploaded');
await scenario(local(100),remote(200),{result:'pulled',pushed:0,loaded:1,status:'pulled'});
console.log('PASS: newer remote data is applied when no draft is active');
await scenario(local(100),remote(100),{result:'ok',pushed:0,loaded:0,status:'ok'});
console.log('PASS: equal timestamps do not overwrite either side');
const pending = local(100); pending.__sync__.pending=true;
await scenario(pending,remote(200),{result:'pushed',pushed:1,loaded:0,status:null});
console.log('PASS: pending edits stay authoritative even against newer remote timestamp');
