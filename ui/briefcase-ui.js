/**
 * TONI 2.0 - KI-BÜRO (BRIEFCASE ELITE UPDATE)
 * Fokus: Transfer-Zentrum, Kader-Management & Team-Zuweisung.
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
        console.log("TONI 2.0 KI-Büro wird hochgefahren...");
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
            { id: 'templates', name: 'STAMMPLATZ', icon: 'fa-trophy', color: '#ffcc00', desc: 'Sticker & Alben' },
            { id: 'system', name: 'TRANSFER & KADER', icon: 'fa-exchange-alt', color: '#fff', desc: 'Spieler hinzufügen/löschen' }
        ];
        nav.innerHTML = `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 20px;">
            ${sectors.map(s => `<div class="folder-card" onclick="window.BriefcaseUI.switchSektor('${s.id}')" style="background:#111; border:1px solid #333; padding:25px; border-radius:15px; text-align:center; cursor:pointer;">
                <i class="fas ${s.icon}" style="font-size:2rem; color:${s.color}; margin-bottom:10px; display:block;"></i>
                <div style="font-size:0.8rem; font-weight:bold; color:#fff;">${s.name}</div>
                <div style="font-size:0.6rem; color:#555;">${s.desc}</div>
            </div>`).join('')}</div>`;
    },

    switchSektor: function(sektor) {
        document.getElementById('briefcase-nav').classList.add('hidden');
        document.getElementById('briefcase-content').classList.remove('hidden');
        document.getElementById('sector-title').innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                <button onclick="window.BriefcaseUI.backToNav()" style="background:none; border:none; color:var(--accent-gold); cursor:pointer;"><i class="fas fa-arrow-left"></i> ZURÜCK</button>
                <span>${sektor.toUpperCase()}</span>
                <i id="main-mic-btn" class="fas fa-microphone" onclick="window.BriefcaseUI.toggleVoice()" style="color:${this.isListening ? 'var(--neon-green)' : '#fff'}; cursor:pointer;"></i>
            </div>`;
        if (sektor === 'system') this.renderTransferCenter();
        else if (sektor === 'sport') { if(window.SektorSporttasche) window.SektorSporttasche.open(); }
        else if (sektor === 'reports') { if(window.SektorAnalyse) window.SektorAnalyse.open(); }
        else if (sektor === 'sponsoring') { if(window.SektorSponsoring) window.SektorSponsoring.open(); }
        else if (sektor === 'templates') { if(window.SektorTemplates) window.SektorTemplates.render(); }
        else this.renderPlaceholder(sektor);
    },

    renderTransferCenter: function() {
        const content = document.getElementById('active-content');
        const players = window.Database ? window.Database.players : [];
        const teams = ["Senioren", "A-Jugend", "B-Jugend", "C-Jugend", "D-Jugend", "E-Jugend", "F-Jugend", "G-Jugend"];

        content.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap:20px; height:100%;">
                <div style="background:#111; padding:20px; border-radius:12px; border:1px solid #333;">
                    <h3 style="color:var(--neon-green); font-size:0.9rem; margin-bottom:15px;">NEUER SPIELER</h3>
                    <input type="text" id="new-player-name" placeholder="Vollständiger Name" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:10px; border-radius:8px; margin-bottom:10px;">
                    <select id="new-player-team" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:10px; border-radius:8px; margin-bottom:15px;">
                        ${teams.map(t => `<option value="${t}">${t}</option>`).join('')}
                    </select>
                    <button class="pro-btn-gold" onclick="window.BriefcaseUI.addNewPlayer()" style="width:100%;">IN DEN KADER AUFNEHMEN</button>
                </div>

                <div style="background:#111; padding:20px; border-radius:12px; border:1px solid #333; overflow-y:auto; max-height:65vh;">
                    <h3 style="color:#fff; font-size:0.9rem; margin-bottom:15px;">AKTUELLER GESAMT-KADER (${players.length})</h3>
                    <table style="width:100%; color:#fff; font-size:0.75rem; border-collapse:collapse;">
                        ${players.map(p => `
                            <tr style="border-bottom:1px solid #222;">
                                <td style="padding:8px;">${p.name}</td>
                                <td style="color:#666;">${p.team || 'Nicht zugewiesen'}</td>
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
        const name = document.getElementById('new-player-name').value;
        const team = document.getElementById('new-player-team').value;
        if(!name) return;
        const newP = {
            id: Date.now(),
            name: name,
            team: team,
            rat: 70, pac: 70, sho: 70, pas: 70, dri: 70, def: 70, phy: 70,
            pos: 'TW', assignment: 'none'
        };
        if(window.Database && window.Database.players) {
            window.Database.players.push(newP);
            if(window.Database.save) window.Database.save();
            this.renderTransferCenter();
            if(window.ToniVoice) window.ToniVoice.speak(`${name} wurde der ${team} hinzugefügt.`);
        }
    },

    removePlayer: function(id) {
        if(!confirm("Spieler wirklich endgültig löschen?")) return;
        if(window.Database && window.Database.players) {
            window.Database.players = window.Database.players.filter(p => p.id !== id);
            if(window.Database.save) window.Database.save();
            this.renderTransferCenter();
        }
    },

    renderPlaceholder: function(sektor) {
        document.getElementById('active-content').innerHTML = `<div style="text-align:center; padding:50px; color:#444;"><i class="fas fa-tools" style="font-size:3rem; margin-bottom:20px;"></i><p>Sektor ${sektor.toUpperCase()} aktiv.</p></div>`;
    }
};
window.BriefcaseUI.init();
