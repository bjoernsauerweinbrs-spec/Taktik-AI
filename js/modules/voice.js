// js/modules/voice.js
// Promise-based SpeechSynthesis wrapper for Toni 2.0
// Responsibilities:
// - load available voices and expose selection heuristics (male preference)
// - provide speak(text, opts) -> Promise that resolves on end or rejects on error/abort
// - persist preferred voice id in localStorage
// - emit helpful events via EventBus (if provided)
// - expose cancel() and isSpeaking()

const STORAGE_KEY = 'toni_preferred_voice';

let EventBus = null;
let voices = [];
let voicesReady = false;
let preferredVoiceId = null;
let currentUtterance = null;
let speaking = false;

function _uuid() {
  return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function init({ eventBus = null } = {}) {
  EventBus = eventBus;
  // load persisted preference
  try {
    preferredVoiceId = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    preferredVoiceId = null;
  }

  // populate voices; handle voiceschanged event
  await _loadVoices();

  if (EventBus && typeof EventBus.emit === 'function') {
    EventBus.emit('voice:ready', { voices: voices.map(v => _voiceMeta(v)) });
  }
  return { voices: voices.map(v => _voiceMeta(v)), preferredVoiceId };
}

function _voiceMeta(v) {
  return { name: v.name, lang: v.lang, localService: v.localService, default: v.default, voiceURI: v.voiceURI, id: v.voiceURI || v.name };
}

function _loadVoices() {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const load = () => {
      voices = synth.getVoices() || [];
      voicesReady = voices.length > 0;
      if (!voicesReady) {
        // still empty: keep listening for event
        return;
      }
      // normalize id
      voices = voices.map(v => {
        v._id = v.voiceURI || v.name || _uuid();
        return v;
      });
      if (!preferredVoiceId) {
        // try to auto-select a male-like voice heuristically
        const auto = _selectHeuristicMale();
        if (auto) preferredVoiceId = auto._id;
      }
      if (EventBus && typeof EventBus.emit === 'function') {
        EventBus.emit('voice:voices:loaded', { voices: voices.map(_voiceMeta) });
      }
      resolve(voices);
    };

    load();
    // browsers may populate voices asynchronously
    synth.onvoiceschanged = () => {
      load();
    };
    // fallback timeout: resolve even if empty after short wait
    setTimeout(() => {
      if (!voicesReady) {
        voices = synth.getVoices() || [];
        voices = voices.map(v => { v._id = v.voiceURI || v.name || _uuid(); return v; });
        voicesReady = true;
        if (!preferredVoiceId) {
          const auto = _selectHeuristicMale();
          if (auto) preferredVoiceId = auto._id;
        }
        if (EventBus && typeof EventBus.emit === 'function') {
          EventBus.emit('voice:voices:loaded', { voices: voices.map(_voiceMeta) });
        }
        resolve(voices);
      }
    }, 800);
  });
}

// Heuristic: try to find a male-sounding voice by name hints or language match
function _selectHeuristicMale(lang = navigator.language || 'de-DE') {
  if (!voices || voices.length === 0) return null;
  // prefer same language
  const candidates = voices.filter(v => v.lang && v.lang.startsWith(lang.split('-')[0]));
  const pool = candidates.length ? candidates : voices;

  // name hints that often indicate male voices
  const maleHints = ['male', 'mann', 'männlich', 'mark', 'david', 'paul', 'peter', 'john', 'tom', 'max', 'oliver', 'alex', 'michael', 'daniel', 'thomas', 'klaus', 'hans', 'bernd', 'sebastian', 'marc', 'marco', 'marcus', 'luca', 'lukas'];

  // try to match hint in voice name (case-insensitive)
  for (const hint of maleHints) {
    const found = pool.find(v => v.name && v.name.toLowerCase().includes(hint));
    if (found) return found;
  }

  // fallback: prefer localService voices (likely higher quality)
  const local = pool.find(v => v.localService);
  if (local) return local;

  // fallback: first voice in pool
  return pool[0] || null;
}

function getVoices() {
  return voices.map(_voiceMeta);
}

