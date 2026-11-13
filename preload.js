// Ponte mínima entre a interface e o app: só a pasta onde as simulações são salvas.
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('simulador', {
  getFolder: () => ipcRenderer.invoke('folder:get'),
  chooseFolder: () => ipcRenderer.invoke('folder:choose'),
  resetFolder: () => ipcRenderer.invoke('folder:reset'),
  openFolder: sub => ipcRenderer.invoke('folder:open', sub)
});
