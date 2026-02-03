window.BriefcaseUI = {
    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) overlay.classList.toggle('hidden');
    },

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
            title.innerText = "📢 MARKETING: A5 STADIONZEITUNG";
            this.renderMarketing();
        } else if (sektor === 'system') {
            title.innerText = "📁 SYSTEM-ORDNER & KI-HILFE";
            this.renderSystemOrdner();
        }
    },

    renderSystemOrdner() {
        const currentKey = localStorage.getItem('toni_api_key') || "";
        const currentProvider = localStorage.getItem('toni_api_provider') || "openai";
        const target = document.getElementById('active-content');
        
        target.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                <div class="sponsoring-tool" style="border-color: var(--data-cyan); background: rgba(0,209,255,0.02); padding: 25px; border-radius: 15px;">
                    <h4 style="color: var(--data-cyan); margin-top:0;">🔑 KI-KONFIGURATION</h4>
                    <label style="font-size:0.7rem; color:#aaa;">ANBIETER:</label>
                    <select id="api-provider" class="login-input" style="width:100%; margin-bottom:15px; background:#111;">
                        <option value="openai" ${currentProvider === 'openai' ? 'selected' : ''}>OpenAI (Cloud)</option>
                        <option value="gemini" ${currentProvider === 'gemini' ? 'selected' : ''}>Google Gemini (Cloud)</option>
                        <option value="llama" ${currentProvider === 'llama' ? 'selected' : ''}>Ollama / Llama (LOKAL)</option>
                        <option value="free" ${currentProvider === 'free' ? 'selected' : ''}>Toni Basis</option>
                    </select>
                    <label style="font-size:0.7rem; color:#aaa;">API-KEY:</label>
                    <input type="password" id="api-key-input" class="login-input" style="width:100%;" value="${currentKey}" placeholder="Key einfügen...">
                    <button class="login-btn" style="width:100%; margin-top:15px; background: var(--data-cyan); color: #000;" onclick="BriefcaseUI.saveSettings()">KONFIGURATION SPEICHERN</button>
                    <p id="save-status" style="margin-top:10px; font-size:0.8rem; font-weight:bold;"></p>
                </div>
                
                <div class="sponsoring-tool" style="border-color: #ffcc00; background: rgba(255,204,0,0.05); padding: 25px; border-radius: 15px;">
                    <h4 style="color: #ffcc00; margin-top:0;">ℹ️ HILFE: LOKALE KI (OLLAMA)</h4>
                    <div style="font-size:0.75rem; line-height:1.4; color:#ddd;">
                        <p><b>MacBook:</b> Terminal öffnen & <br><code>launchctl setenv OLLAMA_ORIGINS "*"</code><br> eingeben. Ollama danach neu starten.</p>
                        <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:10px 0;">
                        <p><b>Windows:</b> In Umgebungsvariablen <code>OLLAMA_ORIGINS</code> mit Wert <code>*</code> hinzufügen. Ollama neu starten.</p>
                    </div>
                </div>
            </div>
        `;
    },

    saveSettings() {
        localStorage.setItem('toni_api_key', document.getElementById('api-key-input').value);
        localStorage.setItem('toni_api_provider', document.getElementById('api-provider').value);
        document.getElementById('save-status').innerText = "✅ Konfiguration gespeichert!";
    },

    renderMarketing() {
        const target = document.getElementById('active-content');
        target.innerHTML = `<div class="magazine-view">
            <div class="mag-page"><h1 contenteditable="true">FC TONI 2.0</h1></div>
            <div class="mag-page"><h3>TRAINER TALK</h3><p contenteditable="true">Heute zaubern wir...</p></div>
            <button class="login-btn" onclick="window.print()">DIN A5 DRUCK</button>
        </div>`;
    },

    renderSporttasche() {
        document.getElementById('active-content').innerHTML = `
            <button class="login-btn" style="width:auto;" onclick="BriefcaseUI.addPlayerPrompt()">+ SPIELER HINZUFÜGEN</button>
            <p>Hier starten wir gleich das Kader-Brainstorming.</p>`;
    },

    addPlayerPrompt() {
        const n = prompt("Name:");
        if(n) {
            let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({id:Date.now(), name:n});
            localStorage.setItem('toni_players', JSON.stringify(pl));
            this.renderSporttasche();
        }
    },

    applyFormation(type) {
        if(window.arena) arena.animateFormation(type);
        this.toggle();
    }
};
