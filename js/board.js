/**
 * Toni 2.0 - Elite Board Engine (Canvas Logic)
 * Erstellt von Toni für Coach Björn
 */

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let currentPitchType = 'none';

// Initialisierung des Boards im Pitch-Container
window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('pitch');
    if(container) {
        container.innerHTML = ''; // Altes CSS-Feld löschen
        container.appendChild(canvas);
        resizeCanvas();
    }
});

function resizeCanvas() {
    canvas.width = 950;
    canvas.height = 600;
    if(currentPitchType !== 'none') drawPitch(currentPitchType);
}

/**
 * Zeichnet das Spielfeld basierend auf Tonis Entscheidung
 * @param {string} type - 'grossfeld', 'kleinfeld', 'funino'
 */
function drawPitch(type) {
    currentPitchType = type;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Rasenfarbe
    ctx.fillStyle = "#1a3a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;

    if (type === 'grossfeld' || type === 'kleinfeld') {
        // Außenlinie
        ctx.strokeRect(50, 50, 850, 500);
        
        // Mittellinie
        ctx.beginPath();
        ctx.moveTo(475, 50);
        ctx.lineTo(475, 550);
        ctx.stroke();

        // Mittelkreis
        ctx.beginPath();
        ctx.arc(475, 300, 70, 0, Math.PI * 2);
        ctx.stroke();

        // Strafräume
        drawBox(50, 150, 120, 300, 'left'); // Links
        drawBox(780, 150, 120, 300, 'right'); // Rechts
    }

    if (type === 'funino') {
        ctx.strokeRect(50, 50, 850, 500);
        // 4 Minitore an den Ecken markieren
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fillRect(50, 80, 10, 80);  ctx.fillRect(50, 440, 10, 80);
        ctx.fillRect(890, 80, 10, 80); ctx.fillRect(890, 440, 10, 80);
        appendToniText("Funino-Feld mit 4 Toren aufgebaut, Björn!");
    }
}

function drawBox(x, y, w, h, side) {
    ctx.strokeRect(x, y, w, h);
    // Tore
    ctx.lineWidth = 5;
    ctx.beginPath();
    if(side === 'left') {
        ctx.moveTo(50, 260); ctx.lineTo(50, 340);
    } else {
        ctx.moveTo(900, 260); ctx.lineTo(900, 340);
    }
    ctx.stroke();
    ctx.lineWidth = 3;
}

// Hook für Toni: Er kann das Feld per Chat-Befehl ändern
function appendToniText(msg) {
    if(window.appendChatMessage) window.appendChatMessage('toni', msg);
}

// Export für die KI-Steuerung
window.drawPitch = drawPitch;
