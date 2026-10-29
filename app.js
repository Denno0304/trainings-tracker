
const MUSCLE_LABEL = {
  chest: 'Brust', back: 'Rücken', shoulders: 'Schultern',
  arms: 'Arme', legs: 'Beine', core: 'Core', calves: 'Waden'
};

const LEGACY_DAYS = {
  'upper-a': {
    title: 'Upper A — Brust + Schultern, schwer',
    exercises: [
      { id:'ua-machine-chest', name:'Maschinen-Brustpresse', sets:3, reps:'6-8', rir:'1-2', muscle:'chest', note:'Maschine gleicht langen Hebelarm aus' },
      { id:'ua-incline-smith', name:'Schrägbank-Brustpresse (Scheiben)', sets:3, reps:'8-10', rir:'1-2', muscle:'chest', note:'Maschine gleicht langen Hebelarm aus. Brust isoliert.' },
      { id:'ua-db-shoulder', name:'Schulterdrücken sitzend (KH)', sets:3, reps:'8-10', rir:'1-2', muscle:'shoulders', note:'Kurzhanteln = natuerlichere Schulterbahn. Compound vor Isolation.' },
      { id:'ua-cable-flys', name:'Kabel-Flys (hoch)', sets:3, reps:'12-15', rir:'0', muscle:'chest', ssGroup:1, note:'Reine Isolation, null Hebelarm-Nachteil' },
      { id:'ua-face-pulls', name:'Gesichtszug (Face Pulls)', sets:3, reps:'15-20', rir:'0', muscle:'shoulders', ssGroup:1, note:'Brust (Flys) + hintere Schulter im Wechsel — kein Kraftverlust' },
      { id:'ua-lateral', name:'Seitheben (KH)', sets:4, reps:'12-15', rir:'0', muscle:'shoulders', note:'NICHT VERHANDELBAR. 4 Saetze, kurze Pause.' },
      { id:'ua-triceps-rope', name:'Trizeps-Drücken (Seil)', sets:3, reps:'10-12', rir:'1', muscle:'arms' }
    ]
  },
  'lower-a': {
    title: 'Lower A — Quad + Knie-Reha',
    exercises: [
      { id:'la-bulgarian', name:'Bulgarische Split-Squats', sets:3, reps:'8-10', rir:'2', muscle:'legs', note:'RECHTS ZUERST. Schwaecheres Bein diktiert Wdh.' },
      { id:'la-legpress', name:'Beinpresse (einseitig)', sets:3, reps:'10-12', rir:'1', muscle:'legs', note:'Jedes Bein einzeln. Defizit-Seite gibt Load vor.' },
      { id:'la-lunges', name:'Ausfallschritte gehen (KH)', sets:3, reps:'12 Schritte', rir:'1', muscle:'legs' },
      { id:'la-extensions', name:'Beinstrecker (Maschine)', sets:3, reps:'12-15', rir:'0-1', muscle:'legs' },
      { id:'la-slrdl', name:'Einbeiniges Kreuzheben (KH)', sets:3, reps:'10/Seite', rir:'2', muscle:'legs', note:'Hamstrings + Sprunggelenk-Stabilitaet. Solo — kein Supersatz.' },
      { id:'la-back-ext', name:'Rückenstrecker (45°)', sets:3, reps:'12-15', rir:'0', muscle:'back' }
    ]
  },
  'upper-b': {
    title: 'Upper B — Ruecken + Arme, Volumen',
    exercises: [
      { id:'ub-lat-pulldown', name:'Latzug (enger Griff)', sets:4, reps:'6-10', rir:'1-2', muscle:'back', note:'Breite. Klimmzuege erst wenn +15kg sauber.' },
      { id:'ub-tbar', name:'Schrägbank-KH-Rudern (Incline DB Row)', sets:3, reps:'8-10', rir:'1', muscle:'back' },
      { id:'ub-cable-row', name:'Kabelrudern sitzend (V-Griff)', sets:3, reps:'10-12', rir:'1', muscle:'back', note:'Ruecken-Block abschliessen — solo' },
      { id:'ub-cable-flys-flach', name:'Kabel-Flys (flach)', sets:3, reps:'12-15', rir:'1', muscle:'chest', ssGroup:1, note:'Brust-Isolation — 2. Brust-Reiz der Woche (Upper A = schwer, hier Volumen)' },
      { id:'ub-ez-curl', name:'Curls mit EZ-Stange', sets:3, reps:'8-10', rir:'1', muscle:'arms', ssGroup:1, note:'Bizeps schwer. Push/Pull-Antagonist zu Flys.' },
      { id:'ub-incline-curl', name:'Schrägbank-Curls (KH)', sets:3, reps:'10-12', rir:'0', muscle:'arms', ssGroup:2, note:'Bizeps in Dehnung = mehr Hypertrophie-Reiz' },
      { id:'ub-overhead-tri', name:'Trizepsstrecken über Kopf (Kabel)', sets:3, reps:'10-12', rir:'0', muscle:'arms', ssGroup:2, note:'Langer Trizeps-Kopf' },
      { id:'ub-preacher', name:'Priestercurls', sets:2, reps:'12-15', rir:'0', muscle:'arms', note:'Finisher, konstante Spannung' }
    ]
  },
  'lower-b': {
    title: 'Lower B — Posterior Chain + Sprunggelenk',
    exercises: [
      { id:'lb-rdl', name:'Rumänisches Kreuzheben (Langhantel)', sets:4, reps:'8-10', rir:'1-2', muscle:'legs', note:'Huefte nach hinten, Ruecken gerade, Spannung halten' },
      { id:'lb-hip-thrust', name:'Beckenheben (Hip Thrusts, Bank + LH)', sets:3, reps:'10-12', rir:'1', muscle:'legs', note:'Glutes entlasten Knie — essenziell fuer Stabilitaet' },
      { id:'lb-leg-curl', name:'Beinbeuger sitzend', sets:3, reps:'10-12', rir:'0-1', muscle:'legs', ssGroup:1 },
      { id:'lb-calf', name:'Wadenheben (einseitig)', sets:4, reps:'12-15', rir:'0', muscle:'calves', ssGroup:1, note:'Jedes Bein einzeln. Volle ROM, Dehnung unten 2s halten.' },
      { id:'lb-back-ext', name:'Rückenstrecker (45°)', sets:3, reps:'12-15', rir:'0', muscle:'back' }
    ]
  },
  'schwach': {
    title: 'Schwachstellen-Tag — Arme, Schultern, Core, Waden',
    exercises: [
      { id:'sw-ez-curl', name:'Curls mit EZ-Stange', sets:3, reps:'8-10', rir:'-', muscle:'arms', ssGroup:1, note:'Supersatz A · Tempo 3-0-1-0' },
      { id:'sw-overhead-tri', name:'Trizepsstrecken über Kopf (Kabel, Seil)', sets:3, reps:'10-12', rir:'-', muscle:'arms', ssGroup:1, note:'Supersatz A · Tempo 3-0-1-0' },
      { id:'sw-incline-curl', name:'Schrägbank-Curls (KH)', sets:3, reps:'10-12', rir:'-', muscle:'arms', ssGroup:2, note:'Supersatz B · Tempo 4-0-2-0 (langsam in Dehnung!)' },
      { id:'sw-pushdowns', name:'Trizeps-Drücken (Stange)', sets:3, reps:'10-12', rir:'-', muscle:'arms', ssGroup:2, note:'Supersatz B · Tempo 2-0-1-1' },
      { id:'sw-lateral', name:'Seitheben (KH)', sets:4, reps:'15-20', rir:'-', muscle:'shoulders', ssGroup:3, note:'Supersatz C · Tempo 2-0-1-0' },
      { id:'sw-face-pulls', name:'Gesichtszug (Face Pulls)', sets:4, reps:'15-20', rir:'-', muscle:'shoulders', ssGroup:3, note:'Supersatz C · Tempo 2-1-1-0' },
      { id:'sw-knee-raises', name:'Hängende Knieheben', sets:3, reps:'12-15', rir:'-', muscle:'core', ssGroup:4, note:'Supersatz D · Langsam ausfuehren' },
      { id:'sw-cable-crunch', name:'Kabel-Crunches (kniend, Seil)', sets:3, reps:'15-20', rir:'-', muscle:'core', ssGroup:4, note:'Supersatz D · Tempo 2-0-1-0' },
      { id:'sw-calf', name:'Wadenheben (einseitig)', sets:3, reps:'15-20', rir:'-', muscle:'calves', note:'Finisher — Tempo 2-2-1-0, volle Dehnung' }
    ]
  },
  'info': { title: 'Uebersicht', content: true },
  'verlauf': { title: 'Verlauf', content: true }
};

