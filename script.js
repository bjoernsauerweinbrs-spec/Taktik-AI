let toniAktiv = false;
let funinoModus = false;

const canvas = document.getElementById("tacticBoard");
const ctx = canvas.getContext("2d");

const teamA = [];
const teamB = [];

function initTeams() {
  teamA.length = 0;
  teamB.length = 0;

  if (funinoModus) {
    teamA.push({ x: 0.2, y: 0.3, role: "ST" });
    teamA.push({ x: 0.2, y: 0.5, role: "ZM" });
    teamA.push({ x: 0.2, y: 0.7, role: "ST" });

    teamB.push({ x: 0.8, y: 0.3, role: "ST" });
    teamB.push({ x: 0.8, y: 0.5, role: "ZM" });
    teamB.push({ x: 0.8, y: 0.7, role: "ST" });
  } else {
    teamA.push(
      { x: 0.1, y: 0.5, role: "TW" },
      { x: 0.25, y: 0.2, role: "LV" },
      { x: 0.25, y: 0.4, role: "LIV" },
      { x: 0.25, y: 0.6, role: "RIV" },
      { x: 0.25, y: 0.8, role: "RV" },
      { x: 0.45, y: 0.2, role: "LM" },
      { x: 0.45, y: 0.4, role: "ZM" },
      { x: 0.45, y: 0.6, role: "ZM" },
      { x: 0.45, y: 0.8, role: "RM" },
      { x: 0.7, y: 0.4, role: "ST" },
      { x: 0.7, y: 0.6, role: "ST" }
    );

    teamB.push(
      { x: 0.9, y: 0.5, role: "TW" },
      { x: 0.75, y: 0.2, role: "LV" },
      { x: 0.75, y: 0.4, role: "LIV" },
      { x: 0.75, y: 0.6, role: "RIV" },
      { x: 0.75, y: 0.8, role: "RV" },
      { x: 0.6, y: 0.3, role: "ZM" },
      { x: 0.6, y: 0.5, role: "ZM" },
      { x: 0.6, y: 0.7, role: "ZM" },
      { x: 0.45, y: 0.25, role: "LA" },
      { x: 0.45, y: 0.5, role: "MS" },
      { x: 0.45, y: 0.75, role: "RA" }
    );
  }
}

function drawField() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0b5f1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 10);
  ctx.lineTo(canvas.width / 2, canvas.height - 10);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, Math.PI * 2);
  ctx.stroke();

  // Tore
  ctx.fillStyle = "#888";
  ctx.fillRect(0, canvas.height / 2 - 30, 10, 60);
  ctx.fillRect(canvas.width - 10, canvas.height / 2 - 30, 10, 60);
}

function drawPlayer(p, color) {
  const x = 10 + p.x * (canvas.width - 20);
  const y = 10 + p.y * (canvas.height - 20);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.font = "10px Arial";
  ctx.textAlign = "center";
  ctx.fillText(p.role, x, y - 15);
}

function updateBoard() {
  drawField();
  teamA.forEach(p => drawPlayer(p, "#00a000"));
  teamB.forEach(p => drawPlayer(p, "#d00000"));
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  speechSynthesis.speak(utterance);
}

function toniAntwort(frage) {
  const q = frage.toLowerCase();

  if (!toniAktiv) return "Bitte aktiviere Toni zuerst über den Button oben.";

  if (q.includes("björn")) {
    return "Björn ist ein Trainer mit Regionalliga-Erfahrung, BVB-Zertifizierung und internationalem Hintergrund. Ich erkläre dir alles, was auf seinem Wissen basiert.";
  }

  if (q.includes("viererkette") && q.includes("links")) {
    return "Wenn der Gegner über unsere linke Seite kommt, schiebt die Viererkette geschlossen nach links. Der ballnahe Außenverteidiger rückt raus, die anderen sichern ab.";
  }

  if (q.includes("offensive") || q.includes("stürmer")) {
    return "In der Offensive starten unsere Stürmer in die Tiefe, orientieren sich zur Ballseite und öffnen Räume.";
  }

  return "Ich habe deine Frage verstanden, aber sie passt noch nicht zu einer meiner taktischen Situationen.";
}

// Event-Handling
document.getElementById("activateBtn").addEventListener("click", () => {
  toniAktiv = true;
  const text = "Hallo Trainer! Ich bin Toni, dein KI-Co-Trainer. Stell mir deine erste Frage.";
  document.getElementById("answer").textContent = text;
  speak(text);
});

document.getElementById("funinoBtn").addEventListener("click", () => {
  funinoModus = !funinoModus;
  initTeams();
  updateBoard();
});

document.getElementById("askBtn").addEventListener("click", () => {
  const frage = document
