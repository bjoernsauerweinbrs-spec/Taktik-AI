let toniAktiv = false;
let funinoModus = false;

const canvas = document.getElementById("tacticBoard");
const ctx = canvas.getContext("2d");

const teamA = [];
const teamB = [];

// ----------------- SPIELFELD & SPIELER -----------------

function initTeams() {
  teamA.length = 0;
  teamB.length = 0;

  if (funinoModus) {
    // 3-gegen-3 Funino, kompakter
    teamA.push(
      { x: 0.2, y: 0.3, role: "ST" },
      { x: 0.2, y: 0.5, role: "ZM" },
      { x: 0.2, y: 0.7, role: "ST" }
    );

    teamB.push(
      { x: 0.8, y: 0.3, role: "ST" },
      { x: 0.8, y: 0.5, role: "ZM" },
      { x: 0.8, y: 0.7, role: "ST" }
    );
  } else {
    // 11er-Taktik
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

  // Hintergrund
  ctx.fillStyle = "#0b5f1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Außenlinien
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  // Mittellinie
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 10);
  ctx.lineTo(canvas.width / 2, canvas.height - 10);
  ctx.stroke();

  // Mittelkreis
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, Math.PI * 2);
  ctx.stroke();

  // Tore
  ctx.fillStyle = "#cccccc";
  ctx.fillRect(0, canvas.height / 2 - 40, 10, 80);                 // links
  ctx.fillRect(canvas.width - 10, canvas.height / 2 - 40, 10, 80); // rechts
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

// ----------------- SPRECHEN & ANTWORTEN -----------------

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function toniAntwort(frage) {
  const q = frage.toLowerCase().trim();

  if (!toniAktiv) {
    return "Bitte aktiviere mich zuerst über den Button 'KI aktivieren'. Dann bin ich bereit für deine Fragen.";
  }

  if (!q) {
    return "Stell mir eine konkrete Frage, zum Beispiel: 'Wie verschiebt sich die Viererkette, wenn der Ball rechts ist?'";
  }

  if (q.includes("viererkette") && (q.includes("rechts") || q.includes("ballseite"))) {
    return "Wenn der Ball auf unserer rechten Seite ist, schiebt die gesamte Viererkette geschlossen nach rechts. Der rechte Außenverteidiger rückt aktiv raus, die beiden Innenverteidiger sichern im Zentrum ab, der linke Außenverteidiger schiebt ein und sichert die Restverteidigung.";
  }

  if (q.includes("viererkette") && q.includes("links")) {
    return "Kommt der Gegner über unsere linke Seite, schiebt die Viererkette nach links. Der linke Außenverteidiger attackiert den Ballführer, der ballnahe Innenverteidiger sichert dahinter, die anderen beiden schieben mit, um die Tiefe zu kontrollieren.";
  }

  if (q.includes("pressing") || q.includes("anlaufen")) {
    return "Im Pressing wollen wir klare Auslöser: Schlechter erster Kontakt, Rückpass zum Innenverteidiger oder zum Torwart. Dann läuft der Stürmer im Bogen an, lenkt das Spiel nach außen, Achter und Flügelspieler schieben aggressiv nach, die Kette steht hoch und kompakt.";
  }

  if (q.includes("funino")) {
    return "Im Funino geht es um viele Ballaktionen, Überzahl am Ball und ständiges Umschalten. Nutze die Mini-Tore, um die Kinder zu motivieren, mutig nach vorne zu spielen und immer wieder neue Lösungen zu finden.";
  }

  if (q.includes("björn")) {
    return "Björn bringt Regionalliga-Erfahrung, BVB-Zertifizierung und internationale Eindrücke aus Ghana und Brasilien mit. Meine Antworten orientieren sich an dieser Mischung aus Struktur, Kreativität und Spielfreude.";
  }

  if (q.includes("stürmer") || q.includes("offensive")) {
    return "Unsere Stürmer arbeiten nicht nur in der Box, sondern auch in den Halbräumen. Einer lässt sich fallen, um anspielbar zu sein, der andere startet in die Tiefe. Wichtig ist, dass sie immer wieder die letzte Linie testen und die Kette des Gegners binden.";
  }

  return "Gute Frage. Dafür habe ich noch keine feste Taktikantwort hinterlegt. Formuliere sie gern noch einmal etwas genauer – zum Beispiel mit Bezug auf Formation, Ballseite oder Spielphase.";
}

// ----------------- DOM & EVENTS -----------------

const answerDiv = document.getElementById("answer");
const questionInput = document.getElementById("question");
const activateBtn = document.getElementById("activateBtn");
const funinoBtn = document.getElementById("funinoBtn");
const askBtn = document.getElementById("askBtn");

activateBtn.addEventListener("click", () => {
  toniAktiv = true;
  const text = "Hallo Trainer! Ich bin Toni, dein KI-Co-Trainer. Stell mir deine erste Frage – gern zur Viererkette, Pressing oder Funino.";
  answerDiv.textContent = text;
  speak(text);
});

funinoBtn.addEventListener("click", () => {
  funinoModus = !funinoModus;
  funinoBtn.textContent = funinoModus ? "Funino aus" : "Funino-Modus";
  initTeams();
  updateBoard();
  const text = funinoModus
    ? "Funino-Modus aktiviert: 3-gegen-3, viele Ballkontakte, viele Abschlüsse. Perfekt für Kinder."
    : "Zurück im 11er-Modus. Jetzt können wir wieder in klassischen Ketten und Zonen denken.";
  answerDiv.textContent = text;
  speak(text);
});

askBtn.addEventListener("click", () => {
  const frage = questionInput.value;
  const antwort = toniAntwort(frage);
  answerDiv.textContent = antwort;
  speak(antwort);
});

questionInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    askBtn.click();
  }
});

// ----------------- INITIALISIERUNG -----------------

window.addEventListener("load", () => {
  initTeams();
  updateBoard();
  answerDiv.textContent = "Hey, ich bin Toni. Aktiviere mich oben über 'KI aktivieren' und stell mir dann deine erste Frage.";
});
