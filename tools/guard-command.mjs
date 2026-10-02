import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const checks = [
  [/(^|[^\w./-])npm\s+publish(?:[\s;"']|$)/, 'npm publish'],
  [/git\s+push[^\r\n]*(?:\s|:)(?:master|--tags|--follow-tags|v\d+(?:\.\d+)+)(?:[\s;"']|$)/, 'git push в master или тега версии'],
  [/git\s+tag\s+(?:-[as]\s+)?v\d/, 'git tag v*'],
];
/** Ограничения релиза; строка команды никогда не исполняется. */
export function blockedCommand(command) {
  const match = checks.find(([pattern]) => pattern.test(command));
  if (match) return match[1];
  if (/npm\s+version/.test(command) && !/npm\s+version[^\r\n]*--no-git-tag-version/.test(command))
    return 'npm version с тегом';
  return null;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const payload = JSON.parse(readFileSync(0, 'utf8'));
    const command = payload.tool_input?.command ?? payload.tool_input?.cmd;
    if (typeof command !== 'string') throw new Error('tool_input.command или cmd должен быть строкой');
    const reason = blockedCommand(command);
    if (reason) throw new Error(`${reason}. Публикацию и релизный push выполняет человек; см. AGENTS.md`);
  } catch (error) {
    console.error(`Заблокировано guard-command: ${error.message}`);
    process.exitCode = 2;
  }
}