const DAYS = {
  "upper-a": {
    "title": "Oberkörper A",
    "exercises": [
      {
        "id": "ua-machine-chest",
        "name": "Maschinen-Brustpresse",
        "sets": 3,
        "reps": "6–10",
        "rir": "1–2",
        "muscle": "chest",
        "rest": 150,
        "note": ""
      },
      {
        "id": "ub-tbar",
        "name": "Brustgestütztes Kurzhantelrudern",
        "sets": 3,
        "reps": "8–12",
        "rir": "1–2",
        "muscle": "back",
        "rest": 150,
        "note": ""
      },
      {
        "id": "ua-incline-smith",
        "name": "Schrägbank-Brustpresse",
        "sets": 2,
        "reps": "8–12",
        "rir": "1–2",
        "muscle": "chest",
        "rest": 150,
        "note": ""
      },
      {
        "id": "ua-lat-pulldown",
        "name": "Latzug",
        "sets": 2,
        "reps": "8–12",
        "rir": "1–2",
        "muscle": "back",
        "rest": 150,
        "note": ""
      },
      {
        "id": "ua-lateral",
        "name": "Seitheben",
        "sets": 2,
        "reps": "12–20",
        "rir": "1–2",
        "muscle": "shoulders",
        "rest": 90,
        "note": ""
      },
      {
        "id": "ua-triceps-rope",
        "name": "Trizepsdrücken am Seil",
        "sets": 2,
        "reps": "10–15",
        "rir": "1–2",
        "muscle": "arms",
        "rest": 90,
        "note": ""
      },
      {
        "id": "ua-ez-curl",
        "name": "EZ-Curls",
        "sets": 2,
        "reps": "10–15",
        "rir": "1–2",
        "muscle": "arms",
        "rest": 90,
        "note": ""
      }
    ]
  },
  "lower-a": {
    "title": "Unterkörper A",
    "exercises": [
      {
        "id": "la-bulgarian",
        "name": "Bulgarian Split Squats",
        "sets": 3,
        "reps": "8–12",
        "rir": "1–2",
        "muscle": "legs",
        "rest": 180,
        "note": "Je Bein. Gleiche Tiefe und kontrollierte Ausführung. Startseite abwechseln."
      },
      {
        "id": "la-legpress-bilateral",
        "name": "Beinpresse · beidbeinig",
        "sets": 3,
        "reps": "10–15",
        "rir": "1–2",
        "muscle": "legs",
        "rest": 150,
        "note": "Neue Übungsvariante: Gewichte der früheren einseitigen Beinpresse nicht übernehmen."
      },
      {
        "id": "la-leg-curl",
        "name": "Beinbeuger sitzend",
        "sets": 3,
        "reps": "10–15",
        "rir": "1–2",
        "muscle": "legs",
        "rest": 90,
        "note": ""
      },
      {
        "id": "la-calf",
        "name": "Wadenheben",
        "sets": 3,
        "reps": "10–20",
        "rir": "1–2",
        "muscle": "calves",
        "rest": 90,
        "note": ""
      },
      {
        "id": "la-cable-crunch",
        "name": "Kabel-Crunches",
        "sets": 2,
        "reps": "10–20",
        "rir": "1–2",
        "muscle": "core",
        "rest": 90,
        "note": ""
      }
    ]
  },
  "upper-b": {
    "title": "Oberkörper B",
    "exercises": [
      {
        "id": "ub-incline-press",
        "name": "Schrägbank-Brustpresse",
        "sets": 3,
        "reps": "8–12",
        "rir": "1–2",
        "muscle": "chest",
        "rest": 150,
        "note": ""
      },
      {
        "id": "ub-lat-pulldown",
        "name": "Latzug · enger Griff",
        "sets": 3,
        "reps": "8–12",
        "rir": "1–2",
        "muscle": "back",
        "rest": 150,
        "note": ""
      },
      {
        "id": "ub-cable-row",
        "name": "Kabelrudern sitzend",
        "sets": 2,
        "reps": "8–12",
        "rir": "1–2",
        "muscle": "back",
        "rest": 150,
        "note": ""
      },
      {
        "id": "ub-lateral",
        "name": "Seitheben",
        "sets": 2,
        "reps": "12–20",
        "rir": "1–2",
        "muscle": "shoulders",
        "rest": 90,
        "note": ""
      },
      {
        "id": "ub-face-pulls",
        "name": "Face Pulls",
        "sets": 2,
        "reps": "12–20",
        "rir": "1–2",
        "muscle": "shoulders",
        "rest": 90,
        "note": ""
      },
      {
        "id": "ub-incline-curl",
        "name": "Schrägbank-Curls",
        "sets": 2,
        "reps": "10–15",
        "rir": "1–2",
        "muscle": "arms",
        "rest": 90,
        "note": ""
      },
      {
        "id": "ub-overhead-tri",
        "name": "Trizepsstrecken über Kopf",
        "sets": 2,
        "reps": "10–15",
        "rir": "1–2",
        "muscle": "arms",
        "rest": 90,
        "note": ""
      }
    ]
  },
  "lower-b": {
    "title": "Unterkörper B",
    "exercises": [
      {
        "id": "lb-rdl",
        "name": "Rumänisches Kreuzheben",
        "sets": 3,
        "reps": "6–10",
        "rir": "1–2",
        "muscle": "legs",
        "rest": 180,
        "note": "Hüfte nach hinten führen. Bewegung beenden, bevor die Rückenposition verloren geht."
      },
      {
        "id": "lb-legpress-bilateral",
        "name": "Beinpresse · beidbeinig",
        "sets": 2,
        "reps": "10–15",
        "rir": "1–2",
        "muscle": "legs",
        "rest": 150,
        "note": ""
      },
      {
        "id": "lb-extensions",
        "name": "Beinstrecker",
        "sets": 2,
        "reps": "12–15",
        "rir": "1–2",
        "muscle": "legs",
        "rest": 90,
        "note": ""
      },
      {
        "id": "lb-leg-curl",
        "name": "Beinbeuger sitzend",
        "sets": 3,
        "reps": "10–15",
        "rir": "1–2",
        "muscle": "legs",
        "rest": 90,
        "note": ""
      },
      {
        "id": "lb-calf",
        "name": "Wadenheben · einseitig",
        "sets": 3,
        "reps": "10–20",
        "rir": "1–2",
        "muscle": "calves",
        "rest": 90,
        "note": "Sätze je Seite. Kontrolliert über den verfügbaren Bewegungsumfang."
      },
      {
        "id": "lb-knee-raises",
        "name": "Hängendes Knieheben",
        "sets": 2,
        "reps": "10–20",
        "rir": "1–2",
        "muscle": "core",
        "rest": 90,
        "note": ""
      }
    ]
  },
  "schwach": {
    "title": "Früherer Zusatzplan",
    "exercises": []
  },
  "info": {
    "title": "Einstellungen",
    "content": true
  },
  "verlauf": {
    "title": "Verlauf",
    "content": true
  }
};
DAYS.schwach.exercises = LEGACY_DAYS.schwach.exercises;

const STORAGE_KEY = 'training-tracker-data';

let currentView = 'upper-a';


let saveFailure = false;
let volatileData = null;
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function numericValue(value) {
  const text = String(value ?? '').trim();
  return /^\d+(?:[.,]\d+)?$/.test(text) ? Number(text.replace(',', '.')) : null;
}
function validSet(entry) {
  const n = normalizeEntry(entry);
  return numericValue(n.w) !== null && numericValue(n.r) > 0 && Number.isInteger(numericValue(n.r));
}
function updateSaveStatus(message, error) {
  const el = document.getElementById('save-status');
  if (el) { el.textContent = message; el.classList.toggle('error', !!error); }
}
function notice(message) {
  const el = document.getElementById('notice');
  el.textContent = message; el.hidden = false;
}
function icon(name) {
  const paths = { training:'M4 8v8m4-11v14M8 12h8m0-7v14m4-11v8', history:'M4 19V9m8 10V5m8 14v-7', settings:'M4 7h16M4 17h16M8 4v6m8 4v6', check:'m5 12 4 4L19 6', timer:'M9 3h6m-3 5v5l3 2M12 6a8 8 0 1 0 0 16 8 8 0 0 0 0-16', arrow:'m9 5 7 7-7 7' };
  return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="' + paths[name] + '"/></svg>';
}


/* ---------- Datenmodell ---------- */

function normalizeEntry(v) {
  // alt: '60'  →  neu: { w:'60', r:'' }
  if (v && typeof v === 'object') {
    return { w: String(v.w ?? ''), r: String(v.r ?? '') };
  }
  return { w: String(v ?? ''), r: '' };
}

function loadData() {
  if (volatileData) return JSON.parse(JSON.stringify(volatileData));
  let data = {};
  try { data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { data = {}; }
  // Migration: alte String-Werte → {w,r}
  let changed = false;
  Object.keys(data).forEach(k => {
    if (k.startsWith('__')) return;
    if (data[k] && typeof data[k] === 'object') {
      Object.keys(data[k]).forEach(s => {
        const n = normalizeEntry(data[k][s]);
        if (typeof data[k][s] !== 'object' || data[k][s].w !== n.w || data[k][s].r !== n.r) changed = true;
        data[k][s] = n;
      });
    }
  });
  const hist = getHistory(data);
  hist.forEach(h => {
    if (!h.entries) return;
    Object.keys(h.entries).forEach(exId => {
      Object.keys(h.entries[exId] || {}).forEach(s => {
        const n = normalizeEntry(h.entries[exId][s]);
        const previous = h.entries[exId][s];
        if (typeof previous !== 'object' || previous.w !== n.w || previous.r !== n.r) changed = true;
        h.entries[exId][s] = n;
      });
    });
  });
  if (changed) saveData(data, true);
  return data;
}

function saveData(data, silent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    volatileData = null;
    saveFailure = false;
    updateSaveStatus('Auf diesem Gerät gespeichert', false);
    const noticeEl = document.getElementById('notice');
    if (noticeEl?.dataset.kind === 'storage') { noticeEl.hidden = true; delete noticeEl.dataset.kind; }
  } catch (error) {
    volatileData = JSON.parse(JSON.stringify(data));
    saveFailure = true;
    updateSaveStatus('Speichern fehlgeschlagen – Backup erstellen', true);
    notice('Der Gerätespeicher ist nicht verfügbar oder voll. Lass die App geöffnet und sichere deine Eingaben als Backup.');
    document.getElementById('notice').dataset.kind = 'storage';
    return false;
  }
  return true;
}

function getHistory(data) {
  if (!data.__history__) data.__history__ = [];
  return data.__history__;
}

function entriesEqual(a, b) {
  if (!a || !b) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every(k => {
    const na = normalizeEntry(a[k]), nb = normalizeEntry(b[k]);
    return na.w === nb.w && na.r === nb.r;
  });
}

function formatDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso))) return 'Unbekannt';
  if (!iso) return '';
  const p = iso.split('-');
  return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : iso;
}

function maxWeight(entry) {
  let max = null;
  Object.values(entry || {}).forEach(v => {
    const n = parseFloat(String(normalizeEntry(v).w).replace(',', '.'));
    if (!isNaN(n) && (max === null || n > max)) max = n;
  });
  return max;
}

function fmtKg(n) {
  return String(n).replace('.', ',');
}

