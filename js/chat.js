/**
 * Toni 2.0 - Elite AI Engine (Dialog & Voice)
 */

let recognition;
let isListening = false;
const coachName = sessionStorage.getItem('toni_coach_name') || "Trainer";

// Initialisierung beim Start
window.onload = () => {
    setTimeout(() => {
        const intro = `Servus Coach ${coachName}! Ich bin Toni. Ich brenne darauf, mit dir die Mannschaft aufs nächste Level zu heben. Wir machen hier kein 08/15-Training, wir entwickeln echte Fußballer. Bevor wir den Rasen betreten: Schau mal oben links in die Aktentasche 💼. Pflege dort deine Jungs ein – Name und Nummer reichen, aber mit Größe und Gewicht kann ich hexen! Sag mir Bescheid, wenn du bereit bist: Welche Altersklasse führen wir heute aufs Grün?`;
        appendChatMessage('toni', intro);
        speak(intro);
    }, 1000);
};

async function handleToniAction() {
    const inputField = document.getElementById('user-msg');
    const text = inputField.value.trim();
    if (!text) return;

    appendChatMessage('user', text);
    inputField.value = '';

    // KI-Anfrage an Groq
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('toni_key')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `Du bist Toni, ein Elite-Fußball-KI-Coach (Mix aus Jürgen Klopp und Julian Nagelsmann). 
                        Dein Partner ist Coach ${coachName}. Sei motivierend, fachlich brillant und direkt. 
                        Warte auf Infos zu Altersklasse, Spielfeld (Groß, Klein, Funino) und Tore-Setup. 
                        Analysiere erst, wenn der Trainer den Auftrag gibt. Reagiere auf BMI nur bei Nachfrage.`
                    },
                    { role: "user", content: text }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const answer = data.choices[0].message.content;
        appendChatMessage('toni', answer);
        speak(answer);

        // Prüfe ob Spielfeld-Befehle im Text sind (für späteres Board-Update)
        if(answer.toLowerCase().includes("großfeld")) {
            document.getElementById('setup-overlay').style.display = 'none';
            document.getElementById('pitch').style.display = 'block';
        }

    } catch (e) {
        appendChatMessage('toni', "Verbindung unterbrochen. Prüfe deinen Key, Coach!");
    }
}

// Sprachausgabe
function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    msg.pitch = 0.9;
    msg.rate = 1.0;
    window.speechSynthesis.speak(msg);
}

// Spracherkennung (Mikrofon)
function toggleVoice() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Spracherkennung wird von diesem Browser nicht unterstützt.");
        return;
    }

    if (!recognition) {
        recognition = new webkitSpeechRecognition();
        recognition.lang = 'de-DE';
        recognition.continuous = false;
        
        recognition.onstart = () => {
            isListening = true;
            document.getElementById('start-mic').classList.add('active');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('user-msg').value = transcript;
            handleToniAction();
        };

        recognition.onend = () => {
            isListening = false;
            document.getElementById('start-mic').classList.remove('active');
        };
    }

    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

function appendChatMessage(role, text) {
    const history = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.style = `padding: 15px; border-radius: 12px; margin-bottom: 10px; line-height: 1.4; font-size: 14px; 
        ${role === 'toni' ? 'background: #1c2128; border-left: 4px solid #2ecc71; color: #e6edf3;' : 'background: #238636; align-self: flex-end; color: white; margin-left: 40px;'}`;
    div.innerText = text;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
}
