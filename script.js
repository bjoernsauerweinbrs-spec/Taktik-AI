// ===============================
// Toni – KI-Co-Trainer Grundlogik
// ===============================

let toniHasIntroduced = false;

function toniIntro() {
  if (toniHasIntroduced) return null;
  toniHasIntroduced = true;
  return "Hey, ich bin Toni – der KI-Co-Trainer von Björn. Ich zeige dir, wie wir trainieren, basierend auf den Erfahrungen, die Björn unter anderem in Ghana, Brasilien und natürlich in Deutschland gesammelt hat. Wenn du bereit bist, stell mir einfach deine erste Frage.";
}

const bjornAnswers = [
  "Björn ist der Trainer, mit dem ich zusammenarbeite. Er hat Ende der Neunziger und Anfang der Zweitausender in der Regionalliga bei Borussia Fulda gespielt, später beim SC Neukirchen, Roland Rodenkirchen, dem VfL Eiterfeld, TSV Hilders und dem ESV Ronshausen. Er hat sogar seine eigene Fußballschule für Kinder und Jugendliche aufgebaut. 2006 wurde er von Edwin Burkamp von Borussia Dortmund zertifiziert – unterschrieben von Dr. Rainer Rauball und Michael Zorc. Sportlich geprägt wurde er unter anderem von Reinhold Wosab, Lutz Pfannenstiel, Udo Bös und Moppes Petz. Und er hat in prominenten Auswahlmannschaften gespielt, zum Beispiel für die Aktion Herzenssache des Innenministeriums Rheinland-Pfalz. Auf dieser Basis erkläre ich dir unser Training.",
  "Björn ist ein ehemaliger Regionalligaspieler von Borussia Fulda, später aktiv bei mehreren Vereinen in Hessen. Er hatte eine eigene Fußballschule, wurde 2006 von Borussia Dortmund zertifiziert und hat in prominenten Auswahlteams gespielt. Seine Erfahrung aus Deutschland, Ghana und Brasilien bildet die Grundlage für unser Training.",
  "Björn verfügt über eine breite sportliche Laufbahn: Regionalliga bei Borussia Fulda, Stationen beim SC Neukirchen, Roland Rodenkirchen, VfL Eiterfeld, TSV Hilders und ESV Ronshausen. Er leitete eine eigene Fußballschule und wurde 2006 von Edwin Burkamp (Borussia Dortmund) zertifiziert, mit Unterschriften von Dr. Rainer Rauball und Michael Zorc. Zusätzlich spielte er in prominenten Auswahlmannschaften wie der Herzenssache-Auswahl des Innenministeriums Rheinland-Pfalz. Seine Entwicklung wurde unter anderem von Reinhold Wosab, Lutz Pfannenstiel, Udo Bös und Moppes Petz begleitet.",
  "Björn ist jemand, der den Fußball wirklich gelebt hat: Regionalliga bei Borussia Fulda, viele Stationen im hessischen Fußball, eine eigene Fußballschule und eine Zertifizierung von Borussia Dortmund im Jahr 2006. Er durfte mit prominenten Spielern und Trainern arbeiten und in Auswahlteams für soziale Projekte spielen. Seine Erfahrungen aus Deutschland, Ghana und Brasilien machen ihn zu einem Trainer, der nicht nur Technik vermittelt, sondern auch Herz, Kultur und Leidenschaft.",
  "Björn? Das ist mein Chef. Regionalliga-Erfahrung, zig Vereine durchlaufen, eigene Fußballschule gehabt, 2006 von Borussia Dortmund zertifiziert – sogar mit Unterschrift von Rauball und Zorc. Er hat in prominenten Auswahlteams gespielt und von Leuten wie Reinhold Wosab, Lutz Pfannenstiel, Udo Bös oder Moppes Petz richtig was mitgenommen. Auf seinen Erfahrungen baue ich meine ganzen Erklärungen auf.",
  "Björn ist der Typ, der Regionalliga gespielt hat, eine eigene Fußballschule hatte, von Dortmund zertifiziert wurde und in Auswahlteams gekickt hat. Ich bin nur die KI – er ist der, der’s wirklich erlebt hat.",
  "Björn ist ein Trainer mit echter Profi-Erfahrung: Regionalliga, mehrere Vereine, eigene Fußballschule, BVB-Zertifizierung 2006, prominente Auswahlmannschaften und Einflüsse von ehemaligen Bundesliga- und Nationalspielern wie Reinhold Wosab, Lutz Pfannenstiel, Udo Bös und Moppes Petz. Sein Wissen ist die Grundlage meiner taktischen und technischen Erklärungen."
];

function toniWerIstBjoern() {
  const idx = Math.floor(Math.random() * bjornAnswers.length);
  return bjornAnswers[idx];
}

// ===============================
// Taktik-Board – Setup
// ===============================

const canvas = document.getElementById("tacticBoard");
const ctx = canvas.getContext("2d");

const field = {
  width: canvas.width,
  height: canvas.height,
  ourPerspective: true
};

// Team A: unser Team – 4-4-2
const teamA = {
  formation: "4-4-2",
  color: "#00a000",
  players: [
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
  ]
};

// Team B: Gegner – 4-3-3
const teamB = {
  formation: "4-3-3",
  color: "#d00000",
  players: [
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
  ]
};

let ballSide = "left";   // "left" | "right" | "center"
let phase = "defense";   // "defense" | "offense"

// ===============================
// Zeichnen
// ===============================

