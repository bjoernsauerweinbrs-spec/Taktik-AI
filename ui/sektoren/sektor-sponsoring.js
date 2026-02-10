/**
 * TONI 2.0 - SEKTOR SPONSORING & EVENTS (ELITE UPDATE)
 * Fokus: Deal-Management, Event-Kalkulation & KI-Anschreiben-Generator.
 */
window.SektorSponsoring = {
    open() {
        const content = document.getElementById('active-content');
        if (!content) return;
        this.render();
    },

    render() {
        const content = document.getElementById('active-content');
        const activeDeals = (window.Database && window.Database.deals) ? window.Database.deals : [
            { id: 1, name: "Müller Bau", type: "Trikot", betrag: 500, status: "Aktiv" }
        ];

        content.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 350px; gap: 20px; height: 100%;">
                
                <div style="overflow-y: auto; padding-right: 10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <h2 style="color:#00d1ff; font-family:'Orbitron'; margin:0; font-size:1.2rem;">SPONSORING & FINANZEN</h2>
                        <div style="display:flex; gap:10px;">
                            <button class="tactic-btn" onclick="window.SektorSponsoring.openLetterGenerator()" style="font-size:0.7rem; border-color:#00d1ff;">
                                <i class="fas fa-file-alt"></i> KI-ANSCHREIBEN
                            </button>
                            <button class="pro-btn-gold" onclick="alert('Funktion folgt')" style="font-size:0.7rem;">+ NEUER DEAL</button>
                        </div>
                    </div>

                    <div style="background:rgba(255,255,255,0.03); border:1px solid #333; border-radius:12px; padding:15px; margin-bottom:25px;">
                        <table style="width:100%; border-collapse:collapse; font-size:0.8rem; color:#fff;">
                            <thead>
                                <tr style="border-bottom:1px solid #444; color:#666; text-align:left;">
                                    <th style="padding:10px;">PARTNER</th>
                                    <th>TYP</th>
                                    <th>BETRAG</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${activeDeals.map(d => `
                                    <tr style="border-bottom:1px solid #222;">
                                        <td style="padding:12px; font-weight:bold;">${d.name}</td>
                                        <td style="color:#888;">${d.type}</td>
                                        <td style="color:var(--neon-green); font-family:'Orbitron';">${d.betrag} €</td>
                                        <td><span style="background:rgba(57,255,20,0.1); color:var(--neon-green); padding:3px 8px; border-radius:4px; font-size:0.6rem;">${d.status}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <h2 style="color:var(--accent-orange); font-family:'Orbitron'; margin-bottom:15px; font-size:1.1rem;">EVENT-PLANER</h2>
                    <div style="background:rgba(255,149,0,0.05); border:1px solid rgba(255,149,0,0.2); border-radius:12px; padding:20px;">
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                            <div>
                                <label style="font-size:0.7rem; color:#888;">GEPLANTE TEILNEHMER</label>
                                <input type="number" id="event-people" value="100" oninput="window.SektorSponsoring.recalcEvent()" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px; border-radius:8px; margin-top:5px;">
                            </div>
                            <div id="event-result" style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px; font-size:0.75rem;">
                                <strong style="color:var(--accent-orange);">TONI-PROGNOSE:</strong><br>Berechne...
                            </div>
                        </div>
                    </div>
                </div>

                <div style="background:rgba(0,0,0,0.2); border-left:1px solid #333; padding-left:20px;">
                    <h3 style="font-size:0.75rem; color:var(--data-cyan); letter-spacing:1px; margin-bottom:15px;">AKQUISE-BERATER</h3>
                    <div style="font-size:0.8rem; color:#aaa; line-height:1.4;">
                        <div style="margin-bottom:15px; padding:12px; background:rgba(0,209,255,0.05); border:1px solid rgba(0,209,255,0.2); border-radius:8px;">
                            <small style="color:var(--data-cyan);">TONI TIPP:</small><br>
                            Nutze den <strong>KI-Anschreiben-Generator</strong> links, um Partner direkt professionell anzusprechen.
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.recalcEvent();
    },

    recalcEvent() {
        const people = document.getElementById('event-people').value;
        const results = document.getElementById('event-result');
        const wurst = Math.ceil(people * 1.5);
        const getraenke = Math.ceil(people * 0.8);
        const gewinn = people * 4.50;

        results.innerHTML = `
            <strong style="color:var(--accent-orange);">TONI-BEDARFS-PLAN:</strong><br>
            🌭 ca. ${wurst} Bratwürste | 🥤 ca. ${getraenke}L Getränke<br>
            <span style="color:var(--neon-green); font-weight:bold;">Möglicher Gewinn: ~${gewinn.toFixed(0)} €</span>
        `;
    },

    openLetterGenerator() {
        const clubName = (window.BriefcaseUI && window.BriefcaseUI.clubData) ? window.BriefcaseUI.clubData.name : "unseren Verein";
        
        const overlay = document.createElement('div');
        overlay.id = "letter-overlay";
        overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:20000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(10px);";
        
        overlay.innerHTML = `
            <div style="background:#111; border:1px solid #00d1ff; padding:30px; border-radius:20px; width:600px; max-height:90vh; overflow-y:auto; box-shadow:0 0 50px rgba(0,209,255,0.2);">
                <h3 style="color:#00d1ff; font-family:'Orbitron'; margin-bottom:20px;">KI-ANSCHREIBEN GENERATOR</h3>
                
                <div style="margin-bottom:20px;">
                    <label style="color:#666; font-size:0.7rem;">ZIELGRUPPE WÄHLEN</label>
                    <select id="letter-type" onchange="window.SektorSponsoring.updateLetterPreview()" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px; border-radius:8px;">
                        <option value="jugend">Jugend-Förderung (Emotional)</option>
                        <option value="event">Event-Partner (Sommerfest/Turnier)</option>
                        <option value="business">Business-Partner (Professionell/Banden)</option>
                    </select>
                </div>

                <div id="letter-preview" style="background:#fff; color:#333; padding:20px; border-radius:5px; font-family:serif; font-size:0.9rem; min-height:300px; white-space:pre-wrap;">
                    </div>

                <div style="display:flex; gap:10px; margin-top:20px;">
                    <button class="pro-btn" onclick="document.getElementById('letter-overlay').remove()" style="flex:1;">SCHLIESSEN</button>
                    <button class="pro-btn-gold" onclick="window.SektorSponsoring.copyLetter()" style="flex:1;">TEXT KOPIEREN</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        this.updateLetterPreview();
    },

    updateLetterPreview() {
        const type = document.getElementById('letter-type').value;
        const club = (window.BriefcaseUI && window.BriefcaseUI.clubData) ? window.BriefcaseUI.clubData.name : "unseren Verein";
        const coach = (window.BriefcaseUI && window.BriefcaseUI.clubData) ? window.BriefcaseUI.clubData.coach : "der Trainer";
        
        let text = "";
        if(type === "jugend") {
            text = `Sehr geehrte Damen und Herren,\n\nfür unsere kleinsten Kicker vom ${club} suchen wir aktuell starke Partner aus der Region. Unsere Jugendabteilung wächst stetig, und wir möchten den Kindern nicht nur Fußball, sondern auch Werte wie Teamgeist und Fairplay vermitteln.\n\nUm die Ausrüstung (z.B. neue Trainingsbälle) zu finanzieren, würden wir uns freuen, Sie als Paten begrüßen zu dürfen. Im Gegenzug präsentieren wir Ihr Logo stolz in unserer Stadionzeitung und auf unseren digitalen Kanälen.\n\nMit sportlichen Grüßen,\n${coach}`;
        } else if(type === "event") {
            text = `Hallo!\n\nAm kommenden Wochenende veranstaltet der ${club} ein großes Jugendturnier. Mit über 100 erwarteten Gästen suchen wir noch Partner für unsere Tombola oder das Catering.\n\nHaben Sie Interesse, sich als lokaler Unterstützer zu präsentieren? Wir bieten Ihnen Werbeflächen direkt am Spielfeldrand und namentliche Nennungen bei allen Durchsagen.\n\nBeste Grüße,\n${coach}`;
        } else {
            text = `Sehr geehrte Geschäftspartner,\n\nder ${club} bietet Ihnen attraktive Werbeflächen in einem emotionalen und reichweitenstarken Umfeld. Mit Fokus auf unsere Region erreichen Sie bei uns direkt Ihre Zielgruppe.\n\nGerne stellen wir Ihnen unsere Sponsoring-Pakete (Bandenwerbung, Trikotsponsoring) in einem persönlichen Gespräch vor.\n\nFreundliche Grüße,\n${coach}`;
        }
        document.getElementById('letter-preview').innerText = text;
    },

    copyLetter() {
        const text = document.getElementById('letter-preview').innerText;
        navigator.clipboard.writeText(text);
        alert("Text in die Zwischenablage kopiert!");
    }
};
