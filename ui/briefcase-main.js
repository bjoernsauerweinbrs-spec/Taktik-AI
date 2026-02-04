/**
 * TONI 2.0 - ZENTRALE STEUEREINHEIT
 * Verwaltet das Öffnen der Aktentasche und das Laden der Sektoren.
 */
window.BriefcaseUI = {
    isOpen: false,

    init: function() {
        console.log("Briefcase System: Initialisiert.");
        this.renderFolderGrid();
    },

    /**
     * Öffnet und schließt die Zentrale
     */
    toggle: function() {
        const overlay = document.getElementById('briefcase-overlay');
        if (!overlay) return;

        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            overlay.classList.remove('hidden');
            overlay.style.display = 'flex'; // Sicherstellen, dass Flex-Layout aktiv ist
            this.backToNav();
            if(window.ToniTTS) ToniTTS.speak("Zentrale geöffnet.", "warm");
        } else {
            overlay.classList.add('hidden');
            overlay.style.display = 'none';
        }
    },

    /**
     * Zurück zur Ordner-Übersicht (Ginga-Grid)
     */
    backToNav: function() {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const title = document.getElementById('sector-title');
        
        if(nav) nav.classList.remove('hidden');
        if(content) content.classList.add('hidden');
        if(title) title.innerText = "ZENTRALE AKTENTASCHE";
        
        this.renderFolderGrid();
    },

    /**
     * Erstellt das Grid mit den Neon-Kacheln
     */
    renderFolderGrid: function() {
        const nav = document.getElementById('briefcase-nav');
        if(!nav) return;

        const folders = [
            { id: 'sport', name: 'MANNSCHAFTSKABINE', icon: 'fa-users', color: 'var(--accent-gold)' },
            { id: 'analyse', name: 'TIEFENANALYSE', icon: 'fa-chart-line', color: 'var(--neon-green)' },
            { id: 'system', name: 'SYSTEM-SETUP', icon: 'fa-cogs', color: '#888' },
            { id: 'templates', name: 'STADIONHEFT', icon: 'fa-book-open', color: '#fff' }
        ];

        nav.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 25px; padding: 20px;">
                ${folders.map(f => `
                    <div class="fifa-card" onclick="BriefcaseUI.switchSektor('${f.id}')" style="padding: 40px 20px;">
                        <i class="fas ${f.icon}" style="font-size: 2.5rem; color: ${f.color}; margin-bottom: 20px; display: block;"></i>
                        <span style="font-weight: 900; letter-spacing: 2px; font-size: 0.8rem; color:#fff;">${f.name}</span>
                        <div class="ginga-bg" style="font-size: 2rem;">GO</div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    /**
     * Schaltet in einen Unterbereich (z.B. Kabine)
     */
    switchSektor: function(sektor) {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const title = document.getElementById('sector-title');
        
        if(nav) nav.classList.add('hidden');
        if(content) content.classList.remove('hidden');
        
        title.innerHTML = `
            <button onclick="BriefcaseUI.backToNav()" style="background:none; border:none; color:var(--neon-green); cursor:pointer; margin-right:15px; font-size:1.2rem;">
                <i class="fas fa-arrow-left"></i>
            </button> ${sektor.toUpperCase()}
        `;

        // Routing zu den Modulen
        if (sektor === 'sport' && window.SektorSporttasche) {
            window.SektorSporttasche.render();
        } else if (sektor === 'analyse' && window.SektorAnalyse) {
            window.SektorAnalyse.render();
        } else {
            document.getElementById('active-content').innerHTML = `
                <div style="text-align:center; padding:100px; color:var(--text-dim);">
                    <i class="fas fa-tools" style="font-size:3rem; margin-bottom:20px; display:block;"></i>
                    Modul <b>${sektor}</b> wird geladen...
                </div>`;
        }
    }
};

// Initial-Start
BriefcaseUI.init();
