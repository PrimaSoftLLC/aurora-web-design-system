# Репозиторий и публикация

Система правится в артефакте Claude, приложения получают её npm-пакетом из
git-репозитория. Как они связаны и кто где пишет — `SYNC.md` в репозитории.

## Завести репозиторий

Готовое дерево репозитория собирает сессия Claude (первая синхронизация). Дальше:

```bash
cd aurora-web-design-system
git remote add origin git@github.com:NikolayNN/aurora-web-design-system.git
git push -u origin main
```

`NikolayNN` — ваш GitHub-аккаунт или организация. Scope пакета в `package.json`
(`@aurora/…`) должен совпадать с ним: GitHub Packages публикует только в scope
владельца репозитория.

## Первая версия

```bash
npm version major -m "Release v%s"    # 2.0.0: переименование префикса v2 → ds
git push --follow-tags
```

Тег запускает `.github/workflows/publish.yml`. Секреты заводить не нужно —
публикация идёт под `GITHUB_TOKEN`.

## Что нужно решить владельцу

- **Лицензия.** Сейчас `UNLICENSED` (внутренний пакет).
- **Шрифты.** `.woff2` для Inter Tight и JetBrains Mono в системе нет —
  `assets/fonts/README.md`. До прод-деплоя переключить `@import` на
  `tokens/webfonts-selfhost.css`.
