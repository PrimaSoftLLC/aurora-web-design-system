Якорный поповер с пунктами — один объект для меню строки таблицы, выпадающего фильтра и меню пользователя.

**Потребитель задаёт** `trigger` и `items` (`{id, label, icon?, shortcut?, checked?, tone?, disabled?, onClick?}` или `{divider:true}`), при необходимости `onSelect`, `align`, `width`, `header`, `footer`, `open` с `onOpenChange`.

- Панель не шире 240px и не выше 320px.
- `tone="danger"` — красные чернила и красный ховер, для «Переместить в архив».
- `checked` рисует галочку — меню как одиночный выбор.
