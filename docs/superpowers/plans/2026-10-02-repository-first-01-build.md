# Repository-first Build and Catalogue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Получить воспроизводимую сборку пакета и всех существующих превью без артефакта Claude.

**Architecture:** Зафиксировать независимый эталон, затем заменить генерацию токенов и JS, подключить самостоятельные HTML-превью и локальный сервер. Каталог находится в `site/`, поставка — в `dist/`; npm-пакет не включает `site/`.

**Tech Stack:** Node 22, PostCSS, esbuild, React/ReactDOM 18.3.1, jsdom, Playwright, parse5, существующий Stylelint.

**Spec:** [Спецификация](../specs/2026-10-02-repository-first-design.md), §§1–5, 7–8; [общий план](2026-10-02-repository-first.md).

## Global Constraints

- «Репозиторий становится единственным источником дизайн-системы Aurora».
- «Существующие React-компоненты, HTML-примеры и содержательная документация сохраняются».
- «Публичная схема `tokens.json` остаётся совместимой».
- «Повторные объявления в выходном CSS допустимы, когда нужны каскаду, но создаются генератором».
- «Публикация пакета, перенос приложений-потребителей и редизайн интерфейса не входят в реализацию».
- Node 22 через mise; обязательны все ограничения общего плана; продуктовые зависимости и версии не обновляются попутно.
- Токены DEFAULT/RED2 × light/dark × cozy/compact, прежние пути CSS и React-экспорты сохраняются.
- Новые build-only зависимости — devDependencies, pinned через `--save-exact`; репозиторий сохраняет lock-файл.
- Read-only Git-эталон — `8bf5c4d`; нельзя переписать baseline результатом новой сборки.

## Review Focus

1. Недоступный bash не маскирует реальные guard-ошибки — задача 1.
2. Относительный asset с query/hash и путь проекта с кириллицей — задачи 2, 5.
3. Алиас зависит от темы предка, а плотность задана на потомке — задача 3.
4. Бандл содержит второй React или проглатывает ошибку компонента — задача 4.
5. Ошибка rebuild оставляет старую страницу без уведомления — задача 5.

## Карта файлов и интерфейсов

| Файлы | Ответственность |
|---|---|
| `tools/guard-command.mjs`, `.codex/hooks.json`, `AGENTS.md` | Перенос ограничений публикации и правил разработки |
| `tools/baseline/{export,render}.mjs`, `tests/fixtures/migration-baseline.json` | Чтение закреплённой Git-версии и проверка миграции |
| `tokens/source.json`, `tools/tokens/{model,css,public-json}.mjs` | Единственная модель, CSS и совместимый JSON |
| `styles/{controls,motion,icons}.css` | Общие правила, не значения палитр |
| `tools/build-components.mjs`, `catalog/runtime.jsx`, `tests/helpers/runtime.js` | Общий React runtime и сборка исходников |
| `tools/catalog/{index,preview,assets,build}.mjs`, `catalog/{index.html,app.js,styles.css}` | Индекс материалов и самостоятельные страницы |
| `tools/dev.mjs`, `tools/verify.mjs`, `tools/build.js` | Оркестрация и разработка |
| `site/`, `.tmp/`, `dist/` | Игнорируемые выходы; `site/` не публикуется |

Все экспортируемые функции tools принимают абсолютный `root`, не зависят от cwd
импортирующего теста. Публичные структуры задач:

