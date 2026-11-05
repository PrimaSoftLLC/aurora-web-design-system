import type { CodeSnippet } from '../../../shared/code-block/code-snippet';

export const spacingSnippets = {
  form: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DsFormFieldComponent,
  DsInputDirective,
  DsButtonComponent,
} from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-spacing-example',
  imports: [DsFormFieldComponent, DsInputDirective, DsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="field-actions" role="group" aria-label="Группировка формы">
      <button
        dsButton
        [tone]="grouped() ? 'subtle' : 'secondary'"
        [attr.aria-pressed]="grouped()"
        (click)="grouped.set(true)">
        Группы различимы
      </button>
      <button
        dsButton
        [tone]="grouped() ? 'secondary' : 'subtle'"
        [attr.aria-pressed]="!grouped()"
        (click)="grouped.set(false)">
        Всё на одинаковом расстоянии
      </button>
    </div>
    <div
      data-spacing-form
      class="field-demo"
      [style.gap]="grouped() ? 'var(--ds-gap-xl)' : 'var(--ds-gap-md)'">
      <div class="field-demo">
        <h3>Объект</h3>
        <ds-form-field label="Название"><input dsInput value="МАЗ 5440" /></ds-form-field>
        <ds-form-field label="Группа"><input dsInput value="Грузовые" /></ds-form-field>
      </div>
      <div class="field-demo">
        <h3>Уведомления</h3>
        <ds-form-field label="Email для отчёта">
          <input dsInput type="email" placeholder="name@example.com" />
        </ds-form-field>
      </div>
    </div>
  \`,
  styles: \`
    .field-demo {
      display: grid;
      gap: var(--ds-gap-md);
      max-width: 480px;
    }
    .field-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ds-gap-sm);
      margin-bottom: var(--ds-gap-md);
    }
    .field-demo h3,
    .field-demo p {
      margin: 0;
    }
  \`,
})
export class SpacingExampleComponent {
  protected readonly grouped = signal(true);
}
`,
  },

  settingsLayout: {
    language: 'css',
    code: `.settings {
  display: grid;
  gap: var(--ds-gap-xl);
  padding: var(--ds-pad-xl);
}
.settings-group {
  display: grid;
  gap: var(--ds-gap-md);
}
`,
  },
} satisfies Record<string, CodeSnippet>;
