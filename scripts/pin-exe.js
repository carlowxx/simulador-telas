// Depois do build: troca o .exe gerado pelo executável fixo ("launcher") e refaz o .zip.
//
// Por quê: o Controle Inteligente de Aplicativos do Windows 11 bloqueia executáveis sem assinatura
// que ele não conhece. Cada build gera um .exe diferente (leva o número da versão dentro), então uma
// versão nova podia ser bloqueada. Usando sempre o mesmo .exe já aceito, só o conteúdo muda.
//
// O launcher fica na Release "launcher" do GitHub e em build/launcher/ (fora do git).
// Se um dia o Electron for atualizado no package.json, é preciso gerar e publicar um launcher novo.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const exeName = 'Simulador de Telas.exe';
const launcher = path.join(root, 'build', 'launcher', exeName);
const unpacked = path.join(root, 'dist', 'win-unpacked');
const zip = path.join(root, 'dist', `Simulador-de-Telas-${pkg.version}-win.zip`);
const URL = 'https://github.com/carlowxx/simulador-telas/releases/download/launcher/Simulador.de.Telas.exe';

(async () => {
  if (!fs.existsSync(launcher)) {
    console.log('Baixando o launcher fixo do GitHub...');
    fs.mkdirSync(path.dirname(launcher), {recursive: true});
    const res = await fetch(URL);
    if (!res.ok) throw new Error(`Falha ao baixar o launcher: HTTP ${res.status}`);
    fs.writeFileSync(launcher, Buffer.from(await res.arrayBuffer()));
  }
  fs.copyFileSync(launcher, path.join(unpacked, exeName));
  console.log('Executável fixo aplicado em dist/win-unpacked.');
  if (fs.existsSync(zip)) fs.rmSync(zip);
  execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${unpacked}\\*' -DestinationPath '${zip}' -CompressionLevel Optimal"`, {stdio: 'inherit'});
  console.log(`Zip refeito: ${path.basename(zip)}`);
})().catch(e => { console.error(e.message); process.exit(1); });
