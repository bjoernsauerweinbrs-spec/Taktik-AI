// js/modules/arena.js
// Arena / Pitch module for Toni 2.0
// Responsibilities:
// - SVG construction animation (animateConstruction(mode)) -> Promise
// - Render players (name + number) as SVG groups and support CSS transitions
// - Handle player placement requests and player:move events via EventBus
// - Provide simple API: init({ svg, canvas, eventBus, lowPower }), animateConstruction(mode), placePlayer(playerId, pos), movePlayer(playerId, targetPos)
// - Keep rendering lightweight; heavy analysis offloaded to workers elsewhere

import EventBus from './eventbus.js';
import Database from './database.js';

const DEFAULT_PITCH_W = 950;
const DEFAULT_PITCH_H = 600;

let svg = null;
let canvas = null;
let eventBus = null;
let lowPowerMode = false;
let playersMap = new Map(); // playerId -> { id, x, y, svgGroup }
let svgNS = 'http://www.w3.org/2000/svg';

// Utility: create SVG element
function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(svgNS, tag);
  for (const k in attrs) {
    if (k === 'text') {
      el.textContent = attrs[k];
    } else {
      el.setAttribute(k, attrs[k]);
    }
  }
  return el;
}

// Convert logical pitch coords (0..1) to SVG coords
function toSvgCoords(normX, normY) {
  const w = svg.viewBox.baseVal.width || DEFAULT_PITCH_W;
  const h = svg.viewBox.baseVal.height || DEFAULT_PITCH_H;
  return { x: Math.round(normX * w), y: Math.round(normY * h) };
}

// Create player SVG group (circle + label)
function createPlayerGroup(player) {
  const g = svgEl('g', { class: 'player-group', 'data-player-id': player.id });
  const circle = svgEl('circle', {
    cx: player.x || 50,
    cy: player.y || 50,
    r: 14,
    fill: '#D4AF37', // gold for friendly by default
    class: 'player-circle'
  });
  const text = svgEl('text', {
    x: (player.x || 50),
    y: (player.y || 50) + 5,
    'text-anchor': 'middle',
    'font-size': 12,
    'fill': '#081018',
    class: 'player-label'
  });
  text.textContent = `${player.name || ''}${player.number ? ' #' + player.number : ''}`;
  g.appendChild(circle);
  g.appendChild(text);
  // enable pointer events for drag (simple)
  g.style.cursor = 'grab';
  return g;
}

// Update group position with CSS transition or immediate set
function setPlayerPosition(group, x, y, animate = true) {
  const circle = group.querySelector('circle');
  const text = group.querySelector('text');
  if (!circle || !text) return;
  if (animate && !lowPowerMode) {
    // use SVG animateTransform via CSS transitions on transform
    group.style.transition = 'transform 520ms cubic-bezier(.2,.9,.2,1)';
    group.style.transform = `translate(${x - parseFloat(circle.getAttribute('cx'))}px, ${y - parseFloat(circle.getAttribute('cy'))}px)`;
    // after transition, normalize attributes to avoid accumulation
    setTimeout(() => {
      group.style.transition = '';
      group.style.transform = '';
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      text.setAttribute('x', x);
      text.setAttribute('y', y + 5);
    }, 540);
  } else {
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    text.setAttribute('x', x);
    text.setAttribute('y', y + 5);
  }
}

