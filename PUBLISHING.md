# Репозиторий и публикация

Репозиторий — `github.com/NikolayNN/aurora-web-design-system` (приватный), пакет — `@nikolaynn/design-system` в
GitHub Packages. Как артефакт и репозиторий обмениваются правками — SYNC.md.

## Выпуск версии

`/aurora-release` в develop (CLAUDE.md, раздел «Релиз»). Push в master запускает `.github/workflows/ci.yml`:
проверки, `npm publish`, тег `v<version>`, GitHub Release из раздела CHANGELOG. Секреты не нужны — `GITHUB_TOKEN`.
Руками теги не ставятся и `npm publish` не запускается.

## Доступ потребителей

Пакет приватный, у каждого потребителя — доступ на чтение:

- **CI приложения.** Владелец в настройках пакета (Package settings → Manage Actions access) добавляет репозиторий
  приложения с ролью Read. Workflow приложения: `permissions: packages: read`,
  `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`.
- **Локально.** PAT **classic** со scope `read:packages` (fine-grained PAT GitHub Packages не поддерживает) в
  `NODE_AUTH_TOKEN`; в `.npmrc` приложения:
  `@nikolaynn:registry=https://npm.pkg.github.com` и `//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}`.

## Лицензия

`UNLICENSED` — внутренний пакет. Шрифты — SIL OFL 1.1 (`assets/fonts/*/OFL.txt`).
