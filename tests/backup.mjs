import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('../app.js',import.meta.url),'utf8');
const names=['normalizeEntry','numericValue','validateBackup','maxWeight','volumeForEntry'];
const context=vm.createContext({DAYS:{'upper-a':{exercises:[]}}});
for(const name of names){const start=source.indexOf('function '+name+'(');assert.ok(start>=0);vm.runInContext(source.slice(start,source.indexOf('\n}',start)+2),context);}
// The old app exported plain field strings without numeric validation. Such a
// historical entry must not make an otherwise structurally valid backup unusable.
const legacy={'ua-machine-chest':{1:{w:'60',r:'0'},2:{w:'62,',r:'8+2'}},__history__:[{date:'2026-01-01',day:'upper-a',entries:{'ua-machine-chest':{1:{w:'60 kg',r:'—'}}}}]};
const before=JSON.stringify(legacy);
assert.equal(context.validateBackup(legacy),legacy);
assert.equal(JSON.stringify(legacy),before,'Import validation must preserve historical strings unchanged');
console.log('PASS: legacy zero, unfinished decimal and text fields remain importable without data loss');
assert.equal(context.maxWeight({1:{w:'60 kg',r:'10'}}),null,'Do not silently reinterpret legacy text as numeric data');
assert.equal(context.volumeForEntry({1:{w:'60',r:'8+2'}}),null);
console.log('PASS: nonnumeric legacy values are excluded from numeric metrics');
assert.throws(()=>context.validateBackup({'ua-machine-chest':{1:{w:{nested:'60'},r:'10'}}}));
assert.throws(()=>context.validateBackup({'ua-machine-chest':{1:{w:'<img src=x>',r:'10'}}}));
console.log('PASS: malformed structures and markup are rejected');
