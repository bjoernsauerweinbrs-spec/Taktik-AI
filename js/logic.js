// Squad als Single Source of Truth
let squad = Storage.loadSquad() || [
  { id: 1, nr: 8, name: "Thorsten", status: "team", x:50, y:50, points:{tech:0,perc:0,fit:0,special:0} },
  { id: 2, nr: 99, name: "David Luiz", status: "team", x:40, y:40, points:{tech:0,perc:0,fit:0,special:0} }
];

// Event Bus minimal
const Bus = new EventTarget();

function saveSquadData() {
  Storage.saveSquad('toni.squad', squad);
  Bus.dispatchEvent(new CustomEvent('squad:updated', { detail: { squad } }));
}

function updatePlayerPosition(id, x, y) {
  const p = squad.find(s => s.id === Number(id));
  if (!p) return;
  p.x = Math.max(0, Math.min(100, Number(x)));
  p.y = Math.max(0, Math.min(100, Number(y)));
  saveSquadData();
}

function getPlayerByIdentifier(identifier) {
  const idStr = String(identifier).trim().toLowerCase();
  return squad.find(p => String(p.nr) === idStr || p.name.toLowerCase().includes(idStr) || String(p.id) === idStr);
}

function addPlayer(name, nr) {
  const newId = Date.now() + Math.floor(Math.random()*1000);
  squad.push({ id:newId, nr: Number(nr), name: String(name), status:'team', x:50, y:50, points:{tech:0,perc:0,fit:0,special:0} });
  saveSquadData();
}

function removePlayer(id) {
  squad = squad.filter(p => p.id !== Number(id));
  saveSquadData();
}

// Export API
window.AppLogic = { squad, saveSquadData, updatePlayerPosition, getPlayerByIdentifier, addPlayer, removePlayer, Bus };
