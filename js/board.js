/**
 * Taktik-Zeichner: Ermöglicht Toni das Malen von Pfeilen und Linien
 */

function drawTacticalLine(fromX, fromY, toX, toY, type = 'run') {
    // Falls die Glasscheibe noch nicht existiert, erstelle sie
    let svg = document.getElementById('tactical-layer');
    if (!svg) {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.id = "tactical-layer";
        svg.style = "position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:40;";
        // Definition der Pfeilspitze
        svg.innerHTML = `
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="context-stroke" />
                </marker>
            </defs>`;
        pitch.appendChild(svg);
    }

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", fromX + "%");
    line.setAttribute("y1", fromY + "%");
    line.setAttribute("x2", toX + "%");
    line.setAttribute("y2", toY + "%");
    
    // Farblogik: Rot für Laufwege, Blau für Passwege
    const color = (type === 'pass') ? "#2196F3" : "#f44336";
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", "3");
    
    if (type === 'pass') {
        line.setAttribute("stroke-dasharray", "8,5"); // Gestrichelt für Pässe
    }
    
    line.setAttribute("marker-end", "url(#arrowhead)");
    svg.appendChild(line);
}

// Hilfsfunktion zum Aufräumen des Boards
function clearTacticalDrawings() {
    const svg = document.getElementById('tactical-layer');
    if (svg) svg.innerHTML = svg.querySelector('defs').outerHTML; 
}
