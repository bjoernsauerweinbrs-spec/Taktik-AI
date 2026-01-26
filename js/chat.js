/* --- TONI'S BRAIN & VOICE --- */
let GROQ_KEY = "DEIN_GROQ_KEY_HIER"; 
let isLocked = false;
let toniVoice = null;

/* --- DER ELITE-TAKTIK PROMPT (Klopp-Nagelsmann-Mix) --- */
const TONI_PERSONA = `
Identität: Toni, dein Taktik-Experte.
Profil: Eine Mischung aus der emotionalen Intelligenz und dem Pressing-Fokus von Jürgen Klopp sowie der tiefen taktischen Analyse und Raumaufteilung von Julian Nagelsmann.
Sprachstil: 
- Analytisch ("Zwischenraum-Besetzung", "Asymmetrie", "Umschaltmomente").
- Motivierend ("Vollgas-Fußball", "Mentalitäts-Monster").
- Direkt: Er nennt dich 'Coach Björn'.
Smalltalk-Regel: Humorvoll, aber fachmännisch. Bei Wetter/Politik zieht er sofort den Vergleich zum Platz (z.B. 'Regen ist Pressing-Wetter, da rutscht der Gegner mehr!').
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
  // Suche eine markante deutsche Stimme
  toniVoice = voices.find(v => v.lang.startsWith('de') && !v.name.toLowerCase().includes('female')) || voices[0];
}

function speakStyled(text) {
  if (!text) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  if (toniVoice) utterance.voice = toniVoice;
  utterance.lang = 'de-DE';
  utterance.pitch = 0.85; 
  utterance.rate = 1.0; 
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

/* --- INTERAKTION MIT TONI (Spezialisierte Simulation) --- */
async function askToni() {
  if (isLocked) return;
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  if (!text) return;

  addMsg('user', text);
  input.value = '';
  isLocked = true;

  setTimeout(() => {
    let answer = "";
    const t = text.toLowerCase();

    // Tonis neuer Klopp-Nagelsmann-Filter
    if (t.includes('wetter') || t.includes('regen')) {
      answer = "Wetter? Coach Björn, das ist absolutes Pressing-Wetter! Der Ball wird schnell, die Abstände müssen kompakt sein. Wir brauchen heute Mentalitäts-Monster auf dem Platz, keine Schönwetter-Fußballer!";
    } else if (t.includes('politik') || t.includes('nachrichten')) {
      answer = "Coach, ganz ehrlich: Die einzige Wahl, die mich interessiert, ist die zwischen Dreier- und Viererkette. Wir fokussieren uns auf die Zwischenraum-Besetzung. Was ist unser Plan für das Gegenpressing?";
    } else if (t.includes('hallo') || t.includes('wie geht')) {
      answer = "Voller Energie, Coach Björn! Ich habe die Daten analysiert. Sollen wir das Feld mit extremer Dynamik kurz machen oder suchen wir die spielerische Lösung in den Halbräumen?";
    } else {
      answer = "Analytisch gesehen ist das ein spannender Ansatz. Wenn wir die Asymmetrie in der Hintermannschaft nutzen, generieren wir Überzahl in Ballnähe. Sollen wir die Laufwege so fixieren?";
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
    const welcome = "System aktiv. Coach Björn, die Taktik-Analyse ist bereit. Gehen wir in die Vollen!";
    addMsg('toni', welcome);
    speakStyled(welcome);
  } else {
    alert("Zugriff verweigert.");
  }
}

function welcomeFlow() {
  const msg = "Bereit für Heavy-Metal-Fußball mit chirurgischer Präzision? Sagen Sie mir, wo wir den Gegner packen, Coach Björn.";
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
