window.BriefcaseUI = {
    init: function() {
        let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
        if (pl.length === 0) {
            pl.push({
                id: 'muster_1', name: 'David Luiz (Muster)', number: '4', pos: 'IV',
                rating: 85, pace: 75, shooting: 60, passing: 82, ginga: 90, defense: 88, stamina: 80, pulse: 72, 
                photo: '', status: 'Fit', isMuster: true
            });
            localStorage.setItem('toni_players', JSON.stringify(pl));
        }
    },

    toggle: function() {
        var overlay = document.getElementById('briefcase-overlay');
        if (overlay) {
            overlay.classList.toggle('hidden');
            if (!overlay.classList.contains('hidden')) { this.backToNav(); }
        }
    },

    backToNav: function() {
        var nav = document.getElementById('briefcase-nav');
        var content = document.getElementById('briefcase-content');
        var title = document.getElementById('sector-title');
        if(!nav || !content) return;
        nav.classList.remove('hidden');
        content.classList.add('hidden');
        title.innerText = "ZENTRALE AKTTENTASCHE";
        this.renderFolderGrid();
    },

    renderFolderGrid: function() {
        var nav = document.getElementById('briefcase-nav');
        if(!nav) return;
        var folders = [
            { id: 'taktik', name: 'TAKTIKEN', icon: 'fa-project-diagram', color: '#ff9500' },
            { id: 'sport', name: 'SPIELER', icon: 'fa-users', color: '#ff9500' },
            { id: 'training', name: 'TRAINING', icon: 'fa-dumbbell', color: '#ff9500' },
            { id: 'matchplan', name: 'MATCHPLANS', icon: 'fa-clipboard-list', color: '#00d1ff' },
            { id: 'media', name: 'MEDIA', icon: 'fa-photo-video', color: '#00d1ff' },
            { id: 'sponsoring', name: 'SPONSORING', icon: 'fa-handshake', color: '#00d1ff' },
            { id: 'templates', name: 'TEMPLATES', icon: 'fa-file-invoice', color: '#888' },
            { id: 'reports', name: 'REPORTS', icon: 'fa-chart-line', color: '#888' },
            { id: 'system', name: 'SYSTEM', icon: 'fa-cogs', color: '#888' }
        ];
        nav.innerHTML = '<div class="folder-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; padding: 10px;">' +
            folders.map(function(f) {
                return '<div class="folder-card" onclick="BriefcaseUI.switchSektor(\'' + f.id + '\')" ' +
                    'style="background: rgba(255,255,255,0.03); border: 1px solid #333; padding: 25px; border-radius: 12px; text-align: center; cursor: pointer;">' +
                    '<i class="fas ' + f.icon + '" style="font-size: 2rem; color: ' + f.color + '; margin-bottom: 10px; display: block;"></i>' +
                    '<span style="font-size: 0.75rem; font-weight: bold; color: #fff;">' + f.name + '</span>' +
                    '</div>';
            }).join('') + '</div>';
    },

    switchSektor: function(sektor) {
        document.getElementById('briefcase-nav').classList.add('hidden');
        document.getElementById('briefcase-content').classList.remove('hidden');
        document.getElementById('sector-title').innerHTML = '<button onclick="BriefcaseUI.backToNav()" style="background:none; border:none; color:#ff9500; cursor:pointer; margin-right:10px;"><i class="fas fa-arrow-left"></i></button> ' + sektor.toUpperCase();
        if (sektor === 'sport') this.renderSporttasche();
        else if (sektor === 'system') this.renderSystem();
        else this.renderPlaceholder(sektor);
    },

    // --- SYSTEM (FIX: PROVIDER AUSWAHL) ---
    renderSystem: function() {
        var currentKey = localStorage.getItem('toni_api_key') || "";
        var currentProvider = localStorage.getItem('toni_api_provider') || "llama";
        document.getElementById('active-content').innerHTML = `
            <div style="padding: 20px; border: 1px solid #333; border-radius: 15px; background: rgba(255,255,255,0.02);">
                <h4 style="color:#fff; margin-bottom:10px;">KI-SETUP</h4>
                <div style="margin-bottom:20px;">
                    <label style="display:block; font-size:0.7rem; color:#888; margin-bottom:5px;">PROVIDER AUSWÄHLEN</label>
                    <select id="api-provider" style="width:100%; background:#000; color:#fff; border:1px solid #444; padding:10px; border-radius:5px;">
                        <option value="llama" ${currentProvider==='llama'?'selected':''}>Gemma 3 (MacBook / Ollama)</option>
                        <option value="openai" ${currentProvider==='openai'?'selected':''}>OpenAI (GPT-4o)</option>
                        <option value="groq" ${currentProvider==='groq'?'selected':''}>Groq (Ultra-Fast)</option>
                    </select>
                </div>
                <div style="margin-bottom:20px;">
                    <label style="display:block; font-size:0.7rem; color:#888; margin-bottom:5px;">API-KEY</label>
                    <input type="password" id="api-key-input" style="width:100%; background:#000; color:#fff; border:1px solid #444; padding:10px; border-radius:5px;" value="${currentKey}">
                </div>
                <button class="login-btn" style="width:100%; height:45px; background:#ff9500; color:#000; font-weight:bold;" onclick="BriefcaseUI.saveSettings()">SPEICHERN</button>
            </div>`;
    },

    saveSettings: function() {
        localStorage.setItem('toni_api_key', document.getElementById('api-key-input').value);
        localStorage.setItem('toni_api_provider', document.getElementById('api-provider').value);
        alert("Konfiguration gesichert!");
    },

    // --- FIFA-CARD MIT FOTO-UPLOAD ---
    openFIFAcard: function(id) {
        var players = JSON.parse(localStorage.getItem('toni_players')) || [];
        var p = players.find(function(x) { return x.id == id; });
        if(!p) return;

        var pac = p.pace || 50, sho = p.shooting || 50, pas = p.passing || 50, gin = p.ginga || 50, def = p.defense || 50, sta = p.stamina || 50;
        var photoSrc = p.photo || 'https://via.placeholder.com/150?text=Foto';

        document.getElementById('active-content').innerHTML = `
            <div style="display: flex; gap: 30px; background: #000; padding: 25px; border-radius: 15px; border: 1px solid #ff9500;">
                <div id="card-preview" style="width: 240px; height: 360px; background: linear-gradient(145deg, #d4af37, #b8860b); border-radius: 10px; padding: 20px; color: #111; text-align: center; position: relative;">
                    <div id="v-rating" style="font-size: 4rem; font-weight: 900; line-height:1;">${p.rating || 80}</div>
                    <div style="font-weight:bold; text-transform:uppercase;">${p.pos || 'IV'}</div>
                    
                    <div onclick="document.getElementById('photo-upload').click()" style="width:120px; height:120px; margin: 10px auto; border-radius:50%; background:#333; overflow:hidden; border:3px solid rgba(0,0,0,0.1); cursor:pointer;">
                        <img id="v-photo" src="${photoSrc}" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                    <input type="file" id="photo-upload" style="display:none;" accept="image/*" onchange="BriefcaseUI.handlePhoto(event, '${id}')">

                    <div style="font-size: 1.5rem; font-weight: 900; margin-top: 10px; text-transform: uppercase; border-bottom: 2px solid rgba(0,0,0,0.1);">${p.name}</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; margin-top: 15px; font-weight: bold; font-size: 0.9rem; text-align: left; padding-left: 10px;">
                        <div><span id="c-pac">${pac}</span> PAC</div><div><span id="c-gin">${gin}</span> GIN</div>
                        <div><span id="c-sho">${sho}</span> SHO</div><div><span id="c-def">${def}</span> DEF</div>
                        <div><span id="c-pas">${pas}</span> PAS</div><div><span id="c-sta">${sta}</span> STA</div>
                    </div>
                </div>
                <div style="flex-grow: 1;">
                    <h3 style="color:#ff9500; margin-top:0;">ATTRIBUTE ANPASSEN</h3>
                    <label style="font-size:0.7rem; color:#888;">PAC</label><input type="range" id="i-pac" value="${pac}" oninput="BriefcaseUI.sync('${id}')">
                    <label style="font-size:0.7rem; color:#888;">SHO</label><input type="range" id="i-sho" value="${sho}" oninput="BriefcaseUI.sync('${id}')">
                    <label style="font-size:0.7rem; color:#888;">PAS</label><input type="range" id="i-pas" value="${pas}" oninput="BriefcaseUI.sync('${id}')">
                    <label style="font-size:0.7rem; color:#888;">GIN</label><input type="range" id="i-gin" value="${gin}" oninput="BriefcaseUI.sync('${id}')">
                    <label style="font-size:0.7rem; color:#888;">DEF</label><input type="range" id="i-def" value="${def}" oninput="BriefcaseUI.sync('${id}')">
                    <label style="font-size:0.7rem; color:#888;">STA</label><input type="range" id="i-sta" value="${sta}" oninput="BriefcaseUI.sync('${id}')">
                    <button class="login-btn" style="width:100%; margin-top:15px;" onclick="BriefcaseUI.renderSporttasche()">FERTIG & SPEICHERN</button>
                </div>
            </div>`;
    },

    handlePhoto: function(event, id) {
        var file = event.target.files[0];
        if(!file) return;
        var reader = new FileReader();
        reader.onload = function(e) {
            var dataUrl = e.target.result;
            document.getElementById('v-photo').src = dataUrl;
            let players = JSON.parse(localStorage.getItem('toni_players')) || [];
            const i = players.findIndex(function(x) { return x.id == id; });
            if(i !== -1) {
                players[i].photo = dataUrl;
                localStorage.setItem('toni_players', JSON.stringify(players));
            }
        };
        reader.readAsDataURL(file);
    },

    // ... (restliche Standardfunktionen sync, renderSporttasche, addPlayerPrompt bleiben identisch)
};
