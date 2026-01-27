/** * Toni 2.0 - Professional Coaching Engine
 * Fokus: Session-State, Intent-Erkennung & Proaktives Coaching
 */

// Das Nervensystem: Hier speichert Toni, was gerade Phase ist
let session = {
    altersklasse: null,
    formation: "4-3-3",
    modus: "taktik", // taktik, training, analyse
    teamAnzahl: 11,
    lastTopic: null
};

window.handleToniAction = async function() {
    const inputField = document.getElementById('user-msg');
    const msg = inputField.value.trim();
    if (!msg) return;

    appendChatMessage("Björn", msg);
    inputField.value = "";
    const lowMsg = msg.toLowerCase();

    // 1. INTENT-ERKENNUNG (Die "Zwiestufe")
    // Erkennt Toni das Thema, bevor er die KI fragt?
    
    // A: Altersklassen & Setup
    if (lowMsg.includes("hallo") || lowMsg.includes("start")) {
        const r = "Sempre pronto, Björn! Das System ist hochgefahren. Für welche Altersklasse (Senioren, Jugend, Funino) schalten wir das Board heute scharf?";
        processToniOutput(r);
        return;
    }

    // B: Spielfeld-Logik (Senioren-Intent)
    if (lowMsg.includes("senioren") || lowMsg.includes("herren") || lowMsg.includes("großfeld")) {
        session.altersklasse = "Senioren";
        if (typeof window.setPitch === "function") window.setPitch('grossfeld');
        const r = "Großfeld steht. Bei den Senioren empfehle ich zum Start ein 4-3-3 mit Fokus auf das Spiel über die Flügel. Soll ich die Grundordnung direkt auf das Board bringen?";
        processToniOutput(r);
        return;
    }

    // C: Taktik-Intent (Pressing/Aufbau)
    if (lowMsg.includes("pressing") || lowMsg.includes("gegenpressing")) {
        session.lastTopic = "Pressing";
        const r = `Alles klar, Björn. Beim ${session.altersklasse || 'Team'} Pressing-Momente zu coachen ist entscheidend. Wollen wir das 'Jagen' in Zone 1 bis 4 simulieren oder die Absicherung der Restverteidigung zeigen?`;
        processToniOutput(r);
        return;
    }

    // 2. FALLBACK: Experten-KI (Groq/Llama) mit Kontext-Übergabe
    // Toni "weiß" jetzt beim KI-Call, wer Björn ist und was sie gerade machen
    const aiResponse = await askToniAI(msg, session); 
    processToniOutput(aiResponse);
};

function processToniOutput(text) {
    appendChatMessage("Toni", text); 
    speakText(text); 
}

// Design-Anpassung: Toni wirkt jetzt "expertenhafter" (Glassy Look in CSS steuerbar)
function appendChatMessage(sender, text) {
    const history = document.getElementById('chat-history');
    const div = document.createElement('div');
    const isToni = sender === "Toni";
    
    div.style = `
        margin: 12px 0; 
        padding: 14px; 
        border-radius: 12px; 
        font-size: 14px;
        line-height: 1.5;
        border-left: 4px solid ${isToni ? "#f1c40f" : "#2ecc71"}; 
        background: ${isToni ? "rgba(255,255,255,0.08)" : "rgba(46, 204, 113, 0.05)"};
        ${isToni ? "backdrop-filter: blur(5px); box-shadow: 0 4px 15px rgba(0,0,0,0.2);" : ""}
    `;
    
    div.innerHTML = `<strong style="color:${isToni ? '#f1c40f' : '#2ecc71'}; display:block; margin-bottom:5px;">${sender.toUpperCase()}</strong> ${text}`;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
}

function speakText(text) {
    window.speechSynthesis.cancel();
    const m = new SpeechSynthesisUtterance(text);
    m.lang = 'de-DE';
    m.pitch = 0.85; 
    window.speechSynthesis.speak(m);
}

async function askToniAI(prompt, ctx) {
    // Hier schicken wir den 'ctx' (Session-State) mit an die Groq-API
    return `Björn, basierend auf unserem ${ctx.altersklasse}-Setup: Wie aggressiv soll die Kette beim Verschieben agieren?`;
}
