# Версии и публикация

Репозиторий — `github.com/PrimaSoftLLC/aurora-web-design-system` (приватный), пакет — `@primasoftllc/design-system` в
GitHub Packages. Исходники и правки живут в репозитории; правила разработки — [CONTRIBUTING.md](../CONTRIBUTING.md).

## Выпуск версии

Версия в `package.json` — разрабатываемая. `/aurora-release` оформляет раздел
CHANGELOG, переводит `master` fast-forward на релизный коммит, затем поднимает
версию `develop` без Git-тега и открывает новый `[Unreleased]`. Push делает человек.

`/aurora-release` в develop ([AGENTS.md](../AGENTS.md), раздел «Релиз»). Push в master запускает `.github/workflows/ci.yml`:
проверки, `npm publish`, тег `v<version>`, GitHub Release из раздела CHANGELOG. Секреты не нужны — `GITHUB_TOKEN`.
Руками теги не ставятся и `npm publish` не запускается.

## Восстановление после частичного релиза

Публикация в `npm publish`, тег и `gh release` идут одним шагом; если `npm publish` прошёл, а
дальше упало (сеть, права), повторный push в master сам всё доводит: гейт смотрит только на тег
(его ещё нет), а шаг публикации видит версию в реестре и пропускает `npm publish`, идёт сразу
ставить тег и релиз (`.github/workflows/ci.yml`). Донастраивать вручную ничего не нужно.

Если упал только `gh release create` — тег `v<version>` уже запушен, поэтому повторный push
в master теперь остановится на гейте («уже выпущена»). Единственное ручное вмешательство,
которое здесь допустимо: человек выполняет `gh release create v<version> --title v<version>
--notes-file <файл с разделом CHANGELOG>` из commit'а релиза сам, без повторного прогона CI.

## Доступ потребителей

Локальный доступ и настройка CI приложения описаны в [руководстве по использованию](usage.md).

## Лицензия

Перед публикацией `npm run verify` собирает пакет и каталог, проверяет исходный
Git-эталон в установленном Playwright Chromium и устанавливает tarball в пустой
offline-каталог. `site/`, исходники каталога и инструменты браузерных тестов не
поставляются потребителю. `prepack` создаёт совместимые файлы из исходников.

`UNLICENSED` — внутренний пакет. Шрифты — SIL OFL 1.1 (`assets/fonts/*/OFL.txt`).

## Versioning

Semantic versioning, `MAJOR.MINOR.PATCH`, released as a git tag `vX.Y.Z`.
The public surface is: **token names and their roles**, **component names and
props**, the three scope attributes, and the package entry points. Guideline cards
and reference screens are documentation — they never drive the number alone.

### MAJOR — a consumer must edit code

- A token is removed or renamed (`--ds-*`), or its *role* changes so an existing
  use now reads wrong (e.g. an ink token becoming a fill).
- A component is removed or renamed; a prop is removed or renamed; a prop's type
  narrows; a default changes what is already on screen.
- A value of `data-ds-theme` / `-appearance` / `-density` is dropped.
- An entry point moves.
- The minimum React version rises.

### MINOR — new surface, nothing breaks

- A new token, component, prop (with a backwards-compatible default), tenant theme
  block, icon in the vocabulary, or guideline card.
- A deprecation: the old name keeps working as an alias and is marked
  `@deprecated` in the `.d.ts` with the replacement named. **Every removal must
  ship one minor as an alias first** — a rename is never a single release.

### PATCH — same surface, better behaviour

- A colour, size or duration corrected inside an existing token role.
- A bug fix, an accessibility fix, a contrast fix that keeps the API.
- Docs, cards, reference screens, `docs/migration.md`.

### Rules

1. **Tokens are the contract, not the hexes.** Retuning a ramp is a patch; renaming
   a step is a major.
2. **Pre-1.0 does not apply** — the system shipped internally, so start at 1.0.0.
3. One tag, one CHANGELOG entry, one line per change, written for the consumer
   ("`DsChip` gains `count`"), not for the author ("refactored chip").
4. A theme added for a new tenant is a minor, even though it is only a CSS block:
   consumers list themes in their own settings UI.
5. Generated files (`dist/`, `site/`, compatible token CSS/JSON and component bundles)
   come from repository sources via `npm run build`. Do not edit generated copies;
   describe the consumer-facing change in the changelog.
