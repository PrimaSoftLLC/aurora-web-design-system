/** Проверяет запрет публикации и релизных команд, не исполняя команды из payload. */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, copyFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { blockedCommand } from '../tools/guard-command.mjs';

const hook = fileURLToPath(new URL('../tools/guard-command.mjs', import.meta.url));
const cases = [
  ['npm publish', 2], ['mise exec -- npm publish --dry-run', 2],
  ['npm run build && npm publish', 2], ['git push origin master', 2],
  ['git push origin HEAD:master', 2], ['git push origin main:master', 2],
  ['git push origin develop master', 2], ['git push --follow-tags', 2],
  ['git push origin v2.0.0', 2], ['git tag v2.0.0', 2],
  ['git tag -a v2.0.0 -m x', 2], ['npm version major', 2],
  ['npm version 2.0.1 --no-git-tag-version', 0], ['npm pack', 0],
  ['npm run build', 0], ['git push origin masterish', 0],
  ['git push origin feature/master-fix', 0], ['git push origin feature/publish-2.0.0', 0],
  ['git push -u origin develop', 0], ['git tag -l', 0], ['git log --oneline', 0],
  ['npm run build; git push origin --tags', 2],
];
const run = (input, path = hook, cwd) => spawnSync(process.execPath, [path], { input, cwd, encoding: 'utf8' });
for (const [command, status] of cases) {
  assert.equal(Boolean(blockedCommand(command)), status === 2, command);
  for (const key of ['command', 'cmd']) {
    const result = run(JSON.stringify({ tool_input: { [key]: command } }));
    assert.equal(result.status, status, `${key}: ${command}: ${result.stderr}`);
    if (status === 2) assert.match(result.stderr, /Заблокировано/);
  }
}
for (const input of ['{', '{}', '{"tool_input":{"command":42}}']) {
  const result = run(input);
  assert.equal(result.status, 2);
  assert.ok(result.stderr.length, 'Отказ объясняет причину');
}
const fixture = mkdtempSync(join(tmpdir(), 'aurora guard пробел '));
try {
  const copied = join(fixture, 'guard command.mjs');
  copyFileSync(hook, copied);
  assert.equal(run('{"tool_input":{"cmd":"npm publish"}}', copied, fixture).status, 2);
  assert.equal(run('{"tool_input":{"command":"npm run build"}}', copied, tmpdir()).status, 0);
} finally { rmSync(fixture, { recursive: true, force: true }); }
console.log(`guard-command: ${cases.length} commands × 2 input fields, malformed input and paths with spaces passed`);
