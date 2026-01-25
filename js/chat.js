/* --- TONI'S BRAIN & VOICE --- */
let GROQ_KEY = "";
let isLocked = false;
let toniVoice = null;

/* --- CHAT-SYSTEM (Die Korrektur) --- */
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
  // Suche bevorzugt nach einer deutschen männlichen Stimme für Toni
  toniVoice = voices.find(v => v.lang.startsWith('de') && !v.name.toLowerCase().includes('female')) || voices[0];
}

function speakStyled(text) {
  if (!text) return;
  speechSynthesis.cancel(); // Vorherige Sätze abbrechen
  const utterance = new SpeechSynthesisUtterance(text);
  if (toniVoice) utterance.voice = toniVoice;
  utterance.lang = 'de-DE';
  utterance.pitch = 0.85;
  utterance.rate = 0.95;
  speechSynthesis.speak(utterance);
}

function selectVoice(name) {
  const voices = speechSynthesis.getVoices();
  const found = voices.find(v => v.name === name);
  if (found) toniVoice = found;
}

/* --- MIKROFON (STT) --- */
function startMic() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    alert("Spracherkennung wird von diesem Browser nicht unterstützt.");
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

  // Hier simulieren wir die Antwort, falls kein Backend/Key da ist
  // Später binden wir hier deine Groq-Schnittstelle wieder voll ein
  setTimeout(() => {
    let answer = "Verstanden, Coach. Ich analysiere die Positionen und bereite die nächste Übung vor.";
    
    // Einfache Logik-Beispiele
    if(text.toLowerCase().includes('hallo')) answer = "Guten Tag, Coach Björn. Bereit für die taktische Einheit?";
    
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
    addMsg('toni', "Toni initialisiert. Ich bin bereit, Coach.");
    speakStyled("Toni initialisiert. Ich bin bereit.");
  } else {
    alert("Zugriff verweigert.");
  }
}

function welcomeFlow() {
  const msg = "Guten Tag, Coach Björn. Ich habe das Training für heute vorbereitet. Sollen wir die Grundordnung prüfen?";
  addMsg('toni', msg);
  speakStyled(msg);
}

// Damit der Browser die Stimmen lädt
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = setupVoice;
}

window.startToni = startToni;
window.askToni = askToni;
window.addMsg = addMsg;
