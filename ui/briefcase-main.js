/**
 * TONI 2.0 - ZENTRALE STEUEREINHEIT (ULTIMATE FIX)
 * Verknüpft alle Sektoren und behebt den Lade-Hänger.
 */
window.BriefcaseUI = {
    isOpen: false,

    init: function() {
        console.log("Briefcase System: Online.");
        this.renderFolderGrid();
    },

    toggle: function() {
        const overlay = document.getElementById('briefcase-overlay');
        if (!overlay) {
            console.error("Fehler: briefcase-overlay nicht im HTML gefunden!");
            return;
        }

        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            overlay.style.setProperty('display', 'flex', 'important');
            overlay.classList.remove('hidden');
            
            this.backToNav();
            if(window.ToniTTS) ToniTTS.speak("Zentrale geöffnet.", "warm");
            console.log("Zentrale: Sichtbar geschaltet.");
        } else {
            overlay.style.display = 'none';
            overlay.classList.add('hidden');
            console.log("Zentrale: Ausgeblendet.");
        }
    },

    backToNav: function() {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const title = document.getElementById('sector-title');
        
        if(nav) nav.classList.remove('hidden');
        if(content) content.classList.add('hidden');
        if(title) title.innerText = "ZENTRALE AKTENTASCHE";
        
        this.renderFolderGrid();
    },

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
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 30px; padding: 20px;">
                ${folders.map(f => `
                    <div class="fifa-card" onclick="BriefcaseUI.switchSektor('${f.id}')" style="padding: 50px 20px; text-align: center; cursor: pointer;">
                        <i class="fas ${f.icon}" style="font-size: 3rem; color: ${f.color}; margin-bottom: 25px; display: block;"></i>
                        <span style="font-weight: 900; letter-spacing: 2px; font-size: 0.9rem; color:#fff;">${f.name}</span>
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

        nav.classList.add('hidden');
        content.classList.remove('hidden');
        
        title.innerHTML = `
            <button onclick="BriefcaseUI.backToNav()" style="background:none; border:none; color:var(--neon-green); cursor:pointer; margin-right:15px; font-size:1.5rem;">
                <i class="fas fa-arrow-left"></i>
            </button> ${sektor.toUpperCase()}
        `;

        // --- VERBESSERTES ROUTING: HIER WERDEN DIE MODULE AKTIVIERT ---
        if (sektor === 'sport' && window.SektorSporttasche) {
            window.SektorSporttasche.render();
        } 
        else if (sektor === 'analyse' && window.SektorAnalyse) {
            window.SektorAnalyse.render();
        } 
        else if (sektor === 'system' && window.SektorSystem) {
            window.SektorSystem.render();
        } 
        else if (sektor === 'templates' && window.SektorTemplates) {
            window.SektorTemplates.render();
        } 
        else {
            active.innerHTML = `<div style="text-align:center; padding:100px; color:var(--text-dim);">
                <i class="fas fa-exclamation-triangle" style="font-size:2rem; margin-bottom:15px; display:block;"></i>
                Modul <b>${sektor}</b> konnte nicht geladen werden.<br>
                Prüfe, ob die entsprechende Skript-Datei in der app.html eingebunden ist.
            </div>`;
        }
    }
};

// Startet das System
BriefcaseUI.init();