// Build pitch SVG structure (lines, center, goals) depending on mode
function buildPitchPaths(mode = 'senioren') {
  // Clear existing
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const w = svg.viewBox.baseVal.width || DEFAULT_PITCH_W;
  const h = svg.viewBox.baseVal.height || DEFAULT_PITCH_H;

  // background rect (grass)
  const bg = svgEl('rect', { x: 0, y: 0, width: w, height: h, fill: 'none', class: 'pitch-bg' });
  svg.appendChild(bg);

  // helper to create path with stroke-dasharray for animation
  function addPath(d, stroke = '#E6EDF3', strokeWidth = 2, dash = true) {
    const p = svgEl('path', { d, stroke, 'stroke-width': strokeWidth, fill: 'none', class: 'svg-path' });
    if (dash) {
      // set dash length to path length later after appended
      p.classList.add('draw');
    }
    svg.appendChild(p);
    return p;
  }

  // outer boundary
  const outerD = `M 40 40 H ${w - 40} V ${h - 40} H 40 Z`;
  addPath(outerD);

  // center line and circle
  addPath(`M ${w / 2} 40 V ${h - 40}`);
  addPath(`M ${w / 2} ${h / 2} m -60,0 a 60,60 0 1,0 120,0 a 60,60 0 1,0 -120,0`);

  // penalty boxes and goals depending on mode
  if (mode === 'senioren') {
    // penalty boxes
    addPath(`M 40 160 H 160 V ${h - 160} H 40`);
    addPath(`M ${w - 40} 160 H ${w - 160} V ${h - 160} H ${w - 40}`);
    // goals (visual)
    const g1 = svgEl('rect', { x: 20, y: (h / 2) - 40, width: 20, height: 80, fill: '#fff', opacity: 0.06 });
    const g2 = svgEl('rect', { x: w - 40, y: (h / 2) - 40, width: 20, height: 80, fill: '#fff', opacity: 0.06 });
    svg.appendChild(g1);
    svg.appendChild(g2);
  } else if (mode === 'jugend') {
    // smaller boxes
    addPath(`M 40 200 H 140 V ${h - 200} H 40`);
    addPath(`M ${w - 40} 200 H ${w - 140} V ${h - 200} H ${w - 40}`);
    const g1 = svgEl('rect', { x: 30, y: (h / 2) - 30, width: 15, height: 60, fill: '#fff', opacity: 0.05 });
    const g2 = svgEl('rect', { x: w - 45, y: (h / 2) - 30, width: 15, height: 60, fill: '#fff', opacity: 0.05 });
    svg.appendChild(g1);
    svg.appendChild(g2);
  } else if (mode === 'funino') {
    // 4 goals, 3 zones: draw vertical thirds and 4 small goals
    const third = w / 3;
    addPath(`M ${third} 40 V ${h - 40}`);
    addPath(`M ${2 * third} 40 V ${h - 40}`);
    // small goals
    const goalW = 12, goalH = 40;
    svg.appendChild(svgEl('rect', { x: 10, y: (h / 2) - goalH / 2, width: goalW, height: goalH, fill: '#fff', opacity: 0.06 }));
    svg.appendChild(svgEl('rect', { x: w - 22, y: (h / 2) - goalH / 2, width: goalW, height: goalH, fill: '#fff', opacity: 0.06 }));
    svg.appendChild(svgEl('rect', { x: third - 6, y: (h / 2) - goalH / 2, width: goalW, height: goalH, fill: '#fff', opacity: 0.06 }));
    svg.appendChild(svgEl('rect', { x: 2 * third - 6, y: (h / 2) - goalH / 2, width: goalW, height: goalH, fill: '#fff', opacity: 0.06 }));
  }

  // after adding paths, compute stroke-dasharray lengths
  // small timeout to ensure DOM path lengths are available
  setTimeout(() => {
    const paths = svg.querySelectorAll('path.svg-path.draw');
    paths.forEach(p => {
      try {
        const len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
        p.style.setProperty('--dash-len', len);
      } catch (e) {
        // ignore
      }
    });
  }, 20);
}

