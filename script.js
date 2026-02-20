/* ==========================================================
   TONI 2.0 | VR-TEST ENGINE
   ========================================================== */

window.onload = () => {
    console.log("VR-Modus bereit für Meta Quest.");
    
    // Einfache Audio-Begrüßung beim Betreten (optional)
    const scene = document.querySelector('a-scene');
    scene.addEventListener('enter-vr', () => {
        console.log("VR-Modus aktiv!");
        speak("VR Analysezentrum gestartet. Willkommen auf dem Platz, Coach.");
    });
};

/**
 * Sprachausgabe für Toni
 */
function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    msg.pitch = 0.9;
    window.speechSynthesis.speak(msg);
}

/**
 * Funktion für spätere Übungen (Trigger-Test)
 */
function testTrigger() {
    const status = document.getElementById('vr-status');
    status.setAttribute('value', 'ÜBUNG AKTIV');
    status.setAttribute('color', 'yellow');
}
