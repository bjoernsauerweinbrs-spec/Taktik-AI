// js/modules/video-worker.js
self.importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.0.0/dist/tf.min.js');
self.importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@0.0.7/dist/pose-detection.min.js');

let detector = null;

async function initDetector() {
  if (detector) return;
  try {
    const model = poseDetection.SupportedModels.MoveNet;
    const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING };
    detector = await poseDetection.createDetector(model, detectorConfig);
    postMessage({ type: 'worker:ready' });
  } catch (e) {
    postMessage({ type: 'worker:error', error: e.message || String(e) });
  }
}

// helper: sample average color in a small bbox around torso keypoints
async function sampleTeamColorFromImage(imgTensor, keypoints) {
  try {
    const leftShoulder = keypoints.find(k => /left/i.test(k.name));
    const rightShoulder = keypoints.find(k => /right/i.test(k.name));
    const leftHip = keypoints.find(k => /left_hip|leftHip/i.test(k.name));
    const rightHip = keypoints.find(k => /right_hip|rightHip/i.test(k.name));
    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return null;

    const minX = Math.max(0, Math.floor(Math.min(leftShoulder.x, rightShoulder.x, leftHip.x, rightHip.x) - 10));
    const maxX = Math.min(imgTensor.shape[1], Math.ceil(Math.max(leftShoulder.x, rightShoulder.x, leftHip.x, rightHip.x) + 10));
    const minY = Math.max(0, Math.floor(Math.min(leftShoulder.y, rightShoulder.y, leftHip.y, rightHip.y) - 10));
    const maxY = Math.min(imgTensor.shape[0], Math.ceil(Math.max(leftShoulder.y, rightShoulder.y, leftHip.y, rightHip.y) + 10));

    const w = maxX - minX;
    const h = maxY - minY;
    if (w <= 0 || h <= 0) return null;

    const crop = tf.image.cropAndResize(
      imgTensor.expandDims(0),
      [[minY / imgTensor.shape[0], minX / imgTensor.shape[1], maxY / imgTensor.shape[0], maxX / imgTensor.shape[1]]],
      [0],
      [32, 32]
    );
    const meanRGB = crop.mean([0,1]).arraySync(); // [r,g,b]
    crop.dispose();
    return { r: meanRGB[0], g: meanRGB[1], b: meanRGB[2] };
  } catch (e) {
    return null;
  }
}

function classifyColor(rgb) {
  if (!rgb) return null;
  const { r, g, b } = rgb;
  // simple rules: red dominant vs blue dominant
  if (r > b + 30 && r > g + 20) return 'red';
  if (b > r + 30 && b > g + 20) return 'blue';
  return 'unknown';
}

self.onmessage = async (ev) => {
  const msg = ev.data;
  if (msg?.type === 'init') {
    await initDetector();
    return;
  }
  if (msg?.type === 'frame' && detector) {
    try {
      const input = msg.frame; // ImageBitmap or OffscreenCanvas
      const imgTensor = tf.browser.fromPixels(input);
      const poses = await detector.estimatePoses(imgTensor, { maxPoses: 1, flipHorizontal: false });
      const keypoints = (poses[0]?.keypoints || []).map(k => ({
        name: k.name || k.part || '',
        x: k.x,
        y: k.y,
        score: k.score
      }));

      postMessage({ type: 'worker:keypoints', keypoints, timestamp: Date.now() });

      // color sampling around torso
      const rgb = await sampleTeamColorFromImage(imgTensor, keypoints);
      const teamColor = classifyColor(rgb);
      if (teamColor) {
        postMessage({ type: 'worker:teamColor', color: teamColor, rgb, timestamp: Date.now() });
      }

      // simple heuristic event: forward lean
      const leftShoulder = keypoints.find(k => /left/i.test(k.name));
      const rightShoulder = keypoints.find(k => /right/i.test(k.name));
      const nose = keypoints.find(k => /nose/i.test(k.name));
      if (leftShoulder && rightShoulder && nose) {
        const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
        if (nose.y > shoulderY + 20) {
          postMessage({ type: 'worker:event', event: 'forward_lean_detected', confidence: 0.7, timestamp: Date.now() });
        }
      }

      imgTensor.dispose();
    } catch (err) {
      postMessage({ type: 'worker:error', error: err.message || String(err) });
    }
  }
  if (msg?.type === 'stop') {
    detector = null;
    postMessage({ type: 'worker:stopped' });
  }
};
