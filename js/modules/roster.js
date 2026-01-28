// js/modules/roster.js
// Kader-Modul für Toni 2.0
// Verantwortlichkeiten:
// - Player CRUD (via Database)
// - BMI-Berechnung und einfache Ernährungs‑Vorschläge
// - Ginga-Score Verwaltung (Technik, Taktik, Fitness) und einfache Trend-Analyse
// - UI-Mount/Unmount für das Kader-Panel (lazy mounting)
// - Emit/Listen auf EventBus (roster:created, roster:updated, roster:deleted, roster:selected)
//
// Erwartet: Database (db wrapper) und EventBus (pub/sub) werden beim init übergeben.

import EventBus from './eventbus.js';
import Database from './database.js';

const DEFAULT_GINGA_WEIGHTS = { technique: 0.4, tactics: 0.4, fitness: 0.2 };

let db = null;
let mounted = false;
let mountTarget = null;
let localPlayersCache = [];

// Utility: simple UUID (same pattern as other modules)
function _uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// BMI calculation: weight (kg) / (height_m)^2
function calculateBMI({ weightKg, heightCm }) {
  if (!weightKg || !heightCm) return null;
  const h = heightCm / 100;
  if (h <= 0) return null;
  const bmi = weightKg / (h * h);
  return Math.round(bmi * 10) / 10; // one decimal
}

function bmiCategory(bmi) {
  if (bmi === null || bmi === undefined) return 'unbekannt';
  if (bmi < 18.5) return 'Untergewicht';
  if (bmi < 25) return 'Normalgewicht';
  if (bmi < 30) return 'Übergewicht';
  return 'Adipositas';
}

// Simple nutrition suggestion engine (non-medical, generic)
function nutritionSuggestions({ bmi, activityLevel = 'moderate' } = {}) {
  // activityLevel: 'low'|'moderate'|'high'
  const base = {
    hydration: 'Trinke regelmäßig Wasser; Ziel: 30–40 ml/kg Körpergewicht/Tag.',
    protein: 'Protein: 1.2–1.8 g/kg Körpergewicht/Tag (je nach Trainingsbelastung).',
    carbs: 'Kohlenhydrate: 3–6 g/kg/Tag, vor allem rund ums Training.',
    fats: 'Fette: 20–35% der Gesamtkalorien, gesunde Quellen bevorzugen.'
  };

  // adjust by BMI category
  if (!bmi) return { note: 'Größe und Gewicht fehlen; bitte Daten ergänzen.', recommendations: base };

  const cat = bmiCategory(bmi);
  const rec = Object.assign({}, base);

  if (cat === 'Untergewicht') {
    rec.note = 'Leichtes Kalorienplus empfohlen; häufige, nährstoffdichte Mahlzeiten.';
    rec.calorieAdvice = 'Ziel: moderates Kalorienplus (ca. +250–500 kcal/Tag).';
  } else if (cat === 'Normalgewicht') {
    rec.note = 'Erhaltungsmodus; Makros an Trainingszielen ausrichten.';
    rec.calorieAdvice = 'Kalorienzufuhr an Trainingsbelastung anpassen.';
  } else {
    rec.note = 'Gewichtsreduktion durch moderates Kaloriendefizit und Fokus auf Protein.';
    rec.calorieAdvice = 'Ziel: moderates Defizit (ca. −250–500 kcal/Tag) kombiniert mit Krafttraining.';
  }

  // activity adjustments
  if (activityLevel === 'high') {
    rec.carbs = 'Kohlenhydrate: 5–7 g/kg/Tag; vor/nach Training gezielt Kohlenhydrate.';
  } else if (activityLevel === 'low') {
    rec.carbs = 'Kohlenhydrate: 2–3 g/kg/Tag; Fokus auf Protein und Mikronährstoffe.';
  }

  return { category: cat, recommendations: rec };
}

