const listeners = new Map();
const socket = {
  connected: false,
  emit: () => {},
  on: (event, handler) => {
    listeners.set(event, handler);
  },
  off: (event) => {
    listeners.delete(event);
  },
  connect: () => {},
  disconnect: () => {},
};

export function getSocket() {
  return socket;
}

export default getSocket;
