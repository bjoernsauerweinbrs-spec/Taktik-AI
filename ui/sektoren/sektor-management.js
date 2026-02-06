window.SektorManagement = {
    render: function() {
        const container = document.getElementById('active-content');
        container.innerHTML = `
            <div class="management-grid">
                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-file-alt"></i> STADIONHEFT-GENERATOR</div>
                    <p>Erstelle automatisch ein druckfertiges Matchday-Magazin mit aktuellem Kader.</p>
                    <button class="pro-btn" onclick="window.SektorManagement.generateMagazine()">JETZT GENERIEREN</button>
                </div>

                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-handshake"></i> SPONSORING-BERATER</div>
                    <p>KI-Vorlagen für Sponsoren-Anschreiben und Präsentations-Konzepte.</p>
                    <button class="pro-btn" onclick="window.SektorManagement.showSponsoring()">AKQUISE-VORLAGEN</button>
                </div>

                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-calendar-check"></i> EVENT-ORGANISATION</div>
                    <p>Checklisten für Heimspiele: Sicherheit, Catering und Ablaufplan.</p>
                    <button class="pro-btn" onclick="window.SektorManagement.showEventPlaner()">CHECKLISTEN ÖFFNEN</button>
                </div>
            </div>
            <div id="management-sub-content" class="sub-content-area"></div>
        `;
    },

    generateMagazine: function() {
        const sub = document.getElementById('management-sub-content');
        const players = window.ToniDB.getPlayers().filter(p => p.team === 'home' && p.isPresent);
        
        sub.innerHTML = `
            <div class="preview-box">
                <h3>Vorschau: Stadionheft - Nächstes Heimspiel</h3>
                <div class="magazine-mockup">
                    <div class="page-front">
                        <h4>MATCHDAY MAGAZINE</h4>
                        <div class="lineup-preview">
                            <b>Heutiger Kader:</b><br>
                            ${players.map(p => `#${p.nr} ${p.name}`).join(', ')}
                        </div>
                        <p class="toni-note"><i>Toni's Kommentar: "Wir sind heute taktisch extrem flexibel aufgestellt. Das Pressing wird der Schlüssel."</i></p>
                    </div>
                </div>
                <button class="pro-btn-gold" onclick="alert('Druckauftrag an Drucker gesendet...')">DRUCKEN (PDF)</button>
            </div>
        `;
    },

    showSponsoring: function() {
        const sub = document.getElementById('management-sub-content');
        sub.innerHTML = `
            <div class="preview-box">
                <h3>Sponsoring-Anschreiben (Entwurf)</h3>
                <textarea class="pro-textarea" readonly>
Sehr geehrte Damen und Herren,

als ambitionierter Fußballverein setzen wir auf modernste Technologie und professionelle Strukturen. Für unser nächstes Projekt suchen wir starke Partner aus der Region...
                </textarea>
                <button class="pro-btn" onclick="alert('In Zwischenablage kopiert')">TEXT KOPIEREN</button>
            </div>
        `;
    },

    showEventPlaner: function() {
        const sub = document.getElementById('management-sub-content');
        sub.innerHTML = `
            <div class="preview-box">
                <h3>Checkliste: Nächster Spieltag</h3>
                <ul class="check-list">
                    <li><input type="checkbox"> Schiedsrichter-Empfang vorbereitet</li>
                    <li><input type="checkbox"> Verpflegung Verkaufstand geprüft</li>
                    <li><input type="checkbox"> Platzmarkierungen (Neon-Check) okay</li>
                    <li><input type="checkbox"> Security-Einweisung durchgeführt</li>
                </ul>
            </div>
        `;
    }
};
