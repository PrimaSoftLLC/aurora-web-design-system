# Репозиторий и публикация

Репозиторий — `github.com/PrimaSoftLLC/aurora-web-design-system` (приватный), пакет — `@primasoftllc/design-system` в
GitHub Packages. Как артефакт и репозиторий обмениваются правками — SYNC.md.

## Выпуск версии

`/aurora-release` в develop (CLAUDE.md, раздел «Релиз»). Push в master запускает `.github/workflows/ci.yml`:
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

Пакет приватный, у каждого потребителя — доступ на чтение:

- **CI приложения.** Владелец в настройках пакета (Package settings → Manage Actions access) добавляет репозиторий
  приложения с ролью Read. Workflow приложения: `permissions: packages: read`,
  `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`.
- **Локально.** PAT **classic** со scope `read:packages` (fine-grained PAT GitHub Packages не поддерживает) в
  `NODE_AUTH_TOKEN`; в `.npmrc` приложения:
  `@primasoftllc:registry=https://npm.pkg.github.com` и `//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}`.

## Лицензия

Перед публикацией `npm run verify` собирает пакет и каталог, проверяет исходный
Git-эталон в установленном Playwright Chromium и устанавливает tarball в пустой
offline-каталог. `site/`, исходники каталога и инструменты браузерных тестов не
поставляются потребителю. `prepack` создаёт совместимые файлы из исходников.

`UNLICENSED` — внутренний пакет. Шрифты — SIL OFL 1.1 (`assets/fonts/*/OFL.txt`).
