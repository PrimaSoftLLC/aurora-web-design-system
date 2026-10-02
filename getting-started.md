# Быстрый старт: дизайн-система в новом Angular-приложении

Путь для разработчика, который подключает систему в новый проект с нуля. Каждый шаг ссылается на документ, где
написано подробнее. Существующее приложение подключается по-другому — срезами, после пилота (ADOPTION.md).

Требования: Angular 19+, Node 22, доступ к GitHub.

## 1. Доступ к пакету

Пакет `@primasoftllc/design-system` приватный и лежит в GitHub Packages.

1. Попросите владельца выдать вам доступ к репозиторию `PrimaSoftLLC/aurora-web-design-system`.
2. Создайте PAT **classic** со scope `read:packages` (GitHub → Settings → Developer settings → Personal access
   tokens → Tokens (classic)). Fine-grained токен GitHub Packages не принимает.
3. Положите токен в переменную окружения `NODE_AUTH_TOKEN` (в профиль оболочки, не в репозиторий).

## 2. `.npmrc` в корне приложения

```
@primasoftllc:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Файл коммитится: токена в нём нет, только ссылка на переменную.

## 3. Установка

```bash
npm i -E @primasoftllc/design-system # точная версия, без ^: обновление — отдельный коммит
npm i -D stylelint postcss-scss      # линтер (шаг 7)
```

Базовый Angular-вход не требует ECharts. Устанавливайте `echarts` отдельно, если используете графики.

## 4. Стили: `angular.json`

`projects.<app>.architect.build.options.styles`, первой строкой, до стилей приложения:

```json
"styles": [
  "node_modules/@primasoftllc/design-system/dist/styles.css",
  "src/styles.scss"
]
```

Шрифты (Inter Tight, JetBrains Mono) и иконки Material Symbols подключаются самим `styles.css` — в `assets`
ничего добавлять не нужно, в Google Fonts интерфейс не ходит. Подробнее — ANGULAR.md §1.

## 5. Angular-слой

Пакет содержит скомпилированный Angular-вход с типами. Для нового проекта алиас в `tsconfig.paths` не нужен.
Импортируйте сервис, директиву и провайдер из `@primasoftllc/design-system/angular`.

## 6. Тема, оформление, плотность

`app.config.ts`:

```ts
import {ApplicationConfig} from '@angular/core';
import {provideAurora} from '@primasoftllc/design-system/angular';

export const appConfig: ApplicationConfig = {
  providers: [...provideAurora({theme: 'DEFAULT'})],
};
```

Провайдер запускает сервис при bootstrap и выставляет атрибуты на `<body>`.
Внедряйте сервис в компонент там, где нужны переключатели оформления или плотности:

```ts
private readonly aurora = inject(AuroraThemeService);

toggleDark(): void {
  this.aurora.setAppearance(this.aurora.appearance() === 'dark' ? 'light' : 'dark');
}
```

`src/index.html` — те же значения статически, чтобы до старта Angular страница не мигнула без темы:

```html
<body data-ds-theme="DEFAULT" data-ds-appearance="light" data-ds-density="cozy">
```

Сервис держит на `<body>` три атрибута: `data-ds-theme` (`DEFAULT` | `RED2`), `data-ds-appearance`
(`light` | `dark`), `data-ds-density` (`cozy` | `compact`). Оформление и плотность он запоминает в
`localStorage`, тему — нет: это свойство тенанта. Пользователю дайте переключатели оформления и плотности, обе
плотности обязательны.

Переопределить скоуп на части страницы — директива или атрибут на обёртке:

```html
<section auroraScope density="compact">…</section>
<div data-ds-appearance="dark">…</div>
```

## 7. Графики, если нужны

```bash
npm i echarts
```

```ts
import {auroraChartChrome, auroraWatchScopes} from '@primasoftllc/design-system/angular/echarts';
```

Стройте опции от DOM-узла графика и перестраивайте их при смене скоупа.
Пример и отписка — [ANGULAR.md](ANGULAR.md#echarts).
Самостоятельный JS-вход `/echarts-theme` также сохранён.

## 8. Линтер — в первый день

`.stylelintrc.json`:

```json
{
  "extends": "@primasoftllc/design-system/stylelint-config",
  "overrides": [{ "files": ["**/*.scss"], "customSyntax": "postcss-scss" }]
}
```

`package.json`: `"lint:css": "stylelint \"src/**/*.{css,scss}\""`, запуск в CI рядом с тестами. Что он ловит и
чего не видит — LINT.md.

## 9. Как писать стили

- Цвет — только `var(--ds-*)`. Размеры — только `px`, без `rem`.
- Свой `:focus`, рамку текстового поля и `box-shadow` не рисовать: кольцо фокуса и рамка уже в системе.
- Шрифт — ролью: `font: var(--ds-type-body)`.
- Литералы цветов в TypeScript (конфиги ECharts) линтер не видит — берите `dsEChartsTheme` из
  `@primasoftllc/design-system/echarts-theme` и перестраивайте график при смене скоупа (`auroraWatchScopes`,
  ANGULAR.md §6).

Пример — ANGULAR.md §3.

## 10. Компоненты

Готовых Angular-компонентов в пакете нет: React-компоненты системы — эталон, в сборку не идут. Компонент пишется
в приложении по спецификации из репозитория системы (в npm-пакет она не входит): папка `components/Ds<Имя>/` —
`Ds<Имя>.d.ts` (входы и типы), `README.md` и карточка `@dsCard` в `preview.html` (вид и состояния). Эталонная
реализация — `components/src/components/**/Ds<Имя>.jsx`. Имя и входы — как у эталона (`DsButton` →
`ds-button`), состояния — все, что описаны в спецификации.

Не хватило токена или компонента, спецификация не покрывает состояние — не изобретайте: `// TODO: DS-<n>` в коде
и задача в репозитории системы. Подробнее — ADOPTION.md, «Когда токена или компонента не хватает».

