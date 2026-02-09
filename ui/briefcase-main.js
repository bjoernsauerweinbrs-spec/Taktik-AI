/**
 * TONI 2.0 - ZENTRALE STEUEREINHEIT (PRO-ROUTING)
 * Fokus: Integration von Stadionheft, Sponsoring & Mikrofon-Aktivierung.
 */
window.BriefcaseUI = {
    isOpen: false,
    isListening: false,

    init: function() {
        console.log("TONI 2.0 Briefcase System: Online.");
        this.renderFolderGrid();
    },

    toggle: function() {
        const overlay = document.getElementById('briefcase-overlay');
        if (!overlay) return;

        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            overlay.style.setProperty('display', 'flex', 'important');
            overlay.classList.remove('hidden');
            this.backToNav();
            if(window.ToniTTS) ToniTTS.speak("Zentrale geöffnet.", "warm");
        } else {
            overlay.style.display = 'none';
            overlay.classList.add('hidden');
        }
    },

    // NEU: Mikrofon-Steuerung (für KI Live-Talk)
    toggleVoice: function() {
        this.isListening = !this.isListening;
        const micBtn = document.getElementById('main-mic-btn');
        if(!micBtn) return;

        if(this.isListening) {
            micBtn.style.color = "var(--neon-green)";
            micBtn.style.textShadow = "0 0 15px var(--neon-green)";
            micBtn.classList.add('fa-beat');
            if(window.ToniTTS) ToniTTS.speak("Ich höre zu, Coach.", "warm");
            // Hier Trigger für WebSpeechAPI oder dein Gateway
            if(window.ToniGateway) window.ToniGateway.startListening();
        } else {
            micBtn.style.color = "#fff";
            micBtn.style.textShadow = "none";
            micBtn.classList.remove('fa-beat');
            if(window.ToniGateway) window.ToniGateway.stopListening();
        }
    },

    backToNav: function() {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const title = document.getElementById('sector-title');
        
        if(nav) nav.classList.remove('hidden');
        if(content) content.classList.add('hidden');
        
        // Header mit Mikrofon-Anker
        if(title) {
            title.innerHTML = `
                <div style="display:flex; align-items:center; gap:20px;">
                    ZENTRALE AKTENTASCHE
                    <i id="main-mic-btn" class="fas fa-microphone" onclick="BriefcaseUI.toggleVoice()" 
                       style="cursor:pointer; font-size:1.2rem; transition:0.3s;" title="KI Sprachsteuerung"></i>
                </div>
            `;
        }
        
        this.renderFolderGrid();
    },

    renderFolderGrid: function() {
        const nav = document.getElementById('briefcase-nav');
        if(!nav) return;

        const folders = [
            { id: 'sport', name: 'MANNSCHAFTSKABINE', icon: 'fa-users', color: 'var(--accent-gold)' },
            { id: 'training', name: 'TRAININGSBETRIEB', icon: 'fa-dumbbell', color: 'var(--accent-orange)' },
            { id: 'analyse', name: 'PERFORMANCE LAB', icon: 'fa-chart-line', color: 'var(--neon-green)' },
            { id: 'templates', name: 'STADIONHEFT', icon: 'fa-book-open', color: '#fff' },
            { id: 'sponsoring', name: 'SPONSORING & FINANZEN', icon: 'fa-handshake', color: 'var(--accent-gold)' },
            { id: 'system', name: 'SYSTEM-SETUP', icon: 'fa-cogs', color: '#888' }
        ];

        nav.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; padding: 20px;">
                ${folders.map(f => `
                    <div class="fifa-card" onclick="BriefcaseUI.switchSektor('${f.id}')" 
                         style="padding: 50px 20px; text-align: center; cursor: pointer; transition: 0.3s; border:1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.4);">
                        <i class="fas ${f.icon}" style="font-size: 3rem; color: ${f.color}; margin-bottom: 25px; display: block;"></i>
                        <span style="font-weight: 900; letter-spacing: 2px; font-size: 0.8rem; color:#fff;">${f.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    switchSektor: function(sektor) {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const title = document.getElementById('sector-title');
        const active = document.getElementById('active-content');
        
        if(!nav || !content || !active) return;

        active.innerHTML = ""; 
        nav.classList.add('hidden');
        content.classList.remove('hidden');
        
        const sectorNames = {
            'sport': 'MANNSCHAFTSKABINE',
            'training': 'TRAININGSBETRIEB',
            'analyse': 'PERFORMANCE LAB',
            'templates': 'STADIONHEFT',
            'sponsoring': 'FINANZ-ZENTRALE',
            'system': 'SYSTEM-SETUP'
        };

        title.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                <div style="display:flex; align-items:center;">
                    <button onclick="BriefcaseUI.backToNav()" style="background:none; border:none; color:var(--neon-green); cursor:pointer; margin-right:15px; font-size:1.5rem;">
                        <i class="fas fa-arrow-left"></i>
                    </button> 
                    ${sectorNames[sektor] || sektor.toUpperCase()}
                </div>
                <i id="main-mic-btn" class="fas fa-microphone" onclick="BriefcaseUI.toggleVoice()" 
                   style="cursor:pointer; font-size:1.2rem; margin-right:20px; color:${this.isListening ? 'var(--neon-green)' : '#fff'}"></i>
            </div>
        `;

        switch(sektor) {
            case 'sport':
                if(window.SektorSporttasche) window.SektorSporttasche.render();
                break;
            case 'training':
                if(window.SektorTraining) window.SektorTraining.render();
                break;
            case 'analyse':
                if(window.SektorAnalyse) window.SektorAnalyse.render();
                break;
            case 'templates':
                if(window.SektorTemplates) window.SektorTemplates.render();
                break;
            case 'sponsoring':
                if(window.SektorSponsoring) window.SektorSponsoring.open();
                break;
            case 'system':
                if(window.SektorSystem) window.SektorSystem.render();
                break;
            default:
                active.innerHTML = `<div style="text-align:center; padding:100px;">Modul nicht gefunden.</div>`;
        }
    }
};

BriefcaseUI.init();
