/**
 * TONI 2.0 - BUSINESS & SPONSORING HUB
 * Fokus: KI-Verhandlungs-Matrix, Akquise-Anschreiben & Strategie-Beratung
 * Status: PRO-MANAGER UPDATE 2026
 */
window.SektorBusiness = {
    
    open() {
        this.render();
    },

    render() {
        const content = document.getElementById('active-content');
        if (!content) return;

        content.innerHTML = `
            <div class="fadeIn" style="display: grid; grid-template-columns: 1fr 400px; gap: 30px; padding: 20px;">
                
                <div>
                    <h2 style="font-family:'Orbitron'; color:var(--neon-green); margin-bottom:10px;">SPONSORING MATRIX</h2>
                    <p style="color:#666; font-size:0.8rem; margin-bottom:25px;">Definiere deine Pakete und nutze TONIs Argumentations-Hebel für das Sponsorengespräch.</p>
                    
                    <div style="display:grid; gap:15px;">
                        ${this.renderPackageCard("BRONZE", "500€ - 1.500€", ["Anzeige Stadionmagazin (1/4)", "Logo auf Website", "1x Social Media Post"], "Ideal für lokale Kleingewerbe.")}
                        ${this.renderPackageCard("SILBER", "2.000€ - 5.000€", ["Bandenwerbung (3m)", "Anzeige Magazin (1/2)", "Toni 2.0 Logo-Präsenz"], "Fokus auf regionale Sichtbarkeit.")}
                        ${this.renderPackageCard("GOLD", "7.500€ - 15.000€", ["Trikot-Ärmel", "Exklusiv-Interview im Magazin", "Full Social Media Paket"], "Premium-Partnerschaft für Mittelständler.")}
                        ${this.renderPackageCard("PLATIN", "Ab 25.000€", ["Hauptsponsor (Brust)", "Namensrecht Arena", "KI-Daten-Integration"], "Strategische Allianz auf Profi-Niveau.")}
                    </div>
                </div>

                <div style="background:rgba(255,255,255,0.02); border:1px solid #333; border-radius:15px; padding:25px; height:fit-content;">
                    <h3 style="font-family:'Orbitron'; font-size:0.9rem; color:var(--data-cyan); margin-bottom:20px;">
                        <i class="fas fa-robot"></i> TONI AKQUISE-BOT
                    </h3>
                    
                    <label style="font-size:0.6rem; color:#888;">VEREINS-PROFIL / AKTUELLE SITUATION</label>
                    <textarea id="club-desc" placeholder="Beschreibe kurz deinen Verein, deine Ziele (z.B. Aufstieg, Jugendförderung) und was dich besonders macht..." 
                        style="width:100%; height:120px; background:#000; border:1px solid #444; color:#fff; padding:10px; margin-top:5px; border-radius:5px; font-size:0.8rem; outline:none;"></textarea>
                    
                    <button class="pro-btn-gold" onclick="window.SektorBusiness.generatePitch()" style="width:100%; margin-top:15px;">ANSCHREIBEN GENERIEREN</button>
                    
                    <div id="pitch-result" style="margin-top:25px; font-size:0.75rem; color:#aaa; line-height:1.5; border-top:1px solid #333; padding-top:15px; display:none;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                            <strong style="color:var(--accent-gold);">VORSCHLAG FÜR ANSCHREIBEN:</strong>
                            <i class="fas fa-copy" style="cursor:pointer;" onclick="window.SektorBusiness.copyPitch()"></i>
                        </div>
                        <div id="pitch-text" class="editable" contenteditable="true" style="background:rgba(0,0,0,0.3); padding:10px; border-radius:5px; max-height:300px; overflow-y:auto;"></div>
                    </div>
                </div>
            </div>
        `;
    },

    renderPackageCard(title, price, perks, advice) {
        return `
            <div style="background:rgba(255,255,255,0.03); border:1px solid #222; border-left:4px solid var(--data-cyan); padding:15px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h4 style="font-family:'Orbitron'; margin:0; color:#fff;">${title}</h4>
                    <span style="font-family:'Orbitron'; color:var(--accent-gold); font-size:0.8rem;">${price}</span>
                </div>
                <ul style="font-size:0.7rem; color:#888; margin:10px 0; padding-left:15px;">
                    ${perks.map(p => `<li>${p}</li>`).join('')}
                </ul>
                <div style="font-size:0.6rem; color:var(--data-cyan); font-style:italic; border-top:1px solid #222; padding-top:8px;">
                    <strong>TONI RATGEBER:</strong> ${advice}
                </div>
            </div>
        `;
    },

    generatePitch() {
        const desc = document.getElementById('club-desc').value;
        const resultDiv = document.getElementById('pitch-result');
        const pitchText = document.getElementById('pitch-text');
        
        if(!desc) {
            alert("Bitte beschreibe erst deinen Verein, damit TONI die Argumente schärfen kann!");
            return;
        }

        if(window.ToniVoice) window.ToniVoice.speak("Analysiere Marktpotenzial und erstelle individuelles Akquise-Anschreiben...");

        // KI-Logik Simulation: TONI baut das Anschreiben
        const pitch = `
Sehr geehrte Damen und Herren,

als Repräsentant von ${window.coachInfo?.verein || 'unserem Verein'} verfolge ich aufmerksam die regionale Präsenz Ihres Unternehmens. Wir befinden uns aktuell in einer spannenden Phase: ${desc}.

Warum eine Partnerschaft mit uns für Sie messbaren Mehrwert bietet:
1. INNOVATION: Durch das TONI 2.0 System bieten wir eine digitale Sichtbarkeit, die über klassische Banden hinausgeht.
2. ZIELGRUPPE: Wir erreichen wöchentlich Hunderte von Familien und Entscheidungsträgern direkt am Spielfeldrand und über unser neues Stadionmagazin.
3. BRANDING: Ihr Logo erscheint in unserem High-Gloss Magazin (Seite 6) und wird in unsere KI-gestützten Match-Analysen integriert.

Gerne lade ich Sie ein, sich vor Ort ein Bild von unserer Vision zu machen. Wir haben Pakete entwickelt (Bronze bis Platin), die exakt auf Ihre Marketing-Ziele zugeschnitten werden können.

Mit sportlichen Grüßen,
${window.coachInfo?.name || 'Der Manager'}
        `;

        pitchText.innerText = pitch;
        resultDiv.style.display = 'block';
    },

    copyPitch() {
        const text = document.getElementById('pitch-text').innerText;
        navigator.clipboard.writeText(text);
        if(window.ToniVoice) window.ToniVoice.speak("Text in die Zwischenablage kopiert.");
    }
};
