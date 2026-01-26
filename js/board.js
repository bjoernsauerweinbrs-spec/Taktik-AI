/* --- SPIELFELD LOGIK (BOARD.JS) --- */

const board = document.getElementById('board-container');
const redTeam = [
  { id: 'R1', pos: [50, 250], role: 'TW' },
  { id: 'R2', pos: [150, 100], role: 'IV' },
  { id: 'R3', pos: [150, 400], role: 'IV' },
  { id: 'R4', pos: [250, 250], role: 'DM' },
  { id: 'R5', pos: [450, 150], role: 'OM' },
  { id: 'R6', pos: [450, 350], role: 'OM' },
  { id: 'R7', pos: [650, 250], role: 'ST' }
];

const blueTeam = [
  { id: 'B1', pos: [750, 250], role: 'TW' },
  { id: 'B2', pos: [600, 150], role: 'V' },
  { id: 'B3', pos: [600, 350], role: 'V' },
  { id: 'B4', pos: [400, 250], role: 'M' },
  { id: 'B5', pos: [200, 250], role: 'S' }
];

// Funktion: Spieler auf dem Feld erstellen
function initBoard() {
  if (!board) return;
  board.innerHTML = ''; // Feld leeren

  // Rote Spieler (Dein Team - Toni's Fokus)
  redTeam.forEach(p => createPlayer(p, 'red'));
  // Blaue Spieler (Gegner)
  blueTeam.forEach(p => createPlayer(p, 'blue'));
}

function createPlayer(p, color) {
  const el = document.createElement('div');
  el.className = `player ${color}`;
  el.id = p.id;
  el.innerText = p.role;
  el.style.left = p.pos[0] + 'px';
  el.style.top = p.pos[1] + 'px';
  
  // Drag & Drop Logik
  makeDraggable(el);
  board.appendChild(el);
}

function makeDraggable(el) {
  let isDragging = false;

  el.onmousedown = (e) => {
    isDragging = true;
    el.style.zIndex = 1000;
  };

  document.onmousemove = (e) => {
    if (!isDragging) return;
    const rect = board.getBoundingClientRect();
    let x = e.clientX - rect.left - 17; // Zentrieren
    let y = e.clientY - rect.top - 17;

    // Grenzen einhalten
    x = Math.max(0, Math.min(x, rect.width - 35));
    y = Math.max(0, Math.min(y, rect.height - 35));

    el.style.left = x + 'px';
    el.style.top = y + 'px';
  };

  document.onmouseup = () => {
    isDragging = false;
    el.style.zIndex = 10;
  };
}

// Grundordnung wiederherstellen
function resetBoard() {
  initBoard();
  console.log("Spielfeld zurückgesetzt - Grundordnung aktiv.");
}

/* --- DER ENTSCHEIDENDE ANPFIFF --- */
document.addEventListener('DOMContentLoaded', () => {
  console.log("Board-System bereit...");
  initBoard();
});

// Export für andere Scripte
window.resetBoard = resetBoard;
