// js/modules/video-bridge.js
// Bridge between main thread UI and a video analysis worker.
// Responsibilities:
// - Manage MP4 uploads / Dropzone integration
// - Spawn a WebWorker (video-worker.js) for pose/event detection
// - Provide simple API: init({ eventBus, db }), loadFile(file), play/pause/seek, extractFrame(ts)
// - Map detected events to playerIds (best-effort) and persist events via Database.saveEvent
// - Emit events on EventBus: video:loaded, video:frame, video:eventDetected, video:analysis:done

import EventBus from './eventbus.js';
import Database from './database.js';

let worker = null;
let eventBus = null;
let db = null;
let currentFile = null;
let videoEl = null;
let canvasEl = null;
let ctx = null;
let isWorkerReady = false;
let workerUrl = './js/modules/video-worker.js'; // ensure this path is correct in repo

// Initialize bridge: expects a container or elements to attach player UI if desired
async function init({ eventBus: eb = null, dbHandle = null, mountTarget = null } = {}) {
  eventBus = eb || EventBus;
  db = dbHandle || Database;

  // create hidden video element and canvas for frame extraction
  videoEl = document.createElement('video');
  videoEl.style.display = 'none';
  videoEl.setAttribute('playsinline', '');
  videoEl.setAttribute('preload', 'metadata');
  document.body.appendChild(videoEl);

  canvasEl = document.createElement('canvas');
  canvasEl.style.display = 'none';
  document.body.appendChild(canvasEl);
  ctx = canvasEl.getContext('2d');

  // wire events from worker
  _spawnWorker();

  // wire UI events (dropzone can emit 'video:upload' with file)
  eventBus.on('video:upload', async ({ file }) => {
    if (!file) return;
    await loadFile(file);
  });

  // allow external requests to extract frame
  eventBus.on('video:extractFrame', async ({ ts, id }) => {
    try {
      const img = await extractFrame(ts);
      eventBus.emit('video:frame', { id, ts, image: img });
    } catch (e) {
      console.warn('extractFrame failed', e);
    }
  });

  return {
    loadFile,
    play,
    pause,
    seek,
    extractFrame,
    close
  };
}

function _spawnWorker() {
  try {
    // create worker
    worker = new Worker(workerUrl, { type: 'module' });
    worker.onmessage = (ev) => {
      const { type, payload } = ev.data || {};
      if (type === 'worker:ready') {
        isWorkerReady = true;
        eventBus.emit('video:worker:ready');
      } else if (type === 'analysis:event') {
        // payload: { eventType, playerHint, ts, confidence, frameData? }
        _handleDetectedEvent(payload);
      } else if (type === 'analysis:log') {
        console.log('video-worker:', payload);
      } else if (type === 'analysis:done') {
        eventBus.emit('video:analysis:done', payload);
      }
    };
    worker.onerror = (err) => {
      console.error('video worker error', err);
      eventBus.emit('video:worker:error', { error: String(err) });
    };
  } catch (e) {
    console.warn('Could not spawn worker', e);
    worker = null;
  }
}

async function loadFile(file) {
  if (!file) throw new Error('file required');
  currentFile = file;

  // create object URL and load metadata
  const url = URL.createObjectURL(file);
  videoEl.src = url;
  await videoEl.load();

  // set canvas size to video resolution
  canvasEl.width = videoEl.videoWidth;
  canvasEl.height = videoEl.videoHeight;

  eventBus.emit('video:loaded', { name: file.name, duration: videoEl.duration, width: videoEl.videoWidth, height: videoEl.videoHeight });

  // send file to worker for pre-processing if worker supports it
  if (worker && isWorkerReady) {
    // transfer via MessageChannel or send URL for worker to fetch via fetch + arrayBuffer
    try {
      const ab = await file.arrayBuffer();
      worker.postMessage({ type: 'video:load', payload: { buffer: ab, name: file.name } }, [ab]);
    } catch (e) {
      // fallback: send metadata only
      worker.postMessage({ type: 'video:loadMeta', payload: { name: file.name, duration: videoEl.duration } });
    }
  }

  // persist a simple video event in DB
  try {
    await Database.saveEvent(Database, {
      id: `video:${Date.now()}`,
      type: 'video:uploaded',
      payload: { name: file.name, duration: videoEl.duration },
      ts: Date.now()
    });
  } catch (e) {
    console.warn('persist video upload event failed', e);
  }

  return { name: file.name, duration: videoEl.duration };
}

function play() {
  if (!videoEl) return;
  videoEl.play();
  eventBus.emit('video:play');
}

function pause() {
  if (!videoEl) return;
  videoEl.pause();
  eventBus.emit('video:pause');
}

function seek(timeSec) {
  if (!videoEl) return;
  videoEl.currentTime = timeSec;
  eventBus.emit('video:seek', { time: timeSec });
}

// Extract a frame at timestamp (seconds) and return dataURL (png)
function extractFrame(ts = 0) {
  return new Promise((resolve, reject) => {
    if (!videoEl) return reject(new Error('no video'));
    const onSeeked = async () => {
      try {
        canvasEl.width = videoEl.videoWidth;
        canvasEl.height = videoEl.videoHeight;
        ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
        const dataUrl = canvasEl.toDataURL('image/png');
        videoEl.removeEventListener('seeked', onSeeked);
        resolve(dataUrl);
      } catch (e) {
        videoEl.removeEventListener('seeked', onSeeked);
        reject(e);
      }
    };
    videoEl.addEventListener('seeked', onSeeked);
    videoEl.currentTime = Math.max(0, Math.min(ts, videoEl.duration || ts));
  });
}

// Handle events detected by worker: persist and emit
async function _handleDetectedEvent(payload) {
  // payload expected: { eventType, ts, confidence, bbox, playerHint }
  try {
    // attempt to map to playerId: if playerHint contains number or name, try to find player in DB
    let playerId = null;
    if (payload.playerHint) {
      // naive mapping: if hint is number, search players by number
      const hint = String(payload.playerHint).trim();
      if (/^\d+$/.test(hint)) {
        const all = await Database.listPlayers(Database);
        const found = all.find(p => String(p.number) === hint);
        if (found) playerId = found.id;
      } else {
        const all = await Database.listPlayers(Database);
        const found = all.find(p => (p.name || '').toLowerCase().includes(hint.toLowerCase()));
        if (found) playerId = found.id;
      }
    }

    const ev = {
      id: `video-event:${Date.now()}:${Math.round(Math.random()*1000)}`,
      type: 'video:event',
      payload: {
        eventType: payload.eventType,
        ts: payload.ts,
        confidence: payload.confidence,
        bbox: payload.bbox || null,
        playerId: playerId || null,
        raw: payload
      },
      ts: Date.now()
    };

    // persist atomically
    try {
      await Database.saveEvent(Database, ev);
    } catch (e) {
      console.warn('Could not persist video event', e);
    }

    // emit on EventBus for UI and roster linking
    eventBus.emit('video:eventDetected', ev);
  } catch (e) {
    console.error('handleDetectedEvent error', e);
  }
}

function close() {
  try {
    if (worker) {
      worker.terminate();
      worker = null;
    }
    if (videoEl) {
      videoEl.pause();
      videoEl.src = '';
      videoEl.remove();
      videoEl = null;
    }
    if (canvasEl) {
      canvasEl.remove();
      canvasEl = null;
    }
  } catch (e) { /* ignore */ }
  eventBus.emit('video:closed');
}

export default {
  init,
  loadFile,
  play,
  pause,
  seek,
  extractFrame,
  close
};