function volumeForEntry(entry) {
  // Summe kg×Wdh über alle Sätze; null wenn keine Wdh. vorhanden
  let total = 0, hasReps = false;
  Object.values(entry || {}).forEach(v => {
    const n = normalizeEntry(v);
    const w = parseFloat(String(n.w).replace(',', '.'));
    const r = parseFloat(String(n.r).replace(',', '.'));
    if (!isNaN(w) && !isNaN(r) && r > 0) { total += w * r; hasReps = true; }
  });
  return hasReps ? Math.round(total * 10) / 10 : null;
}

function hasAnyReps(data) {
  const hist = getHistory(data);
  return hist.some(h => Object.values(h.entries || {}).some(e => volumeForEntry(e) !== null));
}

function weekKey(iso) {
  // Montag der Woche (Mo–So) zum ISO-Datum
  const d = new Date(iso + 'T12:00:00');
  const dow = (d.getDay() + 6) % 7;
  const m = new Date(d);
  m.setDate(d.getDate() - dow);
  return m.getFullYear() + '-' + String(m.getMonth() + 1).padStart(2, '0') + '-' + String(m.getDate()).padStart(2, '0');
}

const DAY_LABEL = { 'upper-a': 'Oberkörper A', 'lower-a': 'Unterkörper A', 'upper-b': 'Oberkörper B', 'lower-b': 'Unterkörper B', 'schwach': 'Zusatzplan' };

function weekVolume(h) {
  let total = 0;
  Object.values(h.entries || {}).forEach(e => {
    const v = volumeForEntry(e);
    if (v !== null) total += v;
  });
  return Math.round(total * 10) / 10;
}

function renderWeekSummary(data) {
  const hist = getHistory(data);
  const today = todayISO();
  const wk = weekKey(today);
  const wkDate = new Date(wk + 'T12:00:00');
  const prev = new Date(wkDate);
  prev.setDate(prev.getDate() - 7);
  const prevKey = prev.toISOString().slice(0, 10);

  const days = {};
  let volThis = 0, volPrev = 0;
  hist.forEach(h => {
    if (!h.date || !h.day) return;
    const v = weekVolume(h);
    if (weekKey(h.date) === wk) {
      volThis += v;
      if (!days[h.day] || h.date > days[h.day].date) days[h.day] = { date: h.date, vol: v };
    } else if (weekKey(h.date) === prevKey) {
      volPrev += v;
    }
  });
  volThis = Math.round(volThis * 10) / 10;
  volPrev = Math.round(volPrev * 10) / 10;

  const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  let html = '<div class="info-card"><h2>Diese Woche</h2>';
  const dayKeys = Object.keys(days);
  if (!dayKeys.length) {
    html += '<div class="week-empty">Noch kein Training diese Woche — los geht\'s!</div>';
  } else {
    html += '<div class="week-days">';
    dayKeys.forEach(k => {
      const d = new Date(days[k].date + 'T12:00:00');
      html += '<div class="week-day"><span class="wd-name">' + dayNames[d.getDay()] + '</span><span class="wd-label">' + (DAY_LABEL[k] || k) + '</span></div>';
    });
    html += '</div>';
  }
  html += '<div class="week-vol">';
  html += '<span>Volumen: <strong>' + fmtKg(volThis) + ' kg</strong></span>';
  if (volPrev > 0) {
    const pct = Math.round((volThis - volPrev) / volPrev * 100);
    if (pct > 0) html += '<span class="wk-up">↑ ' + pct + ' % ggü. letzter Woche</span>';
    else if (pct < 0) html += '<span class="wk-down">↓ ' + Math.abs(pct) + ' % ggü. letzter Woche</span>';
    else html += '<span class="wk-same">= letzte Woche</span>';
  }
  html += '</div>';
  if (!hasAnyReps(data)) {
    html += '<div class="week-hint">Tipp: Wdh. eintragen, dann zählt die App dein Volumen (kg × Wdh.)</div>';
  }
  html += '</div>';
  return html;
}

function getMetricPoints(data, exId) {
  const hist = getHistory(data);
  const points = [];
  hist.forEach(h => {
    const w = h.entries && h.entries[exId];
    if (!w) return;
    let v = null;
    if (__verlaufMetric === 'volume') v = volumeForEntry(w);
    else v = maxWeight(w);
    if (v !== null) points.push({ date: h.date, v: v });
  });
  points.sort((a, b) => a.date < b.date ? -1 : 1);
  return points;
}

function getLastEntry(data, exId) {
  const hist = getHistory(data);
  for (let i = hist.length - 1; i >= 0; i--) {
    const w = hist[i].entries && hist[i].entries[exId];
    if (w && Object.values(w).some(v => { const n = normalizeEntry(v); return n.w || n.r; })) return { date: hist[i].date, weights: w };
  }
  return null;
}

function getPrevEntry(data, exId, currentWeights) {
  const hist = getHistory(data);
  for (let i = hist.length - 1; i >= 0; i--) {
    const w = hist[i].entries && hist[i].entries[exId];
    if (w && Object.keys(w).length && !entriesEqual(w, currentWeights)) return { date: hist[i].date, weights: w };
  }
  return null;
}

function lastDatesForDay(data, dayKey, n) {
  return getHistory(data).filter(h => h.day === dayKey).slice(-n).map(h => h.date);
}

function migrateData(data) {
  const hist = getHistory(data);
  if (hist.length) return;
  const entries = {};
  let hasAny = false;
  Object.keys(data).forEach(k => {
    if (k.startsWith('__')) return;
    if (data[k] && typeof data[k] === 'object' && Object.values(data[k]).some(v => { const n = normalizeEntry(v); return n.w || n.r; })) {
      entries[k] = JSON.parse(JSON.stringify(data[k]));
      hasAny = true;
    }
  });
  if (hasAny) {
    hist.push({ date: todayISO(), day: 'migration', entries });
  }
}

/* ---------- Rotation (flexible Einheiten, keine festen Tage) ---------- */

const ROTATION = ['upper-a', 'lower-a', 'upper-b', 'lower-b'];

/* Woche komplett? Alle 4 Einheiten in der aktuellen Kalenderwoche (Mo–So) gemacht */
function weekDone(data) {
  const wk = weekKey(todayISO());
  const done = new Set();
  getHistory(data).forEach(h => {
    if (ROTATION.includes(h.day) && weekKey(h.date) === wk) done.add(h.day);
  });
  return ROTATION.every(k => done.has(k));
}

/* Schwachstellen-Tag diese Woche schon gemacht? */
function schwachDone(data) {
  const wk = weekKey(todayISO());
  return getHistory(data).some(h => h.day === 'schwach' && weekKey(h.date) === wk);
}

/* Kurz-Label ("Upper A" → "A", "Schwachstellen" → "Schwachstellen") */
function shortLabel(dayKey) {
  const parts = DAY_LABEL[dayKey].split(' ');
  return parts[1] || parts[0];
}

function rotationIndex(data) {
  const r = data.__rotation__;
  const i = r && typeof r.index === 'number' ? r.index : 0;
  return ((i % ROTATION.length) + ROTATION.length) % ROTATION.length;
}

function todayISO() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

/* Tageswahl: welche Einheit der User heute SELBST gewaehlt hat (gilt nur am selben Tag) */
function pickedDay(data) {
  const p = data.__today__;
  if (p && p.date === todayISO() && (ROTATION.includes(p.day) || p.day === 'schwach')) return p.day;
  return null;
}

/* Heute relevant: eigene Wahl schlaegt Vorschlag */
function currentRotationDay(data) {
  const picked=pickedDay(data);
  if (picked) return picked;
  const drafts=Object.entries(data.__drafts__||{}).filter(([day])=>DAYS[day]?.exercises);
  drafts.sort((a,b)=>b[1].startedAt-a[1].startedAt);
  return drafts[0]?.[0] || ROTATION[rotationIndex(data)];
}

/* Einheit selbst waehlen (statt von Plan zu Plan) */
function pickDay(dayKey) {
  if (!DAYS[dayKey] || DAYS[dayKey].content) return;
  saveCurrentState();
  const data = loadData();
  data.__today__ = { date: todayISO(), day: dayKey };
  if (!saveData(data)) return;
  currentView = dayKey;
  renderAll();
}

function nextRotationAfter(dayKey) {
  return ROTATION[(ROTATION.indexOf(dayKey) + 1) % ROTATION.length];
}

function advanceRotation(data) {
  // Schwachstellen abgeschlossen → neue Runde beginnt mit Upper A
  const next = (rotationIndex(data) + 1) % ROTATION.length;
  data.__rotation__ = { index: next, lastFinish: todayISO() };
  saveData(data);
  return ROTATION[next];
}

/* ---------- Heute-Karte, Statistiken, Wochen-Vorschau ---------- */

function fmtDateDE(d) {
  const days = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
  return days[d.getDay()] + ', ' + d.getDate() + '.' + (d.getMonth() + 1) + '.';
}

function trainingCount(data) {
  return getHistory(data).filter(h => h.day !== 'migration').length;
}

/* Tageswahl: Chips zum Aussuchen der Einheit */
function dayPickerHtml(data, picked) {
  const cur = DAYS[currentView]?.exercises ? currentView : currentRotationDay(data);
  const keys = ROTATION.concat(['schwach']);
  let chips = '';
  keys.forEach(function(k) {
    let cls = 'pick-chip';
    if (k === picked) cls += ' picked';
    else if (!picked && k === cur) cls += ' suggested';
    chips += '<button class="' + cls + '" onclick="pickDay(\'' + k + '\')">' + (k === 'schwach' ? '+ Schwachst.' : DAY_LABEL[k]) + '</button>';
  });
  return '<div class="pick-wrap">' +
    '<div class="pick-title">' + (picked
      ? 'Heute gewaehlt: <strong>' + DAY_LABEL[picked] + '</strong> — tippe eine andere Einheit zum Wechseln'
      : 'Was trainierst du heute? Vorschlag: <strong>' + DAY_LABEL[cur] + '</strong>') + '</div>' +
    '<div class="pick-row">' + chips + '</div>' +
    '</div>';
}