// Animate construction: returns Promise that resolves when all path animations complete
function animatePaths() {
  return new Promise((resolve) => {
    const paths = Array.from(svg.querySelectorAll('path.svg-path.draw'));
    if (!paths.length) return resolve();
    let remaining = paths.length;
    const onEnd = (ev) => {
      remaining -= 1;
      if (remaining <= 0) resolve();
    };
    // apply animation class (CSS handles animation)
    paths.forEach(p => {
      // ensure transition duration scaled by path length for nicer effect
      const len = p.getTotalLength ? p.getTotalLength() : 800;
      const dur = Math.min(1600, Math.max(600, Math.round(len * 0.9)));
      p.style.animationDuration = `${dur}ms`;
      // listen for animationend
      p.addEventListener('animationend', onEnd, { once: true });
      // trigger by removing offset (CSS keyframes handle it)
      p.classList.add('draw');
    });
    // safety timeout
    setTimeout(() => resolve(), 2200);
  });
}

// Public: animateConstruction(mode)
async function animateConstruction(mode = 'senioren') {
  // build pitch paths
  buildPitchPaths(mode);

  // small delay for dramatic effect
  await new Promise(r => setTimeout(r, 120));

  // animate paths
  await animatePaths();

  // fade-in grass / enable interactions
  // we can emit an event for other modules
  EventBus.emit('arena:constructed', { mode });

  return Promise.resolve();
}

// Initialize module
async function init({ svg: svgElRef, canvas: canvasRef, eventBus: eb = null, lowPower = false } = {}) {
  if (!svgElRef) throw new Error('svg element required');
  svg = svgElRef;
  canvas = canvasRef || null;
  eventBus = eb || EventBus;
  lowPowerMode = !!lowPower;

  // ensure viewBox is set for scaling
  if (!svg.getAttribute('viewBox')) {
    svg.setAttribute('viewBox', `0 0 ${DEFAULT_PITCH_W} ${DEFAULT_PITCH_H}`);
  }

  // basic defs for styling
  const defs = svg.querySelector('defs') || svgEl('defs');
  if (!svg.querySelector('defs')) svg.appendChild(defs);

  // initial empty pitch
  buildPitchPaths('senioren');

  // wire EventBus handlers
  eventBus.on('player:placeRequest', async ({ playerId }) => {
    // fetch player and place at default or center
    try {
      const p = await Database.getPlayer(Database, playerId);
      if (!p) return;
      // default position: center-left for home team, or use stored defaultStartPos
      const pos = p.defaultStartPos || { x: 0.25, y: 0.5 };
      const coords = toSvgCoords(pos.x, pos.y);
      placePlayer(playerId, coords);
    } catch (e) {
      console.warn('placeRequest failed', e);
    }
  });

  eventBus.on('player:move', ({ playerId, target }) => {
    if (!playerId || !target) return;
    const coords = toSvgCoords(target.x, target.y);
    movePlayer(playerId, coords);
  });

  // allow external mounting of roster players on init
  eventBus.on('roster:created', async ({ playerId }) => {
    try {
      const p = await Database.getPlayer(Database, playerId);
      if (p) {
        // place at default or off-canvas until positioned
        const pos = p.defaultStartPos || { x: 0.5, y: 0.5 };
        const coords = toSvgCoords(pos.x, pos.y);
        placePlayer(playerId, coords, p);
      }
    } catch (e) { /* ignore */ }
  });

  // load existing players from DB and render
  try {
    const players = await Database.listPlayers(Database);
    (players || []).forEach(p => {
      const pos = p.defaultStartPos || { x: 0.5, y: 0.5 };
      const coords = toSvgCoords(pos.x, pos.y);
      placePlayer(p.id, coords, p);
    });
  } catch (e) {
    console.warn('arena.init: could not load players', e);
  }

  // expose simple API via EventBus for debug
  eventBus.on('arena:getState', () => {
    const out = [];
    playersMap.forEach((v, k) => out.push({ playerId: k, x: v.x, y: v.y }));
    eventBus.emit('arena:state', { players: out });
  });

  return {
    animateConstruction,
    placePlayer,
    movePlayer
  };
}

