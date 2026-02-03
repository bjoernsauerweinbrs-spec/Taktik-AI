window.BriefcaseUI = {
    // Öffnet/Schließt die Aktentasche
    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) overlay.classList.toggle('hidden');
    },

    // Bringt den Trainer zurück zur Ordner-Übersicht (Die 3 Haupt-Buttons)
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
            title.innerText = "📢 MARKETING: A5 STADIONZEITUNG";
            this.renderMarketing();
        } else if (sektor === 'system') {
            title.innerText = "📁 SYSTEM-ORDNER & KI-SETUP";
            this.renderSystemOrdner();
        }
    },

    // --- SEKTOR: SYSTEM-ORDNER (API-Keys & Lokale Dateien) ---
    renderSystemOrdner() {
        const currentKey = localStorage.getItem('toni_api_key') || "";
        const currentProvider = localStorage.getItem('toni_api_provider') || "openai";
        const target = document.getElementById('active-content');
        
        target.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                <div class="sponsoring-tool" style="border-color: var(--data-cyan); background: rgba(0,209,255,0.02); padding: 25px; border-radius: 15px;">
                    <h4 style="color: var(--data-cyan); margin-top:0;">🔑 KI-KONFIGURATION</h4>
                    
                    <label style="font-size:0.7rem; color:#aaa; display:block; margin-bottom:5px;">ANBIETER / MODELL:</label>
                    <select id="api-provider" class="login-input" style="width:100%; margin-bottom:15px; background:#111; border:1px solid #444;">
                        <option value="openai" ${currentProvider === 'openai' ? 'selected' : ''}>OpenAI (GPT-4o / sk-Key)</option>
                        <option value="gemini" ${currentProvider === 'gemini' ? 'selected' : ''}>Google Gemini (Key nötig)</option>
                        <option value="llama" ${currentProvider === 'llama' ? 'selected' : ''}>Ollama / Llama (LOKAL - Kostenlos)</option>
                        <option value="free" ${currentProvider === 'free' ? 'selected' : ''}>Toni Basis (Ohne Internet)</option>
                    </select>

                    <label style="font-size:0.7rem; color:#aaa; display:block; margin-bottom:5px;">API-KEY (Falls nötig):</label>
                    <input type="password" id="api-key-input" class="login-input" style="width:100%;" value="${currentKey}" placeholder="Key hier einfügen...">
                    
                    <button class="login-btn" style="width:100%; margin-top:15px; background: var(--data-cyan); color: #000;" onclick="BriefcaseUI.saveSettings()">KONFIGURATION SPEICHERN</button>
                    <p id="save-status" style="margin-top:15px; font-size:0.8rem; font-weight:bold;"></p>
                </div>
                
                <div class="sponsoring-tool" style="border-color: #444; background: rgba(255,255,255,0.02); padding: 25px; border-radius: 15px;">
                    <h4 style="color: var(--text-main); margin-top:0;">💾 LOKALE SPEICHERSTÄNDE</h4>
                    <p style="font-size:0.75rem; color:#888;">Hier werden zukünftig alle deine gespeicherten Kader-Listen und Trainings-Setups angezeigt.</p>
                    <div id="local-files-list" style="font-size:0.75rem; color:#555; border:1px dashed #333; padding:20px; text-align:center; margin-top:15px; border-radius:10px;">
                        <i>Der Speicher ist aktuell leer.</i>
                    </div>
                </div>
            </div>
        `;
    },

    saveSettings() {
        const key = document.getElementById('api-key-input').value;
        const provider = document.getElementById('api-provider').value;
        localStorage.setItem('toni_api_key', key);
        localStorage.setItem('toni_api_provider', provider);
        const status = document.getElementById('save-status');
        status.style.color = "#4CD964";
        status.innerText = `✅ System auf ${provider.toUpperCase()} konfiguriert!`;
    },

    // --- SEKTOR: MARKETING (A5 Stadionzeitung) ---
    renderMarketing() {
        const target = document.getElementById('active-content');
        target.innerHTML = `
            <div id="m-zeitung" class="magazine-view">
                <div class="mag-page">
                    <div style="background:#000; color:#fff; text-align:center; padding:10px; border-bottom:4px solid var(--accent-orange);">
                        <h1 contenteditable="true" style="margin:0; font-size:1rem;">FC TONI 2.0</h1>
                    </div>
                    <div contenteditable="true" style="flex:1; display:flex; align-items:center; justify-content:center; border:1px solid #eee; margin:20px 0; font-size:0.8rem;">[ LOGO ]</div>
                    <p contenteditable="true" style="text-align:center; font-style:italic; font-size:0.7rem;">Stadionheft - Ausgabe 2026</p>
                </div>
                <div class="mag-page">
                    <h4 style="border-bottom:1px solid #000; margin-bottom:10px;">TRAINER-TALK</h4>
                    <div contenteditable="true" style="font-size:0.8rem; line-height:1.4;">Klicke hier, Björn, um deine Ansprache zu schreiben...</div>
                </div>
                <div class="mag-page">
                    <h4 style="border-bottom:1px solid #000; margin-bottom:10px;">ANALYSE</h4>
                    <div contenteditable="true" style="font-size:0.8rem; line-height:1.4;">Hier stehen die Taktik-Fakten...</div>
                </div>
                <div class="mag-page">
                    <h4 style="text-align:center;">PARTNER</h4>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; flex:1;">
                        <div contenteditable="true" style="border:1px dashed #ccc; padding:10px; font-size:0.6rem; text-align:center;">SPONSOR</div>
                    </div>
                    <div style="background:#000; color:#fff; padding:10px; text-align:center; margin-top:10px; font-size:0.7rem;">
                        POWERED BY TONI 2.0
                    </div>
                </div>
                <button class="login-btn" style="grid-column: span 2; margin-top:15px; background:var(--accent-orange);" onclick="window.print()">🖨️ DIN A5 DRUCKEN</button>
            </div>
        `;
    },

    // --- SEKTOR: SPORTTASCHE (Grundgerüst für Brainstorming) ---
    renderSporttasche() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        target.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 300px; gap:30px;">
                <div>
                    <button class="login-btn" style="width:auto; margin-bottom:20px;" onclick="BriefcaseUI.addPlayerPrompt()">+ NEUER SPIELER</button>
                    <div class="pro-player-list">
                        ${players.length > 0 ? players.map(p => `
                            <div class="p-card" onclick="BriefcaseUI.openSetcard(${p.id})">
                                <b>#${p.number || '?'} ${p.name}</b>
                            </div>
                        `).join('') : '<p style="color:#666;">Kader leer. Bereit für Brainstorming.</p>'}
                    </div>
                </div>
                <div style="background:rgba(255,255,255,0.03); padding:20px; border-radius:15px; border:1px solid #333;">
                    <h4 style="margin-top:0;">TAKTIK-SCHALTER</h4>
                    <button class="login-btn" style="width:100%; margin-bottom:10px;" onclick="BriefcaseUI.applyFormation('433')">4-3-3 GINGA</button>
                    <button class="login-btn" style="width:100%;" onclick="BriefcaseUI.applyFormation('352')">3-5-2 KOMPAKT</button>
                </div>
            </div>
        `;
    },

    addPlayerPrompt() {
        const n = prompt("Name:");
        if(n) {
            let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({id:Date.now(), name:n, number:"?"});
            localStorage.setItem('toni_players', JSON.stringify(pl));
            this.renderSporttasche();
        }
    },

    openSetcard(id) {
        console.log("Details für Spieler ID:", id);
    },

    applyFormation(type) {
        if(window.arena) arena.animateFormation(type);
        this.toggle();
    }
};
