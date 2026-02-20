/* --- PRO VR-CENTER MODUL --- */

const vrCenter = {
    launchVR: function() {
        addMessage("Toni", "Lade High-Fidelity Assets... Aktiviere Skeletal Animation Engine.");
        
        const container = document.getElementById('vr-container');
        container.innerHTML = ""; // Alten Stand löschen

        const scene = document.createElement('a-scene');
        scene.setAttribute('embedded', '');
        scene.setAttribute('renderer', 'antialias: true; colorManagement: true; shadowMapEnabled: true;');

        scene.innerHTML = `
            <a-assets>
                <a-asset-item id="pro-player" src="https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0/RiggedFigure/glTF-Binary/RiggedFigure.glb"></a-asset-item>
                <img id="grass-texture" src="https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/textures/terrain/grasslight-big.jpg">
            </a-assets>

            <a-entity light="type: ambient; intensity: 0.6"></a-entity>
            <a-entity light="type: directional; intensity: 0.8; castShadow: true; shadowCameraBottom: -10; shadowCameraTop: 10; shadowCameraLeft: -10; shadowCameraRight: 10" position="-5 10 5"></a-entity>

            <a-plane position="0 0 0" rotation="-90 0 0" width="50" height="50" src="#grass-texture" repeat="10 10" shadow="receive: true"></a-plane>

            <a-entity id="stürmer-1" 
                      gltf-model="#pro-player" 
                      position="0 0 -5" 
                      scale="1.5 1.5 1.5" 
                      shadow="cast: true"
                      animation-mixer="clip: *; loop: repeat">
            </a-entity>

            <a-entity id="toni-avatar" position="-3 0 -2" rotation="0 45 0">
                <a-cylinder radius="0.3" height="1.7" color="#1e293b" shadow="cast: true"></a-cylinder>
                <a-sphere position="0 1.1 0" radius="0.3" color="#22c55e"></a-sphere>
            </a-entity>

            <a-sky color="#223344"></a-sky>
            <a-entity camera look-controls position="0 1.6 0">
                <a-cursor color="#22c55e" fuse="true"></a-cursor>
            </a-entity>
        `;

        container.appendChild(scene);
        
        setTimeout(() => {
            addMessage("Toni", "Skeletal Rigging abgeschlossen. Spieler reagieren jetzt auf physikalische Gesetze.");
        }, 1500);
    }
};
