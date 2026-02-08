/**
 * TONI 2.0 - SEKTOR TRAINING (AI ADVISOR EDITION)
 * Fokus: KI-generierte Übungen, Beratung & Taktik-Vorschläge.
 */
window.SektorTraining = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;
        this.render();
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        const coach = window.coachInfo || { name: "Coach" };

        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 1px solid var(--neon-green); padding-bottom: 20px;">
                <div>
                    <h2 style="color:var(--neon-green); letter-spacing: 2px;">TRAINING & KI-BERATUNG</h2>
                    <span style="color: #888; font-size: 0.7rem;">COACH ${coach.name.toUpperCase()} x TONI 2.0 COLLAB</span>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 350px; gap: 30px;">
                
                <div>
                    <div style="background: rgba(57, 255, 20, 0.05); padding: 25px; border-radius: 15px; border: 1px solid var(--neon-green);">
                        <h3 style="color:var(--neon-green); margin-bottom:15px;"><i class="fas fa-robot"></i> TONI'S ÜBUNGS-GENERATOR</h3>
                        <p style="font-size:0.8rem; color:#ccc; margin-bottom:20px;">Was ist heute der Fokus? Toni erstellt dir eine Übung basierend auf deinem Kader.</p>
                        
                        <div style="display:flex; gap:10px; margin-bottom:20px;">
                            <input type="text" id="training-focus-input" class="pro-textarea" placeholder="z.B. Gegenpressing nach Ballverlust..." style="flex:1;">
                            <button class="pro-btn-gold" onclick="window.SektorTraining.askToni()">VORSCHLAG GENERIEREN</button>
                        </div>

                        <div id="toni-suggestion-output" style="background: rgba(0,0,0,0.4); padding: 20px; border-radius: 10px; min-height: 200px; border-left: 4px solid var(--neon-green); color: #fff; font-size: 0.9rem; line-height: 1.6;">
                            <div style="opacity:0.3; text-align:center; padding-top:60px;">
                                <i class="fas fa-brain" style="font-size: 2rem;"></i><br>Warte auf Fokus-Eingabe...
                            </div>
                        </div>
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:20px;">
                    <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 15px; border: 1px solid #333;">
                        <h4 style="color:#fff; font-size:0.8rem; margin-bottom:15px;">GESPEICHERTE ÜBUNGEN</h4>
                        <div id="mini-archive-list" style="max-height: 400px; overflow-y:auto;">
                            </div>
                        <button class="tactic-btn" style="width:100%; margin-top:15px;" onclick="window.SektorTraining.createNewSession()">+ MANUELLE ÜBUNG</button>
                    </div>
                </div>
            </div>
        `;
        this.renderMiniArchive();
    },

    async askToni() {
        const input = document.getElementById('training-focus-input');
        const output = document.getElementById('toni-suggestion-output');
        if (!input.value) return;

        output.innerHTML = `<span class="thinking">Toni entwirft die Einheit...</span>`;

        const prompt = `Erstelle eine Fußball-Übung für das Training. 
                        Fokus: ${input.value}. 
                        Anzahl Spieler: ${window.Database.players.length}.
                        Struktur: 1. Aufbau, 2. Ablauf, 3. Coaching Points.
                        Halte es kurz und präzise.`;

        if (window.aiOnline) {
            // Wir nutzen die globale handleCommand Logik indirekt
            try {
                const savedIP = localStorage.getItem('toni_mac_ip') || 'localhost';
                const response = await fetch(`http://${savedIP}:11434/api/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'phi3', 
                        prompt: prompt,
                        stream: false
                    })
                });
                const data = await response.json();
                output.innerHTML = `<div class="fadeIn"><strong>TONIS VORSCHLAG:</strong><br><br>${data.response.replace(/\n/g, '<br>')}</div>
                <button class="pro-btn-gold" style="margin-top:20px; width:100%;" onclick="window.SektorTraining.saveSuggestion('${input.value}')">IN MAPPE ÜBERNEHMEN</button>`;
                window.ToniVoice.speak("Hier ist mein Vorschlag für die Einheit, Coach. Fokus liegt auf der Intensität.");
            } catch (e) {
                output.innerHTML = "Fehler: KI-Verbindung unterbrochen.";
            }
        } else {
            output.innerHTML = "Toni ist offline. Bitte verbinde mich am MacBook, um kreative Übungen zu generieren!";
        }
    },

    saveSuggestion(title) {
        const output = document.getElementById('toni-suggestion-output').innerText;
        const newSession = {
            title: title || "KI-Übung",
            desc: output,
            duration: 20,
            players: window.Database.players.length,
            img: null
        };
        if (!window.Database.trainingSessions) window.Database.trainingSessions = [];
        window.Database.trainingSessions.unshift(newSession);
        window.Database.save();
        this.renderMiniArchive();
        alert("Übung in die Mappe kopiert!");
    },

    renderMiniArchive() {
        const list = document.getElementById('mini-archive-list');
        const sessions = window.Database.trainingSessions || [];
        if (sessions.length === 0) {
            list.innerHTML = `<p style="font-size:0.7rem; color:#444;">Noch kein Archiv vorhanden.</p>`;
            return;
        }
        list.innerHTML = sessions.map((s, idx) => `
            <div style="padding:10px; background:rgba(0,0,0,0.3); border-radius:8px; margin-bottom:10px; border-left: 2px solid var(--neon-green);">
                <div style="font-size:0.75rem; font-weight:bold; color:var(--neon-green);">${s.title}</div>
                <div style="font-size:0.6rem; color:#666;">${s.players} Spieler | ${s.duration} Min.</div>
            </div>
        `).join('');
    }
};
