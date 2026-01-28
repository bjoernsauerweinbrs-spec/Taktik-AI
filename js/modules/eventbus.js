window.ToniEvents = {
    events: {},
    on(eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },
    emit(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(fn => fn(data));
        }
    }
};
