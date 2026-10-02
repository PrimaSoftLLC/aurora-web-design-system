# Catalogue, API and Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сделать каталог удобным рабочим справочником: поиск, семейства, проверенный API и сравнение режимов.

**Architecture:** Расширить самостоятельный каталог этапа 1 данными из Markdown, деклараций и исходников. Все страницы обнаруживаются автоматически; небольшая таблица семейств группирует известные карточки, но не определяет, существует ли карточка.

**Tech Stack:** Node 22, существующий каталог на HTML/CSS/JS, TypeScript Compiler API 5.6, markdown-it, Playwright и AXE.

**Spec:** [Спецификация](../specs/2026-10-02-repository-first-design.md), §§5, 7–8; [общий план](2026-10-02-repository-first.md). Нужны [сборка](2026-10-02-repository-first-01-build.md) и [Angular](2026-10-02-repository-first-02-angular.md).

## Global Constraints

- «Существующие React-компоненты, HTML-примеры и содержательная документация сохраняются».
- «Прямые ссылки на прежние карточки получают рабочую страницу либо перенаправление».
- «Редактор произвольных props и конструктор экранов не входят в первую версию».
- «Публичная схема `tokens.json` остаётся совместимой».
- «Публикация пакета, перенос приложений-потребителей и редизайн интерфейса не входят в реализацию».
- Все примеры, props, CSS-токены и экспорты остаются совместимыми; группировка не удаляет DsSelectBox, DsCheckButton или отдельные сценарии selection/bulk bar.
- DEFAULT/light/cozy, DEFAULT/dark/compact, RED2/light/cozy, RED2/dark/compact — четыре панели сравнения; переключатели по отдельности поддерживают все восемь сочетаний.
- Node 22 через mise; комментарии/документы русский, коммиты английский; никаких runtime CDN и новых backend-сервисов.
- Запуск проверок чтения/документации не должен публиковать артефакты во внешние сервисы.

## Review Focus

1. Экспорт компонента живёт в общем `.jsx`, его декларация — в соседней карточке другого имени: задача 1.
2. Значение default вычисляется выражением, декларация принимает ReactNode либо callback: задача 1.
3. Пользователь пришёл по старой ссылке, ищет по русскому названию либо псевдониму: задача 2.
4. Карточка сама показывает разные темы, а каталог переключает внешний scope: задача 2.
5. Редактирование ссылки/props делает сгенерированную документацию невалидной: задачи 1, 3.

## Карта файлов и интерфейсов

| Файлы | Роль |
|---|---|
| `tools/docs/{api,markdown,links,tokens}.mjs` | Извлечение API, Markdown, ссылки, справочник токенов |
| `tools/catalog/{index,build}.mjs` | Объединение данных в site, discovery карточек |
| `catalog/{app.js,styles.css,search.js,families.js}` | Навигация, поиск и сравнение |
| `components/*/*.d.ts`, `components/*/README.md`, metadata `preview.html` | Контракты и описания рядом с компонентами |
| `tests/docs-api.test.js`, `tests/docs-links.test.js`, `tests/catalog-search.test.js` | Проверка генерации и навигации |
| `tests/browser/{catalogue,catalogue-a11y}.spec.js` | Пользовательские сценарии, клавиатура, ошибки |

```ts
type PropDoc = {
  name:string; type:string; required:boolean; description:string;
  defaultValue: string|null; // null означает, что default отсутствует
};
type ComponentDoc = {name:string; sourcePath:string; declarationPath:string; props:PropDoc[]};
// extractApi({root}): ComponentDoc[] — задача 1
// renderMarkdown({root,path,knownRoutes}): {html:string,text:string,links:string[]} — 1
// renderTokenReference(model): {html:string, entries:{name:string,usage:string}[]} — 1
// searchCards(cards,query): Card[] — 2; Card из плана 1 + searchText:string.
// validateLinks({root,siteRoot}): {file:string,target:string,reason:string}[] — 3
```

### Task 1: Проверяемые таблицы props и справочник токенов

**Files:** Create `tools/docs/api.mjs`, `tools/docs/markdown.mjs`, `tools/docs/tokens.mjs`, `tests/docs-api.test.js`, `tests/fixtures/api/` с отдельными positive/negative `.jsx` и `.d.ts`; modify `tools/catalog/build.mjs`, `components/*/*.d.ts`, `package.json`, `package-lock.json`.

**Interfaces:** consumes TypeScript declarations, React implementation и `TokenModel` этапа 1; produces `ComponentDoc[]`, безопасный HTML Markdown и token reference в `site/`.

