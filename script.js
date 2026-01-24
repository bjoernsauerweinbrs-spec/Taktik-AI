/* Taktik-AI — script.js
   Verbesserte Grafik, Tore, Funino, Trainer-Anmeldung, Sprachausgabe, erweiterte Antworten
   Einfach in die bestehende index.html (canvas id="tacticBoard", buttons/inputs vorhanden) einfügen.
*/

// -------------------- Zustand --------------------
let toniAktiv = false;
let funinoModus = false;
let trainer = null; // {name, org, license}
const canvas = document.getElementById("tacticBoard");
const ctx = canvas.getContext("2d");

// DOM-Elemente (sicher holen)
const answerDiv = document.getElementById("answer");
const questionInput = document.getElementById("question");
const activateBtn = document.getElementById("activateBtn");
const funinoBtn = document.getElementById("funinoBtn");
const askBtn = document.getElementById("askBtn");

// Teams
let teamA = [];
let teamB = [];

// -------------------- Hilfsfunktionen --------------------

function saveTrainerToStorage(t) {
  try { localStorage.setItem("taktik_trainer", JSON.stringify(t)); } catch (e) {}
}
function loadTrainerFromStorage() {
  try { return JSON.parse(localStorage.getItem("taktik_trainer")); } catch (e) { return null; }
}
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "de-DE";
  u.rate = 0.95;
  u.pitch = 1;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}
function formatTrainerName() {
  return trainer && trainer.name ? trainer.name : "Gasttrainer";
}

// -------------------- Grafik: moderneres Feld & Tore --------------------

function drawFieldBackground() {
  // sanfter Rasenverlauf
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, "#0e6b2f");
  g.addColorStop(1, "#0b5f1a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // subtile Streifen
  ctx.save();
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < canvas.width; i += 40) {
    ctx.fillStyle = i % 80 === 0 ? "#ffffff" : "#ffffff";
    ctx.fillRect(i, 0, 20, canvas.height);
  }
  ctx.restore();

  // Außenlinien
  ctx.strokeStyle = "#e9f7ee";
  ctx.lineWidth = 3;
  roundRect(ctx, 8, 8, canvas.width - 16, canvas.height - 16, 8, false, true);

  // Mittellinie & Kreis
  ctx.strokeStyle = "#e9f7ee";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 12);
  ctx.lineTo(canvas.width / 2, canvas.height - 12);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 70, 0, Math.PI * 2);
  ctx.stroke();

  // Strafräume
  ctx.strokeRect(10, canvas.height / 2 - 120, 120, 240);
  ctx.strokeRect(canvas.width - 130, canvas.height / 2 - 120, 120, 240);
}

function drawGoals() {
  // linkes Tor mit Netz-Optik
  const gw = 12;
  const gh = 90;
  const gy = canvas.height / 2 - gh / 2;
  ctx.fillStyle = "#dfe7ee";
  ctx.fillRect(6, gy, gw, gh);
  // Netzlinien (leicht)
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.lineWidth = 1;
  for (let i = 0; i < gh; i += 10) {
    ctx.beginPath();
    ctx.moveTo(6, gy + i);
    ctx.lineTo(6 + 40, gy + i + (i % 20 === 0 ? 2 : 0));
    ctx.stroke();
  }

  // rechtes Tor
  ctx.fillStyle = "#dfe7ee";
  ctx.fillRect(canvas.width - 6 - gw, gy, gw, gh);
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  for (let i = 0; i < gh; i += 10) {
    ctx.beginPath();
    ctx.moveTo(canvas.width - 6, gy + i);
    ctx.lineTo(canvas.width - 6 - 40, gy + i + (i % 20 === 0 ? -2 : 0));
    ctx.stroke();
  }
}