function drawField() {
  ctx.clearRect(0, 0, field.width, field.height);

  ctx.fillStyle = "#0b5f1a";
  ctx.fillRect(0, 0, field.width, field.height);

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;

  ctx.strokeRect(10, 10, field.width - 20, field.height - 20);

  ctx.beginPath();
  ctx.moveTo(field.width / 2, 10);
  ctx.lineTo(field.width / 2, field.height - 10);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(field.width / 2, field.height / 2, 60, 0, Math.PI * 2);
  ctx.stroke();
}

function drawPlayer(player, color) {
  const x = 10 + player.x * (field.width - 20);
  const y = 10 + player.y * (field.height - 20);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "10px Arial";
  ctx.textAlign = "center";
  ctx.fillText(player.role, x, y - 15);
}

function drawTeams() {
  teamA.players.forEach(p => drawPlayer(p, teamA.color));
  teamB.players.forEach(p => drawPlayer(p, teamB.color));
}

function updateTacticBoard() {
  drawField();
  drawTeams();
}

// ===============================
// Verschieben Viererkette – Defensiv
// ===============================

function shiftBackFour(team, side) {
  const backFour = team.players.slice(1, 5);

  backFour.forEach((p, index) => {
    let shift = 0;
    if (side === "left") shift = -0.05;
    if (side === "right") shift = 0.05;

    if (side === "left") {
      if (index === 0 || index === 1) p.y += shift * 1.2;
      else p.y += shift * 0.6;
    } else if (side === "right") {
      if (index === 2 || index === 3) p.y += shift * 1.2;
      else p.y += shift * 0.6;
    }

    if (p.y < 0.1) p.y = 0.1;
    if (p.y > 0.9) p.y = 0.9;
  });
}

// ===============================
// Offensivbewegungen – simpel
// ===============================

function moveOffense(team, side) {
  team.players.forEach(p => {
    if (["ST", "LA", "RA", "MS"].includes(p.role)) {
      p.x += 0.03;
      if (side === "left") p.y -= 0.02;
      if (side === "right") p.y += 0.02;

      if (p.x > 0.9) p.x = 0.9;
      if (p.y < 0.1) p.y = 0.1;
      if (p.y > 0.9) p.y = 0.9;
    }
  });
}

// ===============================
// Perspektive drehen
// ===============================

function togglePerspective() {
  field.ourPerspective = !field.ourPerspective;

  function flipTeam(team) {
    team.players.forEach(p => {
      p.x = 1 - p.x;
      p.y = 1 - p.y;
    });
  }

  flipTeam(teamA);
  flipTeam(teamB);
}

// ===============================
// Toni beantwortet Fragen
// ===============================

function toniAnswer(question) {
  const q = question.toLowerCase().trim();

  const intro = toniIntro();
  if (intro) return intro;

  if (q.includes("wer ist björn") || q.includes("wer ist bjoern")) {
    return toniWerIstBjoern();
  }

  if (q.includes("viererkette") && q.includes("defensiv")) {
    if (q.includes("links")) {
      ballSide = "left";
      phase = "defense";
      shiftBackFour(teamA, "left");
      updateTacticBoard();
      return "Wir sind im Defensivmodus. Der Gegner greift über unsere linke Seite an. Unsere Viererkette schiebt geschlossen nach links. Der ballnahe Außenverteidiger rückt raus, der Innenverteidiger sichert diagonal ab. Die ballfernen Spieler rücken ein, um das Zentrum zu schließen. Auf dem Board siehst du die Verschiebebewegung.";
    }
    if (q.includes("rechts")) {
      ballSide = "right";
      phase = "defense";
      shiftBackFour(teamA, "right");
      updateTacticBoard();
      return "Wir sind im Defensivmodus. Der Gegner greift über unsere rechte Seite an. Unsere Viererkette schiebt geschlossen nach rechts. Der ballnahe Außenverteidiger rückt raus, der Innenverteidiger sichert diagonal ab. Die ballfernen Spieler rücken ein, um das Zentrum dicht zu machen. Auf dem Board siehst du die Verschiebebewegung.";
    }
  }

  if (q.includes("offensive") || q.includes("angriff") || q.includes("stürmer") || q.includes("stuermer")) {
    phase = "offense";
    moveOffense(teamA, ballSide);
    updateTacticBoard();
    return "Wir sind jetzt in der Offensive. Unsere Stürmer und Flügelspieler rücken in Richtung gegnerisches Tor und orientieren sich zur Ballseite. Auf dem Board siehst du, wie sie in die Tiefe starten, Räume öffnen und Anspielstationen schaffen.";
  }

  if (q.includes("perspektive") || q.includes("drehen") || q.includes("sicht wechseln")) {
    togglePerspective();
    updateTacticBoard();
    return "Ich habe die Perspektive gedreht. Du siehst das Spielfeld jetzt aus der anderen Sicht.";
  }

  return "Ich habe deine Frage verstanden, aber sie passt noch nicht zu einer meiner vordefinierten Situationen. Frag mich z.B.: 'Wie verschiebt sich die Viererkette, wenn der Gegner links angreift?' oder 'Wie sollen sich unsere Stürmer in der Offensive bewegen?'.";
}

// ===============================
// UI-Verknüpfung
// ===============================

const questionInput = document.getElementById("question");
const askBtn = document.getElementById("askBtn");
const answerDiv = document.getElementById("answer");

askBtn.addEventListener("click", () => {
  const q = questionInput.value;
  if (!q.trim()) return;
  const a = toniAnswer(q);
  answerDiv.textContent = a;
});

questionInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    askBtn.click();
  }
});

// Initiales Zeichnen
updateTacticBoard();