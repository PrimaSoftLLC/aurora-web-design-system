/* Запуск: node tests/nav-dialog-i18n.test.js [путь к bundle.js]
   Нужен jsdom (npm i -D jsdom). №7 — вкладки и меню, Escape по слоям, №9 — имя
   диалога, строки интерфейса (DsStringsProvider). Проверяется собранный бандл. */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { JSDOM } = require('jsdom');
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dom = new JSDOM('<!doctype html><body></body>', { runScripts: 'outside-only', pretendToBeVisual: true });
const w = dom.window, d = w.document;
for (const f of ['components/lib/react.production.min.js', 'components/lib/react-dom.production.min.js'])
  w.eval(fs.readFileSync(path.join(ROOT, f), 'utf8'));
w.eval(fs.readFileSync(process.argv[2] || path.join(ROOT, 'components/bundle.js'), 'utf8'));
const NS = w[Object.keys(w).find((k) => k.startsWith('AuroraWebDesignSystem_'))];
const { React, ReactDOM } = w; const h = React.createElement;
let fails = 0;
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fails++; };
const act = (fn) => ReactDOM.flushSync(fn);
const mount = (el) => { const box = d.createElement('div'); d.body.appendChild(box); const root = ReactDOM.createRoot(box);
  act(() => root.render(el)); return { box, root, rerender: (x) => act(() => root.render(x)), unmount: () => act(() => root.unmount()) }; };
const key = (el, k, extra = {}) => { const e = new w.KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...extra }); act(() => el.dispatchEvent(e)); return e; };
const click = (el) => act(() => el.click());

