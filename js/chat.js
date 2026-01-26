/* --- TONI'S BRAIN & VOICE --- */
let GROQ_KEY = "DEIN_GROQ_KEY_HIER"; // Hier kommt später dein Key rein
let isLocked = false;
let toniVoice = null;

/* --- DER SPEZIALISIERTE TONI-PROMPT (Dienstanweisung) --- */
const TONI_PERSONA = `
Identität: Toni, Elite-Coach.
Mix: Brasilianische Technik (Finesse), Ghanaische Lockerheit (Humor/Spirit), Deutsche Durchsetzungskraft (Taktik).
Auftrag: Du bist der Fachmann für Coach Björn.
Smalltalk-Regel: Ein Funken Humor ist Pflicht! Wenn Björn nach Wetter/Politik fragt, antworte sportlich-charmant und lenke sofort zurück auf Fußball.
Beispiel: 'Coach, solange es keine Caipirinhas regnet, zählt nur die Standfestigkeit in der Abwehr!'
`;

/* --- CHAT-SYSTEM --- */
function addMsg(role, txt) {
  const history = document.getElementById('chat-history');
  if (!history) return;
  
  const div = document.createElement('div');
  div.className = `msg ${role === 'toni' ? 'toni' : 'user'}`;
  div.innerText = txt;
  
  history.appendChild(div);
  history.scrollTop = history.scrollHeight;
}

/* --- SPRACHAUSGABE (TTS) --- */
function setupVoice() {
  const voices = speechSynthesis.getVoices();
  toniVoice = voices.find(v => v.lang.startsWith('de') && !v.name.toLowerCase().includes('female')) || voices[0];
}

function speakStyled(text) {
  if (!text) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  if (toniVoice) utterance.voice = toniVoice;
  utterance.lang = 'de-DE';
  utterance.pitch = 0.85;
  utterance.rate = 0.95;
  speechSynthesis.speak(utterance);
}

/* --- MIKROFON (STT) --- */
function startMic() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    alert("Spracherkennung wird nicht unterstützt.");
    return;
  }
  const rec = new SpeechRec();
  rec.lang = 'de-DE';
  rec.onresult = (e) => {
    document.getElementById('user-input').value = e.results[0][0].transcript;
    askToni();
  };
  rec.start();
}

/* --- INTERAKTION MIT TONI --- */
async function askToni() {
  if (isLocked) return;
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  if (!text) return;

  addMsg('user', text);
  input.value = '';
  isLocked = true;

  // HINWEIS: Sobald wir den API-Key nutzen, wird dieser Teil durch einen 
  // echten Fetch-Aufruf an Groq ersetzt.
  setTimeout(() => {
    let answer = "";
    const t = text.toLowerCase();

    // Tonis Charakter-Filter
    if (t.includes('wetter') || t.includes('regen')) {
      answer = "Wetterbericht? Coach Björn, in Ghana sagen wir: 'Das Spiel wird auf dem Platz gewonnen, nicht in den Wolken!' Bei Regen flutscht der Ball besser – ideal für unsere brasilianische Technik. Wie steht die Abwehr?";
    } else if (t.includes('politik') || t.includes('nachrichten')) {
      answer = "Politik überlasse ich den Leuten im Rathaus. Meine einzige Ideologie ist die Dreierkette! Bleiben wir beim Wesentlichen: Wer ist heute unser Spielmacher?";
    } else if (t.includes('hallo') || t.includes('wie geht')) {
      answer = "Mit der Lockerheit von Accra und der Präzision von München! Ich bin bereit, Coach Björn. Lassen wir die Brasilianer tanzen oder bauen wir die deutsche Mauer auf?";
    } else {
      answer = "Interessanter Punkt, Coach. Taktisch gesehen gibt uns das neue Optionen. Soll ich die Laufwege der blauen Spieler entsprechend anpassen?";
    }

    addMsg('toni', answer);
    speakStyled(answer);
    isLocked = false;
  }, 1000);
}

/* --- SYSTEM INITIALISIEREN --- */
function startToni() {
  const pw = document.getElementById('password').value;
  if (pw === 'Trainer2026') {
    document.getElementById('login-overlay').style.display = 'none';
    setupVoice();
    if (typeof resetBoard === 'function') resetBoard();
    const welcome = "Toni initialisiert. Ich bin bereit, Coach Björn.";
    addMsg('toni', welcome);
    speakStyled(welcome);
  } else {
    alert("Zugriff verweigert.");
  }
}

function welcomeFlow() {
  const msg = "Guten Tag, Coach Björn. Die brasilianische Spielfreude ist geweckt. Sollen wir die Taktik prüfen?";
  addMsg('toni', msg);
  speakStyled(msg);
}

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = setupVoice;
}

window.startToni = startToni;
window.askToni = askToni;
window.addMsg = addMsg;
window.startMic = startMic;
window.welcomeFlow = welcomeFlow;
