# Подключение в Angular

Пошаговое подключение пакета, CSS, провайдера и линтера — [getting-started.md](getting-started.md).
Здесь описаны скоупы, интеграция с брендом приложения и графики.
React-компоненты служат эталоном для реализации компонентов в Angular.

## Три независимых скоупа

`provideAurora` из `@primasoftllc/design-system/angular` запускает сервис при bootstrap.
Он ставит на `<body>` три атрибута:

```html
<body data-ds-theme="DEFAULT" data-ds-appearance="light" data-ds-density="cozy">
```

Тема (`DEFAULT` | `RED2`) приходит из конфигурации тенанта. Оформление
(`light` | `dark`) и плотность (`cozy` | `compact`) сохраняются в `localStorage`.
Корректные сохранённые значения имеют приоритет над конфигурацией; при недоступном
storage применяются значения конфигурации. Тема в storage не записывается.
Статические атрибуты в `index.html` задают оформление до bootstrap.

`FRONT_BRAND` и существующие классы `theme-*` можно сохранить: сервис меняет только
`data-ds-*`. Передавайте бренд приложения в `provideAurora({theme})`; после загрузки
конфигурации используйте `AuroraThemeService.setTheme(theme)`.

```ts
import {inject} from '@angular/core';
import {AuroraThemeService} from '@primasoftllc/design-system/angular';

private readonly aurora = inject(AuroraThemeService);
toggleDark(): void {
  this.aurora.setAppearance(this.aurora.appearance() === 'dark' ? 'light' : 'dark');
}
```

В приложении с собственной реализацией скоупов эти же атрибуты можно выставлять вручную.
Старый механизм `theme-*` остаётся рядом с ними.

## Локальные скоупы

Добавьте standalone-директиву `AuroraScopeDirective` в `imports` компонента:

```html
<section auroraScope density="compact">…</section>
<div data-ds-appearance="light">…</div>
```

Каждый атрибут переопределяет только свою ось. Компактная таблица наследует тему
и оформление страницы; светлая панель внутри тёмной страницы сохраняет плотность.
Не заданный input директивы удаляет локальный атрибут и возвращает наследование.

## Стили компонентов

```scss
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

Цвета задаются токенами, размеры — в px. Фокус и рамки полей включены в
`dist/styles.css`; собственное кольцо фокуса не требуется. Необязательный SCSS-партиал
с миксинами сохранён: [templates/angular/README.md](templates/angular/README.md).
Старые имена при миграции — [MIGRATION.md](MIGRATION.md).

## ECharts

Установите ECharts только для приложений с графиками. Отдельный вход сохраняет
базовый Angular-пакет независимым от него:

```ts
import {auroraChartChrome, auroraWatchScopes} from '@primasoftllc/design-system/angular/echarts';

const buildOption = () => ({
  ...auroraChartChrome(host),
  series,
  xAxis: {type: 'time'},
});
chart.setOption(buildOption(), true);
const stop = auroraWatchScopes(host, () => chart.setOption(buildOption(), true));
// В ngOnDestroy: stop(); chart.dispose();
```

Мост читает токены с реального DOM-узла. Наблюдение покрывает сам узел и цепочку
предков до `<html>`, включая промежуточную панель с локальным скоупом.
После изменения темы, оформления или плотности пересобирайте опции; при уничтожении
компонента обязательно вызывайте функцию отписки. Статическая зарегистрированная
JSON-тема не отслеживает смену атрибутов.

Самостоятельный JS-вход `/echarts-theme`, глобальный `dsEChartsTheme` и старые
TypeScript-адаптеры сохранены. Механический переход со старого алиаса описан
в [getting-started.md](getting-started.md#переход-со-старого-алиаса).

## Проверка

Для каждого экрана, диалога и карточки: DEFAULT/light/cozy, DEFAULT/dark/compact,
RED2/light/cozy, RED2/dark/compact, AXE и видимый фокус с клавиатуры.
Сборка библиотеки использует partial compilation; application linker работает
при сборке приложения. Репозиторный `npm run verify` проверяет базовое приложение
без ECharts, приложение с графиками и старый алиас из установленного tarball.
