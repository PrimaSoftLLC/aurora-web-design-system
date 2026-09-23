# Angular-слой

Тонкая обвязка над CSS-системой. Ничего не рисует: три файла на TypeScript,
один SCSS-партиал и конфиг для сборки библиотекой. Внешний вид целиком приходит из
`styles.css` — эти файлы только переключают скоупы и типизируют их.

Это образец обвязки для приложения, а не часть дизайн-системы: токенов, компонентов
и правил внешнего вида здесь нет. TypeScript-файлы лежат в
`components/src/templates/angular/` (вход — `index.ts`), SCSS-партиал и
`ng-package.json` — в этой папке.

| Файл | Зачем |
|---|---|
| `aurora-theme.service.ts` | `data-ds-theme` / `-appearance` / `-density` на `<body>`: тема из `FRONT_BRAND`, оформление и плотность с сохранением в `localStorage` |
| `aurora-scope.directive.ts` | `[auroraScope]` — переопределить любой из трёх скоупов на поддереве |
| `aurora-echarts.ts` | типизированная обёртка над `components/charts/echartsTheme.js` + пересборка темы при смене скоупа |
| `aurora-tokens.ts` | типы `DsTheme` / `DsAppearance` / `DsDensity` и имена атрибутов — один источник строк |
| `_aurora.scss` | три миксина-сахара над токенами; необязателен |
| `ng-package.json` | сборка `ng-packagr`, если слой станет отдельным npm-пакетом; пути `assets` в нём указывают на раскладку до переноса — поправьте при первой такой сборке |

## Подключение

Слой входит в пакет системы: `@aurora/design-system/angular`. Стили — как в
[ANGULAR.md](../../ANGULAR.md), `node_modules/@aurora/design-system/dist/styles.css`.

```ts
// tsconfig.json — TypeScript-исходники слоя компилирует приложение
"paths": { "@aurora/ds": ["node_modules/@aurora/design-system/components/src/templates/angular/index.ts"] }
```

Отдельная сборка слоя через `ng-packagr` (`ng-package.json` рядом) нужна, только
если слой когда-нибудь станет самостоятельным пакетом.

## Старт

```ts
// app.config.ts
import { provideAurora } from '@aurora/ds';

export const appConfig: ApplicationConfig = {
  providers: [provideAurora({ theme: 'DEFAULT' })],  // тема из FRONT_BRAND
};
```

```ts
// app.component.ts
private readonly aurora = inject(AuroraThemeService);
toggleDark() { this.aurora.setAppearance(this.aurora.appearance() === 'dark' ? 'light' : 'dark'); }
```

Существующий класс `theme-*` из `FRONT_BRAND` убирать не нужно: сервис ставит
атрибут рядом, механизм white-label не меняется.

## Проверка

Четыре рендера: DEFAULT/light/cozy, DEFAULT/dark/compact, RED2/light/cozy,
RED2/dark/compact — критерий приёмки для каждого экрана, диалога и карточки.
