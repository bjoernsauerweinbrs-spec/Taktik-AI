/**
 * TONI 2.0 - SEKTOR SPONSORING & BUSINESS (ELITE SYNC 2026)
 * Fokus: Deal-Management, Event-Kalkulation & KI-Marketing
 * Status: CLEAN & SYNCED 2026
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
        const totalIncome = activeDeals.reduce((sum, d) => sum + parseInt(d.income || 0), 0);

        content.innerHTML = `
            <div class="fadeIn" style="display: grid; grid-template-columns: 1fr 340px; gap: 25px; height: 100%; font-family:'Orbitron';">
                
                <div style="overflow-y: auto; padding-right: 15px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom:1px solid var(--data-cyan); padding-bottom:15px;">
                        <div>
                            <h2 style="color:var(--data-cyan); margin:0; font-size:1.1rem; letter-spacing:2px;">SPONSORING & KONTOR</h2>
                            <small style="color:#666; letter-spacing:1px;">GESAMT-BUDGET: ${totalIncome} € // AKTIV: ${activeDeals.length}</small>
                        </div>
                        <div style="display:flex; gap:10px;">
                            <button class="tactic-btn" onclick="window.SektorSponsoring.openLetterGenerator()" style="font-size:0.6rem; border-color:var(--data-cyan); color:var(--data-cyan);">
                                <i class="fas fa-robot"></i> KI-ANSCHREIBEN
                            </button>
                            <button class="pro-btn-gold" onclick="window.SektorSponsoring.openAddModal()" style="font-size:0.65rem;">
                                <i class="fas fa-plus"></i> DEAL ABSCHLIESSEN
                            </button>
                        </div>
                    </div>

                    <div style="background:rgba(0,209,255,0.03); border:1px solid rgba(0,209,255,0.1); border-radius:12px; padding:15px; margin-bottom:30px;">
                        <table style="width:100%; border-collapse:collapse; font-size:0.75rem; color:#fff; text-align:left;">
                            <thead>
                                <tr style="border-bottom:1px solid #333; color:#666; text-transform:uppercase; font-size:0.55rem;">
                                    <th style="padding:12px;">PARTNER / UNTERNEHMEN</th>
                                    <th>KATEGORIE</th>
                                    <th>BETRAG</th>
                                    <th style="text-align:right;">AKTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${activeDeals.map(d => `
                                    <tr style="border-bottom:1px solid rgba(255,255,255,0.02); transition: 0.2s;" onmouseover="this.style.background='rgba(0,209,255,0.05)'" onmouseout="this.style.background='transparent'">
                                        <td style="padding:15px; display:flex; align-items:center; gap:12px;">
                                            <div style="width:30px; height:30px; background:#111; border-radius:50%; display:flex; align-items:center; justify-content:center; border:1px solid var(--data-cyan);">
                                                <i class="fas fa-building" style="font-size:0.7rem; color:var(--data-cyan);"></i>
                                            </div>
                                            <span style="font-weight:bold; letter-spacing:1px;">${d.name.toUpperCase()}</span>
                                        </td>
                                        <td style="color:#888;">${d.type}</td>
                                        <td style="color:var(--neon-green); font-weight:bold;">${d.income} €</td>
                                        <td style="text-align:right;">
                                            <i class="fas fa-trash-alt" onclick="window.SektorSponsoring.remove('${d.id}')" style="color:#ff3131; cursor:pointer; font-size:0.85rem; padding:10px;"></i>
                                        </td>
                                    </tr>
                                `).join('')}
                                ${activeDeals.length === 0 ? '<tr><td colspan="4" style="padding:40px; text-align:center; color:#444; font-size:0.6rem;">KEINE AKTIVEN PARTNER IM SYSTEM VERZEICHNET</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>

                    <h3 style="color:var(--accent-gold); font-size:0.85rem; margin-bottom:15px; letter-spacing:1px;">EVENT-BEDARFS-KALKULATOR</h3>
                    <div style="background:rgba(212, 175, 55, 0.05); border:1px solid rgba(212, 175, 55, 0.2); border-radius:12px; padding:25px;">
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:30px; align-items:center;">
                            <div>
                                <label style="font-size:0.55rem; color:#888; letter-spacing:1px;">ERWARTETE ZUSCHAUERZAHL</label>
                                <input type="number" id="event-people" value="150" oninput="window.SektorSponsoring.recalcEvent()" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:12px; border-radius:6px; margin-top:8px; font-family:'Orbitron'; font-size:1.1rem; text-align:center;">
                            </div>
                            <div id="event-result" style="background:#000; padding:15px; border-radius:8px; border:1px solid #222;">
                            </div>
                        </div>
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:20px;">
                    <div style="background:rgba(0,209,255,0.05); border:1px solid var(--data-cyan); border-radius:15px; padding:25px;">
                        <h3 style="font-size:0.75rem; color:var(--data-cyan); margin-bottom:20px; border-bottom:1px solid rgba(0,209,255,0.2); padding-bottom:10px;">KI-FINANZ-COACH</h3>
                        <div style="font-size:0.8rem; color:#aaa; line-height:1.6;">
                            <p style="margin-bottom:15px;"><i class="fas fa-chart-line" style="color:var(--neon-green); margin-right:8px;"></i> <strong>Analyse:</strong> Deine Einnahmen decken aktuell ${(totalIncome / 50).toFixed(1)}% der geschätzten Saisonkosten.</p>
                            <div style="padding:15px; background:rgba(255,255,255,0.02); border-radius:8px; border-left:3px solid var(--neon-green);">
                                <span style="font-size:0.7rem; font-style:italic; color:#fff;">"Coach, fokussiere dich auf lokale Handwerksbetriebe für die neue Stadionzeitung. Da ist das Potenzial gerade am höchsten."</span>
                            </div>
                        </div>
                    </div>

                    <div style="background:rgba(0,0,0,0.3); border:1px solid #222; border-radius:15px; padding:20px; flex:1;">
                        <h4 style="font-size:0.6rem; color:#666; letter-spacing:1px; margin-bottom:15px;">BUSINESS LOG</h4>
                        <div id="business-log" style="font-size:0.55rem; color:#444; font-family:monospace; line-height:1.8;">
                            [SYSTEM] Sponsoring-Modul online...<br>
                            [DB] ${activeDeals.length} Verträge geladen...<br>
                            [KI] Strategie-Update verfügbar...
                        </div>
                    </div>
                </div>
            </div>

            <div id="sponsor-modal" class="hidden" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:#05080F; border:2px solid var(--data-cyan); padding:35px; border-radius:15px; z-index:1000005; width:420px; box-shadow:0 0 100px #000; font-family:'Orbitron';">
                <div id="sponsor-form-content"></div>
            </div>
        `;
        this.recalcEvent();
    },

    recalcEvent() {
        const input = document.getElementById('event-people');
        if(!input) return;
        const people = parseInt(input.value) || 0;
        const results = document.getElementById('event-result');
        if(!results) return;

        const wurst = Math.ceil(people * 1.4);
        const getraenke = Math.ceil(people * 0.85);
        const gewinn = people * 4.50;

        results.innerHTML = `
            <div style="font-size:0.55rem; color:#666; margin-bottom:10px;">KALKULIERTER BEDARF:</div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span style="color:#fff;">🌭 BRATWÜRSTE:</span>
                <span style="color:var(--accent-gold); font-weight:bold;">${wurst} STK</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                <span style="color:#fff;">🥤 GETRÄNKE:</span>
                <span style="color:var(--accent-gold); font-weight:bold;">${getraenke} L</span>
            </div>
            <div style="border-top:1px solid #222; padding-top:10px; display:flex; justify-content:space-between;">
                <span style="color:#666; font-size:0.6rem;">EST. PROFIT:</span>
                <span style="color:var(--neon-green); font-weight:bold;">~ ${gewinn.toFixed(0)} €</span>
            </div>
        `;
    },

    openLetterGenerator() {
        const overlay = document.createElement('div');
        overlay.id = "letter-overlay";
        overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.97); z-index:2000000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(15px);";
        
        overlay.innerHTML = `
            <div style="background:#05080F; border:1px solid var(--data-cyan); padding:40px; border-radius:15px; width:600px; color:#fff; font-family:'Orbitron';">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                    <h3 style="color:var(--data-cyan); margin:0; font-size:1rem; letter-spacing:2px;">KI-ANSCHREIBEN GENERATOR</h3>
                    <i class="fas fa-times" onclick="document.getElementById('letter-overlay').remove()" style="cursor:pointer; color:#666;"></i>
                </div>
                
                <select id="letter-type" onchange="window.SektorSponsoring.updateLetterPreview()" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:12px; border-radius:6px; margin-bottom:25px; font-family:'Orbitron'; font-size:0.8rem;">
                    <option value="jugend">FOKUS: JUGEND-FÖRDERUNG</option>
                    <option value="stadion">FOKUS: STADIONZEITUNG PARTNER</option>
                    <option value="event">FOKUS: TURNIER-SPONSORING</option>
                </select>
                
                <div id="letter-preview" style="background:#fff; color:#1a1a1a; padding:30px; border-radius:8px; font-family:'Inter', sans-serif; font-size:0.95rem; height:300px; overflow-y:auto; white-space:pre-wrap; line-height:1.6; border:5px solid #eee;"></div>
                
                <div style="display:flex; gap:15px; margin-top:30px;">
                    <button class="tactic-btn" onclick="document.getElementById('letter-overlay').remove()" style="flex:1;">SCHLIESSEN</button>
                    <button class="pro-btn-gold" onclick="window.SektorSponsoring.copyLetter()" style="flex:2;">KOPIEREN & NUTZEN</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        this.updateLetterPreview();
    },

    updateLetterPreview() {
        const type = document.getElementById('letter-type').value;
        const club = (window.coachInfo) ? window.coachInfo.verein : "unseren Verein";
        const coach = (window.coachInfo) ? window.coachInfo.name : "Coach";
        
        let text = "";
        if(type === "jugend") {
            text = `Sehr geehrte Damen und Herren,\n\nder ${club} investiert aktuell massiv in die Ausbildung seiner Nachwuchstalente.\n\nUm unseren Kindern die bestmögliche Ausrüstung und modernste KI-gestützte Trainingsmethoden zu ermöglichen, suchen wir starke Partner aus der Region.\n\nWir bieten Ihnen eine prominente Platzierung in unserer neuen digitalen Stadionzeitung sowie auf unseren Social-Media-Kanälen.\n\nHaben Sie Interesse, Teil unserer Academy-Erfolgsgeschichte zu werden?\n\nMit sportlichen Grüßen,\n\n${coach}\n(Trainer-Team ${club})`;
        } else if(type === "stadion") {
            text = `Moin!\n\nwir gehen mit dem ${club} neue Wege und haben soeben unser digitales Stadion-Magazin gelauncht.\n\nMit einer Reichweite von über 500 Lesern pro Spieltag bieten wir Ihnen eine hochmoderne Werbeplattform direkt im Herzen unserer Fangemeinschaft.\n\nSichern Sie sich jetzt Ihren Platz als Exklusiv-Partner in der nächsten Ausgabe!\n\nBeste Grüße,\n\n${coach}`;
        } else {
            text = `Sehr geehrte Geschäftspartner,\n\nfür unser großes Sommerturnier beim ${club} erwarten wir hunderte Zuschauer und Teams aus der ganzen Umgebung.\n\nFür das Catering und die Siegerehrungen suchen wir noch engagierte Sponsoren, die ihr Unternehmen in einem emotionalen und sportlichen Umfeld präsentieren möchten.\n\nLassen Sie uns gemeinsam ein unvergessliches Event schaffen!\n\nFreundliche Grüße,\n\n${coach}`;
        }
        document.getElementById('letter-preview').innerText = text;
    },

    copyLetter() {
        const text = document.getElementById('letter-preview').innerText;
        navigator.clipboard.writeText(text);
        if(window.ToniVoice) window.ToniVoice.speak("Anschreiben wurde in die Zwischenablage kopiert.");
        alert("KI-Anschreiben wurde kopiert!");
    },

    openAddModal() {
        const modal = document.getElementById('sponsor-modal');
        const content = document.getElementById('sponsor-form-content');
        modal.classList.remove('hidden');
        content.innerHTML = `
            <h3 style="color:var(--data-cyan); font-family:'Orbitron'; font-size:0.9rem; margin-bottom:25px; letter-spacing:1px;">NEUER PARTNER-DEAL</h3>
            
            <div style="margin-bottom:15px;">
                <label style="font-size:0.5rem; color:#666;">FIRMENNAME / PARTNER</label>
                <input type="text" id="sp-name" placeholder="z.B. Schmidt Gartenbau" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:12px; border-radius:5px; margin-top:5px; font-family:'Orbitron';">
            </div>

            <div style="margin-bottom:15px;">
                <label style="font-size:0.5rem; color:#666;">DEAL-KATEGORIE</label>
                <select id="sp-type" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:12px; border-radius:5px; margin-top:5px; font-family:'Orbitron';">
                    <option value="Bandenwerbung">Bandenwerbung</option>
                    <option value="Trikotsponsor">Trikotsponsor</option>
                    <option value="Stadionzeitung">Anzeige (Zeitung)</option>
                    <option value="Event-Partner">Event-Partner</option>
                </select>
            </div>

            <div style="margin-bottom:25px;">
                <label style="font-size:0.5rem; color:#666;">JAHRES-BETRAG (€)</label>
                <input type="number" id="sp-income" value="250" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:12px; border-radius:5px; margin-top:5px; font-family:'Orbitron'; color:var(--neon-green);">
            </div>

            <div style="display:flex; gap:15px;">
                <button class="pro-btn-gold" style="flex:2;" onclick="window.SektorSponsoring.saveNew()">VERTRAG VERSIEGELN</button>
                <button class="tactic-btn" style="flex:1;" onclick="document.getElementById('sponsor-modal').classList.add('hidden')">STOP</button>
            </div>
        `;
    },

    saveNew() {
        const nameInput = document.getElementById('sp-name');
        const incomeInput = document.getElementById('sp-income');
        if(!nameInput || !incomeInput) return;
        
        const name = nameInput.value;
        const income = incomeInput.value;
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
        if(window.ToniVoice) window.ToniVoice.speak(`Der Deal mit ${name} wurde versiegelt.`);
    },

    remove(id) {
        if(confirm("Soll dieser Sponsoring-Vertrag wirklich aufgelöst werden?")) {
            window.Database.sponsors = window.Database.sponsors.filter(s => s.id != id);
            window.Database.save();
            this.render();
        }
    }
};
