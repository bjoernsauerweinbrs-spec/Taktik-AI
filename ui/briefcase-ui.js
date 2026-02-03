window.BriefcaseUI = {
    // Schaltet das Sichtbarkeits-Flag des Overlays um
    toggle() {
        console.log("Aktentasche getriggert");
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) {
            overlay.classList.toggle('hidden');
        } else {
            console.error("Fehler: briefcase-overlay Element nicht gefunden!");
        }
    },

    async switchSektor(sektor) {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const target = document.getElementById('active-content');
        
        if(!nav || !content || !target) return;

        nav.classList.add('hidden');
        content.classList.remove('hidden');

        if (sektor === 'sport') {
            this.renderAnalysisCenter();
        } else if (sektor === 'orga') {
            this.renderOrga();
        }
    },

    renderAnalysisCenter() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        let html = `
            <div class="analysis-header">
                <h3>📊 ANALYSEZENTRUM</h3>
                <button onclick="BriefcaseUI.showAddPlayerForm()" class="action-btn">+ NEUER SPIELER</button>
            </div>
            <div id="dynamic-sub-content"><div class="player-grid-view">`;
        
        players.forEach(p => {
            html += `
                <div class="player-card red-border" onclick="BriefcaseUI.openSetcard(${p.id})">
                    <span class="p-number">#${p.number}</span> 
                    <b>${p.name}</b> 
                    <span class="p-pos">${p.pos}</span>
                </div>`;
        });
        html += `</div></div>`;
        target.innerHTML = html;
    },

    openSetcard(id) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(player => player.id === id);
        const target = document.getElementById('active-content');
        // Berechnung OVR aus den 6 FIFA-Stats
        const ovr = Math.round((p.pac + p.sho + p.pas + p.dri + p.def + p.phy) / 6);

        target.innerHTML = `
            <div class="setcard-nav">
                <button onclick="BriefcaseUI.renderAnalysisCenter()" class="back-btn">← KADER</button>
                <div class="tab-system">
                    <button onclick="BriefcaseUI.toggleTab('front')" class="tab-btn active" id="btn-front">FIFA-STYLE</button>
                    <button onclick="BriefcaseUI.toggleTab('back')" class="tab-btn" id="btn-back">TRAINER-ANALYSE</button>
                </div>
            </div>

            <div id="setcard-front" class="setcard-side">
                <div class="fifa-card-container">
                    <div class="fifa-card gold">
                        <div class="card-inner">
                            <div class="card-rating">${ovr}</div>
                            <div class="card-pos">${p.pos}</div>
                            <div class="card-pic">👤</div>
                            <div class="card-name">${p.name.toUpperCase()}</div>
                            <div class="card-stats">
                                <div><span>${p.pac}</span> PAC</div><div><span>${p.sho}</span> SHO</div>
                                <div><span>${p.pas}</span> PAS</div><div><span>${p.dri}</span> DRI</div>
                                <div><span>${p.def}</span> DEF</div><div><span>${p.phy}</span> PHY</div>
                            </div>
                        </div>
                    </div>
                    <div class="quick-info">
                        <h3>BASIS-WERTE</h3>
                        ${['pac','sho','pas','dri','def','phy'].map(s => `
                            <label>${s.toUpperCase()}</label>
                            <input type="number" value="${p[s]}" onchange="BriefcaseUI.updateStat(${p.id}, '${s}', this.value)">
                        `).join('')}
                    </div>
                </div>
            </div>

            <div id="setcard-back" class="setcard-side hidden">
                <div class="trainer-grid">
                    <div class="trainer-box">
                        <h4>🏃 PHYSIS</h4>
                        <label>PULS (HF)</label><input type="number" value="${p.hr || 0}" onchange="BriefcaseUI.updateStat(${p.id}, 'hr', this.value)">
                        <label>DISTANZ (KM)</label><input type="number" step="0.1" value="${p.dist || 0}" onchange="BriefcaseUI.updateStat(${p.id}, 'dist', this.value)">
                    </div>
                    <div class="trainer-box">
                        <h4>🧠 MOTIVATION</h4>
                        <label>STATUS</label>
                        <select onchange="BriefcaseUI.updateStat(${p.id}, 'mental_status', this.value)">
                            <option ${p.mental_status==='Fokussiert'?'selected':''}>Fokussiert</option>
                            <option ${p.mental_status==='Frustriert'?'selected':''}>Frustriert</option>
                            <option ${p.mental_status==='Lethargisch'?'selected':''}>Lethargisch</option>
                        </select>
                        <label>LEVEL (0-100)</label>
                        <input type="range" value="${p.motivation || 50}" onchange="BriefcaseUI.updateStat(${p.id}, 'motivation', this.value)">
                    </div>
                    <div class="trainer-box full-width" style="text-align:center;">
                        <button class="analysis-trigger-btn" onclick="BriefcaseUI.triggerToniAnalysis(${p.id})">TONI UM RAT FRAGEN</button>
                    </div>
                </div>
            </div>
        `;
    },

    toggleTab(side) {
        document.getElementById('setcard-front').classList.toggle('hidden', side === 'back');
        document.getElementById('setcard-back').classList.toggle('hidden', side === 'front');
        document.getElementById('btn-front').classList.toggle('active', side === 'front');
        document.getElementById('btn-back').classList.toggle('active', side === 'back');
    },

    updateStat(id, stat, value) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(player => player.id === id);
        p[stat] = isNaN(value) ? value : parseFloat(value);
        localStorage.setItem('toni_players', JSON.stringify(players));
    },

    triggerToniAnalysis(id) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(player => player.id === id);
        const panel = document.getElementById('setcard-content');
        
        let advice = "Björn, basierend auf den Daten ist der Spieler bereit.";
        if(p.mental_status === 'Frustriert') advice = "Er braucht Zuspruch. Erinnere ihn an seine Stärken im Brazilian Style.";
        
        panel.innerHTML = `<div class="toni-speech-bubble"><small>TONI'S TIPP</small><br><br>${advice}</div>`;
    },

    renderOrga() {
        const target = document.getElementById('active-content');
        target.innerHTML = `<h3>🏢 GESCHÄFTSZIMMER</h3><textarea id="stadion-notes" class="orga-box" style="width:100%; height:350px; margin-top:15px;"></textarea><button onclick="BriefcaseUI.saveOrga()" class="action-btn" style="margin-top:10px;">SPEICHERN</button>`;
        const saved = localStorage.getItem('toni_orga_notes');
        if(saved) document.getElementById('stadion-notes').value = saved;
    },

    saveOrga() { localStorage.setItem('toni_orga_notes', document.getElementById('stadion-notes').value); alert("Gespeichert!"); },
    
    showAddPlayerForm() {
        document.getElementById('dynamic-sub-content').innerHTML = `
            <div class="form-container">
                <h4>NEUER SPIELER</h4>
                <div class="edit-grid">
                    <label>NAME</label><input type="text" id="new-name">
                    <label>NUMMER</label><input type="number" id="new-number">
                    <label>POSITION</label><select id="new-pos"><option>TW</option><option>IV</option><option>ZDM</option><option>ST</option></select>
                </div>
                <button onclick="BriefcaseUI.saveNewPlayer()" class="action-btn" style="margin-top:15px;">ANLEGEN</button>
            </div>`;
    },

    saveNewPlayer() {
        const name = document.getElementById('new-name').value;
        const number = document.getElementById('new-number').value;
        const pos = document.getElementById('new-pos').value;
        if(!name || !number) return alert("Fehlende Daten!");
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        players.push({id: Date.now(), name, number, pos, pac:50, sho:50, pas:50, dri:50, def:50, phy:50, hr:0, dist:0, mental_status:'Fokussiert'});
        localStorage.setItem('toni_players', JSON.stringify(players));
        this.renderAnalysisCenter();
    },

    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    }
};
