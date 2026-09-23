# Артефакт и репозиторий

Система правится в артефакте Claude; репозиторий собирает, проверяет и публикует пакет.

- **Артефакт → репозиторий.** Выгрузить файлы артефакта поверх рабочей копии в ветке `feature/sync-<дата>` от
  develop, `npm run verify`, PR в develop. Файлы только репозитория (список в CLAUDE.md) выгрузка не трогает.
- **Репозиторий → артефакт.** Правка файла артефакта в репозитории — исключение; такой файл вносится в список ниже
  и переносится в артефакт при следующей сессии в нём, после чего строка удаляется.

## Перенести в артефакт

| Файл | Что изменено | Когда |
|---|---|---|
| `components/src/index.js`, `components/src/components/charts/echartsTheme.js`, `components/bundle.js`, `lint/config.js` | имя пакета `@nikolaynn/design-system` в комментариях | 2.0.0 |
| `README.md`, `ANGULAR.md`, `LINT.md`, `ADOPTION.md`, `lint/README.md`, `templates/angular/README.md`, `PUBLISHING.md`, `CONTRIBUTING.md` | имя пакета, `dist/styles.css`, алиас Angular-слоя, процесс релиза | 2.0.0 |
| `assets/fonts/README.md`, `assets/fonts/**` | шрифты теперь в репозитории | 2.0.0 |
| `CHANGELOG.md` | строки 2.0.0 о пакете | 2.0.0 |