```ts
type Scope = { theme: 'DEFAULT'|'RED2'; appearance: 'light'|'dark'; density: 'cozy'|'compact' };
type TokenModel = {
  names: string[];
  sets: Record<string, Record<string,string>>; // DEFAULT.light, RED2.dark и т. д.
  density: Record<'cozy'|'compact', Record<string,string>>;
  aliases: Record<string,string[]>; // зависимости var() для пересчёта
};
type Card = {
  id: string; title: string; group: string; subtitle: string;
  previewPath: string; readmePath: string|null; declarationPaths: string[];
  viewport: { width: number; height: number }; scopeMode: 'inherit'|'local';
};
// Каждая функция ниже реализуется в указанной задаче.
// exportBaseline({ root, ref, outDir }): Promise<{ root: string; sha: string }> — 2
// readTokenModel(source): TokenModel; renderTokenCss(model): string — 3
// serializePublicTokens(source): string — 3
// buildComponents({root,outDir}): Promise<{runtime:string,components:string}> — 4
// readCards(root): Card[]; buildCatalogue({root,outDir}): Promise<Card[]> — 5
// renderPreview({root,card,mode,scope}): Promise<string> — legacy в 2, current в 5
// mode: 'legacy'|'current'; legacy подключает неизменённый бандл эталона.
```

### Task 1: Рабочие ограничения и исходные проверки без Claude

**Files:** Create `tools/guard-command.mjs`, `tests/guard-command.test.js`, `.codex/hooks.json`, `AGENTS.md`; modify `tests/guard-bash.test.js`, `package.json`, `CLAUDE.md`, `SYNC.md`, `CONTRIBUTING.md`, `CHANGELOG.md`; remove `.claude/settings.json` и старый shell-хук только после проверки нового подключения.

**Interfaces:** consumes текущие 21 guard-кейса; produces `blockedCommand(command: string): string|null` и CLI JSON stdin → exit 0/2.

- [ ] Сохранить диагностику исходного сбоя: `Get-Command bash -All`, путь реально выбранного bash, его stdout/stderr из `spawnSync`. Запустить старый тест с явным Git Bash, если он установлен. Не называть сбой окружением до подтверждения; все исследуемые publish-команды остаются строками данных.
- [ ] Добавить тесты Node-реализации до изменения скрипта. Перенести все 21 кейс и явно проверить обе формы поля команды, составную команду и невалидный JSON:

```js
import { blockedCommand } from '../tools/guard-command.mjs';
assert.equal(blockedCommand('npm run build'), null);
assert.ok(blockedCommand('mise exec -- npm publish --dry-run'));
assert.ok(blockedCommand('git push origin HEAD:master'));
assert.equal(blockedCommand('git push origin feature/master-fix'), null);
// CLI запускается process.execPath, а не bash: r.status === 2 для запрета.
// JSON {tool_input:{cmd:'npm publish'}} и {tool_input:{command:'npm publish'}}.
```

- [ ] RED: `mise exec -- node tests/guard-command.test.js` → missing module/FAIL до реализации.
- [ ] Перенести существующие четыре правила в чистую JS-функцию, разобрать JSON stdin, выбирать `tool_input.command ?? tool_input.cmd`; отсутствие строки/невалидный JSON — exit 2 с причиной. Удалить shell-зависимость основного guard-теста. Не расширять проект до универсального анализатора shell.

```js
const checks = [
  [/(^|[^\w./-])npm\s+publish(?:[\s;"']|$)/, 'npm publish'],
  [/git\s+push[^\r\n]*(?:\s|:)(?:master|--tags|--follow-tags|v\d+(?:\.\d+)+)(?:[\s;"']|$)/, 'release push'],
  [/git\s+tag\s+(?:-[as]\s+)?v\d/, 'version tag'],
];
export function blockedCommand(command) {
  const match = checks.find(([pattern]) => pattern.test(command));
  if (match) return match[1];
  if (/npm\s+version/.test(command) && !/npm\s+version[^\r\n]*--no-git-tag-version/.test(command))
    return 'npm version with tag';
  return null;
}
```

- [ ] Создать `.codex/hooks.json` со следующими командами; проверить stdin и путь с пробелом при запуске из корня и из подкаталога. Команды ниже находят Git-корень, но не исполняют payload, который проверяет guard.

