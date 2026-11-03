import type { CodeSnippet } from '../../../shared/code-block/code-snippet';

export const contentSnippets = {
  situations: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { DsButtonComponent } from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-content-example',
  imports: [DsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="stack">
      <div class="situation-options" role="group" aria-label="Ситуация">
        @for (situation of situations; track situation.id) {
          <button
            dsButton
            [tone]="mode() === situation.id ? 'subtle' : 'secondary'"
            [attr.aria-pressed]="mode() === situation.id"
            (click)="mode.set(situation.id)">
            {{ situation.label }}
          </button>
        }
      </div>
      <div class="comparison" role="status">
        <div>
          <h3>Слишком общее</h3>
          <p>{{ example()[0] }}</p>
        </div>
        <div>
          <h3>Понятно, что дальше</h3>
          <p style="font: var(--ds-type-body-strong)">{{ example()[1] }}</p>
          <p>{{ example()[2] }}</p>
        </div>
      </div>
    </div>
  \`,
  styles: \`
    .stack {
      display: grid;
      gap: var(--ds-gap-md);
    }
    .situation-options {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ds-gap-sm);
    }
    .comparison {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--ds-gap-xl);
    }
    .comparison > div {
      min-width: 0;
    }
    @media (max-width: 640px) {
      .comparison {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  \`,
})
export class InterfaceMessagesComponent {
  protected readonly mode = signal<'empty' | 'search' | 'error'>('search');
  protected readonly situations = [
    { id: 'empty', label: 'Нет объектов' },
    { id: 'search', label: 'Ничего не найдено' },
    { id: 'error', label: 'Ошибка' },
  ] as const;
  protected readonly messages = {
    empty: ['Нет данных', 'Объектов пока нет', 'Добавьте первый объект, чтобы начать мониторинг.'],
    search: ['Нет данных', 'Объекты не найдены', 'Измените запрос или сбросьте фильтры.'],
    error: ['Произошла ошибка', 'Не удалось загрузить объекты', 'Повторите попытку.'],
  } as const;
  protected readonly example = computed(() => this.messages[this.mode()]);
}
`,
  },
} satisfies Record<string, CodeSnippet>;
