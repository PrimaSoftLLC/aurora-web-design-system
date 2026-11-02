import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { chromium } from '@playwright/test';

// Only selects the Angular workspace and browser. Angular CLI owns compilation and Karma setup.
const root = fileURLToPath(new URL('../../', import.meta.url));
const scope = process.argv[2];
if (!['library', 'site'].includes(scope)) throw Error('Expected library or site');
const args = process.argv.slice(3);
const defaults = [];
if (!args.some((arg) => /^--(?:no-)?watch(?:=|$)/.test(arg))) defaults.push('--watch=false');
const env = { ...process.env, NG_CLI_ANALYTICS: 'false' };
// Prefer the installed Chrome. CI can reuse its existing Playwright Chromium installation.
const systemChrome =
  process.platform === 'win32' &&
  [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA]
    .filter(Boolean)
    .map((base) => join(base, 'Google/Chrome/Application/chrome.exe'))
    .find(existsSync);
let browser = 'ChromeHeadless';
if (!env.CHROME_BIN && systemChrome) env.CHROME_BIN = systemChrome;
else if (!env.CHROME_BIN && existsSync(chromium.executablePath())) {
  env.CHROME_BIN = chromium.executablePath();
  browser = 'ChromeHeadlessNoSandbox'; // Angular CLI's built-in launcher for isolated environments.
}
if (!args.some((arg) => arg.startsWith('--browsers'))) defaults.push('--browsers=' + browser);
const child = spawn(
  process.execPath,
  [join(root, 'node_modules/@angular/cli/bin/ng.js'), 'test', ...defaults, ...args],
  {
    cwd: join(root, scope === 'library' ? 'ng-ui-kit' : 'documentation-site'),
    stdio: 'inherit',
    env,
  },
);
child.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on('exit', (code, signal) => {
  process.exitCode = signal ? 1 : (code ?? 1);
});
