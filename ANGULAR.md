# Подключение в Angular

Система поставляется как **CSS-токены + спецификация**. React-файлы `components/*.jsx`
в Angular-сборку не идут: это эталон внешнего вида, состояний и имён пропсов, по
которому пишутся Angular-компоненты. В бандл попадают только `styles.css`,
`tokens/` и `assets/`.

## 1. Установка

```bash
npm i @aurora/design-system
```

`angular.json` → `projects.<app>.architect.build.options.styles`, первой строкой,
до собственных стилей приложения:

```json
"styles": [
  "node_modules/@aurora/design-system/dist/styles.css",
  "src/styles.scss"
]
```

`dist/styles.css` собирается в репозитории системы из `tokens.json` и проверяется
в браузере на совпадение с ним — это единственная таблица стилей для приложений.
`tokens.css` со страницы артефакта в приложение не подключается: он для превью.

Иконочный шрифт Material Symbols подтягивается самим `styles.css` относительными
путями — отдельная строка в `assets` не нужна.

Подключение через git submodule не используется: сабмодуль отдаёт исходники,
а не собранную и проверенную таблицу стилей, и версия в нём не фиксируется тегом.

## 2. Три скоупа на `<body>`

```html
<body data-ds-theme="DEFAULT" data-ds-appearance="light" data-ds-density="cozy">
```

Тема приходит из `FRONT_BRAND` в рантайме, как и сейчас. Существующий механизм
`theme-*` класса ломать не нужно — достаточно выставлять рядом атрибут:

```ts
// app.component.ts
@Component({ selector: 'app-root', /* … */ })
export class AppComponent implements OnInit {
  private readonly doc = inject(DOCUMENT);
  private readonly config = inject(ConfigService);

  ngOnInit(): void {
    const body = this.doc.body;
    body.dataset['dsTheme'] = this.config.brand ?? 'DEFAULT';   // FRONT_BRAND
    body.dataset['dsAppearance'] = this.prefs.appearance;        // 'light' | 'dark'
    body.dataset['dsDensity'] = this.prefs.density;              // 'cozy' | 'compact'
  }
}
```

Атрибуты наследуются, поэтому любой подузел переопределяет их локально —
compact-таблица внутри cozy-страницы это один атрибут на обёртке:

```html
<div data-ds-density="compact"><app-objects-table/></div>
```

## 3. Токены в компонентах

```scss
// objects-table.component.scss
.row {
  height: var(--ds-row-h);
  padding-inline: var(--ds-cell-pad-x);
  border-bottom: 1px solid var(--ds-divider);
  color: var(--ds-fg);
  font: var(--ds-type-body);

  &:hover { background: var(--ds-surface-hover); }
  &[aria-selected='true'] { background: var(--ds-surface-selected); }
}
```

Правила ревью те же, что и в системе: **цвет — только через токен, размеры — только
в px** (порталы ставят `html { font-size: 10px }`, поэтому `rem` из старого кода
умножается на 10 один раз и остаётся px). Фокус и рамка текстового поля уже живут в
`tokens/focus.css` и `tokens/field.css` — свой `:focus` компонент не рисует.

## 4. Старые имена

`MIGRATION.md` — таблица «Angular-класс / `--color-*` → имя в системе». Это
документ для миграции, а не источник дизайна: v1-слой удалён.

## 5. Слой angular/

В репозитории есть готовая обвязка — `templates/angular/`: сервис трёх скоупов,
директива `[auroraScope]`, типы, миксины SCSS и конфиг `ng-packagr`.
Подробности и два способа подключения — `templates/angular/README.md`.

```ts
providers: [provideAurora({ theme: 'DEFAULT' })]   // тема из FRONT_BRAND
```

## 6. ECharts

`components/charts/echartsTheme.js` — скрипт с глобалом; ES-модульная обёртка над ним лежит рядом (`echartsTheme.mjs`) и именно на неё указывает экспорт пакета `./echarts-theme`:

```ts
import { dsEChartsTheme } from '@ORG/design-system/echarts-theme';

const option = { ...dsEChartsTheme(this.host.nativeElement), series, xAxis: { type: 'time' } };
this.chart.setOption(option, true);
```

Он читает токены с DOM, поэтому после смены темы, светлости или плотности его
нужно вызвать заново и сделать `setOption` — статическую JSON-тему регистрировать
нельзя, она не следит за атрибутом. `auroraWatchScopes(el, cb)` из
`templates/angular/aurora-echarts.ts` делает это за вас: он подписан на сам узел и
на всю цепочку его предков (включая промежуточную панель с `[auroraScope]`, `<body>`
и `<html>`), так что вложенное переопределение темы тоже перерисовывает график.

## 7. Проверка

Четыре рендера для каждого экрана, диалога и карточки: DEFAULT/light/cozy,
DEFAULT/dark/compact, RED2/light/cozy, RED2/dark/compact. Плюс AXE, реальный
`:focus-visible`, состояние загрузки на каждой кнопке, которая шлёт запрос.
