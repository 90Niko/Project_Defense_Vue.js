import { reactive } from 'vue';

const listeners = reactive({});

export function useEventBus() {
  return {
    on(event, callback) {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
    },
    emit(event, data) {
      if (listeners[event]) {
        listeners[event].forEach(callback => callback(data));
      }
    },
  };
}