// abgerundetes Rechteck
function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  if (typeof r === "undefined") r = 5;
  if (typeof r === "number") r = { tl: r, tr: r, br: r, bl: r };
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + w - r.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
  ctx.lineTo(x + w, y + h - r.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
  ctx.lineTo(x + r.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

// Spieler zeichnen mit Schatten und Role-Label
function drawPlayer(p, color) {
  const x = 10 + p.x * (canvas.width - 20);
  const y = 10 + p.y * (canvas.height - 20);

  // Schatten
  ctx.beginPath();
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.ellipse(x + 3, y + 8, 12, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Kreis
  ctx.beginPath();
  const grad = ctx.createLinearGradient(x - 10, y - 10, x + 10, y + 10);
  grad.addColorStop(0, color);
  grad.addColorStop(1, shadeColor(color, -20));
  ctx.fillStyle = grad;
  ctx.arc(x, y, 12, 0, Math.PI * 2);
  ctx.fill();

  // Nummer/Role
  ctx.fillStyle = "#fff";
  ctx.font = "11px Inter, Arial";
  ctx.textAlign = "center";
  ctx.fillText(p.role, x, y + 4);
}

// kleine Farbmanipulation
function shadeColor(color, percent) {
  // color in hex like #00a000
  const f = parseInt(color.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  const R = Math.round((t - (f >> 16)) * p) + (f >> 16);
  const G = Math.round((t - ((f >> 8) & 0x00FF)) * p) + ((f >> 8) & 0x00FF);
  const B = Math.round((t - (f & 0x0000FF)) * p) + (f & 0x0000FF);
  return "#" + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1);
}

// -------------------- Teams initialisieren --------------------

function initTeams() {
  teamA = [];
  teamB = [];
  if (funinoModus) {
    // kompakt 3v3
    teamA.push({ x: 0.22, y: 0.35, role: "ST" });
    teamA.push({ x: 0.22, y: 0.5, role: "ZM" });
    teamA.push({ x: 0.22, y: 0.65, role: "ST" });

    teamB.push({ x: 0.78, y: 0.35, role: "ST" });
    teamB.push({ x: 0.78, y: 0.5, role: "ZM" });
    teamB.push({ x: 0.78, y: 0.65, role: "ST" });
  } else {
    // 11er Beispielaufstellung (vereinfachte Positionen)
    teamA.push({ x: 0.08, y: 0.5, role: "TW" });
    teamA.push({ x: 0.22, y: 0.18, role: "LV" });
    teamA.push({ x: 0.22, y: 0.38, role: "LIV" });
    teamA.push({ x: 0.22, y: 0.62, role: "RIV" });
    teamA.push({ x: 0.22, y: 0.82, role: "RV" });
    teamA.push({ x: 0.45, y: 0.2, role: "LM" });
    teamA.push({ x: 0.45, y: 0.4, role: "ZM" });
    teamA.push({ x: 0.45, y: 0.6, role: "ZM" });
    teamA.push({ x: 0.45, y: 0.8, role: "RM" });
    teamA.push({ x: 0.68, y: 0.4, role: "ST" });
    teamA.push({ x: 0.68, y: 0.6, role: "ST" });

    teamB.push({ x: 0.92, y: 0.5, role: "TW" });
    teamB.push({ x: 0.78, y: 0.18, role: "LV" });
    teamB.push({ x: 0.78, y: 0.38, role: "LIV" });
    teamB.push({ x: 0.78, y: 0.62, role: "RIV" });
    teamB.push({ x: 0.78, y: 0.82, role: "RV" });
    teamB.push({ x: 0.6, y: 0.25, role: "ZM" });
    teamB.push({ x: 0.6, y: 0.45, role: "ZM" });
    teamB.push({ x: 0.6, y: 0.65, role: "ZM" });
    teamB.push({ x: 0.5, y: 0.25, role: "LA" });
    teamB.push({ x: 0.5, y: 0.5, role: "MS" });
    teamB.push({ x: 0.5, y: 0.75, role: "RA" });
  }
}

// -------------------- Board Update --------------------

function updateBoard() {
  drawFieldBackground();
  drawGoals();
  teamA.forEach(p => drawPlayer(p, "#00b050"));
  teamB.forEach(p => drawPlayer(p, "#d32f2f"));
}

// -------------------- KI-Logik (lokal simuliert) --------------------

function explainWhoToniIs() {
  return (
    "Ich bin Toni, dein hochintelligenter KI‑Co‑Trainer. " +
    "Ich kombiniere Björns Erfahrung (Regionalliga, BVB‑Zertifikat, internationale Arbeit) " +
    "mit taktischen Regeln, Trainingsprinzipien und kindgerechten Funino‑Methoden. " +
    "Ich kann Formationen erklären, Pressing‑Trigger nennen, Trainingsformen vorschlagen und " +
    "meine Antworten laut ausgeben, wenn du die Sprachausgabe aktivierst."
  );
}

function generateTacticalAnswer(question) {
  const q = (question || "").toLowerCase();
  if (!toniAktiv) return "Toni ist noch nicht aktiviert. Bitte melde dich an und aktiviere die KI.";
  if (!q) return "Stell mir eine konkrete Frage, z. B. 'Wie verschiebt sich die Viererkette bei Ball auf rechts?'";

  // einfache Regelbasis (Platzhalter für echte KI)
  if (q.includes("viererkette") && (q.includes("rechts") || q.includes("ballseite"))) {
    return "Bei Ball auf rechts: die Viererkette schiebt geschlossen nach rechts. Der ballnahe AV attackiert, die Innenverteidiger sichern die Tiefe, der andere AV schiebt ein.";
  }
  if (q.includes("viererkette") && q.includes("links")) {
    return "Bei Ball auf links: die Kette verschiebt nach links, der linke AV geht raus, Innenverteidiger sichern, Mittelfeld schiebt mit.";
  }
  if (q.includes("pressing")) {
    return "Pressing: klare Auslöser definieren (schlechter erster Kontakt, Rückpass). Stürmer lenkt, Achter und Flügelspieler schieben aggressiv, Kette bleibt kompakt.";
  }
  if (q.includes("funino")) {
    return "Funino: 3v3, viele Ballkontakte, schnelle Abschlüsse. Fokus auf Dribbling, Kombinationen und Umschaltspiel. Kleine Tore, viele Wiederholungen.";
  }
  if (q.includes("training") || q.includes("übung")) {
    return "Trainingsvorschlag: 10 Minuten Warmup, 15 Minuten Funino 3v3, 20 Minuten Positionsspezifische Drills, 10 Minuten Abschlussspiel. Fokus: Entscheidungsfreude und Tempo.";
  }
  if (q.includes("wer bist du") || q.includes("wer ist toni")) {
    return explainWhoToniIs();
  }

  // generische Antwort
  return "Gute Frage. Ich habe mehrere taktische Optionen. Formuliere bitte mit Formation oder Ballseite (z. B. 'Viererkette bei Ball rechts').";
}

// -------------------- Anmeldung / Login für externe Trainer --------------------

function createLoginModalIfNeeded() {
  if (document.getElementById("trainerModal")) return;

  const modal = document.createElement("div");
  modal.id = "trainerModal";
  Object.assign(modal.style, {
    position: "fixed",
    left: 0, top: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
  });

  const box = document.createElement("div");
  Object.assign(box.style, {
    width: "420px",
    background: "#0f1720",
    color: "#e6eef6",
    padding: "18px",
    borderRadius: "10px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
    fontFamily: "Inter, Arial"
  });

  box.innerHTML = `
    <h3 style="margin:0 0 8px 0">Trainer Anmeldung</h3>
    <p style="margin:0 0 12px 0; color:#bcd">Melde dich an, damit Toni deine Trainerrechte erkennt und die KI‑Funktionen freischaltet.</p>
    <label style="display:block; margin-bottom:6px">Name</label>
    <input id="trainerName" style="width:100%; padding:8px; margin-bottom:8px; border-radius:6px; border:1px solid #233" placeholder="Dein Name">
    <label style="display:block; margin-bottom:6px">Organisation (optional)</label>
    <input id="trainerOrg" style="width:100%; padding:8px; margin-bottom:8px; border-radius:6px; border:1px solid #233" placeholder="z. B. Verein oder Schule">
    <label style="display:block; margin-bottom:6px">Lizenz / Code (optional)</label>
    <input id="trainerLicense" style="width:100%; padding:8px; margin-bottom:12px; border-radius:6px; border:1px solid #233" placeholder="z. B. BVB-1234">
    <div style="display:flex; gap:8px; justify-content:flex-end">
      <button id="trainerCancel" style="padding:8px 12px; border-radius:6px; background:#2b3945; color:#fff; border:none">Abbrechen</button>
      <button id="trainerSubmit" style="padding:8px 12px; border-radius:6px; background:#0ea5a4; color:#042; border:none">Anmelden</button>
    </div>
    <p id="trainerMsg" style="margin-top:10px; color:#9fb"></p>
  `;

  modal.appendChild(box);
  document.body.appendChild(modal);

  document.getElementById("trainerCancel").addEventListener("click", () => {
    modal.remove();
  });

  document.getElementById("trainerSubmit").addEventListener("click", () => {
    const name = document.getElementById("trainerName").value.trim();
    const org = document.getElementById("trainerOrg").value.trim();
    const license = document.getElementById("trainerLicense").value.trim();
    const msg = document.getElementById("trainerMsg");

    if (!name) {
      msg.textContent = "Bitte gib deinen Namen an.";
      msg.style.color = "#f88";
      return;
    }

    // Simulierter Verifizierungsprozess (hier lokal)
    trainer = { name, org, license, verified: true, timestamp: Date.now() };
    saveTrainerToStorage(trainer);
    msg.textContent = "Anmeldung erfolgreich. Toni ist bereit.";
    msg.style.color = "#9fb";

    setTimeout(() => {
      modal.remove();
      const text = `Willkommen ${name}. Deine Traineranmeldung war erfolgreich. Toni ist jetzt bereit.`;
      answerDiv.textContent = text;
      speak(text);
      toniAktiv = true;
      updateActivateButton();
    }, 800);
  });
}

function requireLoginThenActivate() {
  trainer = loadTrainerFromStorage();
  if (trainer && trainer.name) {
    toniAktiv = true;
    const text = `Willkommen zurück, ${trainer.name}. Toni ist aktiviert.`;
    answerDiv.textContent = text;
    speak(text);
    updateActivateButton();
    return;
  }
  // Modal öffnen
  createLoginModalIfNeeded();
}

// -------------------- UI-Helpers --------------------

function updateActivateButton() {
  if (toniAktiv) {
    activateBtn.textContent = `Toni aktiv ( ${formatTrainerName()} )`;
    activateBtn.style.background = "#0ea5a4";
    activateBtn.style.color = "#042";
  } else {
    activateBtn.textContent = "KI aktivieren";
    activateBtn.style.background = "";
    activateBtn.style.color = "";
  }
}

// -------------------- Events --------------------

activateBtn.addEventListener("click", () => {
  // Wenn bereits angemeldet, aktivieren; sonst Anmeldung starten
  trainer = loadTrainerFromStorage();
  if (!trainer) {
    createLoginModalIfNeeded();
    return;
  }
  toniAktiv = true;
  const text = `Hallo ${trainer.name}. Toni ist jetzt aktiviert. Sag mir, was du wissen willst oder klicke 'Erkläre Toni' für eine Vorstellung.`;
  answerDiv.textContent = text;
  speak(text);
  updateActivateButton();
});

funinoBtn.addEventListener("click", () => {
  funinoModus = !funinoModus;
  funinoBtn.textContent = funinoModus ? "Funino aus" : "Funino-Modus";
  initTeams();
  updateBoard();
  const text = funinoModus ? "Funino aktiviert: 3 gegen 3, viele Ballkontakte." : "11er-Modus wieder aktiv.";
  answerDiv.textContent = text;
  speak(text);
});

askBtn.addEventListener("click", () => {
  const frage = questionInput.value;
  const antwort = generateTacticalAnswer(frage);
  answerDiv.textContent = antwort;
  speak(antwort);
});

questionInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") askBtn.click();
});

// -------------------- Initialisierung & kleine Animation --------------------

function animatePlayers() {
  // leichte Atmung/Bewegung, damit es lebendiger wirkt
  teamA.forEach((p, i) => {
    const offset = Math.sin(Date.now() / 600 + i) * 0.0025;
    p.y = Math.min(0.95, Math.max(0.05, p.y + offset));
  });
  teamB.forEach((p, i) => {
    const offset = Math.cos(Date.now() / 700 + i) * 0.0025;
    p.y = Math.min(0.95, Math.max(0.05, p.y + offset));
  });
  updateBoard();
  requestAnimationFrame(animatePlayers);
}

// -------------------- Start --------------------

window.addEventListener("load", () => {
  // Lade Trainer falls vorhanden
  trainer = loadTrainerFromStorage();
  initTeams();
  updateBoard();
  updateActivateButton();
  answerDiv.textContent = "Toni ist bereit. Melde dich an, um die volle KI‑Funktion zu aktivieren.";
  // kurze Vorstellung, falls kein Trainer angemeldet
  if (!trainer) {
    speak("Toni ist bereit. Bitte melde dich an, um die KI zu aktivieren.");
  } else {
    speak(`Willkommen zurück ${trainer.name}. Toni ist bereit.`);
  }
  requestAnimationFrame(animatePlayers);
});
