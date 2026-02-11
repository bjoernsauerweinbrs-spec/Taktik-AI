/**
 * TONI 2.0 - SEKTOR SPONSORING & EVENTS (MASTER SYNC 2026)
 * Fokus: Deal-Management, Event-Kalkulation & KI-Anschreiben-Generator.
 * Status: MASTER-SYNC COMPLETED
 */
window.SektorSponsoring = {
    open() {
        const content = document.getElementById('active-content');
        if (!content) return;
        this.render();
    },

    render() {
        const content = document.getElementById('active-content');
        // Zugriff auf die zentrale Datenbank
        const activeDeals = (window.Database && window.Database.sponsors) ? window.Database.sponsors : [];

        content.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 350px; gap: 20px; height: 100%;">
                
                <div style="overflow-y: auto; padding-right: 10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <div>
                            <h2 style="color:#00d1ff; font-family:'Orbitron'; margin:0; font-size:1.2rem;">SPONSORING & FINANZEN</h2>
                            <small style="color:#666;">MASTER-SYNC: AKTIVE PARTNERSCHAFTEN</small>
                        </div>
                        <div style="display:flex; gap:10px;">
                            <button class="tactic-btn" onclick="window.SektorSponsoring.openLetterGenerator()" style="font-size:0.7rem; border-color:#00d1ff;">
                                <i class="fas fa-file-alt"></i> KI-ANSCHREIBEN
                            </button>
                            <button class="pro-btn-gold" onclick="window.SektorSponsoring.openAddModal()" style="font-size:0.7rem;">+ NEUER DEAL</button>
                        </div>
                    </div>

                    <div style="background:rgba(255,255,255,0.03); border:1px solid #333; border-radius:12px; padding:15px; margin-bottom:25px;">
                        <table style="width:100%; border-collapse:collapse; font-size:0.8rem; color:#fff;">
                            <thead>
                                <tr style="border-bottom:1px solid #444; color:#666; text-align:left;">
                                    <th style="padding:10px;">PARTNER</th>
                                    <th>TYP</th>
                                    <th>BUDGET</th>
                                    <th style="text-align:right;">AKTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${activeDeals.length > 0 ? activeDeals.map(d => `
                                    <tr style="border-bottom:1px solid #222;">
                                        <td style="padding:12px; display:flex; align-items:center; gap:10px;">
                                            ${d.logo ? `<img src="${d.logo}" style="height:20px; border-radius:3px;">` : `<i class="fas fa-building" style="color:#333;"></i>`}
                                            <span style="font-weight:bold;">${d.name}</span>
                                        </td>
                                        <td style="color:#888;">${d.type || 'Partner'}</td>
                                        <td style="color:var(--neon-green); font-family:'Orbitron';">${d.income || d.betrag || 0} €</td>
                                        <td style="text-align:right;">
                                            <button onclick="window.SektorSponsoring.remove('${d.id}')" style="background:none; border:none; color:#ff3b30; cursor:pointer;"><i class="fas fa-times"></i></button>
                                        </td>
                                    </tr>
                                `).join('') : '<tr><td colspan="4" style="padding:20px; text-align:center; color:#444;">Keine Deals aktiv.</td></tr>'}
                            </tbody>
                        </table>
                    </div>

                    <h2 style="color:var(--accent-orange); font-family:'Orbitron'; margin-bottom:15px; font-size:1.1rem;">EVENT-PLANER</h2>
                    <div style="background:rgba(255,149,0,0.05); border:1px solid rgba(255,149,0,0.2); border-radius:12px; padding:20px;">
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                            <div>
                                <label style="font-size:0.7rem; color:#888;">GEPLANTE TEILNEHMER (Turnier/Fest)</label>
                                <input type="number" id="event-people" value="100" oninput="window.SektorSponsoring.recalcEvent()" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px; border-radius:8px; margin-top:5px;">
                            </div>
                            <div id="event-result" style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px; font-size:0.75rem;">
                                <strong style="color:var(--accent-orange);">TONI-PROGNOSE:</strong><br>Berechne...
                            </div>
                        </div>
                    </div>
                </div>

                <div style="background:rgba(0,0,0,0.2); border-left:1px solid #333; padding-left:20px;">
                    <h3 style="font-size:0.75rem; color:var(--data-cyan); letter-spacing:1px; margin-bottom:15px; font-family:'Orbitron';">AKQUISE-BERATER</h3>
                    <div style="font-size:0.8rem; color:#aaa; line-height:1.4;">
                        <div style="margin-bottom:15px; padding:12px; background:rgba(0,209,255,0.05); border:1px solid rgba(0,209,255,0.2); border-radius:8px;">
                            <small style="color:var(--data-cyan);">TONI TIPP:</small><br>
                            Nutze den <strong>KI-Anschreiben-Generator</strong>, um Partner für die <strong>Stadionzeitung</strong> zu gewinnen. Lokale Firmen fördern gerne die Jugend!
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="sponsor-modal" class="hidden" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:#0a0a0a; border:2px solid #00d1ff; padding:30px; border-radius:15px; z-index:1000002; width:400px; box-shadow:0 0 100px #000;">
                <div id="sponsor-form-content"></div>
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
            <span style="color:var(--neon-green); font-weight:bold;">Voraussichtl. Gewinn: ~${gewinn.toFixed(0)} €</span>
        `;
    },

    openLetterGenerator() {
        const clubName = (window.BriefcaseUI && window.BriefcaseUI.clubData) ? window.BriefcaseUI.clubData.name : "FC TONI 2.0";
        const overlay = document.createElement('div');
        overlay.id = "letter-overlay";
        overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:20000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(10px);";
        
        overlay.innerHTML = `
            <div style="background:#111; border:1px solid #00d1ff; padding:30px; border-radius:20px; width:600px; max-height:90vh; overflow-y:auto; box-shadow:0 0 50px rgba(0,209,255,0.2);">
                <h3 style="color:#00d1ff; font-family:'Orbitron'; margin-bottom:20px;">KI-ANSCHREIBEN GENERATOR</h3>
                <div style="margin-bottom:20px;">
                    <label style="color:#666; font-size:0.7rem;">STRATEGIE WÄHLEN</label>
                    <select id="letter-type" onchange="window.SektorSponsoring.updateLetterPreview()" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px; border-radius:8px;">
                        <option value="jugend">Jugend-Förderung (Emotional)</option>
                        <option value="event">Turnier-Partner (Marketing)</option>
                        <option value="business">Business-Partner (Professionell)</option>
                    </select>
                </div>
                <div id="letter-preview" style="background:#fff; color:#333; padding:20px; border-radius:5px; font-family:serif; font-size:0.9rem; min-height:300px; white-space:pre-wrap;"></div>
                <div style="display:flex; gap:10px; margin-top:20px;">
                    <button class="pro-btn" onclick="document.getElementById('letter-overlay').remove()" style="flex:1;">ABBRECHEN</button>
                    <button class="pro-btn-gold" onclick="window.SektorSponsoring.copyLetter()" style="flex:1;">IN ZWISCHENABLAGE</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        this.updateLetterPreview();
    },

    updateLetterPreview() {
        const type = document.getElementById('letter-type').value;
        const club = (window.BriefcaseUI && window.BriefcaseUI.clubData) ? window.BriefcaseUI.clubData.name : "FC TONI 2.0";
        const coach = (window.BriefcaseUI && window.BriefcaseUI.clubData) ? window.BriefcaseUI.clubData.coach : "Björn";
        
        let text = "";
        if(type === "jugend") {
            text = `Sehr geehrte Damen und Herren,\n\nfür unsere Jugendabteilung vom ${club} suchen wir aktuell starke Partner. Wir möchten unseren Talenten die bestmögliche Ausrüstung bieten.\n\nHaben Sie Interesse, als Pate unsere Zukunft zu fördern? Ihr Logo würde einen Ehrenplatz in unserer neuen Stadionzeitung erhalten.\n\nMit sportlichen Grüßen,\n${coach}`;
        } else if(type === "event") {
            text = `Hallo!\n\n${club} plant ein großes Event! Wir erwarten über 100 Gäste und suchen noch Partner für das Catering und die Tombola.\n\nPräsentieren Sie sich als lokaler Unterstützer direkt am Spielfeldrand!\n\nBeste Grüße,\n${coach}`;
        } else {
            text = `Sehr geehrte Geschäftspartner,\n\nder ${club} bietet Ihnen attraktive Werbeflächen. Mit unserer neuen digitalen Stadionzeitung erreichen wir die Region direkt und emotional.\n\nGerne stellen wir Ihnen unsere Pakete (Banden, Trikots) vor.\n\nFreundliche Grüße,\n${coach}`;
        }
        document.getElementById('letter-preview').innerText = text;
    },

    copyLetter() {
        const text = document.getElementById('letter-preview').innerText;
        navigator.clipboard.writeText(text);
        alert("Text kopiert! Du kannst ihn jetzt in dein E-Mail-Programm einfügen.");
    },

    openAddModal() {
        const modal = document.getElementById('sponsor-modal');
        const content = document.getElementById('sponsor-form-content');
        modal.classList.remove('hidden');
        content.innerHTML = `
            <h3 style="color:#00d1ff; font-family:'Orbitron'; font-size:0.9rem; margin-bottom:20px;">NEUEN DEAL ABSCHLIESSEN</h3>
            <input type="text" id="sp-name" placeholder="Firma / Partner" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:10px; margin-bottom:10px;">
            <input type="text" id="sp-logo" placeholder="Logo URL (Optional)" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:10px; margin-bottom:10px;">
            <select id="sp-type" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:10px; margin-bottom:10px;">
                <option value="Trikot">Trikot-Sponsor</option>
                <option value="Bande">Banden-Werbung</option>
                <option value="Events">Event-Partner</option>
            </select>
            <input type="number" id="sp-income" placeholder="Betrag in €" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:10px; margin-bottom:20px;">
            <div style="display:flex; gap:10px;">
                <button class="pro-btn-gold" style="flex:1;" onclick="window.SektorSponsoring.saveNew()">SPEICHERN</button>
                <button class="tactic-btn" style="flex:1;" onclick="document.getElementById('sponsor-modal').classList.add('hidden')">ABBRECHEN</button>
            </div>
        `;
    },

    saveNew() {
        const name = document.getElementById('sp-name').value;
        const income = document.getElementById('sp-income').value;
        if(!name || !income) return;

        const newSponsor = {
            id: Date.now(),
            name: name,
            logo: document.getElementById('sp-logo').value,
            type: document.getElementById('sp-type').value,
            income: income,
            status: "Aktiv"
        };

        if(!window.Database.sponsors) window.Database.sponsors = [];
        window.Database.sponsors.push(newSponsor);
        window.Database.save();
        document.getElementById('sponsor-modal').classList.add('hidden');
        this.render();
        if(window.ToniVoice) window.ToniVoice.speak(`Deal mit ${name} wurde versiegelt.`);
    },

    remove(id) {
        if(confirm("Vertrag wirklich kündigen?")) {
            window.Database.sponsors = window.Database.sponsors.filter(s => s.id != id);
            window.Database.save();
            this.render();
        }
    }
};
