/* --- BOARD STATE & GLOBALS --- */
let _snapshot = [];

/* --- SPIELFELD INITIALISIEREN --- */
function resetBoard() {
  const layer = document.getElementById('players-layer');
  const bank = document.getElementById('bank-list');
  if (!layer || !bank) return;

  layer.innerHTML = ''; 
  bank.innerHTML = '';
  
  // Standardpositionen (Prozentual)
  const hPos = [[10,50],[25,20],[25,40],[25,60],[25,80],[45,30],[45,50],[45,70],[75,25],[85,50],[75,75]];
  const aPos = [[90,50],[75,20],[75,40],[75,60],[75,80],[55,30],[55,50],[55,70],[25,25],[15,50],[25,75]];

  for (let i = 0; i < 11; i++) {
    const nr = i + 1;
    const hId = 'home' + nr;
    const aId = 'away' + nr;

    // Home Team (Rot) - Nur erstellen wenn anwesend
    if (typeof attendance !== 'undefined' && attendance[hId] !== false) {
      createPlayer('home', nr, hPos[i][0], hPos[i][1], layer, false);
    } else if (typeof addToBank === 'function') {
      addToBank(hId);
    }

    // Away Team (Blau) - Nur erstellen wenn anwesend
    if (typeof attendance !== 'undefined' && attendance[aId] !== false) {
      createPlayer('away', nr, aPos[i][0], aPos[i][1], layer, true);
    } else if (typeof addToBank === 'function') {
      addToBank(aId);
    }
  }

  // Ball initialisieren
  const ball = document.getElementById('ball');
  if (ball) {
    ball.style.left = '50%';
    ball.style.top = '50%';
    makeDraggableSafe(ball);
  }

  if (typeof syncNames === 'function') syncNames();
  takeSnapshot();
}

/* --- SPIELER ERSTELLEN --- */
function createPlayer(side, nr, x, y, layer, canDrag) {
  const id = side + nr;
  if (document.getElementById(id)) return;

  const p = document.createElement('div');
  p.className = `player ${side}`;
  p.id = id;
  p.innerText = nr;
  p.style.left = x + '%';
  p.style.top = y + '%';
  p.setAttribute('data-team', side);
  
  // Home-Spieler (Rot) sind meistens Toni-gesteuert, Away (Blau) ziehst du selbst
  p.style.pointerEvents = (side === 'home') ? 'none' : 'auto';
  
  layer.appendChild(p);
  if (canDrag) makeDraggableSafe(p);
}

/* --- DRAG & DROP LOGIK --- */
function makeDraggableSafe(el) {
  if (!el) return;
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  el.onmousedown = (e) => {
    dragging = true;
    el.style.transition = 'none';
    el.style.zIndex = 1000;
    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  };

  window.onmousemove = (e) => {
    if (!dragging) return;
    const pitch = document.getElementById('pitch');
    const pRect = pitch.getBoundingClientRect();
    
    let left = ((e.clientX - pRect.left - offsetX) / pRect.width) * 100;
    let top = ((e.clientY - pRect.top - offsetY) / pRect.height) * 100;

    // Grenzen einhalten
    left = Math.max(0, Math.min(96, left));
    top = Math.max(0, Math.min(94, top));

    el.style.left = left + '%';
    el.style.top = top + '%';
  };

  window.onmouseup = () => {
    if (!dragging) return;
    dragging = false;
    el.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
    el.style.zIndex = '';
  };
}

/* --- SNAPSHOTS (TRAININGS-PHASEN) --- */
function takeSnapshot() {
  _snapshot = [];
  document.querySelectorAll('.player').forEach(p => {
    _snapshot.push({ id: p.id, left: p.style.left, top: p.style.top });
  });
  const ball = document.getElementById('ball');
  if (ball) _snapshot.push({ id: 'ball', left: ball.style.left, top: ball.style.top });
}

function restoreSnapshot() {
  _snapshot.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) {
      el.style.left = s.left;
      el.style.top = s.top;
    }
  });
}

// Global verfügbar machen
window.resetBoard = resetBoard;
window.makeDraggableSafe = makeDraggableSafe;
