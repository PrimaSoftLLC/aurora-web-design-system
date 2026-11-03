import { copyFileSync, cpSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeTokenOutputs } from '../design-system/tools/tokens/build.mjs';

export function buildDesignSystem() {
  const root = fileURLToPath(new URL('../', import.meta.url));
  writeTokenOutputs({ root });
  // The site consumes assembled CSS with the published relative font layout.
  // Repository-first forbids compatibility copies in the repository root.
  const resources = join(root, '.tmp/documentation-site-resources');
  mkdirSync(join(resources, 'dist'), { recursive: true });
  for (const file of ['styles.css', 'tokens.css']) {
    copyFileSync(join(root, 'dist', file), join(resources, 'dist', file));
  }
  for (const directory of ['fonts', 'assets/fonts']) {
    cpSync(join(root, 'design-system', directory), join(resources, directory), { recursive: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildDesignSystem();
  console.log('Design system: styles, tokens and fonts built');
}
