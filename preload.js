const { contextBridge, ipcRenderer } = require('electron');
const Store = require('electron-store');

const store = new Store();

contextBridge.exposeInMainWorld('electron', {
  store: {
    get: (key, defaultValue) => store.get(key, defaultValue),
    set: (key, value) => store.set(key, value),
  },
});