```json
{"hooks":{"PreToolUse":[{"matcher":"^Bash$","hooks":[{
  "type":"command","timeout":10,
  "command":"mise exec -- node \"$(git rev-parse --show-toplevel)/tools/guard-command.mjs\"",
  "commandWindows":"powershell -NoProfile -Command \"& mise exec -- node ((git rev-parse --show-toplevel) + '/tools/guard-command.mjs')\""
}]}]}}
```
- [ ] Проверить новый JSON на соответствие официальной схеме Codex hooks; прямой запуск payload не доказывает активацию в хосте. Доверие конкретному hook подтверждается через `/hooks` пользователем; не обходить trust. До подтверждения старую защиту не удалять. В `AGENTS.md` сохранить запрет publish/release push и весь релизный процесс; `CLAUDE.md` заменить ссылкой на правила, `SYNC.md` — коротким уведомлением о новом источнике до финального удаления в плане 3.
- [ ] GREEN: `mise exec -- node tests/guard-command.test.js`, затем `mise exec -- npm test`; если выявлены независимые старые дефекты, зафиксировать причины и исправлять только необходимые для честной базы. Проверить hook из пути с пробелом; текст отказа содержит причину.
- [ ] Коммит: `chore: move repository workflow and release guards out of Claude`.

### Task 2: Независимый эталон и адаптер старых превью

**Files:** Create `tools/baseline/export.mjs`, `tools/baseline/render.mjs`, `tools/catalog/preview.mjs` (legacy-адаптер), `tests/migration-baseline.test.js`, `tests/fixtures/migration-baseline.json`, `tests/browser/migration.spec.js`, `playwright.config.mjs`; modify `package.json`, `package-lock.json`, `.gitignore`.

**Interfaces:** consumes Git ref `8bf5c4d`; produces `exportBaseline({root,ref,outDir})`, manifest `{sha,files:[{path,sha256}]}` и baseline DOM/CSS/screenshots в `.tmp/migration/`.

- [ ] В реализации выполнить `mise exec -- npm install --save-dev --save-exact esbuild @playwright/test parse5 react@18.3.1 react-dom@18.3.1 @axe-core/playwright`; версии записываются в lock и должны поддерживать Node 22. Playwright Chromium установить явно `mise exec -- npx playwright install chromium` до offline-проверок.
- [ ] Написать тест: экспортированная версия не содержит текущей временной правки токена; бинарный woff2 имеет исходный SHA; экспорт в каталог вне разрешённого `.tmp/migration` отвергается.

```js
const baseline = await exportBaseline({root, ref:'8bf5c4d', outDir});
assert.match(baseline.sha, /^[a-f0-9]{40}$/);
assert.deepEqual(readFileSync(join(baseline.root,'tokens.json')),
  execFileSync('git',['show','8bf5c4d:tokens.json'],{cwd:root}));
```

- [ ] RED: `mise exec -- node tests/migration-baseline.test.js` → отсутствует exporter.
- [ ] Реализовать экспорт через `git ls-tree -rz --name-only <ref>` и `git show <ref>:<path>` с `execFileSync`, без shell и без checkout/reset. Сохранять bytes, проверять выходные пути через `resolve/relative`; исключить `.git`, не удалять пользовательские файлы. Исходный build запускается на экспортированной копии с доступом к установленным build-зависимостям; старые CSS/JS берутся только из этой копии.
- [ ] Адаптер `renderPreview` в `tools/catalog/preview.mjs` сначала поддерживает mode legacy: parse5 читает HTML, внедряет локальные шрифты, исходные CSS, исходные React/ReactDOM и исходный bundle перед скриптами примера. JSX из `text/babel` преобразует esbuild.transform с classic React JSX. DOM содержимое примера и его inline-стили не переписываются. Неподдержанный script type — явная ошибка с путём. Этот же HTML pipeline расширяется в задаче 5; самостоятельный второй парсер не создавать.
- [ ] Зафиксировать manifest карточек из `components/*/preview.html` (68) плюс `overview.html`. Для типов viewport использовать метаданные; default 1180×900, высота из `height` при отсутствии `viewport`. Запретить сетевые URL в browser route; local data/blob разрешить. Assets с query/hash разрешаются по pathname.
- [ ] Сделать два рендера одной исходной версии и проверить отсутствие различий. Перед снимком — `document.fonts.ready`, фиксированное время, отключение анимации, одинаковый Chromium и viewport. Сохранять screenshot и вычисленные custom properties восьми комбинаций, включая существующую cascade fixture. При ошибках исходной карточки сначала исправить адаптер, не эталон компонента.
- [ ] GREEN: `mise exec -- node tests/migration-baseline.test.js`, `mise exec -- npx playwright test tests/browser/migration.spec.js --grep baseline`; исходный manifest обязан быть привязан к SHA, а не к HEAD реализации.
- [ ] Коммит: `test: capture an independent design system migration baseline`.

