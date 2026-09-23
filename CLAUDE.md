# aurora-web-design-system: правила для агентов

Пакет `@nikolaynn/design-system` в GitHub Packages. Первый потребитель — aur-billing (пилот, спека
`D:\projects\aur-billing\docs\superpowers\specs\2026-09-22-frontend-design.md`).

## Команды
- Node 22 из `mise.toml`: `mise exec -- npm …`.
- `npm test` — линтер, проверки поставки, UI-тесты, хук. `npm run verify` — плюс сборка `dist/`, каскад в headless
  Chrome (`CHROME_BIN`, если Chrome не в стандартном пути) и проверка tarball глазами потребителя.
- `npm run build` — `dist/styles.css`, `dist/tokens.css` (не коммитятся). `npm run check:parity` — копии токенов
  в `components/bundle.css` против `tokens.css`.

## Где что правится
- Токены, компоненты, превью, карточки, `tokens.css`, `components/bundle.css`, `.d.ts` — в артефакте Claude, в
  репозиторий приходят синхронизацией (SYNC.md). Здесь их не править; если без правки не обойтись — строка в
  SYNC.md «перенести в артефакт».
- Только здесь: `package.json`, `tools/`, `tests/`, `.github/`, `.claude/`, `docs/`, CLAUDE.md, SYNC.md, getting-started.md.

## Релиз
- Ветки: `master` (релизы), `develop`, фичи `feature/*` от develop. Коммиты на английском.
- Версия в `package.json` — разрабатываемая. Релиз — `/aurora-release`: CHANGELOG `## [Unreleased]` →
  `## [X.Y.Z] — YYYY-MM-DD` (Keep a Changelog, не «Не выпущено»), fast-forward master, develop → следующая версия
  (`npm version <next> --no-git-tag-version`) с новым `## [Unreleased]`. Push делает человек.
- Push в master публикует пакет, ставит тег `v<version>` и GitHub Release (ci.yml). `npm publish`, `git tag v*`,
  `git push` в master агенту блокирует `.claude/hooks/guard-bash.sh`.
- Номер — по VERSIONING.md: ломающее изменение → MAJOR.