## 11. CI приложения

1. Владелец пакета: Package settings → Manage Actions access → добавить репозиторий приложения с ролью Read.
2. Workflow приложения:

```yaml
permissions:
  contents: read
  packages: read
steps:
  - uses: actions/setup-node@v7
    with:
      node-version: '22'
      cache: npm
      registry-url: https://npm.pkg.github.com
      scope: '@primasoftllc'
  - run: npm ci
    env:
      NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 12. Приёмка экрана

Каждый экран, диалог и карточка снимаются в четырёх рендерах: DEFAULT/light/cozy, DEFAULT/dark/compact,
RED2/light/cozy, RED2/dark/compact. Плюс AXE без нарушений, видимый `:focus-visible` с клавиатуры, состояние
загрузки у каждой кнопки, которая шлёт запрос (CONTRIBUTING.md, «Acceptance criteria»).

## 13. Обновление системы

`npm i -E @primasoftllc/design-system@X.Y.Z` отдельным коммитом. MAJOR — ломающие изменения: прочитайте раздел версии в
CHANGELOG.md и MIGRATION.md, правки кода — в том же коммите (VERSIONING.md).

## Переход со старого алиаса

Существующий алиас `/angular` на `components/src/templates/angular/index.ts` сохранён.
Старые адаптеры используют тот же сервис и InjectionToken, что и новые входы.
Для Angular application-builder старый исходный `index.ts` должен быть включён в `tsconfig.files`:

```json
"files": ["node_modules/@primasoftllc/design-system/components/src/templates/angular/index.ts"]
```

Для перехода удалите только алиас `@primasoftllc/design-system/angular` из `paths`.
Импорты сервиса и директивы оставьте; `auroraChartChrome` и `auroraWatchScopes` перенесите
на `/angular/echarts`. Запись совместимого `index.ts` в `files` после перехода можно удалить.
CSS-путь, имена токенов и SCSS-партиал сохраняются.

## Если что-то не так

| Симптом | Причина |
|---|---|
| `npm i` — 401/403 от `npm.pkg.github.com` | нет `NODE_AUTH_TOKEN`, токен fine-grained или без `read:packages`, нет доступа к репозиторию системы |
| `npm i` — ERESOLVE по `echarts` или `stylelint` | мажор вне поддерживаемых: echarts 5–6, stylelint 16–17 |
| `Cannot find module 'echarts'` при сборке | установите ECharts при использовании `/angular/echarts` |
| Не найден `/angular` | проверьте установленную версию и оставшийся старый `paths` |
| Интерфейс в Helvetica, иконки — текстом | `styles.css` пакета не первой строкой `styles` или подключён не `dist/styles.css` |
| Тема не меняется, на `<body>` нет `data-ds-*` | проверьте включение `...provideAurora(...)` в bootstrap-конфигурацию |
| CI: 403 на `npm ci` | репозиторию приложения не выдан доступ в настройках пакета (шаг 10) |
