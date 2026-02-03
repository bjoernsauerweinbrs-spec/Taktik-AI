window.BriefcaseUI = {
    // ... (toggle, backToNav, switchSektor bleiben gleich wie zuvor)

    renderMarketing() {
        const target = document.getElementById('active-content');
        
        target.innerHTML = `
            <div style="margin-bottom:20px; display:flex; gap:15px; border-bottom:1px solid #333; padding-bottom:15px;">
                <button class="login-btn" style="width:auto; background:var(--accent-orange);" onclick="BriefcaseUI.toggleMarketing('zeitung')">📄 MAGAZIN-EDITOR</button>
                <button class="login-btn" style="width:auto; background:#222;" onclick="BriefcaseUI.toggleMarketing('sponsoring')">💰 SPONSOREN-RECHNER</button>
                <p style="margin-left:auto; color:var(--data-cyan); font-size:0.8rem; align-self:center;">ℹ️ Klicke direkt in den Text, um ihn zu bearbeiten.</p>
            </div>
            
            <div id="m-zeitung" class="magazine-view">
                
                <div class="mag-page">
                    <div style="border: 2px solid #000; padding: 5px;">
                        <div style="background:#000; color:#fff; text-align:center; padding:10px;">
                            <h1 contenteditable="true" style="margin:0; letter-spacing:4px; font-size:1.4rem;">FC TONI 2.0</h1>
                        </div>
                    </div>
                    
                    <div style="text-align:center; margin:30px 0;">
                        <div style="display:inline-block; border:4px solid #000; padding:20px; border-radius:50%;">
                            <span contenteditable="true" style="font-size:1.2rem; font-weight:900;">DEIN<br>LOGO</span>
                        </div>
                        <h2 contenteditable="true" style="margin-top:20px; font-style:italic;">"Gemeinsam zum Sieg"</h2>
                    </div>

                    <div style="margin-top:auto; background:#f0f0f0; padding:15px; border-left:5px solid var(--accent-orange);">
                        <b contenteditable="true">HEUTE IM STADION:</b>
                        <p contenteditable="true" style="font-size:0.9rem; margin:5px 0;">Top-Spiel gegen den Tabellenführer! Anstoß 15:30 Uhr.</p>
                    </div>
                </div>

                <div class="mag-page">
                    <h3 style="border-bottom:2px solid #000; padding-bottom:5px;">🎤 TRAINER-TALK</h3>
                    <div style="display:flex; gap:15px; margin-top:10px;">
                        <div style="width:80px; height:80px; background:#ddd; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:0.6rem;">FOTO</div>
                        <p contenteditable="true" style="font-size:0.85rem; line-height:1.6; margin:0;">
                            Liebe Sportfreunde, herzlich willkommen! Als Trainer Björn bin ich stolz auf die Entwicklung. 
                            Wir nutzen ab heute TONI 2.0 für unsere Taktik. Klicke hier, um deine eigene Ansprache zu schreiben...
                        </p>
                    </div>
                    <div style="margin-top:30px; padding:15px; border:1px dashed #ccc;">
                        <b contenteditable="true">DIE TAKTIK HEUTE:</b>
                        <p contenteditable="true" style="font-size:0.8rem; color:#444;">Wir agieren aus einer stabilen Defensive und nutzen das schnelle Umschaltspiel über die Flügel.</p>
                    </div>
                </div>

                <div class="mag-page">
                    <h3 style="border-bottom:2px solid #000; padding-bottom:5px;">📊 DER RÜCKBLICK</h3>
                    <div contenteditable="true" style="font-size:0.85rem; column-count:2; column-gap:20px; line-height:1.4;">
                        Das letzte Auswärtsspiel war ein voller Erfolg. Mit einer Laufleistung von insgesamt 112km haben wir den Gegner niedergerungen. 
                        Besonders hervorzuheben ist die Disziplin in der Rückwärtsbewegung. Die Fans waren der 12. Mann!
                    </div>
                    
                    <div style="margin-top:auto;">
                        <table style="width:100%; border-collapse:collapse; font-size:0.8rem;">
                            <tr style="background:#000; color:#fff;">
                                <th style="padding:5px; text-align:left;">POS</th>
                                <th style="padding:5px; text-align:left;">TEAM</th>
                                <th style="padding:5px; text-align:right;">PKT</th>
                            </tr>
                            <tr contenteditable="true"><td>1.</td><td>FC TONI 2.0</td><td style="text-align:right;">24</td></tr>
                            <tr contenteditable="true"><td>2.</td><td>KONKURRENZ 1</td><td style="text-align:right;">21</td></tr>
                        </table>
                    </div>
                </div>

                <div class="mag-page" style="background: linear-gradient(to bottom, #fff 60%, #eefcff 100%);">
                    <h3 style="text-align:center;">🤝 UNSERE PARTNER</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; flex:1;">
                        <div contenteditable="true" style="border:1px solid #eee; padding:10px; text-align:center; font-size:0.7rem; display:flex; align-items:center; justify-content:center;">DEIN HAUPTSPONSOR</div>
                        <div contenteditable="true" style="border:1px solid #eee; padding:10px; text-align:center; font-size:0.7rem; display:flex; align-items:center; justify-content:center;">LOKALER PARTNER</div>
                        <div contenteditable="true" style="border:1px solid #eee; padding:10px; text-align:center; font-size:0.7rem; display:flex; align-items:center; justify-content:center;">AUSRÜSTER</div>
                        <div contenteditable="true" style="border:1px solid #eee; padding:10px; text-align:center; font-size:0.7rem; display:flex; align-items:center; justify-content:center;">GETRÄNKE-PARTNER</div>
                    </div>
                    
                    <div style="margin-top:20px; border:2px solid #00D1FF; background:#000; padding:15px; border-radius:10px; text-align:center; position:relative;">
                        <div style="color:#00D1FF; font-family:monospace; font-size:0.6rem; margin-bottom:5px;">
                            [ DIGITAL TACTICS COMPONENT ]
                        </div>
                        <b style="color:#fff; font-size:0.9rem;">POWERED BY TONI 2.0</b>
                        <p style="color:#00D1FF; font-size:0.7rem; margin:5px 0;">Das ultimative Board für Profi-Trainer & Manager.</p>
                        <small style="color:#666;">www.toni-soccer-ai.com</small>
                    </div>
                </div>
                
                <button class="login-btn" style="grid-column: span 2; margin-top:20px; background:var(--accent-orange);" onclick="window.print()">🖨️ MAGAZIN ALS PDF SPEICHERN / DRUCKEN</button>
            </div>
            `;
    },
    // ... restliche Funktionen
};
