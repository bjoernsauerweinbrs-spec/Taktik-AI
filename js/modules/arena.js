/**
 * TONI 2.0 - Arena Modul
 * Konstruiert das Spielfeld dynamisch als animiertes SVG
 */

const ToniArena = {
    svg: null,
    
    init() {
        this.svg = document.getElementById('pitch-svg');
        
        // Auf Befehle vom EventBus hören
        window.ToniEvents.on('ARENA:BUILD', (data) => this.buildPitch(data.type));
    },

    /**
     * Zeichnet das Spielfeld basierend auf der Altersklasse
     */
    buildPitch(type = 'senioren') {
        console.log(`[Arena] Baue Spielfeld-Typ: ${type}`);
        this.svg.innerHTML = ''; // Altes Feld löschen
        
        // Basis-Konfiguration (Maßstab für die Anzeige)
        const w = 1000;
        const h = 600;
        this.svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

        // Definition der Linien (Pfade)
        const paths = this.getPathsForType(type, w, h);
        
        // Linien nacheinander zeichnen
        paths.forEach((d, index) => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", d);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "white");
            path.setAttribute("stroke-width", "2");
            
            // Die "Construction" Animation
            const length = 2000; // Standardlänge für die Animation
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.animation = `draw 1.5s ease forwards ${index * 0.2}s`;
            
            this.svg.appendChild(path);
        });

        // Wenn die letzte Linie fertig ist (nach ca. 3 Sek), Signal senden
        setTimeout(() => {
            window.ToniEvents.emit('ARENA:READY');
        }, 3000);
    },

    /**
     * Liefert die SVG-Pfad-Daten für das jeweilige Feld
     */
    getPathsForType(type, w, h) {
        const margin = 20;
        const innerW = w - (margin * 2);
        const innerH = h - (margin * 2);

        if (type === 'funino') {
            // Spezial-Layout für Funino (3 Zonen, 4 Tore)
            return [
                `M ${margin} ${margin} h ${innerW} v ${innerH} h -${innerW} Z`, // Außenlinie
                `M ${w/3} ${margin} v ${innerH}`, // Zone 1
                `M ${(w/3)*2} ${margin} v ${innerH}` // Zone 2
            ];
        }

        // Standard Senioren/Jugend Großfeld
        return [
            `M ${margin} ${margin} h ${innerW} v ${innerH} h -${innerW} Z`, // Außenlinie
            `M ${w/2} ${margin} v ${innerH}`, // Mittellinie
            `M ${margin} ${h/2 - 60} v 120`, // Tor Links
            `M ${w-margin} ${h/2 - 60} v 120`, // Tor Rechts
            `M ${w/2} ${h/2} m -50, 0 a 50,50 0 1,0 100,0 a 50,50 0 1,0 -100,0` // Mittelkreis
        ];
    }
};

// Initialisierung
ToniArena.init();
