/**
 * TONI 2.0 - KI-BÜRO (BRIEFCASE ELITE MASTER)
 * Fokus: Transfer-Zentrum, Stadionzeitung, Finanzen & Labor-Sync
 * Status: MASTER-SYNC 2026 - ALL SECTORS INTEGRATED
 */
window.BriefcaseUI = {
    isOpen: false,
    isListening: false,
    recognition: null,
    clubData: JSON.parse(localStorage.getItem('toni_club_config')) || { 
        name: 'FC TONI 2.0', 
        coach: 'Coach Björn', 
        league: 'Jugend/Senioren', 
        budget: 0 
    },

    init: function() {
        console.log("🏟️ KI-Büro: Elite-Zentrale wird hochgefahren...");
        this.setupSpeechRecognition();
        this.renderFolderGrid();
    },

    setupSpeechRecognition: function() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'de-DE';
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
            this.handleVoiceCommand(transcript);
        };
    },

    toggleVoice: function() {
        if (!this.recognition) return;
        this.isListening = !this.isListening;
        const micBtn = document.querySelectorAll('#main-mic-btn');
        if (this.isListening) {
            try {
                this.recognition.start();
                micBtn.forEach(btn => btn.style.color = "var(--neon-green)");
                if(window.ToniVoice) window.ToniVoice.speak("Ich höre zu, Coach.");
            } catch(e) {}
        } else {
            this.recognition.stop();
            micBtn.forEach(btn => btn.style.color = "#fff");
        }
    },

    handleVoiceCommand: function(cmd) {
        if (cmd.includes("sponsoring")) this.switchSektor('sponsoring');
        if (cmd.includes("kabine")) this.switchSektor('sport');
        if (cmd.includes("finanzen") || cmd.includes("geld")) this.switchSektor('finanzen');
        if (cmd.includes("zeitung") || cmd.includes("magazin")) this.switchSektor('newspaper');
        if (cmd.includes("transfer") || cmd.includes("spieler")) this.switchSektor('system');
        if (cmd.includes("schließe")) this.toggle();
    },

    toggle: function() {
        var overlay = document.getElementById('briefcase-overlay');
        if (overlay) {
            overlay.classList.toggle('hidden');
            this.isOpen = !overlay.classList.contains('hidden');
            if (this.isOpen) { this.backToNav(); }
        }
    },

    backToNav: function() {
        var nav = document.getElementById('briefcase-nav');
        var content = document.getElementById('briefcase-content');
        var title = document.getElementById('sector-title');
        if(!nav || !content) return;
        nav.classList.remove('hidden');
        content.classList.add('hidden');
        title.innerHTML = `
            <div style="display:flex; align-items:center; gap:15px; width:100%; justify-content:space-between;">
                <span style="font-family:'Orbitron'; letter-spacing:2px;">KI-BÜRO ZENTRALE</span>
                <i id="main-mic-btn" class="fas fa-microphone" onclick="window.BriefcaseUI.toggleVoice()" style="cursor:pointer; font-size:1.1rem; color:${this.isListening ? 'var(--neon-green)' : '#fff'}"></i>
            </div>`;
        this.renderFolderGrid();
    },

    renderFolderGrid: function() {
        var nav = document.getElementById('briefcase-nav');
        if(!nav) return;
        const sectors = [
            { id: 'sport', name: 'KABINE', icon: 'fa-users', color: 'var(--accent-gold)', desc: 'Kader & Taktik' },
            { id: 'reports', name: 'LABOR', icon: 'fa-microscope', color: 'var(--data-cyan)', desc: 'Bio-Analyse' },
            { id: 'sponsoring', name: 'SPONSORING', icon: 'fa-handshake', color: '#00d1ff', desc: 'Deals & Events' },
            { id: 'finanzen', name: 'FINANZEN', icon: 'fa-wallet', color: 'var(--neon-green)', desc: 'Budget & Saldo' },
            { id: 'newspaper', name: 'STADIONZEITUNG', icon: 'fa-newspaper', color: '#fff', desc: 'E-Paper & Print' },
            { id: 'system', name: 'TRANSFER & KADER', icon: 'fa-exchange-alt', color: 'var(--status-error)', desc: 'Management' }
        ];
        nav.innerHTML = `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 20px;">
            ${sectors.map(s => `<div class="folder-card" onclick="window.BriefcaseUI.switchSektor('${s.id}')" style="background:#111; border:1px solid #333; padding:25px; border-radius:15px; text-align:center; cursor:pointer; transition:0.3s;">
                <i class="fas ${s.icon}" style="font-size:2rem; color:${s.color}; margin-bottom:10px; display:block;"></i>
                <div style="font-size:0.8rem; font-weight:bold; color:#fff; font-family:'Orbitron';">${s.name}</div>
                <div style="font-size:0.6rem; color:#555;">${s.desc}</div>
            </div>`).join('')}</div>`;
    },

    switchSektor: function(sektor) {
        document.getElementById('briefcase-nav').classList.add('hidden');
        document.getElementById('briefcase-content').classList.remove('hidden');
        document.getElementById('sector-title').innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                <button onclick="window.BriefcaseUI.backToNav()" style="background:none; border:none; color:var(--accent-gold); cursor:pointer; font-family:'Orbitron'; font-size:0.7rem;"><i class="fas fa-arrow-left"></i> ZURÜCK</button>
                <span style="font-family:'Orbitron'; letter-spacing:1px;">${sektor.toUpperCase()}</span>
                <i id="main-mic-btn" class="fas fa-microphone" onclick="window.BriefcaseUI.toggleVoice()" style="color:${this.isListening ? 'var(--neon-green)' : '#fff'}; cursor:pointer;"></i>
            </div>`;
        
        if (sektor === 'system') this.renderTransferCenter();
        else if (sektor === 'sport') { if(window.SektorSporttasche) window.SektorSporttasche.open(); }
        else if (sektor === 'reports') { if(window.SektorAnalyse) window.SektorAnalyse.open(); }
        else if (sektor === 'sponsoring') { if(window.SektorSponsoring) window.SektorSponsoring.open(); }
        else if (sektor === 'finanzen') { if(window.SektorFinanzen) window.SektorFinanzen.open(); }
        else if (sektor === 'newspaper') { if(window.SektorStadionzeitung) window.SektorStadionzeitung.open(); }
        else this.renderPlaceholder(sektor);
    },

    renderTransferCenter: function() {
        const content = document.getElementById('active-content');
        const players = window.Database ? window.Database.players : [];
        const teams = ["Senioren", "A-Jugend", "B-Jugend", "C-Jugend", "D-Jugend", "E-Jugend", "F-Jugend", "G-Jugend"];

        content.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap:20px; height:100%;">
                <div style="background:#0a0a0a; padding:20px; border-radius:12px; border:1px solid #333;">
                    <h3 style="color:var(--neon-green); font-size:0.8rem; margin-bottom:15px; font-family:'Orbitron';">NEUER SPIELER</h3>
                    <input type="text" id="new-player-name" placeholder="Vollständiger Name" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:10px; border-radius:8px; margin-bottom:10px;">
                    <select id="new-player-team" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:10px; border-radius:8px; margin-bottom:15px;">
                        ${teams.map(t => `<option value="${t}">${t}</option>`).join('')}
                    </select>
                    <button class="pro-btn-gold" onclick="window.BriefcaseUI.addNewPlayer()" style="width:100%;">IN DEN KADER AUFNEHMEN</button>
                </div>

                <div style="background:#0a0a0a; padding:20px; border-radius:12px; border:1px solid #333; overflow-y:auto; max-height:65vh;">
                    <h3 style="color:#fff; font-size:0.8rem; margin-bottom:15px; font-family:'Orbitron';">AKTUELLER GESAMT-KADER (${players.length})</h3>
                    <table style="width:100%; color:#fff; font-size:0.75rem; border-collapse:collapse;">
                        ${players.map(p => `
                            <tr style="border-bottom:1px solid #222;">
                                <td style="padding:8px;">${p.name}</td>
                                <td style="color:#666;">${p.team || p.jugend || 'Nicht zugewiesen'}</td>
                                <td style="text-align:right;">
                                    <button onclick="window.BriefcaseUI.removePlayer(${p.id})" style="background:none; border:none; color:var(--status-error); cursor:pointer;"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
            </div>`;
    },

    addNewPlayer: function() {
        const nameInput = document.getElementById('new-player-name');
        const teamInput = document.getElementById('new-player-team');
        if(!nameInput || !nameInput.value) return;

        const team = teamInput.value;
        const isSenior = team === "Senioren";

        const newP = {
            id: Date.now(),
            name: nameInput.value,
            team: isSenior ? "Senioren" : "Junioren",
            jugend: isSenior ? "" : team,
            rat: 70, pac: 60, sho: 60, pas: 60, dri: 60, def: 60, phy: 60,
            pos: 'TW', assignment: 'Trainer', onField: false
        };

        if(window.Database && window.Database.players) {
            window.Database.players.push(newP);
            if(window.Database.save) window.Database.save();
            this.renderTransferCenter();
            if(window.ToniVoice) window.ToniVoice.speak(`${newP.name} wurde dem Kader hinzugefügt.`);
        }
    },

    removePlayer: function(id) {
        if(!confirm("Einheit wirklich endgültig eliminieren?")) return;
        if(window.Database && window.Database.players) {
            window.Database.players = window.Database.players.filter(p => p.id !== id);
            if(window.Database.save) window.Database.save();
            this.renderTransferCenter();
        }
    },

    renderPlaceholder: function(sektor) {
        document.getElementById('active-content').innerHTML = `
            <div style="text-align:center; padding:50px; color:#444;">
                <i class="fas fa-tools" style="font-size:3rem; margin-bottom:20px;"></i>
                <p style="font-family:'Orbitron';">Sektor ${sektor.toUpperCase()} in Konstruktion.</p>
            </div>`;
    }
};
window.BriefcaseUI.init();
