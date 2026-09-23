/**
 * Текст GitHub Release — раздел CHANGELOG выпускаемой версии.
 * Запуск: `node tests/changelog-section.test.js`, часть `npm run test:ui`.
 */
import assert from 'node:assert/strict';
import { changelogSection } from '../tools/changelog-section.js';

const md = [
  '# Changelog', '', '## [Unreleased]', '', '- будущее', '',
  '## [2.0.0] — 2026-09-25', '', '### Changed — BREAKING', '', '- `v2` → `ds`', '',
  '## [1.1.0] — 2026-09-01', '', '- старое', '',
].join('\n');

assert.equal(changelogSection(md, '2.0.0'), '### Changed — BREAKING\n\n- `v2` → `ds`');
assert.equal(changelogSection(md, '1.1.0'), '- старое');
assert.equal(changelogSection(md, '2.0.1'), null);
assert.equal(changelogSection(md, '2.0'), null, 'версия сравнивается целиком');
console.log('ok   changelog: раздел версии, последний раздел, нет раздела, неполная версия');