- [ ] Добавить `markdown-it`, `@types/react@18`, `@types/react-dom@18` как точные devDependencies. TypeScript уже установлен этапом 2. Парсить JSX/TS через Compiler API, не регулярным выражением для типов.
- [ ] Fixtures: обычный интерфейс с optional props, union, callback, ReactNode; две функции в одном `.jsx`; `DsCheckButton` с декларацией в папке DsCheck; отсутствующий props type; лишний документированный prop; default выражение `Math.max(1, DEFAULT_SIZE)`.

```js
const api = extractApi({root});
const button = api.find(c=>c.name==='DsButton');
assert.equal(button.props.find(p=>p.name==='tone').defaultValue, "'primary'");
assert.match(button.props.find(p=>p.name==='tone').type, /primary.*secondary/s);
assert.equal(api.find(c=>c.name==='DsCheckButton').declarationPath,
  'components/DsCheck/DsCheck.d.ts');
```

- [ ] RED: `mise exec -- node tests/docs-api.test.js` → отсутствует extractor.
- [ ] Обойти публичные re-exports `components/src/index.js`, найти объявления компонентных функций `Ds*`, сопоставить `.d.ts` по символу exported function, а не только по папке. TypeScript printer/type checker печатает имена типов и required-статус; JSDoc становится description. Имена helper-функций не превращаются в карточки.

```js
const program = ts.createProgram(declarationPaths, {
  target:ts.ScriptTarget.ES2022, moduleResolution:ts.ModuleResolutionKind.Bundler,
  module:ts.ModuleKind.ESNext, types:['react'], skipLibCheck:false,
});
const checker = program.getTypeChecker();
// checker.getPropertiesOfType(propsType), symbol.flags & ts.SymbolFlags.Optional,
// checker.typeToString(...) и ts.displayPartsToString(symbol.getDocumentationComment(checker)).
```

- [ ] Default извлекать только из initializer destructured prop. Строка/число/boolean/null/array/object literals отображаются как исходный код, без eval. Для вычисляемого выражения показать выражение и JSDoc `@default` с пояснением на декларации; несоответствие простой literal аннотации реализации валит генератор. При отсутствии initializer defaultValue=null, не придумывать значение.
- [ ] Проверить пропсы, реально перечисленные в сигнатуре реализации, против декларации. Пропсы из `...rest` документировать как forwarding native attributes только там, где реализация действительно передаёт их DOM; не объявлять поддержку по догадке. Отсутствующие декларации экспортированных компонентов добавить с реальными props. Не менять runtime, чтобы подогнать его под старую декларацию.
- [ ] Markdown renderer использует `html:false`, сохраняет code fences и язык; ссылки преобразует в известные маршруты без сети. Таблица props генерируется как HTML из structured data с escaping. `renderTokenReference` использует ту же модель, что CSS, и тексты usage из source; поддерживает темы/плотность, aliases и имя публичного токена.
- [ ] Генерировать `site/api/components/<name>.html` и `site/api/tokens.html`, добавлять их в карточку. Не использовать старые `api/` и `manifest.json` как вход. Если компонент без декларации или документированное имя не экспортируется — ошибка с путём и именем, а не пустая таблица «see README».
- [ ] GREEN: `mise exec -- node tests/docs-api.test.js`, `mise exec -- npm run build`; через browser проверить DsButton, DsCheckButton, DsChartLegend/Tooltip, DsTabPanel. Негативные fixtures должны падать по своим причинам, а не из-за React namespace.
- [ ] Коммит: `feat: generate component and token references from source contracts`.

### Task 2: Семейства, поиск, режимы сравнения и прямые ссылки

**Files:** Create `catalog/search.js`, `catalog/families.js`, `tests/catalog-search.test.js`; modify `catalog/app.js`, `catalog/styles.css`, `catalog/index.html`, `tools/catalog/index.mjs`, `tools/catalog/build.mjs`, metadata у `components/{DsCheck,DsCheckButton,DsSelectBox,DsCheckbox,DsChart,DsCharts,DsChartLegend,DsChartTooltip,DsHeader,DsAppHeader,DsHeaderChip,DsUserMenu}/preview.html`; extend `tests/browser/catalogue.spec.js`.

**Interfaces:** `searchCards(cards,query):Card[]`; `families` содержит только группировку известных ID, не полный registry. URL `/index.html?card=<id>&theme=...&appearance=...&density=...&compare=1` сохраняет состояние.

- [ ] Добавить тесты поиска по `DsSelectBox`, `выбор`, `checkbox`, смешанному регистру и пробелам; новая карточка fixture появляется без изменения families. Старый direct URL ведёт к тому же примеру. Невалидные scope query не добавляются в DOM, используются DEFAULT/light/cozy.