// Place player: create group if missing, set position
function placePlayer(playerId, coords, playerObj = null) {
  if (!playerId || !coords) return;
  const existing = playersMap.get(playerId);
  if (existing && existing.svgGroup) {
    // move existing
    setPlayerPosition(existing.svgGroup, coords.x, coords.y, true);
    existing.x = coords.x;
    existing.y = coords.y;
    EventBus.emit('player:placed', { playerId, x: coords.x, y: coords.y });
    return existing;
  }

  // create new player group
  const p = playerObj || { id: playerId, name: '', number: '' };
  const group = createPlayerGroup({ id: playerId, x: coords.x, y: coords.y, name: p.name || '', number: p.number || '' });
  // initial absolute placement
  const circle = group.querySelector('circle');
  circle.setAttribute('cx', coords.x);
  circle.setAttribute('cy', coords.y);
  const text = group.querySelector('text');
  text.setAttribute('x', coords.x);
  text.setAttribute('y', coords.y + 5);

  // append to svg
  svg.appendChild(group);

  // store
  playersMap.set(playerId, { id: playerId, x: coords.x, y: coords.y, svgGroup: group });

  // enable simple drag to override (pointer events)
  enableDragForGroup(group, playerId);

  EventBus.emit('player:placed', { playerId, x: coords.x, y: coords.y });
  return playersMap.get(playerId);
}

// Move player to target coords (SVG coords)
function movePlayer(playerId, coords) {
  const rec = playersMap.get(playerId);
  if (!rec) {
    // if not present, create placeholder and move
    return placePlayer(playerId, coords);
  }
  setPlayerPosition(rec.svgGroup, coords.x, coords.y, true);
  rec.x = coords.x;
  rec.y = coords.y;
  EventBus.emit('player:moved', { playerId, x: coords.x, y: coords.y });
  return rec;
}

// Enable simple drag behavior for a group (updates position and emits override)
function enableDragForGroup(group, playerId) {
  let dragging = false;
  let start = null;
  let orig = null;

  const onPointerDown = (ev) => {
    ev.preventDefault();
    dragging = true;
    group.setPointerCapture && group.setPointerCapture(ev.pointerId);
    start = { x: ev.clientX, y: ev.clientY };
    const circle = group.querySelector('circle');
    orig = { x: parseFloat(circle.getAttribute('cx')), y: parseFloat(circle.getAttribute('cy')) };
    group.style.cursor = 'grabbing';
  };

  const onPointerMove = (ev) => {
    if (!dragging) return;
    const dx = ev.clientX - start.x;
    const dy = ev.clientY - start.y;
    const newX = orig.x + dx;
    const newY = orig.y + dy;
    // apply transform for smooth dragging
    group.style.transform = `translate(${newX - orig.x}px, ${newY - orig.y}px)`;
  };

  const onPointerUp = (ev) => {
    if (!dragging) return;
    dragging = false;
    group.releasePointerCapture && group.releasePointerCapture(ev.pointerId);
    group.style.cursor = 'grab';
    // compute final position
    const circle = group.querySelector('circle');
    const origX = parseFloat(circle.getAttribute('cx'));
    const origY = parseFloat(circle.getAttribute('cy'));
    const dx = ev.clientX - start.x;
    const dy = ev.clientY - start.y;
    const finalX = Math.round(origX + dx);
    const finalY = Math.round(origY + dy);
    // normalize transform and set attributes
    group.style.transform = '';
    circle.setAttribute('cx', finalX);
    circle.setAttribute('cy', finalY);
    const text = group.querySelector('text');
    text.setAttribute('x', finalX);
    text.setAttribute('y', finalY + 5);
    // update map
    const rec = playersMap.get(playerId);
    if (rec) {
      rec.x = finalX;
      rec.y = finalY;
    }
    // emit override event so engine reconciles
    EventBus.emit('player:override', { playerId, x: finalX, y: finalY });
  };

  group.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
}

// Exported API
export default {
  init,
  animateConstruction,
  placePlayer,
  movePlayer
};
