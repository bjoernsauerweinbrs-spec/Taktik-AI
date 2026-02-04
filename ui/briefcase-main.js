/**
 * TONI 2.0 - BRIEFCASE MAIN ENGINE
 * Steuert die Navigation und das Laden der einzelnen Sektoren.
 */

window.BriefcaseUI = {
    currentSektor: 'nav',

    init: function() {
        console.log("Briefcase Engine: Systemstart...");
        // Initialer Render des Folder-Grids
        this.renderFolderGrid();
    },

    /**
     * Öffnet/Schließt die Aktentasche
     */
    toggle: function() {
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) {
            const isHidden = overlay.classList.toggle('hidden');
            if (!isHidden) {
                this.backToNav();
                if(window.ToniTTS) ToniTTS.speak("Zentrale geöffnet. Womit fangen wir an, Coach?", "warm");
            }
        }
    },

    /**
     * Zeigt die Übersicht aller Ordner
     */
    backToNav: function() {
        this.currentSektor = 'nav';
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const title = document.getElementById('sector-title');
        
        nav.classList.remove('hidden');
        content.classList.add('hidden');
        title.innerText = "ZENTRALE AKTENTASCHE";
        this.renderFolderGrid();
    },

    /**
     * Erstellt das Grid mit den Ordnern (Soll-Ist Onboarding/Struktur)
     */
    renderFolderGrid: function() {
        const nav = document.getElementById('briefcase-nav');
        const folders = [
            { id: 'sport', name: 'SPORTTASCHE', icon: 'fa-users', color: 'var(--accent-orange)' },
            { id: 'analyse', name: 'ANALYSEZENTRUM', icon: 'fa-chart-line', color: 'var(--data-cyan)' },
            { id: 'training', name: 'TRAINING', icon: 'fa-dumbbell', color: 'var(--accent-orange)' },
            { id: 'templates', name: 'STADIONHEFT', icon: 'fa-book-open', color: '#fff' },
            { id: 'sponsoring', name: 'SPONSORING', icon: 'fa-handshake', color: 'var(--data-cyan)' },
            { id: 'system', name: 'SYSTEM', icon: 'fa-cogs', color: '#888' }
        ];

        nav.innerHTML = `
            <div class="folder-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 20px;">
                ${folders.map(f => `
                    <div class="p-card" onclick="BriefcaseUI.switchSektor('${f.id}')" style="padding: 30px;">
                        <i class="fas ${f.icon}" style="font-size: 2.5rem; color: ${f.color}; margin-bottom: 15px; display: block;"></i>
                        <span style="font-weight: bold; letter-spacing: 1px; font-size: 0.8rem;">${f.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    /**
     * Schaltet zwischen den Sektoren um
     */
    switchSektor: function(sektor) {
        this.currentSektor = sektor;
        document.getElementById('briefcase-nav').classList.add('hidden');
        document.getElementById('briefcase-content').classList.remove('hidden');
        
        const title = document.getElementById('sector-title');
        title.innerHTML = `
            <button onclick="BriefcaseUI.backToNav()" style="background:none; border:none; color:var(--accent-orange); cursor:pointer; margin-right:15px;">
                <i class="fas fa-arrow-left"></i>
            </button> ${sektor.toUpperCase()}
        `;

        // Routing zu den spezialisierten Sektor-Dateien
        switch(sektor) {
            case 'sport':
                if(window.SektorSporttasche) window.SektorSporttasche.render();
                break;
            case 'system':
                // Hier rufen wir später SektorSystem.render() auf
                this.renderPlaceholder("System-Konfiguration");
                break;
            case 'analyse':
                this.renderPlaceholder("Analysezentrum (Performance & BMI)");
                break;
            case 'training':
                this.renderPlaceholder("Trainings-Editor & PDF");
                break;
            case 'templates':
                this.renderPlaceholder("Stadionheft WYSIWYG");
                break;
            default:
                this.renderPlaceholder(sektor);
        }
    },

    renderPlaceholder: function(text) {
        document.getElementById('active-content').innerHTML = `
            <div style="text-align:center; padding:100px; color:var(--text-dim);">
                <i class="fas fa-tools" style="font-size:3rem; margin-bottom:20px; display:block;"></i>
                Sektor <b>${text}</b> wird im nächsten Schritt modular eingebunden.
            </div>
        `;
    }
};

// Start der Engine
BriefcaseUI.init();