// ---------------- №7 вкладки внутри страницы
{
  const items = [{ id: 'a', label: 'Датчики' }, { id: 'b', label: 'Треки' }, { id: 'c', label: 'Отчёты' }];
  let active = 'a'; const seen = [];
  const App = () => { const [v, setV] = React.useState('a'); active = v;
    return h(React.Fragment, null, h(NS.DsTabs, { items, active: v, onChange: (x) => { seen.push(x); setV(x); }, idBase: 't1', 'aria-label': 'Карточка объекта' }),
      ...items.map((it) => h(NS.DsTabPanel, { key: it.id, idBase: 't1', id: it.id, active: v === it.id }, 'панель ' + it.label))); };
  const { box } = mount(h(App));
  const tabs = () => [...box.querySelectorAll('[role="tab"]')];
  ok(box.querySelector('[role="tablist"]') && tabs().length === 3, 'DsTabs underline: tablist из трёх вкладок');
  ok(tabs().map((t) => t.tabIndex).join() === '0,-1,-1', 'DsTabs: один вход через Tab (roving tabindex)');
  tabs()[0].focus(); key(tabs()[0], 'ArrowRight');
  ok(active === 'b' && d.activeElement === tabs()[1] && tabs()[1].tabIndex === 0, 'DsTabs: → переводит фокус и выбирает следующую');
  key(tabs()[1], 'End'); ok(active === 'c' && d.activeElement === tabs()[2], 'DsTabs: End — последняя');
  key(tabs()[2], 'ArrowRight'); ok(active === 'a', 'DsTabs: → с последней — по кругу на первую');
  key(tabs()[0], 'ArrowLeft'); ok(active === 'c', 'DsTabs: ← с первой — на последнюю');
  key(tabs()[2], 'Home'); ok(active === 'a', 'DsTabs: Home — первая');
  const t = tabs()[0], panel = d.getElementById(t.getAttribute('aria-controls'));
  ok(panel && panel.getAttribute('role') === 'tabpanel' && panel.getAttribute('aria-labelledby') === t.id && !panel.hidden,
    'DsTabs + DsTabPanel: вкладка связана с панелью в обе стороны');
  ok(d.getElementById('t1-panel-b').hidden, 'DsTabPanel: панель невыбранной вкладки скрыта');
  const noBase = mount(h(NS.DsTabs, { items, active: 'a', onChange: () => {} })).box;
  ok(!noBase.querySelector('[aria-controls]'), 'DsTabs без idBase не ссылается на несуществующие панели');
}
// ---------------- №7 навигация в шапке
{
  const { box } = mount(h(NS.DsAppHeader, { product: 'Aurora' },
    h(NS.DsTabs, { tone: 'onHeader', active: 'mon', onChange: () => {}, items: [{ id: 'mon', label: 'Мониторинг', icon: 'map' }, { id: 'rep', label: 'Отчёты', icon: 'assessment' }] })));
  ok(!box.querySelector('[role="tab"],[role="tablist"]'), 'шапка: разделы — навигация, не вкладки');
  ok(box.querySelectorAll('nav').length === 1 && box.querySelector('nav nav') === null && box.querySelector('nav').getAttribute('aria-label') === 'Разделы',
    'шапка: один ориентир <nav> с именем, без вложенного nav');
  const btns = [...box.querySelectorAll('nav button')];
  ok(btns[0].getAttribute('aria-current') === 'page' && !btns[1].hasAttribute('aria-current'), 'шапка: активный раздел — aria-current="page"');
  const solo = mount(h(NS.DsTabs, { tone: 'onHeader', active: 'x', items: [{ id: 'x', label: 'X' }] })).box;
  ok(solo.querySelector('nav[aria-label="Разделы"]'), 'DsTabs onHeader вне шапки ставит свой <nav>');
}
// ---------------- №7 меню: фокус и клавиатура
const items = [{ id: 'a', label: 'Профиль' }, { id: 'b', label: 'Настройки' }, { id: 'c', label: 'Выйти' }];
{
  const picked = [];
  const { box } = mount(h(NS.DsMenu, { trigger: h(NS.DsButton, null, 'Меню'), items, onSelect: (it) => picked.push(it.id) }));
  const trig = box.querySelector('button[aria-haspopup="menu"]');
  trig.focus(); click(trig);
  const mi = () => [...box.querySelectorAll('[role="menuitem"]')];
  ok(trig.getAttribute('aria-expanded') === 'true' && d.activeElement === mi()[0], 'меню: открытие переводит фокус на первый пункт');
  ok(trig.getAttribute('aria-controls') === box.querySelector('[role="menu"]').id, 'меню: триггер ссылается на меню (aria-controls)');
  key(mi()[0], 'ArrowDown'); ok(d.activeElement === mi()[1], 'меню: ↓ — следующий пункт');
  key(mi()[1], 'ArrowUp'); key(mi()[0], 'ArrowUp'); ok(d.activeElement === mi()[2], 'меню: ↑ с первого — на последний');
  key(mi()[2], 'Home'); ok(d.activeElement === mi()[0], 'меню: Home — первый');
  key(mi()[0], 'Escape'); ok(!box.querySelector('[role="menu"]') && d.activeElement === trig, 'меню: Escape закрывает и возвращает фокус на триггер');
  key(trig, 'ArrowUp'); ok(d.activeElement === mi()[2], 'меню: ↑ на триггере открывает с последним пунктом');
  click(mi()[1]); ok(picked[0] === 'b' && !box.querySelector('[role="menu"]') && d.activeElement === trig, 'меню: выбор пункта закрывает и возвращает фокус');
  key(trig, 'ArrowDown'); key(mi()[0], 'Tab'); ok(!box.querySelector('[role="menu"]'), 'меню: Tab закрывает меню');
}
// ---------------- Escape по слоям + №9
{
  let closed = 0;
  const app = (open = true) => h(NS.DsDialog, { open, title: 'Назначить водителя', description: 'Водитель получит уведомление.', onClose: () => closed++ },
    h(NS.DsMenu, { trigger: h(NS.DsButton, null, 'Водитель'), items }));
  const { box, unmount } = mount(app());
  const dlg = d.querySelector('[role="dialog"]');
  const title = d.getElementById(dlg.getAttribute('aria-labelledby'));
  ok(title && title.textContent === 'Назначить водителя' && !dlg.hasAttribute('aria-label'), '№9: строковый заголовок — имя через aria-labelledby');
  ok(d.getElementById(dlg.getAttribute('aria-describedby'))?.textContent === 'Водитель получит уведомление.', '№9: описание — aria-describedby');
  const trig = box.querySelector('button[aria-haspopup="menu"]'); click(trig);
  key(d.activeElement, 'Escape');
  ok(!box.querySelector('[role="menu"]') && closed === 0, 'Escape: закрыто только меню, диалог остался');
  key(trig, 'Escape'); ok(closed === 1, 'Escape: второй Escape закрывает диалог');
  unmount();
}
{
  const { unmount } = mount(h(NS.DsDialog, { title: h('span', null, 'Объект ', h('b', null, 'Volvo')), onClose: () => {} }, 'x'));
  const dlg = d.querySelector('[role="dialog"]');
  ok(d.getElementById(dlg.getAttribute('aria-labelledby'))?.textContent === 'Объект Volvo', '№9: JSX-заголовок тоже даёт непустое имя');
  unmount();
  const errs = []; const ce = w.console.error; w.console.error = (m) => errs.push(String(m));
  const a = mount(h(NS.DsDialog, { 'aria-label': 'Импорт', onClose: () => {} }, 'x'));
  ok(d.querySelector('[role="dialog"]').getAttribute('aria-label') === 'Импорт' && !errs.length, '№9: без заголовка — aria-label');
  a.unmount();
  const b = mount(h(NS.DsDialog, { onClose: () => {} }, 'x')); b.unmount();
  w.console.error = ce;
  ok(errs.some((e) => e.includes('aria-label')), '№9: без заголовка и aria-label — ошибка в консоли');
  let closed = 0; const c = mount(h(NS.DsDialog, { title: 'Отправка команды', dismissable: false, onClose: () => closed++ }, 'x'));
  key(d.querySelector('[role="dialog"]'), 'Escape'); ok(closed === 0, 'Escape: dismissable=false — диалог не закрывается');
  c.unmount();
  const fm = mount(h(NS.DsFilterMenu, { label: 'Скорость', type: 'number', value: 0 }));
  const fb = fm.box.querySelector('button'); fb.focus(); click(fb);
  ok(d.activeElement === fm.box.querySelector('input'), 'DsFilterMenu: открытие переводит фокус в поле');
  key(d.activeElement, 'Escape'); ok(!fm.box.querySelector('[role="dialog"]') && d.activeElement === fb, 'DsFilterMenu: Escape закрывает и возвращает фокус');
}
// ---------------- строки интерфейса
{
  const ru = mount(h(NS.DsToast, { action: () => {} }, 'x')).box;
  ok([...ru.querySelectorAll('button')].some((b) => b.textContent === 'Отменить'), 'строки: по умолчанию русские');
  const en = mount(h(NS.DsStringsProvider, { strings: NS.dsStringsEn },
    h(NS.DsToast, { action: () => {} }, 'x'), h(NS.DsTable, { columns: [{ key: 'n', label: 'N' }], rows: [] }),
    h(NS.DsObjectRow, { name: 'Volvo', state: 'alarm', unread: 1, onClick: () => {} }))).box;
  const row = en.querySelector('button[aria-describedby]');
  ok([...en.querySelectorAll('button')].some((b) => b.textContent === 'Undo'), 'строки: dsStringsEn — «Undo» в тосте');
  ok(en.textContent.includes('No data'), 'строки: dsStringsEn — «No data» в пустой таблице');
  ok(d.getElementById(row.getAttribute('aria-describedby')).textContent.startsWith('Alarm'), 'строки: dsStringsEn — состояние объекта «Alarm»');
  const part = mount(h(NS.DsStringsProvider, { strings: { undo: 'Вернуть', state: { alarm: 'Авария' } } },
    h(NS.DsToast, { action: () => {} }, 'x'), h(NS.DsStateIcon, { state: 'alarm' }), h(NS.DsStateIcon, { state: 'offline' }))).box;
  const labels = [...part.querySelectorAll('[role="img"]')].map((x) => x.getAttribute('aria-label'));
  ok([...part.querySelectorAll('button')].some((b) => b.textContent === 'Вернуть') && labels[0] === 'Авария' && labels[1] === 'Нет связи',
    'строки: частичный словарь накладывается на русский (вложенные ключи тоже)');
  const prop = mount(h(NS.DsStringsProvider, { strings: NS.dsStringsEn }, h(NS.DsToast, { action: () => {}, actionLabel: 'Отменить перенос' }, 'x'))).box;
  ok([...prop.querySelectorAll('button')].some((b) => b.textContent === 'Отменить перенос'), 'строки: явный проп побеждает словарь');
  ok(NS.dsStringsRu.objects(1) === '1 объект' && NS.dsStringsRu.objects(3) === '3 объекта' && NS.dsStringsRu.objects(11) === '11 объектов',
    'строки: русское склонение числительных');
  const keysRu = JSON.stringify(Object.keys(NS.dsStringsRu).sort()), keysEn = JSON.stringify(Object.keys(NS.dsStringsEn).sort());
  const nested = Object.keys(NS.dsStringsRu).filter((k) => typeof NS.dsStringsRu[k] === 'object')
    .every((k) => JSON.stringify(Object.keys(NS.dsStringsRu[k]).sort()) === JSON.stringify(Object.keys(NS.dsStringsEn[k]).sort()));
  ok(keysRu === keysEn && nested, 'строки: ru и en содержат одни и те же ключи');
}
if (fails) { console.error(`${fails} FAIL`); process.exit(1); }
console.log('все проверки прошли');
