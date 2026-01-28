// js/modules/video-bridge-test.js
// Bridge Test: sendet OffscreenCanvas Frames an den Worker in 250ms Intervallen
const worker = new Worker('./js/modules/video-worker.js');

worker.onmessage = (ev) => {
  console.log('worker msg', ev.data);
};

async function initBridgeTest() {
  worker.postMessage({ type: 'init' });

  // create OffscreenCanvas and draw a simple test frame (colored background + circle)
  const canvas = new OffscreenCanvas(640, 360);
  const ctx = canvas.getContext('2d');

  let colorToggle = 0;
  setInterval(async () => {
    // alternate background color to simulate red/blue jerseys
    ctx.fillStyle = colorToggle % 2 === 0 ? '#ff0000' : '#0033cc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw a simple "player" circle
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(320, 180, 24, 0, Math.PI * 2);
    ctx.fill();

    // convert to ImageBitmap and send
    const bitmap = canvas.transferToImageBitmap();
    worker.postMessage({ type: 'frame', frame: bitmap }, [bitmap]);

    colorToggle++;
  }, 250);
}

// start when loaded
initBridgeTest();
