import type { CodeSnippet } from '../../../shared/code-block/code-snippet';

export const accessibilitySnippets = {
  form: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DsButtonComponent,
  DsFormFieldComponent,
  DsInputDirective,
  DsErrorDirective,
} from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-accessibility-example',
  imports: [DsButtonComponent, DsFormFieldComponent, DsInputDirective, DsErrorDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <form class="field-demo" novalidate (submit)="save($event)">
      <ds-form-field label="Название объекта">
        <input
          dsInput
          required
          [value]="name()"
          (blur)="touched.set(true)"
          (input)="name.set($any($event.target).value); message.set('')" />
        @if (touched() && !name().trim()) {
          <span dsError>Обязательное поле.</span>
        }
      </ds-form-field>
      <div><button dsButton type="submit" [disabled]="!name().trim()">Сохранить</button></div>
      <p role="status">{{ message() }}</p>
    </form>
  \`,
  styles: \`
    .field-demo {
      display: grid;
      gap: var(--ds-gap-md);
      max-width: 480px;
    }
    p {
      margin: 0;
    }
  \`,
})
export class AccessibilityExampleComponent {
  protected readonly name = signal('МАЗ 5440');
  protected readonly message = signal('');
  protected readonly touched = signal(false);
  protected save(event: Event): void {
    event.preventDefault();
    this.touched.set(true);
    if (!this.name().trim()) {
      this.message.set('Заполните обязательное поле.');
      return;
    }
    this.message.set('Название «' + this.name().trim() + '» сохранено в примере.');
  }
}
`,
  },
} satisfies Record<string, CodeSnippet>;
