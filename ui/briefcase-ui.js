(function() {
    window.BriefcaseUI = {
        renderSport() {
            const target = document.getElementById('sub-content');
            target.innerHTML = `
                <div style="background:rgba(255,255,255,0.05); padding:30px; border-radius:20px;">
                    <h2 style="color:#FF6A00;">👟 Sporttasche: Kader-Steuerung</h2>
                    <p style="font-size:12px; margin-bottom:20px;">Wähle Spieler für das aktive Board aus.</p>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                        <div style="padding:15px; background:rgba(255,255,255,0.03); border-radius:10px; display:flex; justify-content:space-between;">
                            <span>#4 David Luiz (IV)</span> <button style="color:#28C76F; background:none; border:none; cursor:pointer;">AKTIV</button>
                        </div>
                    </div>
                </div>
            `;
        },
        renderMedical() {
            const target = document.getElementById('sub-content');
            target.innerHTML = `<h2 style="color:#00D1FF;">⌚ Medical Hub: Sportuhr-Anbindung</h2><p style="margin-top:20px;">Synchronisiere Garmin / Apple Watch Daten...</p>`;
        },
        renderOrga() {
            const target = document.getElementById('sub-content');
            target.innerHTML = `<h2 style="color:#FFD166;">🏢 Geschäftszimmer: Media & Sponsoren</h2><p style="margin-top:20px;">Stadionzeitung Editor wird geladen...</p>`;
        }
    };

    window.showFullSetcard = function(player) {
        const side = document.getElementById('setcard-content');
        const statusColor = player.status === "Bereit" ? "#28C76F" : "#FF6A00";
        
        side.innerHTML = `
            <div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:15px; border: 1px solid rgba(0,209,255,0.2);">
                <h3 style="color:#FF6A00; font-size:22px;">${player.name}</h3>
                <div style="font-size:40px; font-weight:bold; margin:10px 0;">#${player.number}</div>
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:20px;">
                    <span>POS: ${player.pos}</span> <span style="color:${statusColor};">${player.status}</span>
                </div>
                
                <hr style="opacity:0.1; margin:20px 0;">
                
                <div style="margin-bottom:20px;">
                    <label style="font-size:10px; text-transform:uppercase; letter-spacing:1px;">Taktik-Form: <b>${player.rating}/10</b></label>
                    <input type="range" min="1" max="10" value="${player.rating}" style="width:100%; margin-top:10px; accent-color:#00D1FF;">
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; font-size:11px;">
                    <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px;">
                        <div style="color:#667085;">PULS</div><div style="font-size:16px;">${player.hr} BPM</div>
                    </div>
                    <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px;">
                        <div style="color:#667085;">SCHLAF</div><div style="font-size:16px;">${player.sleep}</div>
                    </div>
                </div>
                
                <div style="margin-top:20px; padding:10px; background:rgba(40,199,111,0.1); border-radius:8px; font-size:11px; color:#28C76F;">
                    🥗 Empfehlung: Fokus auf Kohlenhydrate
                </div>
            </div>
        `;
    };
})();