function weekPreviewHtml(data) {
  const cur = currentRotationDay(data);
  const hist = getHistory(data);
  const today = todayISO();
  const doneToday = hist.some(h => h.date === today && (ROTATION.includes(h.day) || h.day === 'schwach'));
  const showSchwach = weekDone(data) && !schwachDone(data) && cur === 'schwach';
  let html = '<div class="week-preview' + (showSchwach ? ' wp-five' : '') + '">';
  ROTATION.forEach(function(k) {
    const isNow = k === cur;
    const doneCls = doneToday && isNow ? ' wp-done' : '';
    html += '<div class="wp-cell' + (isNow ? ' wp-now' : '') + doneCls + '" onclick="pickDay(\'' + k + '\')">' +
      '<div class="wp-day">' + shortLabel(k) + '</div>' +
      '<div class="wp-name">' + DAY_LABEL[k] + '</div></div>';
  });
  // Schwachstellen als 5. Einheit, wenn Woche komplett
  html += '<div class="wp-cell' + (cur === 'schwach' ? ' wp-now' : '') + (doneToday && cur === 'schwach' ? ' wp-done' : '') + '" onclick="pickDay(\'schwach\')">' +
    '<div class="wp-day">+</div>' +
    '<div class="wp-name">Schwachst.</div></div>';
  html += '</div>';
  return html;
}

/* Feature 1: Wochen-Fortschrittsbalken */
function weekProgress(data) {
  const wk = weekKey(todayISO());
  const doneSet = new Set();
  getHistory(data).forEach(h => {
    if (weekKey(h.date) === wk && (ROTATION.includes(h.day) || h.day === 'schwach')) doneSet.add(h.day);
  });
  // Reihenfolge: 4 Rotationseinheiten + Schwachstellen (wenn Woche komplett)
  const cur = currentRotationDay(data);
  const showSchwach = weekDone(data) || cur === 'schwach';
  const order = showSchwach ? [...ROTATION, 'schwach'] : ROTATION;
  const doneCount = order.filter(k => doneSet.has(k)).length;
  let segs = '';
  order.forEach(k => {
    let cls = doneSet.has(k) ? ' done' : '';
    if (k === cur && !doneSet.has(k)) cls += ' now';
    segs += '<div class="week-seg' + cls + '"></div>';
  });
  let labels = '';
  order.forEach(k => { labels += '<span>' + shortLabel(k) + '</span>'; });
  const total = order.length;
  const pct = Math.round(doneCount / total * 100);
  const doneToday = getHistory(data).some(h => h.date === todayISO() && (ROTATION.includes(h.day) || h.day === 'schwach'));
  const status = doneToday ? '✓ Woche läuft' : (doneCount === total ? '✓ Woche komplett!' : 'Woche läuft');
  return '<div class="week-bar-wrap">' +
    '<div class="week-bar-top"><strong>' + status + '</strong><span>' + doneCount + '/' + total + ' Einheiten (' + pct + '%)</span></div>' +
    '<div class="week-bar">' + segs + '</div>' +
    '<div class="week-bar-labels">' + labels + '</div>' +
    '</div>';
}

function renderTodayHero() {
  const data = loadData();
  const cur = currentView;
  const day = DAYS[cur];
  const sets = day.exercises.reduce((sum, e) => sum + e.sets, 0);
  const count = getHistory(data).filter(h => ROTATION.includes(h.day) && weekKey(h.date) === weekKey(todayISO())).length;
  return '<section class="training-intro"><div class="eyebrow">DEIN TRAINING · ' + escapeHtml(fmtDateDE(new Date())) + '</div>' +
    '<h1>' + escapeHtml(DAY_LABEL[cur]) + '</h1><p class="page-subtitle">' + day.exercises.length + ' Übungen · ' + sets + ' Arbeitssätze · ca. 60 Min.</p>' +
    '<div class="rotation-picker" aria-label="Trainingseinheit wählen">' + ROTATION.map((key, i) =>
      '<button aria-label="' + DAY_LABEL[key] + '" aria-pressed="' + (key === cur) + '" onclick="pickDay(\'' + key + '\')"><span>0' + (i+1) + '</span>' + DAY_LABEL[key].replace('Oberkörper','Ober').replace('Unterkörper','Unter') + '</button>').join('') + '</div>' +
    '<div class="rotation-caption">Fortlaufende Rotation · ' + count + ' / 4 Trainings diese Woche</div></section>';
}

function renderDeloadBanner() {
  return '';
}

/* PR-Erkennung: nach dem Speichern prüfen, ob neue Rekorde aufgestellt wurden */
function findNewPRs(data, dayKey, entries, today) {
  const prs = [];
  const hist = getHistory(data);
  const prevEntries = hist.filter(h => h.day === dayKey && h.date !== today);
  Object.keys(entries).forEach(exId => {
    const curMax = maxWeight(entries[exId]);
    if (curMax === null) return;
    let prevMax = null;
    prevEntries.forEach(h => {
      const m = maxWeight(h.entries && h.entries[exId]);
      if (m !== null && (prevMax === null || m > prevMax)) prevMax = m;
    });
    if (prevMax !== null && curMax > prevMax) {
      const ex = allExercises().find(e => e.id === exId);
      prs.push({ name: ex ? ex.name : exId, from: prevMax, to: curMax });
    }
  });
  return prs;
}

function showPRBanners(prs) {
  if (!prs.length) return;
  let html = '';
  prs.forEach(pr => {
    html += '<div class="pr-banner"><span class="pr-icon">🏆</span><div class="pr-text">Neuer Rekord: ' + pr.name + '!<small>' + fmtKg(pr.from) + ' kg → ' + fmtKg(pr.to) + ' kg</small></div></div>';
  });
  const main = document.getElementById('main');
  if (main && !document.querySelector('.pr-banner')) {
    main.insertAdjacentHTML('afterbegin', html);
    setTimeout(function() {
      document.querySelectorAll('.pr-banner').forEach(function(b) { b.style.display = 'none'; });
    }, 6000);
  }
}

function getExEntry(data, exId) {
  return (data[exId] && typeof data[exId] === 'object') ? data[exId] : {};
}

/* Gibt es schon ein aktuelles Gewicht für diese Übung (im aktuellen Tag)? */
function curMaxIsSet(data, exId) {
  const e = getExEntry(data, exId);
  return Object.values(e).some(v => {
    const n = parseFloat(String(normalizeEntry(v).w).replace(',', '.'));
    return !isNaN(n) && n > 0;
  });
}

/* Vorschlag übernehmen: alle leeren Sätze mit dem Ziel-Gewicht füllen */
function fillSuggestion(exId, kg) {
  const data = loadData();
  const dayKey = (function() {
    const dayKeys = Object.keys(DAYS);
    for (let i = 0; i < dayKeys.length; i++) {
      const d = DAYS[dayKeys[i]];
      if (d.exercises && d.exercises.some(e => e.id === exId)) return dayKeys[i];
    }
    return '';
  })();
  const panel = document.getElementById('panel-' + dayKey);
  if (!panel) return;
  const val = String(kg).replace('.', ',');
  panel.querySelectorAll('.weight-input[data-ex="' + exId + '"]').forEach(inp => {
    if (!inp.value.trim()) {
      inp.value = val;
      inp.classList.add('filled');
    }
  });
  autoSave();
}

/* ---------- Delta (Live) ---------- */

window.__prevMax = {};
window.__prevMaxDate = {};

function updateDelta(exId) {
  const el = document.getElementById('last-' + exId);
  if (!el || !window.__prevMax[exId]) return;
  const panel = el.closest('.day-panel');
  let curMax = null;
  panel.querySelectorAll('.weight-input[data-ex="' + exId + '"]').forEach(inp => {
    const n = parseFloat(inp.value.replace(',', '.'));
    if (!isNaN(n) && (curMax === null || n > curMax)) curMax = n;
  });
  const badge = el.querySelector('.delta');
  if (!badge) return;
  if (curMax === null) { badge.className = 'delta'; badge.textContent = ''; return; }
  const diff = curMax - window.__prevMax[exId];
  const d = window.__prevMaxDate[exId] ? ' ggü. ' + window.__prevMaxDate[exId] : '';
  if (diff > 0.001) { badge.className = 'delta up'; badge.textContent = '↑ +' + fmtKg(diff) + ' kg' + d; }
  else if (diff < -0.001) { badge.className = 'delta down'; badge.textContent = '↓ ' + fmtKg(diff) + ' kg' + d; }
  else { badge.className = 'delta same'; badge.textContent = '= gleich' + d; }
}

/* ---------- Timer ---------- */

window.__timers = {};
let __audioCtx = null;

function beep() {
  try {
    if (!__audioCtx) __audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = __audioCtx.createOscillator();
    const g = __audioCtx.createGain();
    o.connect(g); g.connect(__audioCtx.destination);
    o.frequency.value = 880; g.gain.value = 0.15;
    o.start(); o.stop(__audioCtx.currentTime + 0.35);
  } catch (e) {}
}

function startTimer(exId, secs, btn) {
  Object.keys(window.__timers).forEach(stopTimer);
  const deadline = Date.now() + secs * 1000;
  function tick() {
    const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    const el = document.getElementById('timer-run-' + exId);
    if (el) el.textContent = left ? fmtTime(left) : 'Pause beendet';
    if (!left) { clearInterval(window.__timers[exId]); delete window.__timers[exId]; if (btn) btn.classList.remove('running'); beep(); }
  }
  if (btn) btn.classList.add('running');
  window.__timers[exId] = setInterval(tick, 250);
  tick();
}

function stopTimer(exId) {
  clearInterval(window.__timers[exId]); delete window.__timers[exId];
  const el = document.getElementById('timer-run-' + exId);
  const ex = allExercises().find(e => e.id === exId);
  if (el) el.textContent = fmtTime(ex?.rest || 90);
  document.querySelectorAll('.timer-btn[data-ex="' + exId + '"]').forEach(b => b.classList.remove('running'));
}

function fmtTime(s) {
  const m = Math.floor(s / 60), r = s % 60;
  return m + ':' + (r < 10 ? '0' : '') + r;
}

