// Chat, TTS und KI-Integration (robust)
let outputContainer = null;
document.addEventListener('DOMContentLoaded', () => {
  outputContainer = document.getElementById('toni-output');
  const okBtn = document.getElementById('ok-btn');
  const input = document.getElementById('toni-input');
  okBtn && okBtn.addEventListener('click', () => {
    const text = input.value && input.value.trim();
    if (!text) return;
    addMsg('user', text);
    getToniResponse(text);
    input.value = '';
  });
});

// UI helper
function addMsg(who, text){
  if (!outputContainer) return;
  const div = document.createElement('div');
  div.className = who === 'user' ? 'user-msg' : 'toni-msg';
  div.style.cssText = 'padding:8px;margin-bottom:8px;border-radius:6px;background:rgba(255,255,255,0.02)';
  div.innerHTML = `<strong>${who === 'user' ? 'Du' : 'Toni'}:</strong> ${escapeHtml(text)}`;
  outputContainer.prepend(div);
}

// TTS helper and status
let voices = [];
function loadVoicesOnce(){
  voices = window.speechSynthesis?.getVoices() || [];
  if (!voices.length) {
    const onChange = () => { voices = window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = null; };
    window.speechSynthesis.onvoiceschanged = onChange;
  }
}
if ('speechSynthesis' in window) loadVoicesOnce();

function toniSpeak(message){
  addMsg('toni', message);
  if (!('speechSynthesis' in window)) return;
  try {
    if (window.speechSynthesis.speaking && window.speechSynthesis.pending) window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(message);
    utter.lang = 'de-DE';
    utter.pitch = 0.85;
    utter.rate = 1.0;
    const male = (voices || []).find(v => /Stefan|Google Deutsch|Male|Microsoft/i.test(v.name));
    if (male) utter.voice = male;
    window.speechSynthesis.speak(utter);
  } catch (e) { console.warn('TTS error', e); }
}

// Fetch helper with timeout
async function fetchWithTimeout(url, opts={}, timeout=12000){
  const controller = new AbortController();
  const id = setTimeout(()=>controller.abort(), timeout);
  try {
    const res = await fetch(url, {...opts, signal: controller.signal});
    clearTimeout(id);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } finally { clearTimeout(id); }
}

// Main integration
async function getToniResponse(userInput){
  const apiKey = Storage.loadSession('groq_api_key');
  if (!apiKey) { toniSpeak('Björn, ich brauche den API-Key, um taktisch analysieren zu können.'); return; }
  const style = localStorage.getItem('toni_type') || 'Profi';
  try {
    const payload = {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: `Du bist Toni, ein hochintelligenter Fußballfachmann. Stil: ${style}. Antworte mit möglichen MOVE/LINE Befehlen in eckigen Klammern.` },
        { role: "user", content: userInput }
      ]
    };
    const data = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
      method:'POST',
      headers:{ "Authorization": `Bearer ${apiKey}`, "Content-Type":"application/json" },
      body: JSON.stringify(payload)
    }, 12000);

    const aiMessage = data?.choices?.[0]?.message?.content;
    if (!aiMessage) { toniSpeak('Ich habe keine verwertbare Antwort erhalten.'); return; }

    // Execute commands but keep Trainer-First: push pending moves to UI
    const pending = parseCommands(aiMessage);
    if (pending.length) {
      // Zeige pending im Chat und warte auf Bestätigung
      addMsg('toni', `Vorschläge (${pending.length}) bereit. Bestätige Ausführung mit "OK moves".`);
      // Speichere pending global für Bestätigung
      window._toni_pending = pending;
      // Update status
      setToniStatus('active');
    }

    // Speak cleaned text
    const clean = aiMessage.replace(/\[MOVE:[^\]]*\]|\[LINE:[^\]]*\]/gi, '').trim();
    if (clean) toniSpeak(clean);

  } catch (err) {
    console.error('Chat Fehler', err);
    toniSpeak('Entschuldigung, die Verbindung zum Analyse-Service ist fehlgeschlagen.');
    setToniStatus('standby');
  }
}

// Parser für MOVE und LINE
function parseCommands(text){
  const moves = [];
  if (!text) return moves;
  const moveRegex = /\[MOVE:\s*([^\],]+?)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*\]/gi;
  let m;
  while ((m = moveRegex.exec(text)) !== null) {
    const id = m[1].trim();
    let x = Number(m[2]), y = Number(m[3]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    x = Math.max(0, Math.min(100, x)); y = Math.max(0, Math.min(100, y));
    moves.push({ type:'move', id, x, y });
    if (moves.length >= 20) break;
  }
  const lineRegex = /\[LINE:\s*([^\-\],]+?)->([^\],]+?)\s*(?:,\s*(solid|dashed))?\s*\]/gi;
  while ((m = lineRegex.exec(text)) !== null) {
    const from = m[1].trim(), to = m[2].trim(), style = (m[3]||'solid').trim();
    moves.push({ type:'line', from, to, style });
    if (moves.length >= 20) break;
  }
  return moves;
}

// Confirm pending moves execution via special input
document.addEventListener('click', (e) => {
  const target = e.target;
  if (target && target.id === 'btn-preview') {
    const pending = window._toni_pending || [];
    if (!pending.length) { toniSpeak('Keine ausstehenden Vorschläge.'); return; }
    // Show preview: draw lines and highlight moves but do not persist
    clearTacticalLines();
    pending.forEach(cmd => {
      if (cmd.type === 'move') {
        const player = window.AppLogic.getPlayerByIdentifier(cmd.id);
        if (player) drawTacticalLine(player.x, player.y, cmd.x, cmd.y, false);
      } else if (cmd.type === 'line') {
        const from = window.AppLogic.getPlayerByIdentifier(cmd.from);
        const to = window.AppLogic.getPlayerByIdentifier(cmd.to);
        if (from && to) drawTacticalLine(from.x, from.y, to.x, to.y, cmd.style === 'dashed');
      }
    });
    toniSpeak(`Vorschau gezeichnet (${pending.length}). Bestätige mit OK moves.`);
  }
});

// Execute pending moves when user types "OK moves"
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const input = document.getElementById('toni-input');
    if (!input) return;
    const val = input.value && input.value.trim().toLowerCase();
    if (val === 'ok moves' && Array.isArray(window._toni_pending)) {
      window._toni_pending.forEach(cmd => {
        if (cmd.type === 'move') movePlayerOnBoard(cmd.id, cmd.x, cmd.y);
        if (cmd.type === 'line') {
          const from = window.AppLogic.getPlayerByIdentifier(cmd.from);
          const to = window.AppLogic.getPlayerByIdentifier(cmd.to);
          if (from && to) drawTacticalLine(from.x, from.y, to.x, to.y, cmd.style === 'dashed');
        }
      });
      toniSpeak('Vorschläge ausgeführt.');
      window._toni_pending = [];
      clearTacticalLines();
    }
  }
});

// Status helper (expects setToniStatus in global scope)
function setToniStatus(status){
  const led = document.getElementById('status-led');
  const text = document.getElementById('status-text');
  if (!led || !text) return;
  if (status === 'active') { led.style.background = '#4caf50'; text.innerText = 'Toni ist bereit (Zugegriffen)'; }
  else if (status === 'connecting') { led.style.background = '#ffb300'; text.innerText = 'Toni verbindet...'; }
  else { led.style.background = '#f44336'; text.innerText = 'Verbindung unterbrochen'; }
}