```js
assert.ok(searchCards(cards,' dsselectbox ').some(c=>c.id==='DsSelectBox'));
assert.ok(searchCards(cards,'ВЫБОР').some(c=>c.id==='DsCheckbox'));
assert.deepEqual(searchCards(cards,'неизвестно-12345'), []);
```

- [ ] RED: `mise exec -- node tests/catalog-search.test.js`.
- [ ] Для индекса объединить ID, title, subtitle, README plain text, prop names и aliases; нормализация NFKC → trim → lowercase, запрос разделить по whitespace, все слова должны встретиться. Отображать понятное пустое состояние, не пустую навигацию без объяснения. Изменение поиска не сбрасывает выбранные скоупы.
- [ ] Семейства: «Выбор» = DsCheck/DsCheckButton/DsSelectBox/DsCheckbox; «Графики» = DsCharts/DsChart/Legend/Tooltip/Sparkline/ScoreBar; «Шапка» = DsHeader/DsAppHeader/DsHeaderChip/DsUserMenu. Отдельные подстраницы/якоря сохраняются. DsBulkBar/DsSelectionBar остаются отдельными сценариями; Monitoring/Admin/AppShell — раздел экранов.

```js
export const families = [
  {id:'selection', title:'Выбор', cards:['DsCheck','DsCheckButton','DsSelectBox','DsCheckbox']},
  {id:'charts', title:'Графики', cards:['DsCharts','DsChart','DsChartLegend','DsChartTooltip','DsSparkline','DsScoreBar']},
  {id:'header', title:'Шапка', cards:['DsHeader','DsAppHeader','DsHeaderChip','DsUserMenu']},
];
```

- [ ] Добавить три native select с label и кнопку compare. Обычный режим отображает один iframe с выбранными атрибутами. Compare показывает четыре iframe фиксированной матрицы, каждый с подписью и своим viewport; панель не меняет ширину самого примера из-за доступной ширины каталога. При узком окне панели располагаются последовательно, горизонтальный скролл остаётся у примера.
- [ ] Скоупы передавать URL/query при загрузке iframe или явным same-origin сообщением; runtime меняет только внешний контейнер. Вложенные `data-ds-*` и карточки `scopeMode:local` не переписываются. Browser-тест фиксирует одновременно внешнюю dark и внутреннюю light.
- [ ] Сохранить `site/components/<id>/preview.html` и `site/overview.html` из первого этапа. README-ссылки на объединённые карточки ведут на конкретный ID, а не только на семейство. Неизвестный ID показывает ошибку с возвратом к каталогу; не открывает произвольный файл из URL.
- [ ] GREEN: `mise exec -- node tests/catalog-search.test.js`, `mise exec -- npx playwright test tests/browser/catalogue.spec.js`; проверить URL reload/back, keyboard tab order, 4 iframe и исходные локальные скоупы. Снимки самих примеров сравнить с baseline этапа 1.
- [ ] Коммит: `feat: group catalogue cards and add search and scope comparison`.

### Task 3: Один маршрут документации и удаление старой синхронизации

**Files:** Create `tools/docs/links.mjs`, `tests/docs-links.test.js`; modify `README.md`, `getting-started.md`, `ANGULAR.md`, `ADOPTION.md`, `CONTRIBUTING.md`, `PUBLISHING.md`, `LINT.md`, `lint/README.md`, `templates/angular/README.md`, `assets/fonts/README.md`, `tokens/webfonts-selfhost.css`, `AGENTS.md`, `CHANGELOG.md`, `overview.html`; remove действующий `SYNC.md`, artifact `manifest.json` и старые generated `api/` после проверки отсутствия consumers.

**Interfaces:** `validateLinks({root,siteRoot}):Problem[]`; parser проверяет локальные ссылки/anchors, а внешние URL только синтаксически — build не зависит от доступности сети.

- [ ] Зафиксировать матрицу владельцев текста: README — назначение и команды; getting-started — единственное пошаговое подключение; ANGULAR — особенности; CONTRIBUTING/AGENTS — разработка; PUBLISHING — релиз; карточки — использование/решения. Не удалять обоснования дизайн-решений вместе с дублирующими шагами.
- [ ] Тестировать Markdown relative links, URL-encoded имена, hash anchors и ссылку на страницу, переехавшую в семейство. Исторические `docs/plans/`, `docs/superpowers/`, `assets/notes/`, CHANGELOG разрешают старые названия, но не являются справочником актуального подключения.

```js
const problems = validateLinks({root, siteRoot:join(root,'site')});
assert.deepEqual(problems, []);
// В отдельной fixture удалить linked файл: один Problem с source+target.
// Вторая fixture: существующий файл, отсутствующий #anchor → отдельная причина.
```