/* ---------- Auto-Save ---------- */

let __saveTimer = null;

function autoSave() {
  saveCurrentState();
}

/* Feature 8: Trainings-Session (Dauer) */
function startSessionIfNeeded() {
  return !!workoutDraft(loadData(), currentView);
}

function formatDuration(ms) {
  if (!ms) return '—';
  const mins = Math.round(ms / 60000);
  if (mins < 60) return mins + ' Min.';
  const h = Math.floor(mins / 60), m = mins % 60;
  return h + ' Std. ' + m + ' Min.';
}

/* Dauer-Chip für die Heute-Karte */
function renderDurationChip() {
  const draft = workoutDraft(loadData(), currentView);
  if (!draft) return '';
  return '<span class="duration-chip">Begonnen ' + escapeHtml(new Date(draft.startedAt).toLocaleString('de-DE',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})) + '</span>';
}

function saveCurrentState() {
  const inputs = document.querySelectorAll('.weight-input, .reps-input');
  if (!inputs.length) return true;
  const data = loadData();
  if (!workoutDraft(data, currentView)) return true;
  let changed = false;
  inputs.forEach(inp => {
    const exId = inp.dataset.ex, setId = inp.dataset.set;
    if (!data[exId]) data[exId] = {};
    const entry = normalizeEntry(data[exId][setId]);
    const field = inp.classList.contains('weight-input') ? 'w' : 'r';
    if (entry[field] !== inp.value.trim()) changed = true;
    entry[field] = inp.value.trim();
    data[exId][setId] = entry;
  });
  const saved = changed || saveFailure ? saveData(data) : true;
  updateProgress();
  return saved;
}

/* ---------- Abhaken / Fortschritt ---------- */

function isExDone(data, exId) {
  return !!(data.__done__ && data.__done__[exId]);
}

function toggleDone(exId) {
  if (!workoutDraft(loadData(),currentView) || !saveCurrentState()) return;
  const data = loadData();
  const ex = allExercises().find(e => e.id === exId);
  if (!data.__done__) data.__done__ = {};
  if (!data.__done__[exId] && !Array.from({length: ex.sets}, (_, i) => validSet((data[exId] || {})[i+1])).every(Boolean)) {
    notice('Bitte zuerst Gewicht und Wiederholungen für alle Sätze dieser Übung eintragen.'); return;
  }
  data.__done__[exId] = !data.__done__[exId];
  saveData(data);
  const card = document.getElementById('card-' + exId);
  if (card) {
    card.classList.toggle('done', data.__done__[exId]);
    const btn = card.querySelector('.check-btn');
    btn.setAttribute('aria-pressed', String(data.__done__[exId]));
    btn.innerHTML = icon('check') + (data.__done__[exId] ? 'Erledigt' : 'Übung abschließen');
  }
  updateProgress();
}

function updateProgress() {
  const day = DAYS[currentView];
  const el = document.getElementById('session-progress');
  if (!day || !day.exercises || !el) return;
  const data = loadData();
  const done = workoutDraft(data,currentView) ? day.exercises.filter(ex => isExDone(data, ex.id)).length : 0;
  el.textContent = done + ' / ' + day.exercises.length + ' Übungen abgeschlossen';
}

/* ---------- Render ---------- */

function renderDay(dayKey) {
  const day = DAYS[dayKey];
  const data = loadData();
  const draft = workoutDraft(data,dayKey);
  const disabled = draft ? '' : ' disabled';
  const last = getHistory(data).filter(h => h.day === dayKey && h.day !== 'migration').at(-1);
  let html = '<section class="day-panel active" id="panel-' + dayKey + '"><div class="session-line"><span id="session-progress"></span>' + renderDurationChip() + '</div>';
  html += '<div class="workout-state"><h2>' + (draft ? (draft.recovered ? 'Übernommener Trainingsentwurf' : 'Training läuft') : 'Bereit für dein Training?') + '</h2><p>' + (draft ? 'Deine Eingaben bleiben beim Schließen der App erhalten. Letzte Werte werden nur in leere Felder übernommen.' : 'Starte eine neue Einheit mit leeren Feldern. Die letzten Leistungen bleiben unter den Feldern sichtbar.') + '</p>' + (last ? '<p>Letzte gespeicherte Einheit: ' + escapeHtml(formatDate(last.date)) + '</p>' : '') + '<div class="btn-row"><button class="btn primary" data-action="start-workout" onclick="startTraining(\'' + dayKey + '\')">' + (draft ? 'Training fortsetzen' : 'Neues Training starten') + '</button>' + (draft ? '<button class="btn" data-action="copy-last" onclick="copyLastValues(\'' + dayKey + '\')">Letzte Werte übernehmen</button><button class="text-btn" onclick="clearCurrentDay(\'' + dayKey + '\')">Neu beginnen</button>' : '') + '</div></div>';
  day.exercises.forEach((ex, index) => {
    const lastE = getLastEntry(data, ex.id);
    const done = !!draft && isExDone(data, ex.id);
    html += '<article class="ex-card' + (done ? ' done' : '') + '" id="card-' + ex.id + '"><div class="ex-header"><span class="ex-number">' + String(index+1).padStart(2,'0') + '</span><div><h2 class="ex-name">' + escapeHtml(ex.name) + '</h2><p class="ex-meta">' + ex.sets + ' × ' + ex.reps + ' Wdh. · ' + ex.rir + ' RIR</p></div></div>';
    if (ex.note) html += '<details class="technique"><summary>Ausführung & Hinweise</summary><p>' + escapeHtml(ex.note) + '</p></details>';
    if (lastE) html += '<p class="progression-hint">' + progressionHint(ex, lastE.weights) + '</p>';
    html += '<div class="sets-table"><div class="set-heading"><span>Satz</span><span>Gewicht · kg</span><span>Wiederholungen</span></div>';
    for (let s = 1; s <= ex.sets; s++) {
      const val = normalizeEntry(draft ? (data[ex.id] || {})[s] : null);
      const prev = normalizeEntry(lastE && lastE.weights[s]);
      html += '<div class="set-row"><span class="set-number">' + s + '</span><div class="field"><label class="sr-only" for="w-' + ex.id + '-' + s + '">' + escapeHtml(ex.name) + ', Satz ' + s + ', Gewicht in Kilogramm</label><input id="w-' + ex.id + '-' + s + '" ' + disabled + ' type="text" inputmode="decimal" enterkeyhint="next" class="weight-input" data-ex="' + ex.id + '" data-set="' + s + '" placeholder="–" value="' + escapeHtml(val.w) + '" autocomplete="off" spellcheck="false"><span class="previous">' + (prev.w ? 'Zuletzt ' + escapeHtml(prev.w) + ' kg' : 'Noch kein Wert') + '</span></div>';
      html += '<div class="field"><label class="sr-only" for="r-' + ex.id + '-' + s + '">' + escapeHtml(ex.name) + ', Satz ' + s + ', Wiederholungen</label><input id="r-' + ex.id + '-' + s + '" ' + disabled + ' type="text" inputmode="numeric" enterkeyhint="next" class="reps-input" data-ex="' + ex.id + '" data-set="' + s + '" placeholder="–" value="' + escapeHtml(val.r) + '" autocomplete="off"><span class="previous">' + (prev.r ? 'Zuletzt ' + escapeHtml(prev.r) + ' Wdh.' : 'Ziel ' + ex.reps) + '</span></div></div>';
    }
    html += '</div><p class="validation-message" id="validation-' + ex.id + '" role="status"></p><div class="exercise-footer"><button class="check-btn"' + disabled + ' aria-pressed="' + done + '" onclick="toggleDone(\'' + ex.id + '\')">' + icon('check') + (done ? 'Erledigt' : 'Übung abschließen') + '</button><button class="timer-btn"' + disabled + ' data-ex="' + ex.id + '" onclick="toggleTimer(\'' + ex.id + '\')" aria-label="Pausentimer für ' + escapeHtml(ex.name) + '">' + icon('timer') + '<span id="timer-run-' + ex.id + '">' + fmtTime(ex.rest || 90) + '</span></button></div></article>';
  });
  html += '<aside class="cardio-card"><div>' + icon('arrow') + '<strong>Danach: 20 Minuten Laufband</strong></div><p>Zügiges Gehen. Tempo und Steigung so wählen, dass du noch sprechen kannst. Nach dem Beintag bei Bedarf leichter.</p></aside><div class="finish-actions"><button class="btn primary"' + disabled + ' onclick="finishTraining(\'' + dayKey + '\')">Einheit speichern & abschließen ' + icon('check') + '</button><p>Deine Rotation läuft beim nächsten Training weiter.</p></div></section>';
  return html;
}

/* ---------- Timer-Interaktion ---------- */

window.__timerOpts = {};