// Ginga score: weighted average of technique, tactics, fitness
function computeGingaScore({ technique = 5, tactics = 5, fitness = 5 }, weights = DEFAULT_GINGA_WEIGHTS) {
  const score = (technique * (weights.technique || 0.4)) +
                (tactics * (weights.tactics || 0.4)) +
                (fitness * (weights.fitness || 0.2));
  return Math.round(score * 10) / 10;
}

// UI helpers: create DOM nodes (kept minimal, no external libs)
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const k in attrs) {
    if (k === 'class') node.className = attrs[k];
    else if (k === 'text') node.textContent = attrs[k];
    else node.setAttribute(k, attrs[k]);
  }
  (children || []).forEach(c => {
    if (typeof c === 'string') node.appendChild(document.createTextNode(c));
    else if (c) node.appendChild(c);
  });
  return node;
}

// Render roster panel into target element
async function mount(targetEl) {
  if (mounted) return;
  mounted = true;
  mountTarget = targetEl;

  // root container
  const root = el('div', { class: 'panel-card roster-panel' });

  // header + new player button
  const header = el('div', { class: 'roster-header' }, [
    el('h3', { text: 'Kader' }),
    el('button', { class: 'btn', id: 'roster-new-btn', type: 'button' }, ['Neuen Spieler'])
  ]);
  root.appendChild(header);

  // list container
  const listWrap = el('div', { id: 'roster-list', class: 'roster-list' }, []);
  root.appendChild(listWrap);

  // details / editor area
  const editor = el('div', { id: 'roster-editor', class: 'roster-editor' }, []);
  root.appendChild(editor);

  // nutrition modal placeholder
  const nutritionBox = el('div', { id: 'nutrition-box', class: 'nutrition-box' }, []);
  root.appendChild(nutritionBox);

  // mount into target
  targetEl.innerHTML = '';
  targetEl.appendChild(root);

  // wire events
  document.getElementById('roster-new-btn').addEventListener('click', () => {
    showEditor(null);
  });

  // initial load
  await refreshList();

  // listen for external roster updates
  EventBus.on('roster:refresh', refreshList);
}

// Unmount panel
function unmount() {
  if (!mounted || !mountTarget) return;
  mountTarget.innerHTML = '';
  mounted = false;
  mountTarget = null;
  EventBus.off('roster:refresh', refreshList);
}

// Refresh list from DB and render
async function refreshList() {
  try {
    const players = await Database.listPlayers(Database);
    localPlayersCache = players || [];
    renderList(localPlayersCache);
  } catch (err) {
    console.error('roster.refreshList error', err);
    EventBus.emit('toast', { text: 'Fehler beim Laden des Kaders' });
  }
}

function renderList(players) {
  const listWrap = document.getElementById('roster-list');
  if (!listWrap) return;
  listWrap.innerHTML = '';
  if (!players || players.length === 0) {
    listWrap.appendChild(el('div', { class: 'muted', text: 'Kein Spieler vorhanden. Lege einen neuen Spieler an.' }));
    return;
  }

  players.forEach(p => {
    const item = el('div', { class: 'roster-item panel-card', 'data-id': p.id });
    const title = el('div', { class: 'roster-item-title' }, [
      el('strong', { text: `${p.name || '—'} ` }),
      el('span', { class: 'muted', text: `#${p.number || '-'}` })
    ]);
    const meta = el('div', { class: 'roster-item-meta muted', text: `${p.position || 'Position nicht gesetzt'}` });
    const actions = el('div', { class: 'roster-item-actions' }, [
      el('button', { class: 'btn small', type: 'button', 'data-action': 'edit' }, ['Bearbeiten']),
      el('button', { class: 'btn small', type: 'button', 'data-action': 'place' }, ['Auf Feld']),
      el('button', { class: 'btn small', type: 'button', 'data-action': 'delete' }, ['Löschen'])
    ]);

    item.appendChild(title);
    item.appendChild(meta);
    item.appendChild(actions);

    // click handlers
    actions.querySelector('[data-action="edit"]').addEventListener('click', () => showEditor(p.id));
    actions.querySelector('[data-action="place"]').addEventListener('click', () => {
      EventBus.emit('roster:placeOnField', { playerId: p.id });
    });
    actions.querySelector('[data-action="delete"]').addEventListener('click', async () => {
      if (!confirm(`Spieler ${p.name || p.id} wirklich löschen?`)) return;
      try {
        await Database.deletePlayer(Database, p.id);
        EventBus.emit('roster:deleted', { playerId: p.id });
        await refreshList();
      } catch (err) {
        console.error('deletePlayer error', err);
        EventBus.emit('toast', { text: 'Fehler beim Löschen' });
      }
    });

    listWrap.appendChild(item);
  });
}

