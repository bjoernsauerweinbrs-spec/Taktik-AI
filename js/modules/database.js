// js/modules/database.js
// Lightweight IndexedDB wrapper for Toni 2.0
// Responsibilities:
// - Schema: players, events, matchplans
// - Atomic writes via transactions
// - Simple migrations support (versioned DB)
// - Convenience APIs: init, add/update/get/list/delete for players, events, matchplans
// - Exposes a simple export/import snapshot for backups
//
// Notes:
// - Uses Promises for all async operations
// - Player objects must include a unique id (UUID). If not provided, addPlayer will generate one.
// - Events are stored with event.id, type, payload, ts, meta and can be marked persistent by caller.

const DB_NAME = 'toni_db';
const DB_VERSION = 1; // bump when schema changes
const STORE_PLAYERS = 'players';
const STORE_EVENTS = 'events';
const STORE_MATCHPLANS = 'matchplans';

function _uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (ev) => {
      const db = ev.target.result;
      // Create object stores if not exist
      if (!db.objectStoreNames.contains(STORE_PLAYERS)) {
        const s = db.createObjectStore(STORE_PLAYERS, { keyPath: 'id' });
        s.createIndex('by_number', 'number', { unique: false });
        s.createIndex('by_name', 'name', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_EVENTS)) {
        const s = db.createObjectStore(STORE_EVENTS, { keyPath: 'id' });
        s.createIndex('by_ts', 'ts', { unique: false });
        s.createIndex('by_player', 'payload.playerId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_MATCHPLANS)) {
        const s = db.createObjectStore(STORE_MATCHPLANS, { keyPath: 'id' });
        s.createIndex('by_name', 'name', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function init() {
  const db = await openDB();
  return {
    _db: db
  };
}

// Helper: run a transaction and return a Promise
function _tx(db, storeNames, mode = 'readonly') {
  const tx = db.transaction(storeNames, mode);
  return tx;
}

// Players API
async function addPlayer(dbHandle, player) {
  const db = dbHandle._db || dbHandle;
  if (!player) throw new Error('player required');
  const id = player.id || _uuid();
  const toSave = Object.assign({}, player, { id });
  return new Promise((resolve, reject) => {
    const tx = _tx(db, [STORE_PLAYERS], 'readwrite');
    const store = tx.objectStore(STORE_PLAYERS);
    const req = store.add(toSave);
    req.onsuccess = () => resolve(toSave);
    req.onerror = () => reject(req.error);
  });
}

async function updatePlayer(dbHandle, id, patch) {
  const db = dbHandle._db || dbHandle;
  return new Promise((resolve, reject) => {
    const tx = _tx(db, [STORE_PLAYERS], 'readwrite');
    const store = tx.objectStore(STORE_PLAYERS);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const existing = getReq.result;
      if (!existing) return reject(new Error('player not found'));
      const updated = Object.assign({}, existing, patch, { id });
      const putReq = store.put(updated);
      putReq.onsuccess = () => resolve(updated);
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

async function getPlayer(dbHandle, id) {
  const db = dbHandle._db || dbHandle;
  return new Promise((resolve, reject) => {
    const tx = _tx(db, [STORE_PLAYERS], 'readonly');
    const store = tx.objectStore(STORE_PLAYERS);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function listPlayers(dbHandle) {
  const db = dbHandle._db || dbHandle;
  return new Promise((resolve, reject) => {
    const tx = _tx(db, [STORE_PLAYERS], 'readonly');
    const store = tx.objectStore(STORE_PLAYERS);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function deletePlayer(dbHandle, id) {
  const db = dbHandle._db || dbHandle;
  return new Promise((resolve, reject) => {
    const tx = _tx(db, [STORE_PLAYERS], 'readwrite');
    const store = tx.objectStore(STORE_PLAYERS);
    const req = store.delete(id);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

// Events API (atomic writes recommended)
async function saveEvent(dbHandle, eventObj) {
  const db = dbHandle._db || dbHandle;
  if (!eventObj) throw new Error('event required');
  const ev = Object.assign({}, eventObj);
  ev.id = ev.id || _uuid();
  ev.ts = ev.ts || Date.now();
  return new Promise((resolve, reject) => {
    const tx = _tx(db, [STORE_EVENTS], 'readwrite');
    const store = tx.objectStore(STORE_EVENTS);
    const req = store.add(ev);
    req.onsuccess = () => resolve(ev);
    req.onerror = () => reject(req.error);
  });
}

async function listEvents(dbHandle, { playerId = null, since = 0, limit = 200 } = {}) {
  const db = dbHandle._db || dbHandle;
  return new Promise((resolve, reject) => {
    const tx = _tx(db, [STORE_EVENTS], 'readonly');
    const store = tx.objectStore(STORE_EVENTS);
    const idx = store.index('by_ts');
    const range = IDBKeyRange.lowerBound(since);
    const req = idx.openCursor(range, 'next');
    const out = [];
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (!cursor) return resolve(out.slice(0, limit));
      const val = cursor.value;
      if (playerId) {
        // payload may contain playerId
        if (val.payload && val.payload.playerId === playerId) out.push(val);
      } else {
        out.push(val);
      }
      cursor.continue();
    };
    req.onerror = () => reject(req.error);
  });
}

// Matchplans API
async function saveMatchplan(dbHandle, plan) {
  const db = dbHandle._db || dbHandle;
  if (!plan) throw new Error('plan required');
  plan.id = plan.id || _uuid();
  plan.ts = plan.ts || Date.now();
  return new Promise((resolve, reject) => {
    const tx = _tx(db, [STORE_MATCHPLANS], 'readwrite');
    const store = tx.objectStore(STORE_MATCHPLANS);
    const req = store.put(plan);
    req.onsuccess = () => resolve(plan);
    req.onerror = () => reject(req.error);
  });
}

async function getMatchplan(dbHandle, id) {
  const db = dbHandle._db || dbHandle;
  return new Promise((resolve, reject) => {
    const tx = _tx(db, [STORE_MATCHPLANS], 'readonly');
    const store = tx.objectStore(STORE_MATCHPLANS);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function listMatchplans(dbHandle) {
  const db = dbHandle._db || dbHandle;
  return new Promise((resolve, reject) => {
    const tx = _tx(db, [STORE_MATCHPLANS], 'readonly');
    const store = tx.objectStore(STORE_MATCHPLANS);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

// Export / Import snapshot (useful for backups)
async function exportSnapshot(dbHandle) {
  const db = dbHandle._db || dbHandle;
  const players = await listPlayers(db);
  const events = await listEvents(db, { limit: 10000 });
  const matchplans = await listMatchplans(db);
  return { meta: { exportedAt: Date.now() }, players, events, matchplans };
}

async function importSnapshot(dbHandle, snapshot = {}) {
  const db = dbHandle._db || dbHandle;
  if (!snapshot) throw new Error('snapshot required');
  return new Promise((resolve, reject) => {
    const tx = _tx(db, [STORE_PLAYERS, STORE_EVENTS, STORE_MATCHPLANS], 'readwrite');
    tx.oncomplete = () => resolve(true);
    tx.onerror = (e) => reject(e.target.error || e);
    const pStore = tx.objectStore(STORE_PLAYERS);
    const eStore = tx.objectStore(STORE_EVENTS);
    const mStore = tx.objectStore(STORE_MATCHPLANS);
    try {
      (snapshot.players || []).forEach(p => pStore.put(p));
      (snapshot.events || []).forEach(ev => eStore.put(ev));
      (snapshot.matchplans || []).forEach(m => mStore.put(m));
    } catch (err) {
      reject(err);
    }
  });
}

// Simple migration helper (placeholder for future versions)
async function migrateIfNeeded(dbHandle) {
  // For now DB_VERSION=1; implement migrations when bumping version
  return true;
}

// Expose API
export default {
  init,
  addPlayer,
  updatePlayer,
  getPlayer,
  listPlayers,
  deletePlayer,
  saveEvent,
  listEvents,
  saveMatchplan,
  getMatchplan,
  listMatchplans,
  exportSnapshot,
  importSnapshot,
  migrateIfNeeded
};
