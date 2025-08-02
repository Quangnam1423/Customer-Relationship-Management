const eventEmitter = {
  _events: {},
  dispatch(event, data) {
    if (!this._events[event]) {
      return;
    }
    this._events[event].forEach(callback => callback(data));
  },
  on(event, callback) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(callback);
  },
  remove(event, callback) {
    if (!this._events[event]) {
      return;
    }
    this._events[event] = this._events[event].filter(
      cb => cb !== callback
    );
  },
};

export default eventEmitter;
