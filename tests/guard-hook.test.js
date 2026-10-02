/** Проверяет действительную команду подключения, Git-корень и передачу stdin. */
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const hook = JSON.parse(readFileSync(new URL('.codex/hooks.json', root))).hooks.PreToolUse[0].hooks[0];
const dir = mkdtempSync(join(tmpdir(), 'aurora hook пробел '));
try {
  mkdirSync(join(dir, 'tools'));
  mkdirSync(join(dir, 'nested'));
  copyFileSync(new URL('tools/guard-command.mjs', root), join(dir, 'tools/guard-command.mjs'));
  execFileSync('git', ['init', '--quiet', dir]);
  for (const cwd of [dir, join(dir, 'nested')]) {
    for (const [command, status] of [['npm run build', 0], ['npm publish', 2]]) {
      const windows = process.platform === 'win32';
      const result = windows
        ? spawnSync('cmd', ['/d', '/s', '/c', hook.commandWindows], { cwd, windowsVerbatimArguments: true, input: JSON.stringify({ tool_input: { cmd: command } }), encoding: 'utf8' })
        : spawnSync('bash', ['-c', hook.command], { cwd, input: JSON.stringify({ tool_input: { cmd: command } }), encoding: 'utf8' });
      assert.equal(result.status, status, `${cwd}: ${command}: ${result.stderr}`);
      if (status === 2) assert.match(result.stderr, /Заблокировано/);
    }
  }
} finally { rmSync(dir, { recursive: true, force: true }); }
console.log('guard-hook: configured command works from root/subdirectory with spaces and Cyrillic');