### Task 3: Одна модель токенов и CSS без копий исходных значений

**Files:** Create `tokens/source.json`, `tools/tokens/model.mjs`, `tools/tokens/css.mjs`, `tools/tokens/public-json.mjs`, `styles/controls.css`, `styles/motion.css`, `styles/icons.css`, `tests/token-model.test.js`; modify `tools/build.js`, `tools/css.js`, `tools/check-parity.js`, `lint/lib/tokens.js`, `lint/scripts/build-allowlist.js`, `lint/scripts/build-scoped-tokens.js`, `lint/test/run.js`, `tests/build.test.js`, `tests/dist-cascade.test.js`, `tests/fixtures/cascade.html`, `.gitignore`.

**Interfaces:** consumes исходный JSON и baseline; produces `readTokenModel(source)`, `renderTokenCss(model)`, `serializePublicTokens(source)` и прежние `dist/styles.css`, `dist/tokens.css`, корневой `tokens.json`.

- [ ] Скопировать исходную JSON-модель в `tokens/source.json`. В source убрать только производные `type.families.ds-type-*`; `type.groups` + `ds-font-sans/mono` становятся каноническими данными типографики. Serializer восстанавливает прежние строки в публичном JSON. Палитры и плотности сохраняют текущие идентификаторы и значения, формат публичного JSON не переименовывается.
- [ ] Написать проверки для дубликата имени, отсутствующей ссылки `{ds-*}`, цикла A→B→A, density fallback и точного совпадения публичной сериализации с JSON baseline (сравнение объектов).

```js
const source = JSON.parse(readFileSync(join(root,'tokens/source.json'),'utf8'));
const model = readTokenModel(source);
assert.equal(model.density.cozy['--ds-control-h'], '36px');
assert.equal(model.density.compact['--ds-control-h'], '30px');
assert.deepEqual(JSON.parse(serializePublicTokens(source)), baselineTokens);
// Добавить fixtures с A→B→A, повторным ds-brand и ссылкой {ds-does-not-exist}.
```

- [ ] RED: `mise exec -- node tests/token-model.test.js`.
- [ ] Реализовать обход семейств `*.tokens`, `type.families`, `type.groups`; строка `{name}` преобразуется в `var(--name)`, ссылки проверяются DFS до генерации. Для объектов value fallback: точный theme ID → DEFAULT того же appearance → `light`; `ds-density-compact` относится только к плотности. Построить граф зависимостей алиасов. Ошибка включает путь source и имя токена.

```js
const themeIds = {
  'DEFAULT.light':'light', 'DEFAULT.dark':'ds-appearance-dark-ds-default',
  'RED2.light':'ds-appearance-light-ds-red2', 'RED2.dark':'ds-appearance-dark-ds-red2',
};
const cssValue = value => value.replace(/\{([\w-]+)\}/g, (_,name) => `var(--${name})`);
```

