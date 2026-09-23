/**
 * Хук .claude/hooks/guard-bash.sh: агент не публикует пакет, не пушит в master и не ставит теги версий.
 * Запуск: `node tests/guard-bash.test.js`, часть `npm run test:ui`.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const hook = fileURLToPath(new URL('../.claude/hooks/guard-bash.sh', import.meta.url));
const run = (command) =>
  spawnSync('bash', [hook], { input: JSON.stringify({ tool_input: { command } }), encoding: 'utf8' }).status;

const cases = [
  ['npm publish', 2],
  ['mise exec -- npm publish --dry-run', 2],
  ['npm run build && npm publish', 2],
  ['git push origin master', 2],
  ['git push origin develop master', 2],
  ['git push --follow-tags', 2],
  ['git push origin v2.0.0', 2],
  ['git tag v2.0.0', 2],
  ['git tag -a v2.0.0 -m x', 2],
  ['npm version major', 2],
  ['npm version 2.0.1 --no-git-tag-version', 0],
  ['npm pack', 0],
  ['npm run build', 0],
  ['git push origin feature/publish-2.0.0', 0],
  ['git push -u origin develop', 0],
  ['git tag -l', 0],
  ['git log --oneline', 0],
];
let failed = 0;
for (const [command, expected] of cases) {
  const status = run(command);
  const ok = status === expected;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} guard: ${command} → ${status} (ожидалось ${expected})`);
}
assert.equal(failed, 0, `guard-bash: ${failed} провалов`);
