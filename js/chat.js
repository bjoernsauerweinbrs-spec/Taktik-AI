/* --- TONI'S BRAIN & VOICE --- */
let GROQ_KEY = "DEIN_GROQ_KEY_HIER"; 
let isLocked = false;
let toniVoice = null;

const TONI_PERSONA = `
Identität: Toni, Elite-Taktik-Experte.
Profil: Mischung aus Jürgen Klopp (Emotion/Pressing) und Julian Nagelsmann (Analyse/Räume).
Hintergrund: Brasilianische Technik, ghanaische Lockerheit, deutsche Durchsetzungskraft.
Sprachstil: Analytisch ("Asymmetrie", "Halbräume"), motivierend ("Mentalitäts-Monster"), direkt ("Coach Björn").
Regel: Bei fachfremden Fragen (Wetter/Politik) humorvoll zum Fußball zurücklenken.
`;

/* --- API-VERBINDUNG ZU GROQ --- */
async function fetchToni(userText) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: TONI_PERSONA },
          { role: "user", content: userText }
        ],
        temperature: 0.7
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error("Groq Error:", err);
    return "Coach, die Leitung ins Rechenzentrum ist gerade so lückenhaft wie eine schlechte Viererkette. Versuchen wir es gleich nochmal!";
  }
}

/* --- INTERAKTION --- */
async function askToni() {
  if (isLocked) return;
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  if (!text) return;

  addMsg('user', text);
  input.value = '';
  isLocked = true;

  const answer = await fetchToni(text);
  addMsg('toni', answer);
  speakStyled(answer);
  isLocked = false;
}

/* --- SPEZIAL-ANALYSEN --- */
async function askToniTaktik() {
  const msg = "Toni, kompletter Taktik-Check: Wie bewertest du unsere aktuelle Raumaufteilung und die Besetzung der Halbräume?";
  addMsg('user', msg);
  isLocked = true;
  const answer = await fetchToni(msg);
  addMsg('toni', answer);
  speakStyled(answer);
  isLocked = false;
}

async function askToniPressing() {
  const msg = "Toni, Pressing-Check: Haben wir die nötige Intensität für echtes Gegenpressing? Sind wir Mentalitäts-Monster?";
  addMsg('user', msg);
  isLocked = true;
  const answer = await fetchToni(msg);
  addMsg('toni', answer);
  speakStyled(answer);
  isLocked = false;
}

/* --- BASICS (STIMME & LOGIN) --- */
function addMsg(role, txt) {
  const history = document.getElementById('chat-history');
  if (!history) return;
  const div = document.createElement('div');
  div.className = `msg ${role === 'toni' ? 'toni' : 'user'}`;
  div.innerText = txt;
  history.appendChild(div);
  history.scrollTop = history.scrollHeight;
}

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
  utterance.rate = 1.0;
  speechSynthesis.speak(utterance);
}

function startMic() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) return;
  const rec = new SpeechRec();
  rec.lang = 'de-DE';
  rec.onresult = (e) => {
    document.getElementById('user-input').value = e.results[0][0].transcript;
    askToni();
  };
  rec.start();
}

function startToni() {
  const pw = document.getElementById('password').value;
  if (pw === 'Trainer2026') {
    document.getElementById('login-overlay').style.display = 'none';
    setupVoice();
    if (typeof resetBoard === 'function') resetBoard();
    addMsg('toni', "System online. Coach Björn, wir gehen in die Vollen!");
    speakStyled("System online. Coach Björn, wir gehen in die Vollen!");
  }
}

function welcomeFlow() {
  const msg = "Bereit für Heavy-Metal-Fußball? Lassen wir die Daten tanzen, Coach Björn.";
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
window.askToniTaktik = askToniTaktik;
window.askToniPressing = askToniPressing;
