// Board Rendering und Interaktion
let pitch = null;
let tacticalSvg = null;
let tacticalLines = [];

function ensurePitch() {
  if (!pitch) pitch = document.getElementById('pitch');
  return !!pitch;
}

function drawBoard() {
  if (!ensurePitch()) return;
  pitch.innerHTML = `
    <div class="center-line"></div>
    <div class="center-circle"></div>
    <div class="penalty-area left"></div>
    <div class="penalty-area right"></div>
    <div id="ball" class="ball"></div>
  `;

  // Render players from logic.squad
  const { squad } = window.AppLogic;
  squad.forEach(p => {
    if (p.status !== 'team') return;
    const existing = pitch.querySelector(`[data-player-id="${p.id}"]`);
    if (existing) existing.remove();

    const dot = document.createElement('div');
    dot.className = `player-dot ${p.status === 'team' ? 'red' : 'blue'}`;
    dot.style.left = `${p.x}%`;
    dot.style.top = `${p.y}%`;
    dot.dataset.playerId = p.id;
    dot.dataset.stats = `Tech:${p.points.tech}\nPerc:${p.points.perc}\nFit:${p.points.fit}\nSpec:${p.points.special}`;
    dot.innerHTML = `<div class="player-label">#${p.nr} ${p.name}</div>`;
    pitch.appendChild(dot);
    makeDraggable(dot);
  });

  createSvgLayer(); // lazy create
}

function makeDraggable(el) {
  if (!ensurePitch() || !el) return;
  let dragging = false;
  let startX = 0, startY = 0, origLeft = 0, origTop = 0;

  function onPointerDown(e) {
    e.preventDefault();
    dragging = true;
    el.setPointerCapture && el.setPointerCapture(e.pointerId);
    const rect = el.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    origLeft = rect.left;
    origTop = rect.top;
    el.style.transition = 'none';
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const pitchRect = pitch.getBoundingClientRect();
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const newLeftPx = origLeft + dx - pitchRect.left;
    const newTopPx = origTop + dy - pitchRect.top;
    const clampedX = Math.max(0, Math.min(pitchRect.width - el.offsetWidth, newLeftPx));
    const clampedY = Math.max(0, Math.min(pitchRect.height - el.offsetHeight, newTopPx));
    el.style.position = 'absolute';
    el.style.left = (clampedX / pitchRect.width * 100) + '%';
    el.style.top = (clampedY / pitchRect.height * 100) + '%';
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    el.releasePointerCapture && el.releasePointerCapture(e.pointerId);
    el.style.transition = '';
    // Persist position to logic
    const id = el.dataset.playerId;
    const left = parseFloat(el.style.left);
    const top = parseFloat(el.style.top);
    window.AppLogic.updatePlayerPosition(id, left, top);
  }

  el.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
}

function createSvgLayer() {
  if (!ensurePitch()) return null;
  if (tacticalSvg) return tacticalSvg;
  const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.id = "tactical-svg";
  svg.setAttribute('preserveAspectRatio','none');
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  svg.style.width = '100%';
  svg.style.height = '100%';
  svg.style.pointerEvents = 'none';
  svg.style.zIndex = '50';
  pitch.appendChild(svg);
  tacticalSvg = svg;
  return svg;
}

function percentToPixel(xPercent,yPercent){
  if (!ensurePitch()) return {x:0,y:0};
  const rect = pitch.getBoundingClientRect();
  return { x: (Number(xPercent)/100)*rect.width, y: (Number(yPercent)/100)*rect.height };
}

function drawTacticalLine(fromX,fromY,toX,toY,isDashed=false){
  const svg = createSvgLayer();
  if (!svg) return null;
  const p1 = percentToPixel(fromX,fromY);
  const p2 = percentToPixel(toX,toY);
  const line = document.createElementNS("http://www.w3.org/2000/svg","line");
  line.setAttribute("x1", p1.x);
  line.setAttribute("y1", p1.y);
  line.setAttribute("x2", p2.x);
  line.setAttribute("y2", p2.y);
  line.setAttribute("stroke", isDashed ? "blue" : "red");
  line.setAttribute("stroke-width", "2");
  if (isDashed) line.setAttribute("stroke-dasharray","5,5");
  svg.appendChild(line);
  tacticalLines.push({fromX,fromY,toX,toY,isDashed,el:line});
  return line;
}

function clearTacticalLines(){
  if (!tacticalSvg) return;
  tacticalLines.forEach(item => { try { tacticalSvg.removeChild(item.el); } catch(e){} });
  tacticalLines = [];
}

function movePlayerOnBoard(identifier,x,y){
  // identifier kann Name, Nummer oder id sein
  const player = window.AppLogic.getPlayerByIdentifier(identifier);
  if (!player) { console.warn('Spieler nicht gefunden', identifier); return; }
  player.x = Math.max(0, Math.min(100, Number(x)));
  player.y = Math.max(0, Math.min(100, Number(y)));
  window.AppLogic.saveSquadData();
  drawBoard();
}

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
  drawBoard();
  // Re-render wenn Squad updated
  window.AppLogic.Bus.addEventListener('squad:updated', () => drawBoard());
});
