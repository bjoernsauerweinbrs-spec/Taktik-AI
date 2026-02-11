/**
 * TONI 2.0 - SEKTOR SPONSORING & EVENTS (MASTER SYNC 2026)
 * Fokus: Deal-Management, Event-Kalkulation & Finanz-Integration
 * Status: ETAPPE 5 - KONTOR VERSIEGELT
 */
window.SektorSponsoring = {
    
    open() {
        const content = document.getElementById('active-content');
        if (!content) return;
        this.render();
    },

    render() {
        const content = document.getElementById('active-content');
        const activeDeals = (window.Database && window.Database.sponsors) ? window.Database.sponsors : [];

        content.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 320px; gap: 20px; height: 100%; font-family:'Orbitron';">
                
                <div style="overflow-y: auto; padding-right: 10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom:1px solid #00d1ff; padding-bottom:15px;">
                        <div>
                            <h2 style="color:#00d1ff; margin:0; font-size:1.1rem; letter-spacing:2px;">SPONSORING & FINANZEN</h2>
                            <small style="color:#666;">AKTIVE DEALS: ${activeDeals.length}</small>
                        </div>
                        <div style="display:flex; gap:10px;">
                            <button class="tactic-btn" onclick="window.SektorSponsoring.openLetterGenerator()" style="font-size:0.6rem; border-color:#00d1ff; color:#00d1ff;">
                                <i class="fas fa-robot"></i> KI-ANSCHREIBEN
                            </button>
                            <button class="pro-btn-gold" onclick="window.SektorSponsoring.openAddModal()" style="font-size:0.6rem;">+ DEAL ABSCHLIESSEN</button>
                        </div>
                    </div>

                    <div style="background:rgba(0,209,255,0.02); border:1px solid #222; border-radius:10px; padding:10px; margin-bottom:30px;">
                        <table style="width:100%; border-collapse:collapse; font-size:0.75rem; color:#fff; text-align:left;">
                            <thead>
                                <tr style="border-bottom:1px solid #333; color:#666;">
                                    <th style="padding:10px;">PARTNER</th>
                                    <th>TYP</th>
                                    <th>BUDGET</th>
                                    <th style="text-align:right;">STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${activeDeals.map(d => `
                                    <tr style="border-bottom:1px solid #111;">
                                        <td style="padding:12px; display:flex; align-items:center; gap:10px;">
                                            <i class="fas fa-building" style="color:#00d1ff;"></i>
                                            <span style="font-weight:bold;">${d.name}</span>
                                        </td>
                                        <td style="color:#888;">${d.type}</td>
                                        <td style="color:#39FF14;">${d.income} €</td>
                                        <td style="text-align:right;">
                                            <i class="fas fa-trash" onclick="window.SektorSponsoring.remove('${d.id}')" style="color:#ff3b30; cursor:pointer; font-size:0.8rem;"></i>
                                        </td>
                                    </tr>
                                `).join('')}
                                ${activeDeals.length === 0 ? '<tr><td colspan="4" style="padding:30px; text-align:center; color:#444;">KEINE AKTIVEN PARTNER</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>

                    <h3 style="color:var(--accent-orange); font-size:0.9rem; margin-bottom:15px; letter-spacing:1px;">EVENT-BEDARFS-PLANER</h3>
                    <div style="background:rgba(255,149,0,0.03); border:1px solid rgba(255,149,0,0.2); border-radius:10px; padding:20px;">
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; align-items:center;">
                            <div>
                                <label style="font-size:0.6rem; color:#888;">GÄSTEZAHL PROGNOSE</label>
                                <input type="number" id="event-people" value="100" oninput="window.SektorSponsoring.recalcEvent()" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px; border-radius:5px; margin-top:5px;">
                            </div>
                            <div id="event-result" style="font-size:0.7rem; line-height:1.6; color:#ccc;">
                                </div>
                        </div>
                    </div>
                </div>

                <div style="background:rgba(0,0,0,0.3); border:1px solid #222; border-radius:10px; padding:20px;">
                    <h3 style="font-size:0.7rem; color:#00d1ff; margin-bottom:15px; border-bottom:1px solid #222; padding-bottom:10px;">KI-FINANZ-COACH</h3>
                    <div style="font-size:0.75rem; color:#aaa; line-height:1.6;">
                        <p><i class="fas fa-lightbulb" style="color:#39FF14;"></i> <strong>Tipp:</strong> Stadionzeitung-Anzeigen sind lukrativer als Bandenwerbung.</p>
                        <p style="margin-top:15px; padding:10px; background:rgba(255,255,255,0.02); border-radius:5px;">"Coach, mit den aktuellen Sponsoren decken wir 80% der Saisonkosten ab."</p>
                    </div>
                </div>
            </div>

            <div id="sponsor-modal" class="hidden" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:#0a0a0a; border:2px solid #00d1ff; padding:30px; border-radius:15px; z-index:1000005; width:400px; box-shadow:0 0 100px #000;">
                <div id="sponsor-form-content"></div>
            </div>
        `;
        this.recalcEvent();
    },

    recalcEvent() {
        const people = document.getElementById('event-people').value;
        const results = document.getElementById('event-result');
        if(!results) return;

        const wurst = Math.ceil(people * 1.3);
        const getraenke = Math.ceil(people * 0.75);
        const gewinn = people * 4.25;

        results.innerHTML = `
            <strong style="color:var(--accent-orange);">BEDARF:</strong><br>
            🌭 ${wurst} Bratwürste | 🥤 ${getraenke}L Getränke<br>
            <span style="color:#39FF14; font-weight:bold;">EST. PROFIT: ~${gewinn.toFixed(0)} €</span>
        `;
    },

    openLetterGenerator() {
        const club = (window.coachInfo) ? window.coachInfo.verein : "FC TONI 2.0";
        const coach = (window.coachInfo) ? window.coachInfo.name : "Coach";

        const overlay = document.createElement('div');
        overlay.id = "letter-overlay";
        overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:2000000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(10px);";
        
        overlay.innerHTML = `
            <div style="background:#111; border:1px solid #00d1ff; padding:30px; border-radius:20px; width:550px; color:#fff; font-family:'Orbitron';">
                <h3 style="color:#00d1ff; margin-bottom:20px;">KI-ANSCHREIBEN GENERATOR</h3>
                <select id="letter-type" onchange="window.SektorSponsoring.updateLetterPreview()" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:10px; border-radius:5px; margin-bottom:20px;">
                    <option value="jugend">Jugend-Förderung</option>
                    <option value="stadion">Stadionzeitung Partner</option>
                    <option value="event">Turnier-Sponsor</option>
                </select>
                <div id="letter-preview" style="background:#fff; color:#333; padding:20px; border-radius:5px; font-family:serif; font-size:0.85rem; height:250px; overflow-y:auto; white-space:pre-wrap;"></div>
                <div style="display:flex; gap:10px; margin-top:20px;">
                    <button class="pro-btn" onclick="document.getElementById('letter-overlay').remove()" style="flex:1;">SCHLIESSEN</button>
                    <button class="pro-btn-gold" onclick="window.SektorSponsoring.copyLetter()" style="flex:1;">KOPIEREN</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        this.updateLetterPreview();
    },

    updateLetterPreview() {
        const type = document.getElementById('letter-type').value;
        const club = (window.coachInfo) ? window.coachInfo.verein : "unseren Verein";
        const coach = (window.coachInfo) ? window.coachInfo.name : "Ihr Ansprechpartner";
        
        let text = "";
        if(type === "jugend") {
            text = `Sehr geehrte Damen und Herren,\n\nder ${club} sucht für seine Nachwuchstalente engagierte Partner.\n\nWir möchten unsere Kinder mit neuer Ausrüstung fördern und bieten Ihnen im Gegenzug attraktive Präsenz in unserer digitalen Stadionzeitung.\n\nHaben Sie Interesse an einer Kooperation?\n\nMit sportlichen Grüßen,\n${coach}`;
        } else if(type === "stadion") {
            text = `Hallo,\n\nwir launchen aktuell die neue digitale Stadionzeitung für den ${club}.\n\nMit über 500 Lesern in der Region bieten wir Ihnen eine ideale Werbeplattform direkt im Herzen des Sports.\n\nSichern Sie sich jetzt eine Anzeige!\n\nBeste Grüße,\n${coach}`;
        } else {
            text = `Sehr geehrte Geschäftspartner,\n\nfür unser kommendes Turnier beim ${club} suchen wir Sponsoren für das Catering und die Pokale.\n\nPräsentieren Sie Ihr Unternehmen vor hunderten Zuschauern direkt am Spielfeldrand.\n\nFreundliche Grüße,\n${coach}`;
        }
        document.getElementById('letter-preview').innerText = text;
    },

    copyLetter() {
        const text = document.getElementById('letter-preview').innerText;
        navigator.clipboard.writeText(text);
        alert("Anschreiben in Zwischenablage kopiert!");
    },

    openAddModal() {
        const modal = document.getElementById('sponsor-modal');
        const content = document.getElementById('sponsor-form-content');
        modal.classList.remove('hidden');
        content.innerHTML = `
            <h3 style="color:#00d1ff; font-family:'Orbitron'; font-size:0.8rem; margin-bottom:20px;">NEUER DEAL</h3>
            <label style="font-size:0.5rem; color:#666;">FIRMENNAME</label>
            <input type="text" id="sp-name" placeholder="z.B. Titan Leasing" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:10px; margin-bottom:10px;">
            <label style="font-size:0.5rem; color:#666;">DEAL-TYP</label>
            <select id="sp-type" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:10px; margin-bottom:10px;">
                <option value="Banden">Bandenwerbung</option>
                <option value="Trikot">Trikotsponsor</option>
                <option value="Zeitung">Anzeige Zeitung</option>
            </select>
            <label style="font-size:0.5rem; color:#666;">BETRAG (€)</label>
            <input type="number" id="sp-income" value="500" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:10px; margin-bottom:20px;">
            <div style="display:flex; gap:10px;">
                <button class="pro-btn-gold" style="flex:1;" onclick="window.SektorSponsoring.saveNew()">SICHERN</button>
                <button class="tactic-btn" style="flex:1;" onclick="document.getElementById('sponsor-modal').classList.add('hidden')">STOP</button>
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
            type: document.getElementById('sp-type').value,
            income: parseInt(income)
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