function setTimerOpt(exId, secs, btn) {
  window.__timerOpts[exId] = secs;
  btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function toggleTimer(exId) {
  if (window.__timers[exId]) { stopTimer(exId); return; }
  const ex = allExercises().find(e => e.id === exId);
  startTimer(exId, ex.rest || 90, document.querySelector('.timer-btn[data-ex="' + exId + '"]'));
}

/* ---------- Info-Tab ---------- */

function renderRotationCard() {
  const data = loadData();
  const cur = currentRotationDay(data);
  let html = '<div class="info-card"><h2>Trainings-Rotation</h2><div class="week-grid">';
  ROTATION.forEach(function(k, i) {
    const isCur = k === cur;
    html += '<div class="' + (isCur ? 'rot-now' : '') + '"><strong>' + (i + 1) + '</strong><br>' + DAY_LABEL[k] + (isCur ? '<br><small>⬅ dran</small>' : '') + '</div>';
  });
  html += '<div><strong>+</strong><br>Schwachst.<br><small>optional</small></div>';
  html += '</div>' +
    '<p class="rot-hint"><strong>Du suchst aus:</strong> In der Heute-Karte tippst du an, welche Einheit du heute trainierst (A / LA / UB / LB oder + Schwachstellen) — auch aus der Wochen-Vorschau heraus. Die goldene Markierung ist nur ein Vorschlag. „Training fertig" merkt sich die Einheit für heute und schlägt danach die nächste vor, springt aber nicht mehr automatisch um. Nichts ist gesperrt: jede Einheit ist jederzeit eintragbar.</p></div>';
  return html;
}

function renderInfo() {
  return '<section class="day-panel active" id="panel-info"><div class="eyebrow">DEINE APP</div><h1>Einstellungen</h1>' +
    '<article class="info-card"><h2>Dein Trainingsrahmen</h2><p>Muskelaufbau · 4 flexible Einheiten · ca. 60 Minuten Krafttraining + 20 Minuten Gehen.</p><p>Erst Wiederholungen steigern. Wenn alle Sätze am oberen Ende gelingen und noch 1–2 saubere Wiederholungen möglich wären, den kleinsten passenden Gewichtsschritt wählen.</p><p>Mehrgelenkübungen: meist 2–3 Minuten Pause. Isolationen: meist 1–2 Minuten. Erholung nach Leistung und Befinden planen.</p><p>Orientierung Ernährung: etwa 1,6 g Protein pro Kilogramm Körpergewicht täglich. Kalorienzufuhr nach Ziel und Gewichtsverlauf anpassen.</p></article>' +
    '<article class="info-card"><h2>Auf dem iPhone installieren</h2><ol><li>Diese Seite in Safari öffnen.</li><li>Teilen antippen, dann „Zu Home-Bildschirm hinzufügen“ wählen.</li><li>Falls angeboten: „Als Web-App öffnen“ aktivieren und hinzufügen.</li><li>Die App über das neue Symbol öffnen.</li></ol><p>Nach dem ersten Laden funktioniert der Trainingsplan auch offline. Lokale Daten gehören zu diesem Gerät und dieser Webadresse: vor einem Wechsel ein Backup herunterladen.</p></article>' +
    '<article class="info-card" id="storage-info"><h2>Nur auf deinem iPhone</h2><p>Gewichte, Wiederholungen und Verlauf bleiben auf diesem Gerät. Es gibt keine Anmeldung, Server-Synchronisierung oder automatische Cloud-Sicherung.</p><p>Speichere regelmäßig ein Datei-Backup, zum Beispiel über „Dateien“ auf iCloud Drive. Die JSON-Datei ist nicht zusätzlich verschlüsselt. Bei Gerätewechsel oder gelöschten Website-Daten brauchst du dieses Backup.</p></article>' +
    '<article class="info-card" id="backup-card"><h2>Backup & Wiederherstellung</h2><p>Die JSON-Datei enthält den vollständigen Verlauf und offene Trainingsentwürfe. Speichere sie regelmäßig außerhalb dieser App. Eine lokale Sicherheitskopie ersetzt kein Datei-Backup.</p><div class="btn-row"><button class="btn primary" onclick="downloadBackup()">Backup herunterladen</button><button class="btn" onclick="exportBackup()">Als Text anzeigen</button></div><label for="backup-file">Backup-Datei vom Gerät laden</label><input class="backup-file" id="backup-file" type="file" accept=".json,application/json" onchange="importBackupFile(this)"><details><summary>Backup als Text wiederherstellen</summary><label for="backup-area">Backup-Text</label><textarea class="backup-area" id="backup-area" placeholder="JSON-Backup hier einfügen"></textarea><button class="btn" onclick="importBackup()">Backup wiederherstellen</button></details></article>' +
    '<details class="info-card"><summary>Früheren Zusatzplan öffnen</summary><p>Für deinen neuen Plan nicht erforderlich. Alte Übungen und Aufzeichnungen bleiben im Verlauf verfügbar.</p><button class="btn" onclick="pickDay(\'schwach\')">Zusatzplan anzeigen</button></details>' +
    '<details class="info-card danger-zone"><summary>Daten auf diesem Gerät löschen</summary><p>Erst ein Backup herunterladen. Diese Aktion betrifft den lokalen Datensatz.</p><button class="btn danger" onclick="resetAll()">Lokale Daten löschen</button></details></section>';
}

/* ---------- Verlauf-Tab ---------- */

let __verlaufEx = null;
let __verlaufMetric = 'weight';

function allExercises() {
  const byId = new Map();
  Object.values(LEGACY_DAYS).forEach(d => (d.exercises || []).forEach(e => byId.set(e.id, { ...e, name: e.name + ' · früherer Plan' })));
  Object.values(DAYS).forEach(d => (d.exercises || []).forEach(e => byId.set(e.id, e)));
  return [...byId.values()];
}

/* Feature 11: Rekord-Liste — Bestwert jeder Übung mit Datum */
function renderPRList(data) {
  const hist = getHistory(data);
  const best = {}; // exId -> { max, date, name }
  hist.forEach(h => {
    if (!h.entries) return;
    Object.keys(h.entries).forEach(exId => {
      const m = maxWeight(h.entries[exId]);
      if (m === null) return;
      if (!best[exId] || m > best[exId].max) {
        best[exId] = { max: m, date: h.date };
      }
    });
  });
  const entries = Object.keys(best);
  if (!entries.length) {
    return '<div class="info-card"><h2>Rekorde</h2><div class="pr-empty">Noch keine Rekorde — trag Gewichte ein, dann siehst du hier deine Bestleistungen!</div></div>';
  }
  // Nach Bestwert sortieren, Top 8
  const ranked = entries
    .map(exId => {
      const ex = allExercises().find(e => e.id === exId);
      return { id: exId, name: ex ? ex.name : exId, max: best[exId].max, date: best[exId].date };
    })
    .sort((a, b) => b.max - a.max)
    .slice(0, 8);
  const medals = ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.'];
  let html = '<div class="info-card"><h2>Deine Rekorde</h2><div class="pr-list">';
  ranked.forEach((r, i) => {
    html += '<div class="pr-row">' +
      '<span class="pr-rank">' + medals[i] + '</span>' +
      '<div class="pr-info"><div class="pr-name">' + r.name + '</div><div class="pr-date">' + formatDate(r.date) + '</div></div>' +
      '<span class="pr-val">' + fmtKg(r.max) + ' kg</span>' +
      '</div>';
  });
  html += '</div></div>';
  return html;
}

function renderVerlauf() {
  const exs = allExercises();
  if (!__verlaufEx) __verlaufEx = exs.length ? exs[0].id : null;
  const data = loadData();

  let html = '<div class="day-panel active" id="panel-verlauf">';

  // Wochen-Zusammenfassung
  html += renderWeekSummary(data);

  // Feature 11: Rekord-Liste (alle PRs)
  html += renderPRList(data);

  html += '<div class="info-card"><h2>' + (__verlaufMetric === 'volume' ? 'Volumen-Verlauf' : 'Gewichts-Verlauf') + '</h2>';
  html += '<div class="metric-toggle">';
  html += '<button class="' + (__verlaufMetric === 'weight' ? 'active' : '') + '" onclick="selectVerlaufMetric(\'weight\')">Gewicht (kg)</button>';
  html += '<button class="' + (__verlaufMetric === 'volume' ? 'active' : '') + '" onclick="selectVerlaufMetric(\'volume\')">Volumen (kg×Wdh)</button>';
  html += '</div>';
  html += '<label class="history-label" for="history-exercise">Übung auswählen</label><select id="history-exercise" class="history-select" onchange="selectVerlaufEx(this.value)">';
  exs.forEach(ex => {
    html += '<option value="' + ex.id + '"' + (ex.id === __verlaufEx ? ' selected' : '') + '>' + escapeHtml(ex.name) + '</option>';
  });
  html += '</select></div>';

  const points = getMetricPoints(data, __verlaufEx);
  const unit = __verlaufMetric === 'volume' ? ' kg Volumen' : ' kg';

  html += '<div class="chart-wrap"><h3>' + escapeHtml(allExercises().find(ex => ex.id === __verlaufEx)?.name || '') + '</h3>';
  if (points.length >= 2) {
    html += '<div class="chart-sub">' + (__verlaufMetric === 'volume' ? 'Volumen (Summe kg×Wdh)' : 'Bestes Gewicht') + ' pro Training · ' + points.length + ' Einträge</div>';
    html += '<canvas id="verlauf-canvas"></canvas>';
  } else if (points.length === 1) {
    html += '<div class="chart-sub">Bisher 1 Training · ' + fmtKg(points[0].v) + unit + ' (' + formatDate(points[0].date) + ')</div>';
    html += '<div class="chart-empty">Ab dem 2. Training erscheint hier die Kurve</div>';
  } else {
    html += '<div class="chart-empty">' + (__verlaufMetric === 'volume' && !hasAnyReps(data) ? 'Volumen braucht Wiederholungs-Angaben — beim nächsten Training Wdh. eintragen!' : 'Noch kein Training für diese Übung gespeichert') + '</div>';
  }

  html += '<div class="hist-list">';
  for (let i = points.length - 1; i >= 0; i--) {
    let delta = '';
    if (i > 0) {
      const diff = points[i].v - points[i - 1].v;
      if (diff > 0.001) delta = '<span class="h-delta" style="color:var(--green)">↑ +' + fmtKg(diff) + '</span>';
      else if (diff < -0.001) delta = '<span class="h-delta" style="color:var(--red)">↓ ' + fmtKg(diff) + '</span>';
      else delta = '<span class="h-delta" style="color:var(--text-dim)">= gleich</span>';
    }
    html += '<div class="hist-row"><span class="h-date">' + formatDate(points[i].date) + '</span><span class="h-val">' + fmtKg(points[i].v) + '</span>' + delta + '</div>';
  }
  html += '</div></div></div>';
  return html;
}

function selectVerlaufEx(exId) {
  __verlaufEx = exId;
  renderAll();
}

function selectVerlaufMetric(m) {
  __verlaufMetric = m;
  renderAll();
}

function drawVerlaufChart() {
  const canvas = document.getElementById('verlauf-canvas');
  if (!canvas) return;
  const data = loadData();
  const points = getMetricPoints(data, __verlaufEx);
  if (points.length < 2) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const W = rect.width, H = rect.height;
  canvas.width = W * dpr; canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const theme = getComputedStyle(document.documentElement);
  const color = name => theme.getPropertyValue(name).trim();

  const padL = 52, padR = 20, padT = 24, padB = 24;
  const iw = W - padL - padR, ih = H - padT - padB;
  let min = Infinity, max = -Infinity;
  points.forEach(p => { if (p.v < min) min = p.v; if (p.v > max) max = p.v; });
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.15;
  min -= pad; max += pad;

  const x = i => padL + (points.length > 1 ? i / (points.length - 1) * iw : iw / 2);
  const y = v => padT + ih - (v - min) / (max - min) * ih;

  ctx.clearRect(0, 0, W, H);

  // Gitter + Y-Beschriftung
  ctx.font = '12px -apple-system, sans-serif';
  ctx.fillStyle = color('--text-dim');
  ctx.strokeStyle = color('--border');
  ctx.lineWidth = 1;
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const v = min + (max - min) * i / steps;
    const yy = y(v);
    ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(W - padR, yy); ctx.stroke();
    ctx.fillText(fmtKg(Math.round(v * 10) / 10), 4, yy + 3);
  }

  // X-Beschriftung (erstes + letztes Datum)
  ctx.fillText(formatDate(points[0].date), padL, H - 6);
  ctx.textAlign = 'right';
  ctx.fillText(formatDate(points[points.length - 1].date), W - padR, H - 6);
  ctx.textAlign = 'left';

  // Fläche + Linie
  ctx.beginPath();
  points.forEach((p, i) => { const px = x(i), py = y(p.v); i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); });
  const grad = ctx.createLinearGradient(0, padT, 0, padT + ih);
  grad.addColorStop(0, color('--surface2'));
  grad.addColorStop(1, color('--surface'));
  ctx.lineTo(x(points.length - 1), padT + ih);
  ctx.lineTo(x(0), padT + ih);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.beginPath();
  points.forEach((p, i) => { const px = x(i), py = y(p.v); i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); });
  ctx.strokeStyle = color('--green');
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Punkte + kg-Labels
  points.forEach((p, i) => {
    const px = x(i), py = y(p.v);
    ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = color('--surface'); ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = color('--green'); ctx.stroke();
    ctx.font = 'bold 12px -apple-system, sans-serif';
    ctx.fillStyle = color('--text');
    ctx.textAlign = 'center';
    ctx.fillText(fmtKg(p.v), px, py - 9);
    ctx.textAlign = 'left';
  });
}

