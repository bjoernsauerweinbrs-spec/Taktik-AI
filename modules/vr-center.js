/* --- PRO VR-CENTER MODUL (Laufwege & Animationen) --- */

const vrCenter = {
    isVRMode: false,
    isMüllerRunning: false,

    launchVR: function() {
        this.isVRMode = true;
        addMessage("Toni", "VR-System bereit. Sag 'Lauf Müller' oder klicke auf den Button.");
        
        const container = document.getElementById('vr-container');
        container.innerHTML = ""; 

        const scene = document.createElement('a-scene');
        scene.setAttribute('xr-mode-ui', 'enabled: true');
        scene.setAttribute('embedded', '');
        scene.setAttribute('renderer', 'antialias: true; shadowMapEnabled: true;');

        scene.innerHTML = `
            <a-assets>
                <a-asset-item id="pro-player" src="https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0/RiggedFigure/glTF-Binary/RiggedFigure.glb"></a-asset-item>
                <img id="grass" src="https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/textures/terrain/grasslight-big.jpg">
            </a-assets>

            <a-sky color="#87CEEB"></a-sky>
            <a-plane position="0 0 0" rotation="-90 0 0" width="105" height="68" src="#grass" repeat="15 10" shadow="receive: true"></a-plane>
            
            <a-box position="0 10 -40" width="110" height="20" depth="2" color="#1e293b"></a-box>

            <a-entity light="type: ambient; intensity: 0.5"></a-entity>
            <a-entity light="type: directional; intensity: 0.8; castShadow: true" position="-5 10 5"></a-entity>

            <a-entity id="rig" position="0 0 0">
                <a-entity id="camera" camera look-controls position="0 1.6 0">
                    <a-cursor color="#22c55e"></a-cursor>
                </a-entity>
                <a-entity oculus-touch-controls="hand: right" ontriggerdown="vrCenter.handlePass()"></a-entity>
            </a-entity>

            <a-entity id="player-mueller" 
                      gltf-model="#pro-player" 
                      position="5 0 -10" 
                      scale="1.5 1.5 1.5" 
                      shadow="cast: true"
                      animation-mixer="clip: *">
                <a-text value="MUELLER" align="center" position="0 1.8 0" color="white" scale="0.5 0.5 0.5"></a-text>
            </a-entity>
        `;

        container.appendChild(scene);
    },

    // Müller startet seinen Laufweg
    triggerRunPath: function() {
        if (this.isMüllerRunning) return;
        this.isMüllerRunning = true;

        const mueller = document.getElementById('player-mueller');
        
        addMessage("Toni", "Müller startet den Tiefenlauf! Schau nach rechts!");

        // 1. Animation umschalten (Skeletal Animation)
        mueller.setAttribute('animation-mixer', 'clip: walk; loop: repeat; timeScale: 1.5');

        // 2. Bewegung im Raum (Translation)
        mueller.setAttribute('animation', {
            property: 'position',
            to: '5 0 -25', // Er läuft 15 Meter tief
            dur: 4000,
            easing: 'linear'
        });

        // 3. Nach dem Lauf anhalten
        setTimeout(() => {
            mueller.setAttribute('animation-mixer', 'clip: *'); // Zurück zu Idle
            this.isMüllerRunning = false;
            addMessage("Toni", "Müller hat die Endposition erreicht. Er wartet auf den Pass.");
        }, 4000);
    },

    handlePass: function() {
        const mueller = document.getElementById('player-mueller');
        const targetPos = mueller.getAttribute('position');
        
        addMessage("Toni", "Pass in den Lauf!");

        const ball = document.createElement('a-sphere');
        ball.setAttribute('radius', '0.15');
        ball.setAttribute('color', 'white');
        ball.setAttribute('position', '0 0.2 -1');
        
        // Der Ball fliegt exakt dorthin, wo Müller gerade steht
        ball.setAttribute('animation', {
            property: 'position',
            to: `${targetPos.x} 0.2 ${targetPos.z}`,
            dur: 600,
            easing: 'easeOutQuad'
        });

        document.querySelector('a-scene').appendChild(ball);
        setTimeout(() => ball.remove(), 700);
    }
};