- [ ] Генерировать root defaults, appearance-переключатели, значения обеих светлостей каждой темы и переопределения плотности. Сохранить нынешний принцип `--ds-_if-*` / `--ds-_...--light|dark`, но выводить его из модели. Зависимые алиасы переобъявлять на каждой границе scope. Не заменять его перечислением селекторов только для одного уровня вложенности.
- [ ] Перенести нетокенные правила из bundle в `styles/controls.css`, `motion.css`, `icons.css` без изменения специфичности и порядка. Из typography генерировать прежние utility-классы и `--font-*`/`--text-*`, реально присутствующие в dist; не удалять их лишь потому, что основной API использует `--ds-*`. У шрифтов и URL остаётся единственный emitter. `prefers-reduced-motion` — правило, а не второй редактируемый набор длительностей.
- [ ] Обновить `buildDist({root})` на новую модель; генерировать allowlist и публичный JSON до линтера. Старые `build:scoped-tokens`/`check:parity` сохранить как wrappers над новой проверкой до обновления документации. Старые `tokens.css`, `tokens/scoped.css`, `components/bundle.css` выводить только как совместимые preview-артефакты, не читать при сборке. Удалить их, корневой `tokens.json` и `lint/tokens.allowed.json` из индекса и добавить в ignore после переключения тестов. `prepack` по-прежнему создаёт все файлы из `package.json.files`.
- [ ] Заменить тесты числа ручных копий на семантические проверки, не удалить контраст/вложенность. Сравнить baseline computed values во всех восьми сочетаниях и цепочках light→dark→light, DEFAULT→RED2→DEFAULT, compact под темой, только compact на корне. Проверить локальное переопределение `--ds-brand` и зависимых алиасов на тех же узлах, что поддерживает исходная система.
- [ ] GREEN: `mise exec -- node tests/token-model.test.js`, `mise exec -- npm run build`, `mise exec -- npm run test:lint`, `mise exec -- node tests/build.test.js`, `mise exec -- node tests/dist-cascade.test.js`; mutation одного бренда должна давать настоящий diff с baseline.
- [ ] Коммит: `refactor: generate tokens and scoped styles from one source`.

### Task 4: Свежий JS-бандл и единый React runtime

**Files:** Create `tools/build-components.mjs`, `catalog/runtime.jsx`, `tests/helpers/runtime.js`, `tests/component-build.test.js`; modify `tools/build.js`, `tests/DsFilterMenu.test.js`, `tests/a11y-tokens.test.js`, `tests/rows-buttons.test.js`, `tests/nav-dialog-i18n.test.js`, `.gitignore`; untrack `components/bundle.js` после замены.

**Interfaces:** consumes `components/src/index.js`; produces `{runtime,components}` filenames, `loadRuntime(): {window,React,ReactDOM,NS}` для существующих jsdom-тестов.

- [ ] Написать тест, который в временной копии меняет текст минимального fixture-компонента, строит bundle и видит новую строку. Отдельно проверять экспорт DsStringsProvider, отсутствие `NS.__errors`, что импорт React у компонента равен `window.React`.

```js
const paths = await buildComponents({root, outDir});
const dom = new JSDOM('<div id="root"></div>', {runScripts:'outside-only'});
dom.window.eval(readFileSync(paths.runtime,'utf8'));
dom.window.eval(readFileSync(paths.components,'utf8'));
assert.equal(typeof dom.window.AuroraWebDesignSystem_96e210.DsButton, 'function');
```

- [ ] RED: `mise exec -- node tests/component-build.test.js`.
- [ ] Runtime объединяет npm React и ReactDOM/client + flushSync в один глобальный объект. Бандл компонентов собирается esbuild `bundle:true`, `format:'iife'`, `globalName:'AuroraWebDesignSystem_96e210'`, jsx classic. Plugin для `react` отдаёт `module.exports = window.React`, а не вторую копию. Не оборачивать каждый компонент catch-блоком с продолжением сборки.

```jsx
import React from 'react';
import * as Client from 'react-dom/client';
import {flushSync, createPortal} from 'react-dom';
window.React = React;
window.ReactDOM = {...Client, flushSync, createPortal};
```

