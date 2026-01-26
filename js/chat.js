/**
 * Toni 2.0 - KI & Chat Engine
 * Steuert die Kommunikation mit der Groq Cloud
 */

const CHAT_HISTORY = document.getElementById('chat-history');
const CHAT_INPUT = document.getElementById('chat-input');

/**
 * Sendet die Nachricht an Toni (Groq API)
 */
async function handleChat() {
    const text = CHAT_INPUT.value.trim();
    if (!text) return;

    // User Nachricht anzeigen
    appendMessage('user', text);
    CHAT_INPUT.value = '';

    // Toni zeigt "Denken" an
    setToniStatus(true);

    const apiKey = sessionStorage.getItem('toni_key');
    const userType = sessionStorage.getItem('toni_type') || 'kinder';
    const userName = sessionStorage.getItem('toni_name') || 'Björn';

    // System Prompt für Toni (deine Identität)
    const systemPrompt = `
        Du bist Toni, ein absoluter Fußball-Fachmann mit brasilianischem Style (Ginga). 
        Deine Sprache ist motivierend, technisch versiert und taktisch klug. 
        Du arbeitest für den Trainer ${userName}. 
        Aktueller Fokus: ${userType}-Training.
        Du hast Zugriff auf das Board. Wenn der User fragt, wer da ist, nenne die Spieler, die 'present' sind.
        Aktueller Kader-Status: ${JSON.stringify(squad.filter(p => p.status === 'present'))}
    `;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: text }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const answer = data.choices[0].message.content;

        appendMessage('toni', answer);
        
        // Sprachausgabe (Toni hat eine männliche Stimme)
        toniSpeak(answer);

    } catch (error) {
        console.error("Toni Error:", error);
        appendMessage('toni', "Oje Björn, die Verbindung zum Scouting-Server klemmt...");
    } finally {
        setToniStatus(false);
    }
}

/**
 * Fügt Nachrichten zum UI hinzu
 */
function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    div.innerText = text;
    CHAT_HISTORY.appendChild(div);
    CHAT_HISTORY.scrollTop = CHAT_HISTORY.scrollHeight;
}

/**
 * Visuelles Feedback (Ampel oben rechts)
 */
function setToniStatus(isThinking) {
    const dot = document.getElementById('toni-status-dot');
    const text = document.getElementById('toni-status-text');
    if (isThinking) {
        dot.className = 'dot online';
        text.innerText = 'TONI ANALYSIERT...';
    } else {
        dot.className = 'dot';
        text.innerText = 'TONI BEREIT';
    }
}

/**
 * Tonis Stimme
 */
function toniSpeak(text) {
    if (!window.speechSynthesis) return;
    
    // Alle laufenden Ausgaben stoppen
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = sessionStorage.getItem('toni_lang') === 'de' ? 'de-DE' : 'pt-BR';
    
    // Versuche eine männliche Stimme zu finden
    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('Google Deutsch'));
    if (maleVoice) utterance.voice = maleVoice;

    utterance.pitch = 0.9; // Etwas tiefer für mehr Autorität
    utterance.rate = 1.0;
    
    window.speechSynthesis.speak(utterance);
}