/* ---------- Speichern / Löschen ---------- */

function saveCurrentDay(dayKey) {
  if (!saveCurrentState()) return false;
  const before = loadData();
  const draft = workoutDraft(before,dayKey);
  if (!draft) { notice('Bitte zuerst ein neues Training starten.'); return false; }
  const data = JSON.parse(JSON.stringify(before));
  const entries = {};
  let hasValues = false, incomplete = false, invalid = false;
  DAYS[dayKey].exercises.forEach(ex => {
    entries[ex.id] = {};
    for (let s = 1; s <= ex.sets; s++) {
      const entry = normalizeEntry((data[ex.id] || {})[s]);
      if (entry.w || entry.r) hasValues = true;
      if (!validSet(entry)) incomplete = true;
      if ((entry.w && numericValue(entry.w) === null) || (entry.r && (numericValue(entry.r) === null || !Number.isInteger(numericValue(entry.r)) || numericValue(entry.r)<1))) invalid = true;
      entries[ex.id][s] = entry;
    }
  });
  if (!hasValues) { notice('Noch keine Sätze eingetragen. Dein Entwurf bleibt geöffnet.'); return false; }
  if (invalid) { notice('Bitte die markierten Zahlen korrigieren.'); return false; }
  if (incomplete && !confirm('Einige Sätze sind unvollständig. Diese Einheit trotzdem speichern?')) return false;
  getHistory(data).push({date:todayISO(),day:dayKey,entries,session_id:draft.id});
  data.__dates__ = Object.assign({},data.__dates__,{[dayKey]:todayISO()});
  delete data.__drafts__[dayKey];
  DAYS[dayKey].exercises.forEach(ex=>{delete data[ex.id];if(data.__done__)delete data.__done__[ex.id];});
  const next=nextRotationAfter(dayKey);
  data.__rotation__={index:ROTATION.indexOf(next),lastFinish:todayISO()};
  delete data.__today__;
  if (!saveData(data)) { volatileData=before; return false; }
  return true;
}

function finishTraining(dayKey) {
  if (!saveCurrentDay(dayKey)) return;
  Object.keys(window.__timers).forEach(stopTimer);
  renderAll();
  notice(DAY_LABEL[dayKey] + ' gespeichert. Nächste Einheit: ' + DAY_LABEL[nextRotationAfter(dayKey)] + '.');
}

function clearCurrentDay(dayKey) {
  if (!confirm('Diesen Trainingsentwurf neu beginnen? Bereits abgeschlossene Trainings bleiben im Verlauf.')) return;
  if (!stashLocal(loadData())) { notice('Keine Sicherheitskopie möglich. Der Entwurf bleibt erhalten.'); return; }
  startTraining(dayKey,true);
}

function resetAll() {
  if (!confirm('ALLE gespeicherten Daten unwiderruflich loeschen?')) return;
  volatileData = null;
  localStorage.removeItem(STORAGE_KEY);
  currentView = 'upper-a';
  renderAll();
}

/* ---------- Backup ---------- */

function exportBackup() {
  const area = document.getElementById('backup-area');
  area.value = JSON.stringify(backupData(), null, 2);
  notice('Backup-Text bereit. Er enthält Verlauf und offene Trainingsentwürfe.');
}

function flashBackupBtn(msg) {
  const ta = document.getElementById('backup-area');
  if (!ta) return;
  const card = ta.closest('.info-card');
  const btn = card.querySelector('.btn.primary');
  const orig = btn.textContent;
  btn.textContent = msg;
  setTimeout(function() { btn.textContent = orig; }, 1500);
}

function importBackup() {
  let parsed;
  try { parsed = validateBackup(JSON.parse(document.getElementById('backup-area').value)); }
  catch (error) { notice('Backup konnte nicht geladen werden: ' + error.message); return; }
  restoreBackup(parsed);
}

function restoreBackup(parsed) {
  if (!confirm('Aktuelle Daten durch dieses Backup ersetzen? Eine lokale Sicherheitskopie wird angelegt.')) return;
  const before=loadData();
  if (!stashLocal(before)) { notice('Keine Sicherheitskopie möglich. Die aktuellen Daten bleiben erhalten.'); return; }
  delete parsed.__sync__;
  migrateWorkouts(parsed);
  if (!saveData(parsed)) { volatileData=before; return; }
  renderAll(); notice('Backup wiederhergestellt. Verlauf und offene Entwürfe sind verfügbar.');
}

async function importBackupFile(input) {
  const file=input.files?.[0];
  if (!file) return;
  if (file.size>10*1024*1024) { notice('Die Backup-Datei ist größer als 10 MB und kann hier nicht geladen werden.'); input.value=''; return; }
  try { restoreBackup(validateBackup(JSON.parse(await file.text()))); }
  catch(error) { notice('Backup konnte nicht geladen werden: '+error.message); }
  input.value='';
}

/* ---------- Render-All / Tabs / Events ---------- */

function renderAll() {
  const main = document.getElementById('main');
  if (!DAYS[currentView]) currentView = currentRotationDay(loadData());
  main.innerHTML = currentView === 'info' ? renderInfo() : currentView === 'verlauf' ? renderVerlauf() : renderTodayHero() + renderDay(currentView);
  document.querySelectorAll('nav button').forEach(b => {
    const selected = b.dataset.page === (DAYS[currentView].content ? currentView : 'training');
    b.classList.toggle('active', selected); b.setAttribute('aria-current', selected ? 'page' : 'false');
  });
  attachInputListeners(); updateProgress();
  if (currentView === 'verlauf') requestAnimationFrame(drawVerlaufChart);
}

function showDay(dayKey) {
  currentView = dayKey; renderAll();
}

/* Aus Wochen-Vorschau springen: Tab-Button + Panel aktivieren */
function jumpToDay(dayKey) {
  if (!saveCurrentState()) return;
  currentView = dayKey; renderAll();
  window.scrollTo({top:0, behavior:'instant'});
}

function attachInputListeners() {
  document.querySelectorAll('.weight-input, .reps-input').forEach(input => {
    validateInput(input);
    input.addEventListener('input', function() {
      validateInput(this);
      const data = loadData();
      if (data.__done__?.[this.dataset.ex]) {
        delete data.__done__[this.dataset.ex]; saveData(data);
        this.closest('.ex-card').classList.remove('done');
        const doneButton = this.closest('.ex-card').querySelector('.check-btn');
        doneButton.setAttribute('aria-pressed','false'); doneButton.innerHTML = icon('check') + 'Übung abschließen';
      }
      autoSave();
    });
    input.addEventListener('keydown', function(event) {
      if (event.key !== 'Enter' || event.isComposing) return;
      event.preventDefault();
      const inputs = [...document.querySelectorAll('.weight-input, .reps-input')];
      const next = inputs[inputs.indexOf(this)+1];
      if (next) next.focus(); else this.blur();
    });
  });
}

/* Feature 6: Cursor zum nächsten leeren Satz der Übung springen */
function focusNextSet() {
  // Field changes are explicit (tap, Tab or Enter), never triggered by typing.
}


