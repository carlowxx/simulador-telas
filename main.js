const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');

let win;

// Pasta onde os PNGs exportados são salvos (sem perguntar a cada arquivo)
function exportDir() {
  const dir = path.join(app.getPath('pictures'), 'Simulações');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
function uniquePath(dir, name) {
  const ext = path.extname(name), base = path.basename(name, ext);
  let p = path.join(dir, name), i = 2;
  while (fs.existsSync(p)) p = path.join(dir, `${base} (${i++})${ext}`);
  return p;
}

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 640,
    backgroundColor: '#121417',
    title: 'Simulador de Telas',
    icon: path.join(__dirname, 'build', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  Menu.setApplicationMenu(null);
  win.maximize();
  win.loadFile(path.join(__dirname, 'app', 'index.html'), { query: { v: app.getVersion() } });

  // Links externos abrem no navegador; nada de navegar dentro do app
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', e => e.preventDefault());

  // Downloads (Baixar PNG) vão direto para Imagens\Simulações
  let lastShown = 0;
  win.webContents.session.on('will-download', (_e, item) => {
    const target = uniquePath(exportDir(), item.getFilename());
    item.setSavePath(target);
    item.once('done', (_ev, state) => {
      if (state !== 'completed') return;
      // abre a pasta no máximo uma vez a cada 20 s (evita várias janelas no "Baixar todas")
      if (Date.now() - lastShown > 20000) { lastShown = Date.now(); shell.showItemInFolder(target); }
    });
  });

  // Atalhos úteis: F5 recarrega, F12 ferramentas de desenvolvedor
  win.webContents.on('before-input-event', (_e, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F5') win.webContents.reload();
    if (input.key === 'F12') win.webContents.toggleDevTools();
  });
}

function setupUpdates() {
  if (!app.isPackaged) return;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('update-downloaded', async info => {
    const r = await dialog.showMessageBox(win, {
      type: 'info',
      buttons: ['Reiniciar agora', 'Depois'],
      defaultId: 0,
      cancelId: 1,
      title: 'Atualização disponível',
      message: `A versão ${info.version} do Simulador de Telas foi baixada.`,
      detail: 'Reinicie para usar a nova versão. Se escolher "Depois", ela será instalada quando você fechar o app.'
    });
    if (r.response === 0) autoUpdater.quitAndInstall();
  });
  autoUpdater.on('error', err => console.error('Atualização:', err && err.message));
  autoUpdater.checkForUpdates().catch(() => {});
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.whenReady().then(() => { createWindow(); setupUpdates(); });
  app.on('window-all-closed', () => app.quit());
}