- [ ] Новый helper загружает runtime и components из `.tmp/runtime/`; все четыре UI-набора используют helper. `pretest` гарантирует сборку JS. Список экспортов сравнить с исходным entry и baseline namespace; новые служебные exports не считаются удалением старых. Существующий script-compatible `echartsTheme.js` подключать явно там, где нужен.
- [ ] GREEN: `mise exec -- node tests/component-build.test.js`, `mise exec -- npm run test:ui`; прогон после временного отсутствия старого bundle обязан проходить. Снимки baseline/current сравнить на кнопке, меню, таблице и объектной строке до полного набора.
- [ ] Коммит: `build: derive catalogue runtime and UI tests from component sources`.

### Task 5: Самостоятельные страницы и dev-сервер

**Files:** Create `tools/catalog/index.mjs`, `tools/catalog/assets.mjs`, `tools/catalog/build.mjs`, `tools/dev.mjs`, `catalog/index.html`, `catalog/app.js`, `catalog/styles.css`, `tests/catalog-build.test.js`, `tests/dev-server.test.js`, `tests/browser/catalogue.spec.js`; modify `tools/catalog/preview.mjs`, `tools/build.js`, `lint/scripts/check-delivery.js`, `lint/test/run.js`, `package.json`, `.gitignore`.

**Interfaces:** produces `readCards(root):Card[]`, `renderPreview({root,card,mode,scope})`, `buildCatalogue({root,outDir})`, `startDev({root,port}):Promise<{url,close}>`.

- [ ] Написать tests обнаружения 68 карточек + overview, duplicate ID, метаданных height/viewport, пустого README, отсутствующего asset и пути с `?v=1#part`. Test fixture не редактирует настоящий source.

```js
const cards = readCards(root);
assert.equal(cards.filter(c => c.previewPath.endsWith('/preview.html')).length, 68);
assert.ok(cards.some(c => c.id === 'overview'));
const html = await renderPreview({root, card:cards.find(c=>c.id==='DsButton'),
  mode:'current', scope:{theme:'RED2',appearance:'dark',density:'compact'}});
assert.ok(!html.includes('unpkg.com'));
```

- [ ] RED: `mise exec -- node tests/catalog-build.test.js`.
- [ ] Реализовать HTML parser/injector, подключающий свежие runtime/CSS до пользовательских скриптов. Сохранить source-path layout в `site/components/<id>/preview.html`; stylesheet и runtime через относительные URL. Копировать только достижимые локальные ресурсы. Разрешить data/blob и относительные файлы; внешний runtime URL — ошибка. Изображения больше не обязаны быть data URI: `check-delivery` проверяет реальный asset graph вместо ограничений артефакта.
- [ ] Создать `site/cards.json`, базовую навигацию и iframe страницы; каждый iframe использует свою область scoping. На этапе 1 достаточно полного списка и чтения примеров; семейства, поиск и props добавляет план 3. `scopeMode:'local'` задаётся метаданными карточки для демонстрации собственных тем. Внешний root получает переключаемые атрибуты, вложенные атрибуты не переписываются.
- [ ] Dev-сервер использует Node http, bind `127.0.0.1`, безопасное разрешение pathname под `site/`, SSE для reload/error. Watch исходников исключает `.git`, `node_modules`, `dist`, `site`, `.tmp` и производные JSON/CSS. Сборки сериализуются и debounce; изменение source во время сборки ставит один следующий rebuild. На ошибке SSE показывает текст ошибки; recovery убирает его. Сначала строится staged output, потом переключается обслуживаемая версия.

```js
const dev = await startDev({root:fixtureRoot, port:0});
assert.equal((await fetch(dev.url)).status, 200);
// Записать невалидный fixture token: дождаться SSE event:error с именем токена.
// Вернуть валидный: дождаться event:reload, затем новый текст в HTML.
await dev.close();
```

