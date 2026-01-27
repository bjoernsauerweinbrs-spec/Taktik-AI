/* js/chat.js 
   Zuständig für: KI-Kommunikation (Groq), Übungsvisualisierung, 
   Aktentaschen-Archivierung und Druckfunktion
*/

const ToniChat = {
    chatHistory: [],

    init() {
        const sendBtn = document.getElementById('send-btn');
        const userInput = document.getElementById('user-input');

        sendBtn.onclick = () => this.sendMessage();
        userInput.onkeypress = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        };
    },

    async sendMessage() {
        const inputField = document.getElementById('user-input');
        const text = inputField.value.trim();
        if (!text) return;

        // UI Update: Nutzer Nachricht anzeigen
        this.addMessageToUI('user', text);
        inputField.value = '';

        const config = ToniStorage.getAuthConfig();
        
        try {
            // System-Instruction von ToniLogic holen (Fachmann-Rolle)
            const systemPrompt = ToniLogic.getSystemInstruction(config.name, ToniBoard.activeModus);

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "mixstral-8x7b-32768", // Oder dein bevorzugtes Modell
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...this.chatHistory,
                        { role: "user", content: text }
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            const aiText = data.choices[0].message.content;

            // KI-Antwort verarbeiten
            this.addMessageToUI('toni', aiText);
            this.chatHistory.push({ role: "user", content: text });
            this.chatHistory.push({ role: "assistant", content: aiText });

            // Toni spricht die Antwort (Männliche Stimme aus board.js)
            ToniBoard.speak(aiText);

            // Falls die KI eine Übung vorschlägt, bieten wir den "Speichern"-Button an
            this.checkForExercise(aiText);

        } catch (error) {
            console.error("Fehler bei Groq-Anfrage:", error);
            this.addMessageToUI('toni', "Entschuldige Coach, mein System hat gerade einen Aussetzer. Prüf mal deinen API-Key.");
        }
    },

    addMessageToUI(role, text) {
        const container = document.getElementById('chat-container');
        const msgDiv = document.createElement('div');
        msgDiv.style.marginBottom = "15px";
        msgDiv.style.padding = "10px";
        msgDiv.style.borderRadius = "8px";
        msgDiv.style.background = role === 'user' ? "#1e293b" : "#0f172a";
        msgDiv.style.borderLeft = role === 'user' ? "none" : "3px solid #2ecc71";
        
        msgDiv.innerHTML = `<strong>${role === 'user' ? 'Du' : 'Toni'}:</strong><br>${text.replace(/\n/g, '<br>')}`;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    },

    // Erkennt, ob eine Übung gespeichert werden kann
    checkForExercise(text) {
        if (text.length > 100) { // Einfache Logik: Lange Texte sind oft Übungen
            const saveBtn = document.createElement('button');
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Übung in Aktentasche speichern';
            saveBtn.style.cssText = "background:#2ecc71; color:white; border:none; padding:8px; border-radius:4px; cursor:pointer; margin-top:10px;";
            saveBtn.onclick = () => this.saveToAktentasche(text);
            document.getElementById('chat-container').appendChild(saveBtn);
        }
    },

    saveToAktentasche(content) {
        const config = ToniStorage.getAuthConfig();
        const session = {
            title: "Trainingseinheit " + new Date().toLocaleDateString(),
            content: content,
            trainer: config.name,
            date: new Date().toLocaleDateString()
        };
        ToniStorage.saveTrainingSession(session);
        alert("In Aktentasche gespeichert, Coach!");
    }
};

// Funktionalität für das Aktentaschen-Overlay (Archiv & Druck)
function renderArchive() {
    const list = document.getElementById('archive-list');
    const sessions = ToniStorage.getArchiv();
    list.innerHTML = "";

    sessions.forEach((s, index) => {
        const item = document.createElement('div');
        item.style.cssText = "background:#1e293b; padding:15px; border-radius:8px; margin-bottom:10px; border:1px solid #334155;";
        item.innerHTML = `
            <div style="display:flex; justify-content:space-between;">
                <strong>${s.title}</strong>
                <span>${s.date}</span>
            </div>
            <p style="font-size:0.85rem; color:#94a3b8;">Trainer: ${s.trainer}</p>
            <button onclick="printSession(${index})" style="background:#3498db; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">
                <i class="fas fa-print"></i> Drucken / PDF
            </button>
        `;
        list.appendChild(item);
    });
}

function printSession(index) {
    const session = ToniStorage.getArchiv()[index];
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Trainingsplan - Coach ${session.trainer}</title>
            <style>
                body { font-family: sans-serif; padding: 40px; }
                .header { border-bottom: 2px solid #2ecc71; padding-bottom: 10px; margin-bottom: 20px; }
                .content { line-height: 1.6; }
                .footer { margin-top: 50px; font-size: 0.8rem; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Trainingsprotokoll: ${session.title}</h1>
                <p><strong>Verantwortlicher Trainer:</strong> Coach ${session.trainer}</p>
                <p><strong>Datum:</strong> ${session.date}</p>
            </div>
            <div class="content">${session.content.replace(/\n/g, '<br>')}</div>
            <div class="footer">Erstellt mit Coach Toni 2.0 - Taktik & Analyse</div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function renderPlayerStats() {
    const statsDiv = document.getElementById('stats-display');
    const players = ToniStorage.getKader().filter(p => p.status !== 'blue');
    statsDiv.innerHTML = "";

    players.forEach(p => {
        const card = document.createElement('div');
        card.style.cssText = "background:#0f172a; padding:10px; border-radius:6px; margin-bottom:10px;";
        card.innerHTML = `
            <div style="color:#2ecc71; font-weight:bold;">${p.nummer}. ${p.name}</div>
            <div style="font-size:0.8rem; display:grid; grid-template-columns: 1fr 1fr; gap:5px; margin-top:5px;">
                <span>Kondition: ${p.stats.kondition}%</span>
                <span>Übersicht: ${p.stats.uebersicht}%</span>
                <span>Technik: ${p.stats.technik}%</span>
                <span>Taktik: ${p.stats.taktik}%</span>
            </div>
            <div style="margin-top:5px; height:4px; background:#334155; border-radius:2px;">
                <div style="width:${ToniLogic.calculatePerformanceScore(p.stats)}%; height:100%; background:#2ecc71;"></div>
            </div>
        `;
        statsDiv.appendChild(card);
    });
}

// Initialisierung starten
ToniChat.init();
