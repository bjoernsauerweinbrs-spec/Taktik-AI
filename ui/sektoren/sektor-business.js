/**
 * TONI 2.0 - BUSINESS & SPONSORING HUB (ELITE EDITION)
 * Fokus: KI-Verhandlungs-Matrix, Akquise-Assistent & Logo-Manager
 * Status: MASTER-SYNC 2026 - INTEGRATED BRANDING
 */
window.SektorBusiness = {
    
    open() {
        this.render();
    },

    render() {
        const content = document.getElementById('active-content');
        if (!content) return;

        // Sicherstellen, dass TONI 2.0 als System-Sponsor existiert
        this.ensureSystemSponsor();

        content.innerHTML = `
            <div class="fadeIn" style="display: grid; grid-template-columns: 1fr 400px; gap: 30px; padding: 20px;">
                
                <div style="max-height: 80vh; overflow-y: auto; padding-right: 10px;">
                    <h2 style="font-family:'Orbitron'; color:var(--neon-green); margin-bottom:10px;">SPONSORING MATRIX</h2>
                    <p style="color:#666; font-size:0.8rem; margin-bottom:25px;">Verwalte deine Partner und nutze die KI-Hebel für maximale Akquise-Power.</p>
                    
                    <div style="background:rgba(255,255,255,0.03); border:1px solid #333; padding:20px; border-radius:12px; margin-bottom:30px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                            <h3 style="font-family:'Orbitron'; font-size:0.8rem; color:var(--accent-gold); margin:0;">AKTIVE PARTNER-LOGOS</h3>
                            <button class="pro-btn-gold" style="font-size:0.6rem; padding:5px 10px;" onclick="window.SektorBusiness.addSponsor()">+ PARTNER HINZUFÜGEN</button>
                        </div>
                        <div style="display:flex; gap:15px; flex-wrap:wrap;">
                            ${(window.Database.sponsors || []).map(s => `
                                <div style="width:100px; height:70px; background:#fff; border-radius:6px; padding:8px; position:relative; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.3);">
                                    <img src="${s.logo}" style="max-width:100%; max-height:100%; object-fit:contain;">
                                    <div style="position:absolute; bottom:-18px; left:0; width:100%; text-align:center; font-size:0.5rem; color:#666; font-family:'Orbitron';">${s.tier.toUpperCase()}</div>
                                    ${s.isSystem ? '' : `<i class="fas fa-times-circle" onclick="window.SektorBusiness.removeSponsor(${s.id})" style="position:absolute; top:-8px; right:-8px; color:var(--status-error); cursor:pointer; background:#000; border-radius:50%;"></i>`}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div style="display:grid; gap:15px;">
                        ${this.renderPackageCard("BRONZE", "500€ - 1.500€", ["Anzeige Stadionmagazin (1/4)", "Logo auf Website", "1x Social Media Post"], "Ideal für lokale Kleingewerbe.")}
                        ${this.renderPackageCard("SILBER", "2.000€ - 5.000€", ["Bandenwerbung (3m)", "Anzeige Magazin (1/2)", "Sichtbarkeit im Analyse-Zentrum"], "Fokus auf regionale Reichweite.")}
                        ${this.renderPackageCard("GOLD", "7.500€ - 15.000€", ["Trikot-Ärmel", "Exklusiv-Interview im Magazin", "KI-Branding in der Arena"], "Premium-Partnerschaft für ambitionierte Marken.")}
                        ${this.renderPackageCard("PLATIN", "Ab 25.000€", ["Hauptsponsor (Brust)", "Namensrecht Arena", "Volle Daten-Integration"], "Strategische Allianz mit maximalem Image-Transfer.")}
                    </div>
                </div>

                <div style="background:rgba(255,255,255,0.02); border:1px solid #333; border-radius:15px; padding:25px; height:fit-content; position:sticky; top:0;">
                    <h3 style="font-family:'Orbitron'; font-size:0.9rem; color:var(--data-cyan); margin-bottom:20px;">
                        <i class="fas fa-robot"></i> TONI AKQUISE-BOT
                    </h3>
                    
                    <label style="font-size:0.6rem; color:#888; letter-spacing:1px;">DEINE VEREINS-DNA</label>
                    <textarea id="club-desc" placeholder="Beschreibe deine Ziele... z.B. Wir sind ein Traditionsverein mit Fokus auf High-Tech Jugendförderung und suchen Partner für den Aufstieg 2026." 
                        style="width:100%; height:120px; background:#000; border:1px solid #444; color:#fff; padding:10px; margin-top:5px; border-radius:5px; font-size:0.8rem; outline:none; font-family:'Inter';"></textarea>
                    
                    <button class="pro-btn-gold" onclick="window.SektorBusiness.generatePitch()" style="width:100%; margin-top:15px;">ANSCHREIBEN GENERIEREN</button>
                    
                    <div id="pitch-result" style="margin-top:25px; font-size:0.75rem; color:#aaa; line-height:1.6; border-top:1px solid #333; padding-top:15px; display:none;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                            <strong style="color:var(--accent-gold); font-family:'Orbitron'; font-size:0.6rem;">VORSCHLAG FÜR PARTNER-AKQUISE:</strong>
                            <i class="fas fa-copy" style="cursor:pointer; color:var(--data-cyan);" onclick="window.SektorBusiness.copyPitch()"></i>
                        </div>
                        <div id="pitch-text" class="editable" contenteditable="true" style="background:rgba(0,0,0,0.4); padding:15px; border-radius:8px; max-height:350px; overflow-y:auto; border:1px solid rgba(255,255,255,0.05);"></div>
                    </div>
                </div>
            </div>
        `;
    },

    renderPackageCard(title, price, perks, advice) {
        return `
            <div style="background:rgba(255,255,255,0.03); border:1px solid #222; border-left:4px solid var(--data-cyan); padding:18px; border-radius:8px; transition:0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h4 style="font-family:'Orbitron'; margin:0; color:#fff; letter-spacing:1px;">${title}</h4>
                    <span style="font-family:'Orbitron'; color:var(--accent-gold); font-size:0.8rem;">${price}</span>
                </div>
                <ul style="font-size:0.7rem; color:#888; margin:12px 0; padding-left:18px; line-height:1.5;">
                    ${perks.map(p => `<li>${p}</li>`).join('')}
                </ul>
                <div style="font-size:0.6rem; color:var(--data-cyan); font-style:italic; border-top:1px solid rgba(255,255,255,0.05); padding-top:10px; font-family:'Orbitron';">
                    <i class="fas fa-lightbulb"></i> TONI CONSULTING: ${advice}
                </div>
            </div>
        `;
    },

    /**
     * Stellt sicher, dass TONI 2.0 immer als Vorzeige-Sponsor im System ist
     */
    ensureSystemSponsor() {
        if (!window.Database.sponsors) window.Database.sponsors = [];
        const hasToni = window.Database.sponsors.find(s => s.isSystem);
        if (!hasToni) {
            window.Database.sponsors.push({
                id: 999,
                name: "TONI 2.0 SYSTEMS",
                logo: "https://i.postimg.cc/mD88R0m3/toni-logo-placeholder.png", // Ein Platzhalter für dein Logo
                tier: "Platin",
                isSystem: true,
                isMain: true
            });
            window.Database.save();
        }
    },

    addSponsor() {
        const name = prompt("NAME DES PARTNERS:");
        const logo = prompt("BILD-URL DES LOGOS (PNG empfohlen):", "https://via.placeholder.com/200x100?text=LOGO");
        const tier = prompt("PAKET-STUFE (Bronze, Silber, Gold, Platin):", "Silber");

        if (name && logo) {
            window.Database.sponsors.push({
                id: Date.now(),
                name: name,
                logo: logo,
                tier: tier,
                isSystem: false
            });
            window.Database.save();
            this.render();
            if(window.ToniVoice) window.ToniVoice.speak("Partner " + name + " wurde erfolgreich im Portfolio registriert.");
        }
    },

    removeSponsor(id) {
        if (confirm("Möchtest du diesen Partner wirklich aus dem Portfolio entfernen? Alle Werbeflächen werden zurückgesetzt.")) {
            window.Database.sponsors = window.Database.sponsors.filter(s => s.id !== id);
            window.Database.save();
            this.render();
        }
    },

    generatePitch() {
        const desc = document.getElementById('club-desc').value;
        const resultDiv = document.getElementById('pitch-result');
        const pitchText = document.getElementById('pitch-text');
        
        if(!desc) {
            alert("Coach, ich brauche ein paar Infos über den Verein, um die Vorteile präzise zu formulieren!");
            return;
        }

        if(window.ToniVoice) window.ToniVoice.speak("Analysiere Marktpotenzial und erstelle High-Impact Anschreiben...");

        const pitch = `
Sehr geehrte Damen und Herren,

als Manager von ${window.coachInfo?.verein || 'unserem Verein'} verfolge ich aufmerksam die Innovationskraft Ihres Unternehmens. Wir befinden uns in einer Phase der Transformation: ${desc}.

Warum eine strategische Partnerschaft mit uns den Unterschied macht:

1. DIGITALE REICHWEITE: Durch das neue TONI 2.0 System bieten wir Werbeflächen, die biometrische Daten mit Markenpräsenz verknüpfen – eine Innovation im regionalen Sport.
2. HOCHGLANZ-MAGAZIN: Ihr Unternehmen wird Teil unserer 6-seitigen Stadionzeitung, die Professionalität und Exklusivität ausstrahlt.
3. WERTE-TRANSFER: Wir verbinden traditionelle Vereinsarbeit mit modernster KI-Technologie.

Gerne präsentieren wir Ihnen in der Arena unser 'Platin-Paket' – inklusive Namensrecht und voller Daten-Integration. Lassen Sie uns gemeinsam die Zukunft des Sports in der Region gestalten.

Mit sportlichen Grüßen,
${window.coachInfo?.name || 'Der Manager'}
        `;

        pitchText.innerText = pitch;
        resultDiv.style.display = 'block';
    },

    copyPitch() {
        const text = document.getElementById('pitch-text').innerText;
        navigator.clipboard.writeText(text);
        if(window.ToniVoice) window.ToniVoice.speak("Akquise-Text wurde kopiert.");
    }
};
