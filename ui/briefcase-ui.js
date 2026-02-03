window.BriefcaseUI = {
    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) overlay.classList.toggle('hidden');
    },

    // Zentraler Zurück-Button zur Hauptübersicht der Aktentasche
    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    },

    switchSektor(sektor) {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const title = document.getElementById('sector-title');
        
        nav.classList.add('hidden');
        content.classList.remove('hidden');

        if (sektor === 'sport') {
            title.innerText = "👟 SPORTTASCHE: KADER & TRAINING";
            this.renderSporttasche();
        } else if (sektor === 'marketing') {
            title.innerText = "📢 MARKETING: STADIONZEITUNG";
            this.renderMarketing();
        } else if (sektor === 'system') {
            title.innerText = "📁 SYSTEM & LOKALER SPEICHER";
            this.renderSystemOrdner();
        }
    },

    // NEU: Der System-Ordner für API-Keys und lokale Dateien
    renderSystemOrdner() {
        const currentKey = localStorage.getItem('toni_api_key') || "";
        const target = document.getElementById('active-content');
        
        target.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                <div class="sponsoring-tool" style="border-color: var(--data-cyan);">
                    <h4>🔑 API-KONFIGURATION</h4>
                    <p style="font-size:0.8rem; color:var(--text-dim);">Hinterlege deinen Key für die Web-Recherche:</p>
                    <input type="password" id="api-key-input" class="login-input" style="width:100%;" value="${currentKey}" placeholder="Key eingeben...">
                    <button class="login-btn" style="width:auto; margin-top:10px;" onclick="BriefcaseUI.saveApiKey()">KEY SPEICHERN</button>
                </div>
                
                <div class="sponsoring-tool" style="border-color: #555;">
                    <h4>💾 LOKALE SPEICHERSTÄNDE</h4>
                    <p style="font-size:0.8rem; color:var(--text-dim);">Hier werden deine gespeicherten Trainings angezeigt:</p>
                    <div id="local-files-list" style="font-size:0.7rem; color:#888; border:1px dashed #444; padding:10px;">
                        Keine lokalen Dateien gefunden.
                    </div>
                </div>
            </div>
            <p id="save-status" style="margin-top:15px; font-size:0.8rem; color:var(--data-cyan);"></p>
        `;
    },

    saveApiKey() {
        const val = document.getElementById('api-key-input').value;
        localStorage.setItem('toni_api_key', val);
        document.getElementById('save-status').innerText = "✅ API-Key im System-Ordner hinterlegt!";
    },

    // ... (renderSporttasche und renderMarketing bleiben wie besprochen erhalten)
    renderMarketing() {
        const target = document.getElementById('active-content');
        target.innerHTML = `
            <div class="magazine-view">
                <div class="mag-page"><b>SEITE 1: COVER</b><input type="text" class="mag-area" value="FC TONI 2.0"></div>
                <div class="mag-page"><b>SEITE 2: TALK</b><textarea class="mag-area">Willkommen Björn!</textarea></div>
                <div class="mag-page"><b>SEITE 3: ANALYSE</b><textarea class="mag-area">Top Leistung!</textarea></div>
                <div class="mag-page"><b>SEITE 4: PARTNER</b><div style="font-size:0.6rem;">Powered by Toni 2.0</div></div>
                <button class="login-btn" style="grid-column: span 2;" onclick="window.print()">🖨️ A5 DRUCK</button>
            </div>`;
    },

    renderSporttasche() {
        const target = document.getElementById('active-content');
        target.innerHTML = `
            <div class="pro-player-list">
                <p>Spieler-Verwaltung wird im nächsten Schritt optimiert.</p>
                <button class="login-btn" style="width:auto;" onclick="BriefcaseUI.addPlayerPrompt()">+ NEUER SPIELER</button>
            </div>`;
    },

    addPlayerPrompt() {
        const n = prompt("Name:");
        if(n) {
            let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({id:Date.now(), name:n, number:"?", status:"Anwesend"});
            localStorage.setItem('toni_players', JSON.stringify(pl));
            this.renderSporttasche();
        }
    }
};
