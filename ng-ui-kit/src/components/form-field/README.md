# DsFormFieldComponent и DsInputDirective

Одна связка и одна страница /components/form-field в группе «Поля и выбор».
Оболочка размещает label, рамку и области проекции. Нативный input/textarea
владеет значением, фокусом, событиями и связью с Angular Forms.

```html
<ds-form-field label="Максимальная скорость">
  <span dsPrefix>до</span>
  <input dsInput type="number" min="0" required [formControl]="speed"
    aria-describedby="speed-unit">
  <span dsSuffix id="speed-unit">км/ч</span>
  <div dsHint>Подсказка и счётчик, размещённые приложением</div>
  @if (showError()) {
    <span dsError>Проверьте значение</span>
  }
</ds-form-field>
```

Все сущности импортируются из @primasoftllc/design-system/angular: DsFormFieldComponent,
DsInputDirective, DsPrefixDirective, DsSuffixDirective, DsHintDirective, DsErrorDirective.
Общие styles.css подключаются один раз: в них находятся токены и правила рамки/фокуса.

## Обязанности и API

| Сущность | Параметры | Обязанность |
| --- | --- | --- |
| ds-form-field | label?: string | Подпись над полем, связанная с ID контрола. |
| ds-form-field | collapseEmptyLabel = false | Схлопывание только пустой области подписи. |
| ds-form-field | collapseEmptyMessages = false | Схлопывание только пустой области сообщений. |
| input[dsInput], textarea[dsInput] | id?: string | Нативный ID; при отсутствии генерируется. |
| dsInput | mono = false | Моноширинное значение через ds-type-mono. |
| dsInput | maxRows = 0 | Предел высоты textarea в строках; 0 — без ограничения. |
| dsPrefix, dsSuffix | Проекция без параметров | Содержимое до и после контрола. |
| dsHint, dsError | Проекция без параметров | Содержимое нижней области. |

Булевы параметры используют booleanAttribute. Label и обе нижние области
резервируют по одной строке по умолчанию; длинное содержимое увеличивает высоту,
а не обрезается. Collapse-параметры не скрывают существующее содержимое.
Один form-field содержит один dsInput. Служебные поля/методы с @internal
предназначены для связи оболочки и директивы, не для API приложения.

Значение, type, disabled, readOnly, required, name, autocomplete, maxlength,
min/max/step и прочие нативные параметры задаются непосредственно на контроле.
Собственных value/valueChange и CVA нет. Работают обычные value/input,
ngModel и стандартные Angular Forms accessors, включая number/null для type=number.
Checkbox, radio, file и select не являются назначением dsInput. Плавающий label,
автоматический resize textarea и собственный счётчик пока не входят в API.
Textarea сохраняет rows и нативный вертикальный resize; счётчик размещает приложение.
maxRows ограничивает ручную высоту по текущему межстрочному интервалу (например,
`<textarea dsInput rows="3" maxRows="8">`). При превышении появляется внутренняя
прокрутка; число символов и значение не ограничиваются. Для обычного input параметр
не применяется. Высоту изначально задаёт rows, поэтому maxRows выбирают не меньше rows.

## Состояния и доступность

- Disabled читается с нативного контрола, в том числе из Angular Forms и fieldset.
  Оболочка меняет фон/текст/курсор; hover рамки отключён. Дублировать disabled
  на form-field не нужно.
- Readonly сохраняет фокус, выделение и копирование, меняет фон и отключает hover.
- Required задаётся нативным атрибутом/привязкой либо Validators.required.
  Оболочка показывает декоративную звёздочку; директива задаёт aria-required.
- Момент показа ошибки принадлежит приложению. Присутствие dsError заменяет весь
  dsHint (включая счётчик), включает красную рамку и aria-invalid. Тронутость,
  invalid и отправка формы сами по себе не заставляют оболочку показывать ошибку.
- Фокус рисуется вокруг всей рамки, при ошибке её граница остаётся красной.
- Label связан с input через for/id. Показанное сообщение связано через
  aria-describedby; внешние ID сохраняются. При удалении ошибки внешний
  aria-invalid восстанавливается. Пустая резервная строка не создаёт ARIA-описания.
- Если видимого label нет, приложение задаёт aria-label или aria-labelledby.
  Дополнительные описания единиц в prefix/suffix можно связать собственным ID,
  как в примере скорости. Весь dsHint, включая счётчик, описывает контрол;
  автоматического live region нет, чтобы не озвучивать каждый ввод.
- Проекции могут содержать кнопки. Их disabled и поведение принадлежат приложению;
  оболочка не отключает произвольные дочерние компоненты. В readonly действия
  вроде показа пароля могут оставаться доступными.

Стили проекции используют ViewEncapsulation.None с селекторами, ограниченными
[data-ds-form-field]. Они не оформляют произвольные input вне этой оболочки.
Для синхронизации нативных свойств и Forms используются стандартный ngDoCheck и локальный MutationObserver; подписки и наблюдатель освобождаются при уничтожении.
SSR/hydration и zoneless пока не заявлены, как и для текущей библиотеки.

## Примеры и проверки

На одной странице семь сценариев: нативный ввод, prefix/suffix и типы,
Reactive Forms/ошибка, readonly/disabled, textarea/счётчик, резервирование, ngModel.
В примере ngModel родитель показывает dsError при `company.touched &&
company.hasError('required')`, где `#company="ngModel"` — ссылка на директиву.
Required сам по себе не задаёт момент появления сообщения или красной рамки.
Связка также применяется в поиске сайта и восстановленных самостоятельных примерах
статей. Сценарии с недостающими компонентами остаются заглушками.
Unit-тесты находятся рядом в form-field.component.spec.ts и запускаются обычной
командой test:angular с --include. Общий пример consumers/shared/form-field-demo.*
также проверяет установленный tarball в Angular 19.2.25 и 20.3.34 через существующий
check:angular: production AOT, Forms, нативный ввод, проекцию, доступные связи и стили.
Актуальные результаты — в
[статусе](../../../../docs/plans/angular-ui-kit-status.md).
