window.BriefcaseUI = {
    // Öffnet/Schließt die Aktentasche
    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) overlay.classList.toggle('hidden');
    },

    // Bringt den Trainer zurück zur Ordner-Übersicht
    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    },

    // Schaltet zwischen den Sektoren um
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
            title.innerText = "📁 SYSTEM-ORDNER & SPEICHER";
            this.renderSystemOrdner();
        }
    },

    // --- SEKTOR: SYSTEM-ORDNER (API-Key & Lokale Dateien) ---
    renderSystemOrdner() {
        const currentKey = localStorage.getItem('toni_api_key') || "";
        const target = document.getElementById('active-content');
        
        target.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                <div class="sponsoring-tool" style="border-color: var(--data-cyan); background: rgba(0,209,255,0.02); padding: 25px; border-radius: 15px;">
                    <h4 style="color: var(--data-cyan); margin-top:0;">🔑 API-KONFIGURATION</h4>
                    <p style="font-size:0.8rem; color:var(--text-dim); line-height:1.4;">
                        Hinterlege hier deinen persönlichen Key (OpenAI/Gemini). 
                        Toni nutzt diesen, um für dich echte Live-Recherchen im Web durchzuführen.
                    </p>
                    <input type="password" id="api-key-input" class="login-input" style="width:100%; margin-top:15px;" value="${currentKey}" placeholder="Dein Key hier...">
                    <button class="login-btn" style="width:100%; margin-top:15px; background: var(--data-cyan); color: #000;" onclick="BriefcaseUI.saveApiKey()">KEY IM SYSTEM SPEICHERN</button>
                    <p id="save-status" style="margin-top:15px; font-size:0.8rem; font-weight:bold;"></p>
                </div>
                
                <div class="sponsoring-tool" style="border-color: #444; background: rgba(255,255,255,0.02); padding: 25px; border-radius: 15px;">
                    <h4 style="color: var(--text-main); margin-top:0;">💾 LOKALE SPEICHERSTÄNDE</h4>
                    <p style="font-size:0.8rem; color:var(--text-dim); line-height:1.4;">
                        Alle auf diesem Rechner gespeicherten Trainingseinheiten und Kaderlisten werden hier gelistet:
                    </p>
                    <div id="local-files-list" style="font-size:0.75rem; color:#666; border:1px dashed #333; padding:20px; text-align:center; margin-top:15px; border-radius:10px;">
                        <i>Aktuell keine lokalen Sitzungen gefunden.</i>
                    </div>
                </div>
            </div>
        `;
    },

    saveApiKey() {
        const val = document.getElementById('api-key-input').value;
        localStorage.setItem('toni_api_key', val);
        const status = document.getElementById('save-status');
        status.style.color = "#4CD964";
        status.innerText = "✅ Key erfolgreich im System hinterlegt. Toni ist nun bereit!";
    },

    // --- SEKTOR: MARKETING (DIN A5 Magazin) ---
    renderMarketing() {
        const target = document.getElementById('active-content');
        target.innerHTML = `
            <div id="m-zeitung" class="magazine-view">
                <div class="mag-page">
                    <div style="background:#000; color:#fff; text-align:center; padding:10px; border-bottom:5px solid var(--accent-orange);">
                        <h1 contenteditable="true" style="margin:0; font-size:1.1rem;">FC TONI 2.0</h1>
                    </div>
                    <div contenteditable="true" style="flex:1; display:flex; align-items:center; justify-content:center; border:1px solid #eee; margin:20px 0; font-weight:bold;">[ DEIN LOGO ]</div>
                    <p contenteditable="true" style="text-align:center; font-style:italic; font-size:0.8rem;">"Matchday Magazin - Ausgabe #01"</p>
                </div>
                <div class="mag-page">
                    <h3 style="border-bottom:2px solid #000; font-size:1rem;">🎤 TRAINER-TALK</h3>
                    <div contenteditable="true" style="font-size:0.8rem; line-height:1.5;">Klicke hier, um deine Ansprache für die Fans und das Team zu verfassen...</div>
                </div>
                <div class="mag-page">
                    <h3 style="border-bottom:2px solid #000; font-size:1rem;">📊 ANALYSE</h3>
                    <div contenteditable="true" style="font-size:0.8rem; line-height:1.5;">Zusammenfassung des letzten Spieltags und taktische Ausblicke...</div>
                </div>
                <div class="mag-page">
                    <h3 style="text-align:center; font-size:1rem;">🤝 PARTNER</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; flex:1;">
                        <div contenteditable="true" style="border:1px dashed #ccc; padding:10px; text-align:center; font-size:0.6rem;">HAUPTSPONSOR</div>
                        <div contenteditable="true" style="border:1px dashed #ccc; padding:10px; text-align:center; font-size:0.6rem;">PARTNER</div>
                    </div>
                    <div style="background:#000; color:#00D1FF; padding:10px; border-radius:5px; text-align:center; margin-top:20px;">
                        <b style="font-size:0.75rem; color:#fff;">POWERED BY TONI 2.0</b>
                    </div>
                </div>
                <button class="login-btn" style="grid-column: span 2; margin-top:20px; background:var(--accent-orange);" onclick="window.print()">🖨️ DIN A5 MAGAZIN DRUCKEN</button>
            </div>
        `;
    },

    // --- SEKTOR: SPORTTASCHE ---
    renderSporttasche() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        target.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 300px; gap:30px;">
                <div>
                    <button class="login-btn" style="width:auto; margin-bottom:20px;" onclick="BriefcaseUI.addPlayerPrompt()">+ NEUER SPIELER</button>
                    <div class="pro-player-list">
                        ${players.length > 0 ? players.map(p => `
                            <div class="p-card Anwesend" onclick="BriefcaseUI.openSetcard(${p.id})">
                                <b>#${p.number || '?'} ${p.name}</b>
                            </div>
                        `).join('') : '<p style="color:#666;">Keine Spieler im Kader.</p>'}
                    </div>
                </div>
                <div style="background:rgba(255,255,255,0.03); padding:20px; border-radius:15px; border:1px solid #333;">
                    <h4 style="margin-top:0;">BOARD-STEUERUNG</h4>
                    <button class="login-btn" style="width:100%; margin-bottom:10px;" onclick="BriefcaseUI.applyFormation('433')">FORMATION 4-3-3</button>
                    <button class="login-btn" style="width:100%;" onclick="BriefcaseUI.applyFormation('352')">FORMATION 3-5-2</button>
                </div>
            </div>
        `;
    },

    addPlayerPrompt() {
        const n = prompt("Name des Spielers:");
        if(n) {
            let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({id:Date.now(), name:n, number:"?", status:"Anwesend"});
            localStorage.setItem('toni_players', JSON.stringify(pl));
            this.renderSporttasche();
        }
    },

    openSetcard(id) {
        alert("Spieler-Detailansicht folgt im nächsten Update.");
    },

    applyFormation(type) {
        if(window.arena) arena.animateFormation(type);
        this.toggle(); // Schließt Aktentasche nach Wahl
    }
};