function setPreferredVoiceId(id) {
  preferredVoiceId = id;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch (e) { /* ignore */ }
  if (EventBus && typeof EventBus.emit === 'function') {
    EventBus.emit('voice:preferred:set', { id });
  }
}

function _findVoiceById(id) {
  if (!id) return null;
  return voices.find(v => v._id === id || v.voiceURI === id || v.name === id) || null;
}

// speak: returns Promise that resolves on end, rejects on error or abort
// opts: { voiceId, pitch, rate, volume, role } role is informational
function speak(text, opts = {}) {
  if (!text || typeof text !== 'string') return Promise.resolve();

  // cancel any existing utterance
  if (speaking && currentUtterance) {
    // do not auto-cancel; allow caller to call cancel() explicitly if desired
    // but for safety, we cancel here to avoid overlapping speech
    cancel();
  }

  const synth = window.speechSynthesis;
  if (!synth) {
    const err = new Error('SpeechSynthesis not supported');
    if (EventBus && typeof EventBus.emit === 'function') EventBus.emit('voice:error', { error: String(err) });
    return Promise.reject(err);
  }

  // choose voice
  let voice = null;
  if (opts.voiceId) voice = _findVoiceById(opts.voiceId);
  if (!voice && preferredVoiceId) voice = _findVoiceById(preferredVoiceId);
  if (!voice) voice = _selectHeuristicMale();

  // create utterance
  const u = new SpeechSynthesisUtterance(text);
  if (voice) u.voice = voice;
  u.pitch = typeof opts.pitch === 'number' ? opts.pitch : 0.9; // slightly lower pitch for male feel
  u.rate = typeof opts.rate === 'number' ? opts.rate : 1.0;
  u.volume = typeof opts.volume === 'number' ? opts.volume : 1.0;

  // attach metadata
  u._meta = { id: _uuid(), role: opts.role || 'tts' };

  currentUtterance = u;
  speaking = true;

  if (EventBus && typeof EventBus.emit === 'function') {
    EventBus.emit('voice:speak:start', { text, meta: u._meta, voice: voice ? _voiceMeta(voice) : null });
  }

  return new Promise((resolve, reject) => {
    let finished = false;

    u.onend = (ev) => {
      finished = true;
      speaking = false;
      currentUtterance = null;
      if (EventBus && typeof EventBus.emit === 'function') {
        EventBus.emit('voice:speak:end', { text, meta: u._meta });
      }
      resolve({ text, meta: u._meta });
    };

    u.onerror = (err) => {
      finished = true;
      speaking = false;
      currentUtterance = null;
      if (EventBus && typeof EventBus.emit === 'function') {
        EventBus.emit('voice:error', { error: String(err), meta: u._meta });
      }
      reject(err);
    };

    // safety: if user triggers skip via EventBus, cancel utterance
    const onSkip = () => {
      if (finished) return;
      try {
        synth.cancel();
      } catch (e) { /* ignore */ }
      speaking = false;
      currentUtterance = null;
      if (EventBus && typeof EventBus.emit === 'function') {
        EventBus.emit('voice:speak:aborted', { meta: u._meta });
      }
      reject(new Error('speech aborted'));
    };

    // listen for global skip/abort events if EventBus available
    if (EventBus && typeof EventBus.on === 'function') {
      EventBus.on('sequence:skip', onSkip);
      EventBus.on('voice:cancel', onSkip);
    }

    try {
      synth.speak(u);
    } catch (e) {
      // immediate failure
      speaking = false;
      currentUtterance = null;
      if (EventBus && typeof EventBus.emit === 'function') {
        EventBus.emit('voice:error', { error: String(e) });
      }
      reject(e);
    }
  });
}

function cancel() {
  try {
    const synth = window.speechSynthesis;
    if (synth && synth.speaking) synth.cancel();
  } catch (e) { /* ignore */ }
  speaking = false;
  currentUtterance = null;
  if (EventBus && typeof EventBus.emit === 'function') {
    EventBus.emit('voice:cancelled');
  }
}

function isSpeaking() {
  return speaking;
}

export default {
  init,
  speak,
  cancel,
  isSpeaking,
  getVoices,
  setPreferredVoiceId,
  _selectHeuristicMale // exported for testing/inspection
};