- [ ] Подключить `npm run dev` → `node tools/dev.mjs`; `build:catalog` → builder CLI. Задокументировать команды в README, новые правила редактирования в AGENTS; это рабочая инструкция до полной чистки документации.
- [ ] GREEN: `mise exec -- node tests/catalog-build.test.js`, `mise exec -- node tests/dev-server.test.js`, `mise exec -- npx playwright test tests/browser/catalogue.spec.js`; пройти все карточки, собрать console/pageerror/404, запретить внешние запросы. Пустой root для React-карточки — ошибка.
- [ ] Коммит: `feat: add a standalone local design system catalogue`.

### Task 6: Полная проверка поставки и граница первого этапа

**Files:** Create `tools/verify.mjs`, `tests/clean-build.test.js`, `tests/deterministic-build.test.js`; modify `tools/build.js`, `tools/check-pack.js`, `tests/package.test.js`, `package.json`, `.github/workflows/ci.yml`, `CHANGELOG.md`, `PUBLISHING.md`.

**Interfaces:** `build` = sources→tokens/runtime/package/catalogue; `verify` вызывает последовательные проверки один раз; tarball сохраняет старые exports, не включает сайт.

- [ ] Добавить проверки: отсутствующие сохранённые bundles не мешают чистой сборке; два build дают одинаковые bytes; `site/`, `catalog/`, fixtures и Playwright не входят в tarball. Проверять `files` tarball, не только `package.json`.

```js
const packed = JSON.parse(execFileSync(npm,['pack','--json','--ignore-scripts'],opts))[0];
assert.equal(packed.files.some(f=>/^(site|catalog|tests)\//.test(f.path)), false);
for (const path of ['dist/styles.css','dist/tokens.css','tokens.json'])
  assert.ok(packed.files.some(f=>f.path===path));
```

- [ ] RED: `mise exec -- node tests/clean-build.test.js`, `mise exec -- node tests/deterministic-build.test.js` перед объединением pipeline.
- [ ] `tools/verify.mjs` запускает без рекурсивных npm lifecycle: build → lint → UI → token/cascade/build → catalogue/dev tests → browser migration → pack. Child process status, signal и stderr выводятся с названием стадии; ненулевой статус останавливает pipeline. Исполнение npm на Windows через существующий безопасный runner, пути не интерполируются в shell.
- [ ] Полный browser migration сравнивает все 69 страниц × 4 режима и computed tokens × 8 режимов с экспортированной версией. Проверить sensitivity: намеренная порча выбранного токена в изолированной fixture создаёт diff; текущие source не портятся. Снимки и отчёт — `.tmp/migration`, CI загружает их при неуспехе.
- [ ] CI устанавливает Chromium в подготовительном шаге, затем `npm run verify`; публикацию/tags оставляет только существующему master-job. Baseline ref доступен при checkout (`fetch-depth:0` уже есть). Не вызывать публикацию из тестов. Зависимости для Angular появятся только на этапе 2.
- [ ] GREEN: `mise exec -- npm run verify`; повторить сборку в пути с пробелами на Windows, итоговый status 0. Проверить git diff и состав npm pack, локальные URL всех шрифтов и старый Angular source path.
- [ ] Коммит: `test: verify standalone builds and preserve package compatibility`.

## Проверка покрытия и передача

Задачи 1–6 покрывают первый этап спецификации; расширение интерфейса каталога
отложено в план 3, новые Angular exports — в план 2. Удаление старых исходных
бандлов допустимо только после зелёного воспроизводимого build. Результат этапа
не требует публикации и не меняет version.

## Первичные технические источники

- [esbuild API](https://esbuild.github.io/api/): IIFE/globalName и transform используются для сборки примеров.
- [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots): снимки сравниваются в одинаковом окружении.
- [Codex hooks](https://learn.chatgpt.com/docs/hooks): `.codex/hooks.json`, matcher Bash, синхронный отказ exit 2, `commandWindows`, отдельное доверие hook.
