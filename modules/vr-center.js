/* --- PRO VR-CENTER MODUL (Stadion & Ego-Perspektive) --- */

const vrCenter = {
    isVRMode: false,

    launchVR: function() {
        this.isVRMode = true;
        addMessage("Toni", "Stadion-Atmosphäre wird geladen... Bitte 'Enter VR' in der Quest bestätigen.");
        
        const container = document.getElementById('vr-container');
        container.innerHTML = ""; 

        // Wir erstellen die Szene
        const scene = document.createElement('a-scene');
        // 'xr-mode-ui' erzwingt den VR-Button für die Brille
        scene.setAttribute('xr-mode-ui', 'enabled: true');
        scene.setAttribute('embedded', '');
        scene.setAttribute('renderer', 'antialias: true; shadowMapEnabled: true;');

        scene.innerHTML = `
            <a-assets>
                <a-asset-item id="pro-player" src="https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0/RiggedFigure/glTF-Binary/RiggedFigure.glb"></a-asset-item>
                <img id="grass" src="https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/textures/terrain/grasslight-big.jpg">
                <img id="sky" src="https://cdn.jsdelivr.net/gh/aframevr/aframe/examples/boilerplate/panorama/puydesancy.jpg">
            </a-assets>

            <a-sky src="#sky"></a-sky>
            <a-plane position="0 0 0" rotation="-90 0 0" width="105" height="68" src="#grass" repeat="15 10" shadow="receive: true"></a-plane>
            
            <a-box position="0 10 -40" width="110" height="20" depth="2" color="#1e293b"></a-box> <a-box position="0 10 40" width="110" height="20" depth="2" color="#1e293b"></a-box>  <a-box position="-55 10 0" width="2" height="20" depth="80" color="#1e293b"></a-box> <a-box position="55 10 0" width="2" height="20" depth="80" color="#1e293b"></a-box>  <a-entity id="goal-north" position="0 0 -34">
                <a-box position="-3.6 1.2 0" width="0.2" height="2.4" depth="0.2" color="white"></a-box>
                <a-box position="3.6 1.2 0" width="0.2" height="2.4" depth="0.2" color="white"></a-box>
                <a-box position="0 2.4 0" width="7.4" height="0.2" depth="0.2" color="white"></a-box>
            </a-entity>

            <a-entity light="type: ambient; intensity: 0.5"></a-entity>
            <a-entity light="type: spot; intensity: 0.8; castShadow: true" position="20 20 20"></a-entity>

            <a-entity id="rig" position="0 0 0">
                <a-entity id="camera" camera look-controls position="0 1.6 0">
                    <a-cursor color="#22c55e" raycaster="objects: .selectable"></a-cursor>
                </a-entity>
                <a-entity oculus-touch-controls="hand: left"></a-entity>
                <a-entity oculus-touch-controls="hand: right" ontriggerdown="vrCenter.handlePass()"></a-entity>
            </a-entity>

            <a-entity id="player-mueller" 
                      gltf-model="#pro-player" 
                      position="5 0 -10" 
                      scale="1.5 1.5 1.5" 
                      shadow="cast: true"
                      class="selectable">
                <a-text value="MUELLER" align="center" position="0 1.8 0" scale="0.5 0.5 0.5"></a-text>
            </a-entity>
        `;

        container.appendChild(scene);
        this.initVoiceCommand();
    },

    handlePass: function() {
        addMessage("Toni", "Pass zu Müller ausgeführt!");
        // Hier schießen wir den Ball zu Müller
        const ball = document.createElement('a-sphere');
        ball.setAttribute('radius', '0.2');
        ball.setAttribute('color', 'white');
        ball.setAttribute('position', '0 0.2 -1');
        ball.setAttribute('animation', 'property: position; to: 5 0.2 -10; dur: 600; easing: easeOutQuad');
        document.querySelector('a-scene').appendChild(ball);
        setTimeout(() => ball.remove(), 700);
    },

    initVoiceCommand: function() {
        // ... (wie vorher)
    }
};
