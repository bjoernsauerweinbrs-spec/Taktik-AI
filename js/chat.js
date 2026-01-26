/**
 * Toni 2.0 - KI Chat Engine
 * Koordiniert Taktik-Analyse und Co-Trainer-Feedback
 */

async function handleToniAction() {
    const inputField = document.getElementById('user-msg');
    const text = inputField.value.trim();
    if (!text) return;

    // 1. User Nachricht im Chat anzeigen
    appendChatMessage('user', text);
    inputField.value = '';

    const trainerName = sessionStorage.getItem('toni_name') || 'Björn';
    const apiKey = sessionStorage.getItem('toni_key');

    // Toni zeigt Aktivität
    const history = document.getElementById('chat-history');
    const thinking = document.createElement('div');
    thinking.className = 'msg toni';
    thinking.innerText = "Toni analysiert...";
    history.appendChild(thinking);

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
                    {
                        role: "system",
                        content: `Du bist Toni, der Co-Trainer von ${trainerName}. 
                        Dein Stil: Brasilianischer Ginga, fachlich hochqualifiziert, präzise und motivierend.
                        Deine Aufgabe: Erkläre Taktiken, Trainingseinheiten und Spielzüge.
                        WICHTIG: Begrüße kurz als Co-Trainer, wenn man 'Hallo' sagt. 
                        Wenn du Bewegungen vorschlägst, nutze fachliche Begriffe wie 'Verschieben', 'Halbräume' oder 'Kompaktheit'.`
                    },
                    { role: "user", content: text }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const toniText = data.choices[0].message.content;

        // "Denken" entfernen und echte Antwort anzeigen
        thinking.remove();
        appendChatMessage('toni', toniText);
        
        // Sprachausgabe (Männliche Stimme)
        const speech = new SpeechSynthesisUtterance(toniText);
        speech.lang = 'de-DE';
        speech.pitch = 0.9;
        window.speechSynthesis.speak(speech);

    } catch (error) {
        thinking.innerText = "Oje Chef, da ist ein Fehler in der Leitung...";
        console.error("Groq Error:", error);
    }
}

function appendChatMessage(role, text) {
    const history = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    div.style.marginBottom = "15px";
    div.style.padding = "12px";
    div.style.borderRadius = "10px";
    div.style.background = role === 'toni' ? "#1c2128" : "#238636";
    div.style.borderLeft = role === 'toni' ? "4px solid #2ecc71" : "none";
    div.innerText = text;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
}

// Initialer Gruß beim Start
document.addEventListener('DOMContentLoaded', () => {
    const trainer = sessionStorage.getItem('toni_name') || 'Björn';
    setTimeout(() => {
        appendChatMessage('toni', `Hallo Chef! Co-Trainer Toni meldet sich zum Dienst. Das 3-4-3 steht bereit. Was gehen wir heute an, ${trainer}?`);
    }, 1000);
});
