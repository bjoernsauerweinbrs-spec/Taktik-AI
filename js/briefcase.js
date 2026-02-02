/**
 * BRIEFCASE MODUL: Verwaltung der Sektoren & Kader [cite: 2026-02-02]
 */
window.BriefcaseUI = {
    kader: [],

    init() {
        // Lädt gespeicherten Kader oder setzt Standard (David Luiz) [cite: 2025-11-19, 2026-01-24]
        const saved = localStorage.getItem('toni2_kader');
        this.kader = saved ? JSON.parse(saved) : [
            { id: 1, name: "David Luiz", number: 4, pos: "IV", team: 'home', x: 200, y: 300 }
        ];
    },

    // Öffnet/Schließt den Koffer
    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        overlay.classList.toggle('hidden');
    },

    // Wechselt zwischen den Ordnern (Sport, Medical, Orga, Analyse) [cite: 2026-02-02]
    switchSektor(sektor) {
        document.getElementById('briefcase-nav').classList.add('hidden');
        document.getElementById('briefcase-content').classList.remove('hidden');
        
        const target = document.getElementById('active-content');
        
        if (sektor === 'sport') this.renderSport(target);
        if (sektor === 'orga') this.renderOrga(target);
        if (sektor === 'medical') target.innerHTML = "<h3>⌚ Medical Hub</h3><p>Bio-Daten werden synchronisiert...</p>";
        if (sektor === 'analyse') target.innerHTML = "<h3>📊 Analyse</h3><p>Historische Taktiken werden geladen...</p>";
    },

    // Zurück zur Ordner-Übersicht
    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    },

    // Sektor: Sporttasche (Kader-Management) [cite: 2026-02-02]
    renderSport(container) {
        container.innerHTML = `
            <div class="animate-fadeIn">
                <h2 style="color:var(--accent-orange); margin-bottom:20px;">👟 Sporttasche: Kader</h2>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    ${this.kader.map(p => `
                        <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:12px; display:flex; justify-content:space-between; align-items:center;">
                            <span>#${p.number} <b>${p.name}</b> (${p.pos})</span>
                            <button onclick="BriefcaseUI.toBoard(${p.id})" style="background:var(--success-green); border:none; color:white; padding:8px 12px; border-radius:8px; cursor:pointer; font-weight:bold;">AUFS FELD</button>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top:30px; padding:20px; border:1px dashed #444; border-radius:15px; text-align:center;">
                    <p style="color:var(--text-muted);">+ Weiteren Spieler hinzufügen (Coming Soon)</p>
                </div>
            </div>
        `;
    },

    // Sektor: Geschäftszimmer (Stadionzeitung) [cite: 2026-02-02]
    renderOrga(container) {
        container.innerHTML = `
            <div class="animate-fadeIn" style="text-align:center; padding:40px;">
                <div style="font-size:60px; margin-bottom:20px;">📰</div>
                <h2 style="margin-bottom:10px;">STADIONZEITUNG EDITOR</h2>
                <p style="color:var(--text-muted); margin-bottom:30px;">Erstelle das Matchday-Programm mit Tonis Taktik-Checks.</p>
                <button onclick="window.Stadionzeitung.render()" style="background:white; color:black; border:none; padding:15px 40px; border-radius:30px; font-weight:bold; cursor:pointer;">REDAKTION ÖFFNEN</button>
            </div>
        `;
    },

    // Schickt Spieler auf das Board [cite: 2026-01-23, 2026-01-24]
    toBoard(id) {
        const player = this.kader.find(p => p.id === id);
        if (player && !arena.players.find(ap => ap.id === id)) {
            arena.players.push({ ...player });
            ToniAI.speak(`${player.name} ist jetzt auf seiner Position bereit.`); [cite: 2026-01-26]
            this.toggle(); // Schließt den Koffer automatisch
        }
    }
};
