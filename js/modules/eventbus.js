// js/modules/eventbus.js
// Lightweight EventBus with pub/sub, once, waitFor, and optional persistence hooks.
// Designed for Toni 2.0: deterministic sequencing, guaranteed local delivery for critical events,
// and simple tracing via event ids and metadata.

const EventBus = (function () {
  // internal listeners: { eventType: Set<handler> }
  const listeners = new Map();

  // optional persistence hook: function(event) => Promise
  // If set, EventBus will call this for events marked as persistent.
  let persistenceHook = null;

  // simple in-memory queue for pending persistent events
  const pendingQueue = [];

  // utility: generate simple UUID (v4-like)
  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // normalize event object
  function makeEvent(type, payload = {}, opts = {}) {
    return {
      id: opts.id || uuid(),
      type,
      payload,
      ts: opts.ts || Date.now(),
      meta: opts.meta || {},
      persistent: !!opts.persistent
    };
  }

  // init: optional config { persistence: fn }
  function init(config = {}) {
    if (config && typeof config.persistence === 'function') {
      persistenceHook = config.persistence;
      // try to flush any pending queue if persistence available
      flushPending().catch((e) => {
        // keep pending if flush fails
        console.warn('EventBus: flushPending failed', e);
      });
    }
  }

  // on: subscribe
  function on(eventType, handler) {
    if (!eventType || typeof handler !== 'function') return;
    if (!listeners.has(eventType)) listeners.set(eventType, new Set());
    listeners.get(eventType).add(handler);
    return () => off(eventType, handler);
  }

  // off: unsubscribe
  function off(eventType, handler) {
    if (!listeners.has(eventType)) return;
    if (!handler) {
      listeners.delete(eventType);
      return;
    }
    listeners.get(eventType).delete(handler);
    if (listeners.get(eventType).size === 0) listeners.delete(eventType);
  }

  // once: subscribe for a single event
  function once(eventType, handler) {
    const wrapper = (payload) => {
      try {
        handler(payload);
      } finally {
        off(eventType, wrapper);
      }
    };
    on(eventType, wrapper);
    return wrapper;
  }

  // emit: synchronous dispatch to handlers; returns Promise that resolves when persistence (if any) completes
  async function emit(typeOrEvent, payload = {}, opts = {}) {
    // allow passing either an event object or (type, payload, opts)
    const event = typeof typeOrEvent === 'string'
      ? makeEvent(typeOrEvent, payload, opts)
      : Object.assign({}, typeOrEvent, { id: typeOrEvent.id || uuid(), ts: typeOrEvent.ts || Date.now() });

    // dispatch to listeners (synchronously)
    try {
      const handlers = listeners.get(event.type);
      if (handlers && handlers.size) {
        // call handlers in microtask order but do not await them here
        handlers.forEach((h) => {
          try {
            // allow handlers to be async; don't await to avoid blocking
            const res = h(event.payload, event);
            // if handler returns a Promise and wants to be awaited, it can emit its own follow-up events
            if (res && typeof res.then === 'function') {
              res.catch((e) => console.error('Event handler error', e));
            }
          } catch (err) {
            console.error('Event handler threw', err);
          }
        });
      }
    } catch (err) {
      console.error('EventBus dispatch error', err);
    }

    // if event is persistent, attempt to persist via hook
    if (event.persistent) {
      if (persistenceHook) {
        try {
          await persistenceHook(event);
        } catch (err) {
          // on failure, push to pending queue for retry
          console.warn('EventBus persistence failed, queued', err);
          pendingQueue.push(event);
        }
      } else {
        // no persistence hook yet: queue
        pendingQueue.push(event);
      }
    }

    return event;
  }

  // waitFor: returns a Promise that resolves when an event of given type is emitted (optionally matching predicate)
  function waitFor(eventType, { timeout = 0, predicate = null } = {}) {
    return new Promise((resolve, reject) => {
      let timer = null;
      const handler = (payload, event) => {
        try {
          if (typeof predicate === 'function' && !predicate(payload, event)) return;
          clear();
          resolve({ payload, event });
        } catch (e) {
          clear();
          reject(e);
        }
      };
      const clear = () => {
        off(eventType, handler);
        if (timer) clearTimeout(timer);
      };
      on(eventType, handler);
      if (timeout > 0) {
        timer = setTimeout(() => {
          clear();
          resolve(null);
        }, timeout);
      }
    });
  }

  // flushPending: attempt to persist queued events (if persistenceHook available)
  async function flushPending() {
    if (!persistenceHook || pendingQueue.length === 0) return;
    // process a copy to avoid mutation during iteration
    const copy = pendingQueue.splice(0, pendingQueue.length);
    for (const ev of copy) {
      try {
        await persistenceHook(ev);
      } catch (err) {
        // push back to pendingQueue for retry later
        pendingQueue.push(ev);
        console.warn('EventBus.flushPending failed for event', ev.id, err);
      }
    }
  }

  // expose current pending count (for monitoring)
  function pendingCount() {
    return pendingQueue.length;
  }

  // expose listeners snapshot (for debugging)
  function debugListeners() {
    const out = {};
    for (const [k, set] of listeners.entries()) {
      out[k] = set.size;
    }
    return out;
  }

  // simple helper to emit and wait for a follow-up event (useful in sequencer)
  async function emitAndWait(type, payload = {}, opts = {}, waitForType = null, waitOpts = {}) {
    const ev = await emit(type, payload, opts);
    if (!waitForType) return ev;
    const res = await waitFor(waitForType, waitOpts);
    return { emitted: ev, waited: res };
  }

  return {
    init,
    on,
    off,
    once,
    emit,
    waitFor,
    flushPending,
    pendingCount,
    debugListeners,
    emitAndWait
  };
})();

export default EventBus;
