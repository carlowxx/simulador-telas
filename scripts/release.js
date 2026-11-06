// Publica uma nova versão: sobe o número da versão, gera o instalador e cria a Release no GitHub.
// Uso:  npm run release            (1.0.0 -> 1.0.1)
//       npm run release -- minor   (1.0.1 -> 1.1.0)
//       npm run release -- major   (1.1.0 -> 2.0.0)
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

const token = out('gh auth token');
run('npx electron-builder --win --publish always', { env: { ...process.env, GH_TOKEN: token } });

run('git add package.json');
run(`git commit -m "Versão ${next}"`);
run(`git tag v${next}`);
run('git push');
run('git push --tags');

// electron-builder cria a Release como rascunho; publica de vez
run(`gh release edit v${next} --draft=false --title "Versão ${next}"`);
console.log(`\nPronto! Versão ${next} publicada. Os apps instalados vão se atualizar sozinhos.\n`);
