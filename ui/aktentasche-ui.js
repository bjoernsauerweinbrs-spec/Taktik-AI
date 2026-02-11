/**
 * TONI 2.0 - MASTER HUB UI (ELITE COMBINED SYNC 2026)
 * Fokus: Navigation, Voice-Control & Transfer-Management
 * Status: ETAPPE 2 - VOLLSTÄNDIG VERSIEGELT
 */
window.BriefcaseUI = {
    isOpen: false,
    isListening: false,
    recognition: null,

    init() {
        console.log("🚀 TONI Zentrale: Elite-Modus wird hochgefahren...");
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) overlay.classList.add('hidden');
        
        // Sprache initialisieren (aus der alten Briefcase-UI übernommen)
        this.setupSpeechRecognition();
    },

    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (!overlay) return;
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            overlay.classList.remove('hidden');
            this.renderMainGrid();
        } else {
            overlay.classList.add('hidden');
        }
    },

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'de-DE';
        this.recognition.continuous = true;
        this.recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
            this.handleVoiceCommand(transcript);
        };
    },

    toggleVoice() {
        if (!this.recognition) return;
        this.isListening = !this.isListening;
        const micBtn = document.querySelectorAll('#main-mic-btn');
        if (this.isListening) {
            try {
                this.recognition.start();
                micBtn.forEach(btn => btn.style.color = "#39FF14");
                if(window.ToniVoice) window.ToniVoice.speak("Ich höre zu, Coach.");
            } catch(e) {}
        } else {
            this.recognition.stop();
            micBtn.forEach(btn => btn.style.color = "#fff");
        }
    },

    handleVoiceCommand(cmd) {
        if (cmd.includes("sponsoring")) window.openSection('sponsoring');
        if (cmd.includes("kabine")) window.openSection('kabine');
        if (cmd.includes("finanzen")) window.openSection('finanzen');
        if (cmd.includes("zeitung")) window.openSection('stadionzeitung');
        if (cmd.includes("transfer") || cmd.includes("kader")) window.openSection('transfer');
        if (cmd.includes("schließe")) this.toggle();
    },

    renderMainGrid() {
        const windowBody = document.querySelector('.briefcase-window');
        if (!windowBody) return;
        windowBody.innerHTML = `
            <div id="sector-title">
                <div style="display: flex; flex-direction: column;">
                    <span style="color: #39FF14; letter-spacing: 3px; font-weight: 900; font-size: 1.1rem;">TONI ZENTRALE</span>
                    <span style="color: #666; font-size: 0.5rem; letter-spacing: 2px;">ELITE UNIT CONTROL 2026</span>
                </div>
                <i class="fas fa-times" onclick="window.BriefcaseUI.toggle()" style="cursor: pointer; color: #ff3b30; font-size: 1.2rem;"></i>
            </div>
            
            <div id="briefcase-nav" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; padding: 20px;">
                <div class="mgmt-card" style="border: 1px solid #39FF14; padding: 15px; border-radius: 10px;">
                    <div style="color: #39FF14; font-weight: 900; margin-bottom: 12px; font-size: 0.7rem; font-family: 'Orbitron';">⚽ PRO AREA</div>
                    <button class="tactic-btn" style="width: 100%; margin-bottom: 8px;" onclick="window.openSection('kabine')">KABINE</button>
                    <button class="tactic-btn" style="width: 100%; margin-bottom: 8px;" onclick="window.openSection('transfer')">TRANSFERMARKT</button>
                    <button class="tactic-btn" style="width: 100%;" onclick="window.openSection('analyse')">LABOR</button>
                </div>

                <div class="mgmt-card" style="border: 1px solid var(--accent-gold); padding: 15px; border-radius: 10px;">
                    <div style="color: var(--accent-gold); font-weight: 900; margin-bottom: 12px; font-size: 0.7rem; font-family: 'Orbitron';">📈 BUSINESS</div>
                    <button class="tactic-btn" style="width: 100%; margin-bottom: 8px;" onclick="window.openSection('sponsoring')">SPONSORING</button>
                    <button class="tactic-btn" style="width: 100%;" onclick="window.openSection('finanzen')">FINANZEN</button>
                </div>

                <div class="mgmt-card" style="border: 1px solid #fff; padding: 15px; border-radius: 10px;">
                    <div style="color: #fff; font-weight: 900; margin-bottom: 12px; font-size: 0.7rem; font-family: 'Orbitron';">📺 MEDIA</div>
                    <button class="tactic-btn" style="width: 100%;" onclick="window.openSection('stadionzeitung')">STADIONZEITUNG</button>
                </div>

                <div class="mgmt-card" style="border: 1px solid var(--data-cyan); padding: 15px; border-radius: 10px;">
                    <div style="color: var(--data-cyan); font-weight: 900; margin-bottom: 12px; font-size: 0.7rem; font-family: 'Orbitron';">⚙️ SYSTEM</div>
                    <button class="tactic-btn" style="width: 100%;" onclick="window.openSection('settings')">SETUP</button>
                </div>
            </div>
            
            <div id="briefcase-content" class="hidden" style="padding: 20px;">
                <div id="active-content"></div>
                <div id="back-to-hub" style="text-align: center; margin-top: 30px; border-top: 1px solid #222; padding-top: 20px;">
                    <button class="pro-btn" style="border: 1px solid #39FF14; color: #39FF14; background: none; padding: 10px 20px; cursor: pointer;" onclick="window.BriefcaseUI.renderMainGrid()">← ZENTRALE</button>
                </div>
            </div>
        `;
    },

    // --- TRANSFER ZENTRUM (AUS BRIEFCASE-UI ÜBERNOMMEN) ---
    renderTransferCenter() {
        const content = document.getElementById('active-content');
        const players = window.Database ? window.Database.players : [];
        content.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap:20px;">
                <div style="background:#0a0a0a; padding:15px; border-radius:10px; border:1px solid #333;">
                    <h3 style="color:#39FF14; font-size:0.8rem; font-family:'Orbitron';">NEUER SPIELER</h3>
                    <input type="text" id="new-player-name" placeholder="Name" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:10px; margin-bottom:10px;">
                    <button class="pro-btn-gold" onclick="window.BriefcaseUI.addNewPlayer()" style="width:100%;">AUFNEHMEN</button>
                </div>
                <div style="background:#0a0a0a; padding:15px; border-radius:10px; border:1px solid #333; overflow-y:auto; max-height:400px;">
                    <h3 style="color:#fff; font-size:0.8rem; font-family:'Orbitron';">KADER (${players.length})</h3>
                    ${players.map(p => `<div style="display:flex; justify-content:space-between; padding:5px; border-bottom:1px solid #222;">
                        <span>${p.name}</span>
                        <i class="fas fa-trash" onclick="window.BriefcaseUI.removePlayer(${p.id})" style="color:#ff3b30; cursor:pointer;"></i>
                    </div>`).join('')}
                </div>
            </div>`;
    },

    addNewPlayer() {
        const name = document.getElementById('new-player-name').value;
        if(!name) return;
        const newP = { id: Date.now(), name: name, team: "Senioren", rat: 70, onField: false, assignment: "Trainer", number: "99" };
        window.Database.players.push(newP);
        window.Database.save();
        this.renderTransferCenter();
    },

    removePlayer(id) {
        if(!confirm("Löschen?")) return;
        window.Database.players = window.Database.players.filter(p => p.id !== id);
        window.Database.save();
        this.renderTransferCenter();
    }
};

window.openSection = function(section) {
    const nav = document.getElementById('briefcase-nav');
    const content = document.getElementById('briefcase-content');
    if(nav) nav.classList.add('hidden');
    if(content) content.classList.remove('hidden');

    switch(section) {
        case 'kabine': if(window.SektorSporttasche) window.SektorSporttasche.open(); break;
        case 'transfer': window.BriefcaseUI.renderTransferCenter(); break;
        case 'analyse': if(window.SektorAnalyse) window.SektorAnalyse.open(); break;
        case 'sponsoring': if(window.SektorSponsoring) window.SektorSponsoring.open(); break;
        case 'finanzen': if(window.SektorFinanzen) window.SektorFinanzen.open(); break;
        case 'stadionzeitung': if(window.SektorStadionzeitung) window.SektorStadionzeitung.open(); break;
        case 'settings': if(window.SektorSettings) window.SektorSettings.open(); break;
    }
};

window.BriefcaseUI.init();
