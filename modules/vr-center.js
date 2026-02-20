/* --- VR-CENTER MODUL (Meta Quest 3 Integration) --- */

const vrCenter = {
    launchVR: function() {
        addMessage("Toni", "Initialisiere VR-Spielfeld... Bitte setze deine Meta Quest 3 auf.");
        
        // Erstelle eine virtuelle A-Frame Szene dynamisch
        const vrScene = document.createElement('a-scene');
        vrScene.setAttribute('embedded', '');
        vrScene.style.height = "100%";
        vrScene.style.width = "100%";

        vrScene.innerHTML = `
            <a-sky color="#87CEEB"></a-sky>
            <a-plane position="0 0 -4" rotation="-90 0 0" width="100" height="100" color="#228B22"></a-plane>
            
            <a-grid color="#ffffff" opacity="0.2"></a-grid>

            <a-cylinder position="-2 0 -5" radius="0.5" height="1.8" color="#1e293b">
                <a-sphere position="0 1.2 0" radius="0.4" color="#22c55e"></a-sphere>
            </a-cylinder>

            <a-box position="2 0 -10" color="red" animation="property: position; to: -2 0 -10; dur: 3000; loop: true; dir: alternate"></a-box>

            <a-entity camera look-controls position="0 1.6 0">
                <a-cursor color="#22c55e"></a-cursor>
            </a-entity>
        `;

        const previewContainer = document.getElementById('vr-fallback-preview');
        previewContainer.innerHTML = "";
        previewContainer.appendChild(vrScene);

        setTimeout(() => {
            addMessage("Toni", "Verbindung steht. Wenn du in der Brille bist, schau dich um. Ich tracke dein Scanning-Verhalten.");
        }, 2000);
    }
};

window.addEventListener('load', () => {
    console.log("VR-Center bereit.");
});