document.querySelectorAll('nav button').forEach(btn => btn.addEventListener('click', () => {
  const next = btn.dataset.page === 'training' ? currentRotationDay(loadData()) : btn.dataset.page;
  jumpToDay(next);
}));
currentView = currentRotationDay(loadData());
const initial = loadData(); migrateData(initial); migrateWorkouts(initial); saveData(initial, true);
currentView = currentRotationDay(initial);
renderAll();
window.addEventListener('resize', () => { if (currentView === 'verlauf') drawVerlaufChart(); });
window.addEventListener('pagehide', () => saveCurrentState());
document.addEventListener('visibilitychange', () => { if (document.hidden) saveCurrentState(); });
let editingInput = null;
function updateInputTools() {
  const active = document.activeElement;
  const editing = active.matches('.weight-input,.reps-input');
  document.getElementById('input-tools').hidden = !editing;
  document.body.classList.toggle('editing', editing);
  if (editing) editingInput = active;
  const viewport = window.visualViewport;
  const offset = viewport ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) : 0;
  document.documentElement.style.setProperty('--keyboard-offset', offset + 'px');
}
function revealEditingInput() {
  requestAnimationFrame(() => {
    const input=document.activeElement;
    if (!input.matches('.weight-input,.reps-input')) return;
    const rect=input.getBoundingClientRect();
    const toolbar=document.getElementById('input-tools').getBoundingClientRect();
    const viewportTop=window.visualViewport?.offsetTop || 0;
    if (rect.bottom>toolbar.top-12) window.scrollBy(0,rect.bottom-toolbar.top+12);
    else if (rect.top<viewportTop+12) window.scrollBy(0,rect.top-viewportTop-12);
  });
}
document.addEventListener('focusin', () => {updateInputTools();revealEditingInput();});
document.addEventListener('focusout', () => setTimeout(updateInputTools, 0));
window.visualViewport?.addEventListener('resize', () => {updateInputTools();revealEditingInput();});
window.visualViewport?.addEventListener('scroll', updateInputTools);
document.querySelectorAll('[data-input-action]').forEach(button => {
  button.addEventListener('pointerdown', event => event.preventDefault());
  button.addEventListener('click', () => {
    if (!editingInput?.isConnected) return;
    const action = button.dataset.inputAction;
    if (action === 'done') { editingInput.blur(); return; }
    const inputs = [...document.querySelectorAll('.weight-input,.reps-input')];
    const target = inputs[inputs.indexOf(editingInput) + (action === 'next' ? 1 : -1)];
    if (target) target.focus();
  });
});

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  let reloadForUpdate = false;
  navigator.serviceWorker.register('./sw.js').then(reg => {
    function offerUpdate() {
      const btn = document.getElementById('update-app');
      if (!reg.waiting || !navigator.serviceWorker.controller) { btn.hidden = true; return; }
      btn.hidden = false;
      btn.onclick = () => { if (!saveCurrentState()) return; reloadForUpdate = true; reg.waiting.postMessage({type:'SKIP_WAITING'}); };
    }
    offerUpdate();
    reg.addEventListener('updatefound', () => reg.installing?.addEventListener('statechange', offerUpdate));
  }).catch(() => notice('Offline-Installation derzeit nicht verfügbar. Deine Einträge werden weiterhin auf diesem Gerät gespeichert.'));
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (reloadForUpdate) location.reload(); });
}

function progressionHint(ex, entries) {
  const max = Number(ex.reps.match(/\d+/g)?.at(-1));
  const complete = Array.from({length: ex.sets}, (_, i) => normalizeEntry(entries[i+1]));
  const ready = complete.every(e => validSet(e) && numericValue(e.r) >= max);
  return ready ? 'Oberes Wiederholungsziel zuletzt erreicht. Nur bei sauberer Technik und passender Reserve den kleinsten Gewichtsschritt wählen.' : 'Gewicht beibehalten und zuerst Wiederholungen im Zielbereich steigern.';
}
function validateInput(input) {
  const n = numericValue(input.value);
  const invalid = input.value.trim() !== '' && (n === null || (input.classList.contains('reps-input') && (!Number.isInteger(n) || n < 1)));
  input.setAttribute('aria-invalid', String(invalid));
  const message = document.getElementById('validation-' + input.dataset.ex);
  const card = input.closest('.ex-card');
  if (message) message.textContent = card.querySelector('[aria-invalid="true"]') ? 'Bitte eine gültige Zahl eintragen. Gewicht z. B. 12,5; Wiederholungen als ganze Zahl.' : '';
}

function downloadBackup() {
  saveCurrentState();
  const raw = JSON.stringify(backupData(), null, 2);
  const url = URL.createObjectURL(new Blob([raw], {type:'application/json'}));
  const a = document.createElement('a'); a.href = url; a.download = 'training-backup-' + todayISO() + '.json'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  notice('Backup-Download gestartet. Lege die JSON-Datei in „Dateien“ an einem sicheren Ort ab.');
}
function validateBackup(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Das Backup muss ein JSON-Objekt sein.');
  const checkEntries = entries => {
    if (!entries || typeof entries !== 'object' || Array.isArray(entries)) throw new Error('Ungültige Übungsdaten.');
    for (const [id, sets] of Object.entries(entries)) {
      if (!/^[a-z0-9-]+$/.test(id) || !sets || typeof sets !== 'object' || Array.isArray(sets)) throw new Error('Ungültige Übung.');
      for (const [s, entry] of Object.entries(sets)) {
        if (!/^\d+$/.test(s)) throw new Error('Ungültige Satznummer.');
        const n = normalizeEntry(entry);
        if ((n.w && numericValue(n.w) === null) || (n.r && (numericValue(n.r) === null || !Number.isInteger(numericValue(n.r)) || numericValue(n.r) < 1))) throw new Error('Ungültiger Zahlenwert.');
      }
    }
  };
  checkEntries(Object.fromEntries(Object.entries(data).filter(([key]) => !key.startsWith('__'))));
  if (data.__drafts__ !== undefined) {
    if (!data.__drafts__ || typeof data.__drafts__!=='object' || Array.isArray(data.__drafts__)) throw new Error('Ungültige Trainingsentwürfe.');
    for (const [day,draft] of Object.entries(data.__drafts__)) {
      if (!DAYS[day]?.exercises || !draft || typeof draft.id!=='string' || !draft.id || !Number.isFinite(draft.startedAt) || draft.startedAt<=0) throw new Error('Ungültiger Trainingsentwurf.');
    }
  }
  if (data.__history__ !== undefined && !Array.isArray(data.__history__)) throw new Error('Ungültiger Verlauf.');
  for (const h of data.__history__ || []) {
    if (!h || !/^\d{4}-\d{2}-\d{2}$/.test(h.date) || !['upper-a','lower-a','upper-b','lower-b','schwach','migration'].includes(h.day)) throw new Error('Ungültiger Verlaufseintrag.');
    checkEntries(h.entries);
  }
  return data;
}

function workoutDraft(data,dayKey) {
  return data.__drafts__ && data.__drafts__[dayKey] || null;
}
function migrateWorkouts(data) {
  if (data.__workoutSchema__ === 1) return;
  data.__drafts__ = data.__drafts__ || {};
  Object.entries(DAYS).forEach(([dayKey,day])=>{
    if (!day.exercises || data.__drafts__[dayKey]) return;
    const last=getHistory(data).filter(h=>h.day===dayKey).at(-1);
    const hasValues=day.exercises.some(ex=>Object.values(data[ex.id]||{}).some(v=>{const n=normalizeEntry(v);return n.w||n.r;}));
    const differs=day.exercises.some(ex=>Object.entries(data[ex.id]||{}).some(([s,v])=>{
      const n=normalizeEntry(v),previous=normalizeEntry(last?.entries?.[ex.id]?.[s]);
      return (n.w||n.r) && (n.w!==previous.w || n.r!==previous.r);
    }));
    const oldSession=data.__session__?.day===dayKey ? data.__session__ : null;
    if (hasValues && (oldSession || !last || differs)) {
      const startedAt=Number.isFinite(oldSession?.startedAt) ? oldSession.startedAt : Date.now();
      data.__drafts__[dayKey]={id:'recovered-'+dayKey+'-'+startedAt,startedAt,recovered:true};
    }
  });
  delete data.__session__;
  data.__workoutSchema__=1;
}
function startTraining(dayKey,replace=false) {
  if (!DAYS[dayKey]?.exercises) return;
  const before=loadData();
  const data=JSON.parse(JSON.stringify(before));
  if (workoutDraft(data,dayKey) && !replace) {
    notice('Dein Trainingsentwurf wird fortgesetzt.');
    return;
  }
  data.__drafts__=data.__drafts__||{};
  DAYS[dayKey].exercises.forEach(ex=>{delete data[ex.id];if(data.__done__)delete data.__done__[ex.id];});
  data.__drafts__[dayKey]={id:crypto.randomUUID(),startedAt:Date.now()};
  data.__workoutSchema__=1;
  data.__today__={date:todayISO(),day:dayKey};
  if (!saveData(data)) { volatileData=before; return; }
  currentView=dayKey;renderAll();
}
function copyLastValues(dayKey) {
  if (!saveCurrentState()) return;
  const data=loadData();
  if (!workoutDraft(data,dayKey)) return;
  let filled=0;
  DAYS[dayKey].exercises.forEach(ex=>{
    const previous=getLastEntry(data,ex.id);
    if (!previous) return;
    for(let s=1;s<=ex.sets;s++){
      const current=normalizeEntry(data[ex.id]?.[s]),old=normalizeEntry(previous.weights[s]);
      for(const field of ['w','r'])if(!current[field] && old[field]){current[field]=old[field];filled++;}
      if (!data[ex.id])data[ex.id]={};data[ex.id][s]=current;
    }
  });
  if (!saveData(data)) return;
  renderAll();notice(filled ? 'Letzte Werte in leere Felder übernommen. Bitte für heute prüfen; Übungen bleiben offen.' : 'Keine weiteren Werte zum Übernehmen vorhanden.');
}
function stashLocal(data) {
  try {
    const key=STORAGE_KEY+'-backup-'+Date.now();
    localStorage.setItem(key,JSON.stringify(data));
    const keys=Object.keys(localStorage).filter(k=>k.startsWith(STORAGE_KEY+'-backup-')).sort();
    keys.slice(0,Math.max(0,keys.length-5)).forEach(k=>localStorage.removeItem(k));
    return true;
  } catch { return false; }
}
function backupData() {
  const data=loadData();
  delete data.__sync__;
  return data;
}