// Show editor for new or existing player
async function showEditor(playerId = null) {
  const editor = document.getElementById('roster-editor');
  if (!editor) return;
  editor.innerHTML = '';

  let player = {
    id: null,
    name: '',
    number: '',
    position: '',
    heightCm: null,
    weightKg: null,
    birthdate: null,
    foot: '',
    ginga: { technique: 5, tactics: 5, fitness: 5 }
  };

  if (playerId) {
    const p = await Database.getPlayer(Database, playerId);
    if (p) player = Object.assign(player, p);
  }

  // form fields
  const form = el('form', { class: 'roster-form' });
  const nameRow = el('div', { class: 'form-row' }, [
    el('label', { text: 'Name' }),
    el('input', { type: 'text', id: 'fld-name', value: player.name || '' })
  ]);
  const numberRow = el('div', { class: 'form-row' }, [
    el('label', { text: 'Nummer' }),
    el('input', { type: 'text', id: 'fld-number', value: player.number || '' })
  ]);
  const positionRow = el('div', { class: 'form-row' }, [
    el('label', { text: 'Position' }),
    el('input', { type: 'text', id: 'fld-position', value: player.position || '' })
  ]);
  const heightRow = el('div', { class: 'form-row' }, [
    el('label', { text: 'Größe (cm)' }),
    el('input', { type: 'number', id: 'fld-height', value: player.heightCm || '' })
  ]);
  const weightRow = el('div', { class: 'form-row' }, [
    el('label', { text: 'Gewicht (kg)' }),
    el('input', { type: 'number', id: 'fld-weight', value: player.weightKg || '' })
  ]);
  const footRow = el('div', { class: 'form-row' }, [
    el('label', { text: 'Fußpräferenz' }),
    el('input', { type: 'text', id: 'fld-foot', value: player.foot || '' })
  ]);

  // Ginga scores
  const gingaRow = el('div', { class: 'form-row' }, [
    el('label', { text: 'Ginga Scores (1–10)' }),
    el('div', { class: 'ginga-scores' }, [
      el('input', { type: 'number', id: 'fld-tech', min: 1, max: 10, value: player.ginga?.technique || 5 }),
      el('input', { type: 'number', id: 'fld-tactics', min: 1, max: 10, value: player.ginga?.tactics || 5 }),
      el('input', { type: 'number', id: 'fld-fitness', min: 1, max: 10, value: player.ginga?.fitness || 5 })
    ])
  ]);

  const actions = el('div', { class: 'form-actions' }, [
    el('button', { class: 'btn', type: 'submit' }, [playerId ? 'Speichern' : 'Anlegen']),
    el('button', { class: 'btn', type: 'button', id: 'cancel-edit' }, ['Abbrechen'])
  ]);

  form.appendChild(nameRow);
  form.appendChild(numberRow);
  form.appendChild(positionRow);
  form.appendChild(heightRow);
  form.appendChild(weightRow);
  form.appendChild(footRow);
  form.appendChild(gingaRow);
  form.appendChild(actions);

  editor.appendChild(form);

  // nutrition preview box
  const nutritionPreview = el('div', { class: 'panel-card nutrition-preview' });
  editor.appendChild(nutritionPreview);

  // update nutrition preview when height/weight change
  function updateNutritionPreview() {
    const h = parseFloat(document.getElementById('fld-height').value) || null;
    const w = parseFloat(document.getElementById('fld-weight').value) || null;
    const bmi = calculateBMI({ heightCm: h, weightKg: w });
    const suggestions = nutritionSuggestions({ bmi });
    nutritionPreview.innerHTML = '';
    nutritionPreview.appendChild(el('h4', { text: 'Ernährungsvorschläge' }));
    if (!bmi) {
      nutritionPreview.appendChild(el('div', { class: 'muted', text: 'Größe und Gewicht fehlen.' }));
    } else {
      nutritionPreview.appendChild(el('div', { text: `BMI: ${bmi} (${suggestions.category})` }));
      const rec = suggestions.recommendations;
      nutritionPreview.appendChild(el('div', { text: rec.note }));
      if (rec.calorieAdvice) nutritionPreview.appendChild(el('div', { class: 'muted', text: rec.calorieAdvice }));
    }
  }

  // initial preview
  updateNutritionPreview();

  // listeners
  form.querySelectorAll('#fld-height, #fld-weight').forEach(inp => {
    inp.addEventListener('input', updateNutritionPreview);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('fld-name').value.trim();
    const number = document.getElementById('fld-number').value.trim();
    const position = document.getElementById('fld-position').value.trim();
    const heightCm = parseFloat(document.getElementById('fld-height').value) || null;
    const weightKg = parseFloat(document.getElementById('fld-weight').value) || null;
    const foot = document.getElementById('fld-foot').value.trim();
    const technique = parseInt(document.getElementById('fld-tech').value, 10) || 5;
    const tactics = parseInt(document.getElementById('fld-tactics').value, 10) || 5;
    const fitness = parseInt(document.getElementById('fld-fitness').value, 10) || 5;

    const ginga = { technique, tactics, fitness, score: computeGingaScore({ technique, tactics, fitness }) };
    const payload = {
      id: playerId || _uuid(),
      name,
      number,
      position,
      heightCm,
      weightKg,
      foot,
      ginga,
      createdAt: Date.now()
    };

    try {
      if (playerId) {
        await Database.updatePlayer(Database, payload.id, payload);
        EventBus.emit('roster:updated', { playerId: payload.id, player: payload });
      } else {
        await Database.addPlayer(Database, payload);
        EventBus.emit('roster:created', { playerId: payload.id, player: payload });
      }
      EventBus.emit('toast', { text: 'Spieler gespeichert' });
      await refreshList();
      editor.innerHTML = '';
    } catch (err) {
      console.error('save player error', err);
      EventBus.emit('toast', { text: 'Fehler beim Speichern' });
    }
  });

  document.getElementById('cancel-edit').addEventListener('click', () => {
    editor.innerHTML = '';
  });
}

// Public API
async function init({ dbHandle = null, eventBus = null } = {}) {
  // accept injected dependencies or use imported defaults
  if (dbHandle) db = dbHandle;
  else db = Database;
  if (eventBus) {
    // allow external EventBus but keep module-level import for compatibility
    // we still use EventBus import for emitting/listening
  }

  // preload players into cache
  try {
    localPlayersCache = await Database.listPlayers(Database);
  } catch (err) {
    console.warn('roster.init: could not load players', err);
    localPlayersCache = [];
  }

  // listen for mount/unmount events
  EventBus.on('ui:mountPanel', async ({ view, target }) => {
    if (view === 'roster' && target) {
      await mount(target);
    }
  });
  EventBus.on('sidebar:unmount', ({ view }) => {
    if (view === 'roster') unmount();
  });

  // expose some debug events
  EventBus.on('roster:placeOnField', ({ playerId }) => {
    // forward to arena/board
    EventBus.emit('player:placeRequest', { playerId });
  });

  return {
    mount,
    unmount,
    refreshList,
    calculateBMI,
    nutritionSuggestions,
    computeGingaScore
  };
}

export default {
  init,
  mount,
  unmount,
  refreshList,
  calculateBMI,
  nutritionSuggestions,
  computeGingaScore
};
