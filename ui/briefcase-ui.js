/**
 * TONI 2.0 - KI-BÜRO (BRIEFCASE ELITE UPDATE)
 * Fokus: Dynamisches Dashboard, Sponsoring-Integration & Voice-Management.
 */
window.BriefcaseUI = {
    isOpen: false,
    isListening: false,
    recognition: null,
    // Zentrale Konfiguration für Club & Manager
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

    // --- KI SPRACHERKENNUNG (ERWEITERT) ---
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
                if(window.ToniVoice) window.ToniVoice.speak("Ich höre zu, Coach. Was steht an?");
            } catch(e) { console.log("Mic bereits aktiv"); }
        } else {
            this.recognition.stop();
            micBtn.forEach(btn => btn.style.color = "#fff");
        }
    },

    handleVoiceCommand: function(cmd) {
        console.log("KI-Büro erkennt:", cmd);
        
        // Strategische Befehle
        if (cmd.includes("sponsoring") || cmd.includes("geld")) this.switchSektor('sponsoring');
        if (cmd.includes("kabine") || cmd.includes("team")) this.switchSektor('sport');
        if (cmd.includes("analyse") || cmd.includes("performance")) this.switchSektor('reports');
        if (cmd.includes("heft") || cmd.includes("stammplatz") || cmd.includes("mission")) this.switchSektor('templates');
        if (cmd.includes("training")) this.switchSektor('training');
        if (cmd.includes("schließe") || cmd.includes("beende")) this.toggle();
        
        // Trick-Suche Logik bleibt erhalten
        if (cmd.includes("zeig mir") || cmd.includes("video von")) {
            const trick = cmd.replace("toni", "").replace("zeig mir", "").replace("video von", "").trim();
            this.switchSektor('reports');
            setTimeout(() => {
                if(window.SektorAnalyse) window.SektorAnalyse.playTrickVideo(trick);
            }, 500);
        }
    },

    // --- NAVIGATION & UI ---
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
                <div style="display:flex; gap:20px; align-items:center;">
                    <span style="font-size:0.7rem; color:#666;">COACH: ${this.clubData.coach}</span>
                    <i id="main-mic-btn" class="fas fa-microphone" onclick="window.BriefcaseUI.toggleVoice()" style="cursor:pointer; font-size:1.1rem; color:${this.isListening ? 'var(--neon-green)' : '#fff'}"></i>
                </div>
            </div>`;
        this.renderFolderGrid();
    },

    renderFolderGrid: function() {
        var nav = document.getElementById('briefcase-nav');
        if(!nav) return;
        
        const sectors = [
            { id: 'sport', name: 'KABINE', icon: 'fa-users', color: 'var(--accent-gold)', desc: 'Kader & Belastung' },
            { id: 'reports', name: 'LABOR', icon: 'fa-microscope', color: 'var(--data-cyan)', desc: 'Bio-Analyse & Trends' },
            { id: 'sponsoring', name: 'SPONSORING', icon: 'fa-handshake', color: '#00d1ff', desc: 'Deals & Kalkulation' },
            { id: 'templates', name: 'MISSION STAMMPLATZ', icon: 'fa-trophy', color: '#ffcc00', desc: 'Sticker & Alben' },
            { id: 'training', name: 'TRAINING', icon: 'fa-clipboard-list', color: 'var(--neon-green)', desc: 'Einheiten & Pläne' },
            { id: 'system', name: 'EINSTELLUNGEN', icon: 'fa-sliders-h', color: '#666', desc: 'Club-Config' }
        ];

        nav.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 20px;">
                ${sectors.map(s => `
                    <div class="folder-card" onclick="window.BriefcaseUI.switchSektor('${s.id}')" 
                        style="background: linear-gradient(145deg, #111, #050505); border: 1px solid #333; padding: 30px 20px; border-radius: 15px; text-align: center; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 20px rgba(0,0,0,0.3);">
                        <i class="fas ${s.icon}" style="font-size: 2.2rem; color: ${s.color}; margin-bottom: 15px; display: block; filter: drop-shadow(0 0 10px ${s.color}44);"></i>
                        <div style="font-size: 0.85rem; font-weight: 900; color: #fff; font-family:'Orbitron'; letter-spacing:1px;">${s.name}</div>
                        <div style="font-size: 0.6rem; color: #555; margin-top: 5px; text-transform: uppercase;">${s.desc}</div>
                    </div>`).join('')}
            </div>`;
    },

    switchSektor: function(sektor) {
        document.getElementById('briefcase-nav').classList.add('hidden');
        document.getElementById('briefcase-content').classList.remove('hidden');
        
        const title = document.getElementById('sector-title');
        title.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                <div style="display:flex; align-items:center; gap:15px;">
                    <button onclick="window.BriefcaseUI.backToNav()" style="background:rgba(255,255,255,0.05); border:1px solid #333; color:var(--accent-gold); cursor:pointer; width:35px; height:35px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:0.3s;"><i class="fas fa-chevron-left"></i></button>
                    <span style="font-family:'Orbitron'; font-size:1.1rem; letter-spacing:1px;">${sektor.toUpperCase()}</span>
                </div>
                <i id="main-mic-btn" class="fas fa-microphone" onclick="window.BriefcaseUI.toggleVoice()" style="color:${this.isListening ? 'var(--neon-green)' : '#fff'}; cursor:pointer; font-size:1.1rem;"></i>
            </div>`;
        
        // Routing-Logik
        if (sektor === 'sport') { if(window.SektorSporttasche) window.SektorSporttasche.open(); }
        else if (sektor === 'reports') { if(window.SektorAnalyse) window.SektorAnalyse.open(); }
        else if (sektor === 'sponsoring') { if(window.SektorSponsoring) window.SektorSponsoring.open(); }
        else if (sektor === 'templates') { if(window.SektorTemplates) window.SektorTemplates.render(); }
        else if (sektor === 'training') this.renderTraining();
        else if (sektor === 'system') this.renderSystem();
        else this.renderPlaceholder(sektor);
    },

    renderSystem: function() {
        const content = document.getElementById('active-content');
        content.innerHTML = `
            <div style="padding:20px; background:rgba(255,255,255,0.02); border-radius:15px; border:1px solid #333;">
                <h3 style="color:var(--neon-green); font-family:'Orbitron'; font-size:0.9rem;">SYSTEM-KONFIGURATION</h3>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:20px;">
                    <div>
                        <label style="color:#666; font-size:0.7rem; display:block; margin-bottom:5px;">VEREINSNAME</label>
                        <input type="text" id="cfg-club-name" value="${this.clubData.name}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px; border-radius:8px;">
                    </div>
                    <div>
                        <label style="color:#666; font-size:0.7rem; display:block; margin-bottom:5px;">TRAINER / MANAGER</label>
                        <input type="text" id="cfg-coach-name" value="${this.clubData.coach}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px; border-radius:8px;">
                    </div>
                </div>
                <button class="pro-btn-gold" onclick="window.BriefcaseUI.saveConfig()" style="margin-top:20px; width:100%;">EINSTELLUNGEN SPEICHERN</button>
            </div>`;
    },

    saveConfig: function() {
        this.clubData.name = document.getElementById('cfg-club-name').value;
        this.clubData.coach = document.getElementById('cfg-coach-name').value;
        localStorage.setItem('toni_club_config', JSON.stringify(this.clubData));
        if(window.ToniVoice) window.ToniVoice.speak("Systemkonfiguration aktualisiert.");
        this.backToNav();
    },

    renderPlaceholder: function(sektor) {
        document.getElementById('active-content').innerHTML = `
            <div style="text-align:center; padding:50px; color:#444;">
                <i class="fas fa-tools" style="font-size:3rem; margin-bottom:20px;"></i>
                <p>Der Sektor ${sektor.toUpperCase()} wird gerade von der KI kalibriert...</p>
            </div>`;
    }
};

window.BriefcaseUI.init();
