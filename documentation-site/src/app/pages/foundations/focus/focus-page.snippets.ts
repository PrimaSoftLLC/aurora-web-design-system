import type { CodeSnippet } from '../../../shared/code-block/code-snippet';

export const focusSnippets = {
  form: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DsFormFieldComponent,
  DsInputDirective,
  DsButtonComponent,
  DsCheckboxComponent,
} from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-focus-example',
  imports: [DsFormFieldComponent, DsInputDirective, DsButtonComponent, DsCheckboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <form
      class="field-demo"
      (submit)="$event.preventDefault(); message.set('Настройки сохранены.')">
      <ds-form-field label="Название объекта">
        <input dsInput [value]="name()" (input)="name.set($any($event.target).value)" />
      </ds-form-field>
      <ds-checkbox
        label="Показывать названия"
        [checked]="checked()"
        (checkedChange)="checked.set($event)"></ds-checkbox>
      <div class="field-actions">
        <button dsButton type="submit">Сохранить</button>
        <button dsButton tone="secondary" (click)="reset()">Отмена</button>
        <button dsButton disabled>Недоступно</button>
      </div>
      <p role="status">{{ message() }}</p>
    </form>
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
export class FocusExampleComponent {
  protected readonly name = signal('МАЗ 5440');
  protected readonly checked = signal(false);
  protected readonly message = signal('Изменения ещё не сохранены.');
  protected reset(): void {
    this.name.set('МАЗ 5440');
    this.checked.set(false);
    this.message.set('Изменения отменены.');
  }
}
`,
  },
} satisfies Record<string, CodeSnippet>;
