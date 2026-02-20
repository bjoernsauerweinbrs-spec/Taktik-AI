/* ==========================================================
   TONI 2.0 | ELITE VR ENGINE
   ========================================================== */

window.onload = () => {
    console.log("Elite VR Stadium geladen.");
    
    const scene = document.querySelector('a-scene');
    
    // VR-Eintritt Logik
    scene.addEventListener('enter-vr', () => {
        speak("Willkommen im Elite Analysezentrum. Das Spielfeld ist kalibriert.");
    });
};

function speak(text) {
    if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'de-DE';
        msg.pitch = 0.85;
        window.speechSynthesis.speak(msg);
    }
}

/**
 * Zukünftige Funktion: Spieler dynamisch bewegen
 */
function movePlayer(id, x, z, rot) {
    const p = document.getElementById(id);
    if(p) {
        p.setAttribute('position', `${x} 0 ${z}`);
        p.setAttribute('rotation', `0 ${rot} 0`);
    }
}
