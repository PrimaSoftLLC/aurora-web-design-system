# Меню пользователя

`DsUserMenu` объединяет кнопку пользователя и выпадающее меню на основе `DsMenu`.
Кнопка с именем и стрелкой всегда открывает меню; отдельно статичная плашка не используется.

**Потребитель задаёт** `name`, при необходимости `email`, `avatarSrc`, `items`, `onSelect`.

- Кнопка — часть `DsUserMenu`: имя, необязательный аватар и стрелка раскрытия.
- Высота — `ds-control-h-sm`, цвета — `ds-header-chip-*`; оформление следует теме и плотности.
- Размещайте меню в `actions` или слоте `actions` компонента `DsAppHeader`.
- Enter / Space и стрелки открывают меню; стрелки перемещают фокус по пунктам,
  Escape закрывает меню и возвращает фокус на кнопку.

```jsx
<DsAppHeader
  product="Aurora"
  actions={<DsUserMenu name="a.ivanov" items={userItems} onSelect={handleUserAction} />}
/>
```
