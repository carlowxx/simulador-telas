const { app, BrowserWindow, Menu, dialog, shell, net } = require('electron');
const path = require('path');
const fs = require('fs');

const REPO = 'carlowxx/simulador-telas';
let win;

/* ---------- versões da interface ----------
   O simulador inteiro é um único arquivo (app/index.html). Atualizações baixam só esse arquivo
   da Release do GitHub para a pasta do usuário — nada executável, então o Controle Inteligente
   de Aplicativos do Windows não bloqueia. Mudanças em main.js exigem reinstalar o app. */
const uiDir = () => path.join(app.getPath('userData'), 'ui');
const bundledUi = () => path.join(__dirname, 'app', 'index.html');

function cmpVer(a, b) {
  const pa = String(a).replace(/^v/, '').split('.').map(Number), pb = String(b).replace(/^v/, '').split('.').map(Number);
  for (let i = 0; i < 3; i++) { const d = (pa[i] || 0) - (pb[i] || 0); if (d) return Math.sign(d); }
  return 0;
}
function currentUi() {
  try {
    const v = fs.readFileSync(path.join(uiDir(), 'version.txt'), 'utf8').trim();
    const f = path.join(uiDir(), 'index.html');
    if (fs.existsSync(f) && cmpVer(v, app.getVersion()) > 0) return {file: f, version: v};
  } catch (e) { /* sem atualização baixada */ }
  return {file: bundledUi(), version: app.getVersion()};
}
function loadUi() {
  const ui = currentUi();
  win.loadFile(ui.file, {query: {v: ui.version}});
  return ui;
}

async function checkUpdates() {
  if (!app.isPackaged) return;
  try {
    const res = await net.fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {headers: {'User-Agent': 'simulador-telas'}});
    if (!res.ok) return;
    const rel = await res.json();
    const latest = String(rel.tag_name || '').replace(/^v/, '');
    const ui = currentUi();
    if (!latest || cmpVer(latest, ui.version) <= 0) return;
    const asset = (rel.assets || []).find(a => a.name === 'index.html');
    if (!asset) return;
    const html = await (await net.fetch(asset.browser_download_url, {headers: {'User-Agent': 'simulador-telas'}})).text();
    if (!html.includes('Simulador de Telas')) return; // arquivo inesperado: ignora
    fs.mkdirSync(uiDir(), {recursive: true});
    fs.writeFileSync(path.join(uiDir(), 'index.html.tmp'), html, 'utf8');
    fs.renameSync(path.join(uiDir(), 'index.html.tmp'), path.join(uiDir(), 'index.html'));
    fs.writeFileSync(path.join(uiDir(), 'version.txt'), latest, 'utf8');
    const r = await dialog.showMessageBox(win, {
      type: 'info', buttons: ['Atualizar agora', 'Depois'], defaultId: 0, cancelId: 1,
      title: 'Atualização disponível',
      message: `A versão ${latest} do Simulador de Telas foi baixada.`,
      detail: 'Fotos abertas e trabalho não exportado serão perdidos ao atualizar agora. Se escolher "Depois", a nova versão abre da próxima vez.'
    });
    if (r.response === 0) loadUi();
  } catch (e) {
    console.error('Atualização:', e && e.message);
  }
}

/* ---------- downloads (Baixar PNG) ---------- */
function exportDir() {
  const dir = path.join(app.getPath('pictures'), 'Simulações');
  fs.mkdirSync(dir, {recursive: true});
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
    width: 1400, height: 900, minWidth: 1000, minHeight: 640,
    backgroundColor: '#121417',
    title: 'Simulador de Telas',
    icon: path.join(__dirname, 'build', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {contextIsolation: true, nodeIntegration: false, sandbox: true}
  });
  Menu.setApplicationMenu(null);
  win.maximize();
  loadUi();

  win.webContents.setWindowOpenHandler(({url}) => { if (/^https?:/.test(url)) shell.openExternal(url); return {action: 'deny'}; });
  win.webContents.on('will-navigate', e => e.preventDefault());

  let lastShown = 0;
  win.webContents.session.on('will-download', (_e, item) => {
    const target = uniquePath(exportDir(), item.getFilename());
    item.setSavePath(target);
    item.once('done', (_ev, state) => {
      if (state !== 'completed') return;
      if (Date.now() - lastShown > 20000) { lastShown = Date.now(); shell.showItemInFolder(target); }
    });
  });

  win.webContents.on('before-input-event', (_e, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F5') loadUi();
    if (input.key === 'F12') win.webContents.toggleDevTools();
  });
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.whenReady().then(() => { createWindow(); setTimeout(checkUpdates, 3000); });
  app.on('window-all-closed', () => app.quit());
}
