window.BriefcaseUI = {
    // --- INITIALISIERUNG ---
    init: function() {
        console.log("BriefcaseUI wird initialisiert...");
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

    // --- NAVIGATION & UI CONTROLS ---
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
        else if (sektor === 'sponsoring') this.renderSponsoring();
        else this.renderPlaceholder(sektor);
    },

    // --- SPIELER-VERWALTUNG & FIFA-CARD ---
    renderSporttasche: function() {
        var players = JSON.parse(localStorage.getItem('toni_players')) || [];
        document.getElementById('active-content').innerHTML = `
            <div style="padding: 10px;">
                <button class="login-btn" style="width: 100%; margin-bottom: 20px; background:#ff9500; color:#000;" onclick="BriefcaseUI.addPlayerPrompt()">+ NEUEN SPIELER HINZUFÜGEN</button>
                <div class="pro-player-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;">
                    ${players.map(p => `
                        <div class="p-card" onclick="BriefcaseUI.openFIFAcard('${p.id}')" style="background: #151515; border: 1px solid #333; padding: 15px; border-radius: 10px; text-align: center; cursor:pointer;">
                            <div style="font-size: 1.2rem; font-weight: 900; color: #ff9500;">#${p.number || '0'}</div>
                            <b style="font-size: 0.8rem; color: #fff;">${p.name}</b>
                        </div>`).join('')}
                </div>
            </div>`;
    },

    openFIFAcard: function(id) {
        var players = JSON.parse(localStorage.getItem('toni_players')) || [];
        var p = players.find(function(x) { return x.id == id; });
        if(!p) return;

        var currentPins = JSON.parse(localStorage.getItem('toni_player_pins')) || {};
        var playerPin = currentPins[id] ? currentPins[id].pin : "Nicht generiert";
        var photoSrc = p.photo || 'https://via.placeholder.com/110?text=Foto';

        document.getElementById('active-content').innerHTML = `
            <div style="display: grid; grid-template-columns: 240px 1fr; gap: 30px; background: #000; padding: 25px; border-radius: 15px; border: 1px solid #ff9500;">
                <div id="card-preview" style="width: 240px; height: 360px; background: linear-gradient(145deg, #d4af37, #b8860b); border-radius: 10px; padding: 20px; color: #111; text-align: center; position: relative;">
                    <div id="v-rating" style="font-size: 4rem; font-weight: 900; line-height:1;">${p.rating || 80}</div>
                    <div style="font-weight:bold; text-transform:uppercase;">${p.pos || 'IV'}</div>
                    <div onclick="document.getElementById('photo-upload').click()" style="width:110px; height:110px; margin: 10px auto; border-radius:50%; background:#333; overflow:hidden; border:2px solid rgba(0,0,0,0.2); cursor:pointer;">
                        <img id="v-photo" src="${photoSrc}" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                    <input type="file" id="photo-upload" style="display:none;" accept="image/*" onchange="BriefcaseUI.handlePhoto(event, '${id}')">
                    <div style="font-size: 1.3rem; font-weight: 900; text-transform: uppercase;">${p.name}</div>
                    <div style="font-size: 0.65rem; margin-top:10px; background:rgba(0,0,0,0.1); padding:5px; border-radius:5px;">
                        PLAYER-PIN: <b style="letter-spacing:1px;">${playerPin}</b>
                    </div>
                </div>

                <div style="flex-grow: 1;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                        <h3 style="color:#ff9500; margin:0;">ANALYSIS CENTER</h3>
                        <button class="login-btn" style="width:auto; padding:5px 15px; font-size:0.7rem;" onclick="BriefcaseUI.generatePin('${id}')">NEUE PIN GENERIEREN</button>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: rgba(255,255,255,0.03); padding: 20px; border-radius: 10px;">
                        <div>
                            <label style="font-size:0.7rem; color:#888;">PAC</label><input type="range" id="i-pac" value="${p.pace||50}" oninput="BriefcaseUI.sync('${id}')">
                            <label style="font-size:0.7rem; color:#888;">GIN</label><input type="range" id="i-gin" value="${p.ginga||50}" oninput="BriefcaseUI.sync('${id}')">
                            <label style="font-size:0.7rem; color:#888;">PULS</label><input type="number" id="i-pulse" value="${p.pulse||70}" style="width:100%; background:#000; color:#fff; border:1px solid #444;" onchange="BriefcaseUI.sync('${id}')">
                        </div>
                        <div>
                            <label style="font-size:0.7rem; color:#888;">SHO</label><input type="range" id="i-sho" value="${p.shooting||50}" oninput="BriefcaseUI.sync('${id}')">
                            <label style="font-size:0.7rem; color:#888;">DEF</label><input type="range" id="i-def" value="${p.defense||50}" oninput="BriefcaseUI.sync('${id}')">
                            <label style="font-size:0.7rem; color:#888;">STA</label><input type="range" id="i-sta" value="${p.stamina||50}" oninput="BriefcaseUI.sync('${id}')">
                        </div>
                    </div>
                    <div style="margin-top:15px; padding:15px; background:rgba(0,209,255,0.05); border:1px solid #00d1ff; border-radius:10px;">
                        <h4 style="color:#00d1ff; margin:0 0 5px 0; font-size:0.8rem;">DASHBOARD COMPLIANCE</h4>
                        <small style="color:#ccc;">Status: Spieler-Dashboard aktiv | Sichtbarkeit: Privat</small>
                    </div>
                    <button class="login-btn" style="width:100%; margin-top:15px;" onclick="BriefcaseUI.renderSporttasche()">ÄNDERUNGEN SPEICHERN</button>
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
            const i = players.findIndex(x => x.id == id);
            if(i !== -1) {
                players[i].photo = dataUrl;
                localStorage.setItem('toni_players', JSON.stringify(players));
            }
        };
        reader.readAsDataURL(file);
    },

    generatePin: function(playerId) {
        const pin = Math.floor(100000 + Math.random() * 900000);
        let pins = JSON.parse(localStorage.getItem('toni_player_pins')) || {};
        pins[playerId] = { pin: pin, expires: Date.now() + (30 * 24 * 60 * 60 * 1000) };
        localStorage.setItem('toni_player_pins', JSON.stringify(pins));
        this.openFIFAcard(playerId); // Refresh UI
        return pin;
    },

    sync: function(id) {
        var vals = {
            pace: document.getElementById('i-pac').value,
            shooting: document.getElementById('i-sho').value,
            ginga: document.getElementById('i-gin').value,
            defense: document.getElementById('i-def').value,
            stamina: document.getElementById('i-sta').value,
            pulse: document.getElementById('i-pulse').value
        };
        var rating = Math.round((parseInt(vals.pace) + parseInt(vals.shooting) + parseInt(vals.ginga) + parseInt(vals.defense) + parseInt(vals.stamina)) / 5);
        document.getElementById('v-rating').innerText = rating;

        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const i = players.findIndex(x => x.id == id);
        if(i !== -1) {
            Object.assign(players[i], vals);
            players[i].rating = rating;
            localStorage.setItem('toni_players', JSON.stringify(players));
            if(vals.pulse > 160 && window.ToniAI) {
                window.ToniAI.addChatMessage("Toni", "Coach Björn! Puls-Alarm bei " + players[i].name + "!", "bot-msg");
            }
        }
    },

    // --- SPONSORING & COMPLIANCE ---
    renderSponsoring: function() {
        document.getElementById('active-content').innerHTML = `
            <div style="padding: 20px;">
                <h3 style="color:#00d1ff;">PARTNER-BOARD & COMPLIANCE</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top:20px;">
                    <div style="background:white; color:black; padding:40px; border-radius:15px; text-align:center;">
                        <div style="font-weight:900; font-size:2rem;">MUSTER LOGO</div>
                        <div style="margin-top:10px; font-size:0.7rem; border-top:1px solid #eee; padding-top:10px;">HAUPTSPONSOR</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.03); border:1px solid #444; padding:20px; border-radius:15px;">
                        <h4 style="margin-top:0; color:#ffcc00;">AUTO-CHECK</h4>
                        <ul style="font-size:0.8rem; color:#ccc; list-style:none; padding:0;">
                            <li><i class="fas fa-check" style="color:green;"></i> Kontrastverhältnis: 4.8:1</li>
                            <li><i class="fas fa-exclamation-triangle" style="color:orange;"></i> Auflösung: 280 DPI (A5 Druck)</li>
                            <li><i class="fas fa-check" style="color:green;"></i> Exklusivität gewahrt</li>
                        </ul>
                    </div>
                </div>
            </div>`;
    },

    // --- SYSTEM & KI SETTINGS ---
    renderSystem: function() {
        var currentKey = localStorage.getItem('toni_api_key') || "";
        var currentProvider = localStorage.getItem('toni_api_provider') || "llama";
        document.getElementById('active-content').innerHTML = `
            <div style="padding: 20px; border: 1px solid #333; border-radius: 15px; background: rgba(255,255,255,0.02);">
                <h4 style="color:#fff; margin-bottom:15px;">KI-SETUP & PROVIDER</h4>
                <div style="margin-bottom:20px;">
                    <label style="display:block; font-size:0.7rem; color:#888; margin-bottom:5px;">PROVIDER</label>
                    <select id="api-provider" style="width:100%; background:#000; color:#fff; border:1px solid #444; padding:10px; border-radius:5px;">
                        <option value="llama" ${currentProvider==='llama'?'selected':''}>Gemma 3 (MacBook / Ollama)</option>
                        <option value="openai" ${currentProvider==='openai'?'selected':''}>OpenAI (GPT-4o)</option>
                    </select>
                </div>
                <div style="margin-bottom:20px;">
                    <label style="display:block; font-size:0.7rem; color:#888; margin-bottom:5px;">API-KEY</label>
                    <input type="password" id="api-key-input" style="width:100%; background:#000; color:#fff; border:1px solid #444; padding:10px; border-radius:5px;" value="${currentKey}">
                </div>
                <button class="login-btn" style="width:100%; height:45px; background:#ff9500; color:#000; font-weight:bold;" onclick="BriefcaseUI.saveSettings()">KONFIGURATION SPEICHERN</button>
            </div>`;
    },

    saveSettings: function() {
        localStorage.setItem('toni_api_key', document.getElementById('api-key-input').value);
        localStorage.setItem('toni_api_provider', document.getElementById('api-provider').value);
        alert("KI-Konfiguration gesichert!");
    },

    renderPlaceholder: function(s) { document.getElementById('active-content').innerHTML = `<div style="text-align:center; padding:50px; color:#555;">Bereich ${s.toUpperCase()} wird vorbereitet.</div>`; },

    addPlayerPrompt: function() {
        var n = prompt("Name:"); var num = prompt("Nummer:");
        if(n && num) {
            var pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({ id: Date.now(), name: n, number: num, rating: 50, pace: 50, shooting: 50, ginga: 50, defense: 50, stamina: 50, pulse: 70 });
            localStorage.setItem('toni_players', JSON.stringify(pl));
            this.renderSporttasche();
        }
    }
};

// Initialisierung beim Laden
BriefcaseUI.init();
