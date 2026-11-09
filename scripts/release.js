// Publica uma nova versão no GitHub.
// Uso:  npm run release            (1.0.0 -> 1.0.1)
//       npm run release -- minor   (1.0.1 -> 1.1.0)
//       npm run release -- major   (1.1.0 -> 2.0.0)
//
// A Release leva dois arquivos:
//   index.html  -> usado pela atualização automática dos apps já instalados (só a interface)
//   ...-win.zip -> o app completo, para instalar num PC novo
// Se você mudou main.js, os apps instalados precisam ser reinstalados (npm run build && npm run instalar).
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });
const out = cmd => execSync(cmd, { encoding: 'utf8' }).trim();

const root = path.join(__dirname, '..');
process.chdir(root);

if (out('git status --porcelain')) {
  console.error('\nHá alterações não commitadas. Faça o commit antes de publicar.\n');
  process.exit(1);
}

const kind = process.argv[2] || 'patch';
const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const [a, b, c] = pkg.version.split('.').map(Number);
const next = kind === 'major' ? `${a + 1}.0.0` : kind === 'minor' ? `${a}.${b + 1}.0` : `${a}.${b}.${c + 1}`;
pkg.version = next;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`\nVersão ${next}\n`);

// apaga zips de versões antigas (são só cópias locais; todos ficam no GitHub)
for (const f of fs.readdirSync(path.join(root, 'dist')).filter(f => f.endsWith('-win.zip'))) fs.rmSync(path.join(root, 'dist', f));
run('npm run build');
const zip = path.join('dist', `Simulador-de-Telas-${next}-win.zip`);

run('git add package.json');
run(`git commit -m "Versão ${next}"`);
run(`git tag v${next}`);
run('git push');
run(`git push origin v${next}`);
run(`gh release create v${next} "app/index.html" "${zip}" --title "Versão ${next}" --notes "Os apps instalados se atualizam sozinhos. Para instalar num PC novo, baixe o .zip, extraia e abra **Simulador de Telas.exe**."`);
console.log(`\nPronto! Versão ${next} publicada. Os apps instalados vão se atualizar ao abrir.\n`);
