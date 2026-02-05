window.ToniEvents = {
    listeners: {},
    on: function(event, handler) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(handler);
    },
    emit: function(event, payload) {
        console.log(`[EventBus] ${event} gefeuert.`);
        (this.listeners[event] || []).forEach(h => h(payload));
    }
};
 