- [ ] RED: `mise exec -- node tests/docs-links.test.js` с нынешними ссылками на отсутствующие focus.css/field.css.
- [ ] Заменить ссылки на отсутствующие файлы описанием реального общего CSS в `dist/styles.css`; убрать требование вручную класть уже поставляемые шрифты. Свести повторяющиеся Angular-инструкции к ссылкам на getting-started. README описывает `dev/build/verify`, исходники и offline-предпосылки.
- [ ] Убрать ручное число карточек из `overview.html`: подставлять текущее число из `readCards`. Вынести устаревшие статусы пилота из действующей инструкции; подтверждённый первый потребитель aur-billing из AGENTS можно назвать, но не объявлять пилот завершённым без данных.
- [ ] Сохранить полезные заметки из SYNC в истории Git и актуальных документах, затем удалить SYNC и Claude-only manifest/API при нулевых актуальных ссылках. Историческая leadership-дека остаётся в архивном разделе, не обещать её работоспособность и не переписывать презентацию в рамках этого плана.
- [ ] `.claude` удаляется только после выполненной задачи 1.1 по переносу/проверке guards. `CLAUDE.md` можно удалить после переноса всех правил в AGENTS; его наличие как короткой ссылки не является runtime-зависимостью и не оправдывает ослабление защит.
- [ ] Зарегистрировать проверку ссылок и документации в `verify`; source CSS/JS к этому моменту не должен ссылаться на `manifest.json`, blob-ID, x-import или удалённую копию bundle. Собранный сайт также проверяется на 404 при открытии каждой карточки.
- [ ] GREEN: `mise exec -- node tests/docs-links.test.js`, `mise exec -- npm run build`, browser crawl. Ручное ревью одного полного пути нового пользователя: README → установка → пример Angular → карточка кнопки → токен.
- [ ] Коммит: `docs: consolidate setup and remove artifact synchronization workflow`.

### Task 4: Доступность каталога и итоговая приёмка

**Files:** Create `tests/browser/catalogue-a11y.spec.js`, `tests/browser/final-acceptance.spec.js`; modify `tools/verify.mjs`, `.github/workflows/ci.yml`, `CHANGELOG.md`; при обнаружении нарушений изменять только соответствующие файлы каталога.

**Interfaces:** `npm run verify` покрывает все обязательные задачи трёх этапов; stdout даёт итог по группам без скрытых skips.

- [ ] Добавить AXE для оболочки каталога и репрезентативных интерактивных карточек Button, Tabs, Menu, Dialog, Checkbox, Table. Для остальных страниц выполнить crawl на script errors/404; нарушения доступности исходных примеров классифицировать отдельно, не глушить правила глобально.

```js
import AxeBuilder from '@axe-core/playwright';
const result = await new AxeBuilder({page}).analyze();
expect(result.violations).toEqual([]);
await page.getByRole('searchbox').focus();
await page.keyboard.type('DsButton');
await page.keyboard.press('Tab');
// Проверить видимый focus и достижимость ссылки/переключателей с клавиатуры.
```

- [ ] Проверить отсутствие сетевой зависимости браузером: route разрешает только локальный host/data/blob, остальные запросы записываются и отменяются. Открыть каталог, API, все 69 примеров и compare; список внешних запросов должен быть пуст. Обнаруженная недоступность локального шрифта — провал, не допустимый fallback.
- [ ] Проверить полный поток правки на fixture checkout: сменить один токен → обновились CSS/справочник; добавить карточку → она найдена; нарушить тип/default → build даёт конкретную ошибку; исправить → dev снимает сообщение и обновляет страницу. Настоящие source пользователя не менять для этих проверок.
- [ ] Пройти финальные команды последовательно:

```powershell
mise exec -- npm run verify
git diff --check
git status --short
```

- [ ] В конце проверить tarball и итоговую diff-матрицу: все прежние exports, CSS paths, source aliases, переменные, namespace-адаптеры примеров сохранены; ECharts не обязателен базовому Angular; сайт не публикуется в npm; git содержит исходники и lock, а не свежие baseline-картинки или site.
- [ ] Завершить ручной keyboard-проход и независимое ревью ветки выбранным способом исполнения. Отдельно перечислить реальные ограничения, если они выявлены; не отмечать этап завершённым при красном обязательном gate.
- [ ] Коммит: `test: enforce catalogue accessibility and end-to-end acceptance`.

## Завершение

Составить отчёт по трём этапам: что упрощено, какие старые входы сохранены,
какие проверки выполнены и есть ли ограничения. Не делать publish, version bump,
release tag или push в master. Предложить `/aurora-impl-report` в последней строке
финального отчёта реализации, как требуют глобальные инструкции проекта.
