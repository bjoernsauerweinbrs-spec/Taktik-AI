/**
 * Toni 2.0 - KI-Schnittstelle & Board-Kommando-Zentrale
 * Männerstimme, Board-Zugriff und Archiv-Funktion.
 */

const outputContainer = document.getElementById('toni-output');
const apiKey = sessionStorage.getItem('groq_api_key');

/**
 * Kernfunktion: Toni kommuniziert mit Groq und steuert das Board
 */
async function getToniResponse(userInput) {
    if (!apiKey) {
        toniSpeak("Björn, mein Freund, ohne den API-Key kann ich die Taktiktafel nicht bedienen.");
        return;
    }

    const thinkingId = "think-" + Date.now();
    const thinkingDiv = document.createElement('div');
    thinkingDiv.id = thinkingId;
    thinkingDiv.style = "font-size: 0.8em; color: #666; font-style: italic; margin-bottom: 10px;";
    thinkingDiv.innerText = "Toni analysiert die Räume...";
    outputContainer.prepend(thinkingDiv);

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `Du bist Toni, ein brasilianischer Fußball-Fachmann und Co-Trainer von Björn. 
                        Aktueller Modus: ${currentMode}. 
                        Deine Aufgabe: Erkläre Trainingseinheiten fachlich brillant und bewege die Spieler!
                        KOMMANDOS:
                        - Um Spieler zu bewegen, schreibe am Ende: [MOVE: Name, X, Y] (X/Y von 0-100).
                        - Um Bälle zu legen: [BALL: Anzahl].
                        - Um Hütchen zu setzen: [CONES: Anzahl].
                        - Gib am Ende jeder neuen Übung einen Button-Code aus: [SAVE_EXERCISE: Titel].
                        Sei motivierend, nutze 'Du' und klinge nach Ginga!`
                    },
                    { role: "user", content: userInput }
                ]
            })
        });

        const data = await response.json();
        let aiMessage = data.choices[0].message.content;

        // Befehle ausführen (Spieler schieben, Material legen)
        executeToniCommands(aiMessage);

        // UI-Bereinigung und Anzeige
        document.getElementById(thinkingId).remove();
        
        // Button für Aktentasche filtern
        const saveMatch = aiMessage.match(/\[SAVE_EXERCISE:\s*(.*?)\]/);
        const cleanMsg = aiMessage.replace(/\[.*?\]/g, "").trim();
        
        toniSpeak(cleanMsg);

        if (saveMatch) {
            const title = saveMatch[1];
            addSaveButton(title, cleanMsg);
        }

    } catch (error) {
        console.error("KI-Fehler:", error);
        document.getElementById(thinkingId).innerText = "Verbindung unterbrochen, Björn.";
    }
}

/**
 * Verarbeitet die [MOVE] und [BALL] Befehle
 */
function executeToniCommands(text) {
    // Spieler bewegen
    const moveRegex = /\[MOVE:\s*(.*?),\s*(\d+),\s*(\d+)\]/g;
    let m;
    while ((m = moveRegex.exec(text)) !== null) {
        movePlayerOnBoard(m[1].trim(), m[2], m[3]);
    }

    // Material
    if (text.includes("[BALL:")) {
        const b = text.match(/\[BALL:\s*(\d+)\]/);
        if (b && typeof distributeBalls === "function") distributeBalls(b[1]);
    }
    if (text.includes("[CONES:")) {
        const c = text.match(/\[CONES:\s*(\d+)\]/);
        if (c && typeof placeCones === "function") placeCones(c[1]);
    }
}

function movePlayerOnBoard(name, x, y) {
    const dots = document.querySelectorAll('.player-dot');
    dots.forEach(dot => {
        const label = dot.querySelector('.player-label');
        if (label && label.innerText.toLowerCase().includes(name.toLowerCase())) {
            dot.style.left = x + '%';
            dot.style.top = y + '%';
        }
    });
}

function addSaveButton(title, desc) {
    const btn = document.createElement('button');
    btn.className = "nav-btn orange";
    btn.style.marginTop = "10px";
    btn.innerText = "💾 Übung in Aktentasche speichern";
    btn.onclick = () => saveExerciseToPlan(title, desc);
    outputContainer.prepend(btn);
}

function saveExerciseToPlan(title, description) {
    let plans = JSON.parse(localStorage.getItem('toni_training_plans') || '[]');
    plans.push({
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        title: title,
        desc: description,
        notes: "",
        boardSnap: document.getElementById('pitch').innerHTML
    });
    localStorage.setItem('toni_training_plans', JSON.stringify(plans));
    toniSpeak("Abgeheftet! Du findest die Übung jetzt in deiner Aktentasche unter Trainingspläne.");
}

/**
 * MÄNNLICHE STIMME & AUSGABE
 */
function toniSpeak(message) {
    if (!outputContainer) return;
    const msgDiv = document.createElement('div');
    msgDiv.style = "background:#f1f8e9; border-left:5px solid #2e7d32; padding:12px; margin-bottom:15px; border-radius:5px;";
    msgDiv.innerHTML = `<strong>Toni:</strong> ${message}`;
    outputContainer.prepend(msgDiv);

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(message);
        utter.lang = 'de-DE';
        utter.pitch = 0.85; // Tiefer
        utter.rate = 1.0;
        
        const voices = window.speechSynthesis.getVoices();
        const male = voices.find(v => v.name.includes('Stefan') || v.name.includes('Google Deutsch') || v.name.includes('Microsoft Stefan'));
        if (male) utter.voice = male;
        
        window.speechSynthesis.speak(utter);
    }
}

function handleChatInput(val) {
    if (!val.trim()) return;
    getToniResponse(val);
}
