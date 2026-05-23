import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = path.join(rootDir, 'dist');

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const entry of ['index.html', 'app', 'README.md', 'README.ru.md']) {
  const src = path.join(rootDir, entry);
  const dest = path.join(outDir, entry);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
  }
}

fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
console.log(`Built static site into ${path.relative(rootDir, outDir)}`);
