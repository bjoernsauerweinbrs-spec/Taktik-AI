renderMarketing() {
        const target = document.getElementById('active-content');
        target.innerHTML = `
            <div class="marketing-tabs" style="margin-bottom:20px; display:flex; gap:10px;">
                <button class="login-btn" style="width:auto;" onclick="BriefcaseUI.toggleMarketing('zeitung')">STADIONZEITUNG (VORSCHAU)</button>
                <button class="login-btn" style="width:auto; background:#222;" onclick="BriefcaseUI.toggleMarketing('sponsoring')">SPONSOREN-AGENTUR</button>
            </div>
            
            <div id="m-zeitung" class="magazine-view">
                <div class="mag-page">
                    <div style="text-align:center; border: 4px double #000; padding: 10px; margin-bottom: 20px;">
                        <h1 style="margin:0; font-size: 1.5rem;">MATCHDAY-MAGAZIN</h1>
                        <small>AUSGABE #01 | SAISON 2026</small>
                    </div>
                    <b style="font-size: 2rem; text-align:center;">FC TONI 2.0</b>
                    <div style="margin: 20px 0; border: 1px solid #eee; height: 150px; display:flex; align-items:center; justify-content:center; background:#f9f9f9;">
                        <span style="color:#ccc; font-weight:bold;">[ SPIELER-FOTO DES TAGES ]</span>
                    </div>
                    <div style="margin-top:auto; display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div style="border:1px solid #eee; padding:5px; text-align:center; font-size:0.7rem;">TOP-PARTNER:<br><b>Cyber-Tech GmbH</b></div>
                        <div style="border:1px solid #eee; padding:5px; text-align:center; font-size:0.7rem;">AUSRÜSTER:<br><b>Ginga-Sports</b></div>
                    </div>
                </div>

                <div class="mag-page">
                    <b>🎤 TRAINER-TALK</b>
                    <p style="font-size:0.85rem; line-height:1.4;">
                        "Willkommen in der Arena! Wir haben eine harte Trainingswoche hinter uns. 
                        Besonders der Fokus auf die <b>Brazilian-Style</b> Technik-Einheiten zeigt Wirkung. 
                        Heute wollen wir gegen den Tabellenführer mit Mut und spielerischer Eleganz überzeugen.
                        <br><br>
                        Mein Dank gilt den Fans und dem Staff für die unermüdliche Unterstützung.
                        Genießen wir den Spieltag!"
                        <br><br>
                        <i>Euer Trainer Björn</i>
                    </p>
                    <div style="margin-top:auto; background:var(--panel-dark); color:white; padding:10px; border-radius:5px; font-size:0.7rem;">
                        <b>Wochenfokus:</b> Umschaltspiel & defensive Kompaktheit.
                    </div>
                </div>

                <div class="mag-page">
                    <b>📊 RÜCKBLICK & TABELLE</b>
                    <table style="width:100%; font-size:0.7rem; border-collapse:collapse;">
                        <tr style="background:#eee;"><th>Pos</th><th>Team</th><th>Pkt</th></tr>
                        <tr style="border-bottom:1px solid #eee;"><td>1.</td><td>FC Toni 2.0</td><td>24</td></tr>
                        <tr style="border-bottom:1px solid #eee;"><td>2.</td><td>Bot-United</td><td>21</td></tr>
                        <tr style="border-bottom:1px solid #eee;"><td>3.</td><td>CSS-Kickers</td><td>19</td></tr>
                    </table>
                    <div style="margin-top:20px;">
                        <b>SPIELBERICHT:</b>
                        <p style="font-size:0.75rem;">Das letzte 3:0 war ein Statement. Die Formation 4-3-3 hat perfekt gegriffen.</p>
                    </div>
                </div>

                <div class="mag-page" style="background: linear-gradient(to bottom, #fff 70%, #fceabb 100%);">
                    <b>🤝 UNSERE PARTNER</b>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; flex:1;">
                        <div style="border:1px dashed #ccc; padding:10px; font-size:0.6rem; text-align:center;">SPONSOR HIER</div>
                        <div style="border:1px dashed #ccc; padding:10px; font-size:0.6rem; text-align:center;">SPONSOR HIER</div>
                        <div style="border:1px dashed #ccc; padding:10px; font-size:0.6rem; text-align:center;">SPONSOR HIER</div>
                        <div style="border:1px dashed #ccc; padding:10px; font-size:0.6rem; text-align:center;">SPONSOR HIER</div>
                    </div>
                    <div style="border-top: 2px solid #000; padding-top:10px; font-size:0.8rem; text-align:center;">
                        <b>POWERED BY TONI 2.0</b><br>
                        <small>Die Zukunft des Amateur-Managements</small>
                    </div>
                </div>
                
                <button class="login-btn" style="grid-column: span 2; background:var(--accent-orange);" onclick="window.print()">JETZT FÜR FANS DRUCKEN</button>
            </div>

            <div id="m-sponsoring" class="hidden">
                <div class="sponsoring-tool">
                    <h4>TONI'S PAKET-RECHNER</h4>
                    <select id="s-package" class="login-input" style="width:100%;" onchange="BriefcaseUI.calcSponsor()">
                        <option value="0">Leistung wählen...</option>
                        <option value="500">Bandenwerbung (Saison)</option>
                        <option value="1250">Trikot-Sponsoring</option>
                        <option value="300">Stadionzeitung Anzeige</option>
                        <option value="800">Jugendturnier-Patenschaft</option>
                    </select>
                    <div id="s-result" class="toni-speech-bubble" style="margin-top:20px;">Wähle ein Modul für Toni's Analyse.</div>
                </div>
            </div>`;
    },
