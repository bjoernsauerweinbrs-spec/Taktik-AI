// ANALYSEZENTRUM & STADIONZEITUNG
function renderMediaCenter() {
    const stage = document.getElementById('module-content');
    stage.innerHTML = `
        <div class="office-container fade-in">
            <h2><i class="fa-solid fa-newspaper"></i> MEDIACENTER</h2>
            <div class="media-grid">
                <div class="media-card" onclick="openStadiumPaper()">
                    <h3>STADIONZEITUNG</h3>
                    <p>Nächste Ausgabe: Spieltag 12</p>
                </div>
                <div class="media-card" onclick="openAnalysisCenter()">
                    <h3>ANALYSEZENTRUM</h3>
                    <p>Performance-Metriken & Bio-Sync</p>
                </div>
            </div>
        </div>
    `;
}

// TONI'S STIMME & TAKTIK
function toggleMic() {
    const btn = document.getElementById('mic-nav-btn');
    const isActive = btn.classList.toggle('mic-active');
    
    if(isActive) {
        // Hier würde der Live-Talk starten
        alert("Toni (Stimme von Klopp/Nagelsmann): Ich höre dir zu, Trainer!");
    }
}
