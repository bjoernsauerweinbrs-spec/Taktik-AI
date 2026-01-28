// js/modules/video-worker.js
// WebWorker (module) for lightweight video analysis.
// Responsibilities:
// - Receive video buffer or metadata from main thread
// - Optionally run a lightweight detection loop (frame sampling) using simple heuristics
// - Emit detected events back to main thread via postMessage({ type: 'analysis:event', payload })
// - This worker is intentionally minimal: heavy ML models (tfjs) are optional and not bundled here.
// - The worker exposes a simple protocol: messages { type, payload } and posts messages back similarly.

// Note: This file runs in a Worker context. Keep dependencies minimal. If you want to integrate TFJS,
// load it dynamically and ensure the worker has enough memory. For now, we implement a stub detector
// that simulates event detection for demonstration and testing.

self.addEventListener('message', async (ev) => {
  const { type, payload } = ev.data || {};
  try {
    if (type === 'video:load') {
      // payload.buffer is an ArrayBuffer of the file (if transferred)
      // For now, we simply acknowledge and mark ready
      postMessage({ type: 'worker:ready' });
      // Optionally, we could decode and run analysis here
    } else if (type === 'video:loadMeta') {
      postMessage({ type: 'worker:ready', payload: { meta: payload } });
    } else if (type === 'video:analyzeFrame') {
      // payload: { imageDataUrl, ts }
      // Run a stub detection: random event with low probability
      const rnd = Math.random();
      if (rnd > 0.95) {
        postMessage({
          type: 'analysis:event',
          payload: {
            eventType: 'interesting_play',
            ts: payload.ts,
            confidence: Math.round(80 + Math.random() * 20),
            playerHint: null,
            bbox: null
          }
        });
      }
    } else if (type === 'video:stop') {
      // cleanup if needed
      postMessage({ type: 'analysis:done' });
    }
  } catch (e) {
    postMessage({ type: 'analysis:log', payload: { error: String(e) } });
  }
});

// initial ready ping
postMessage({ type: 'worker:ready' });
