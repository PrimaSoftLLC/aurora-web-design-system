import type { CodeSnippet } from '../../../shared/code-block/code-snippet';

export const iconographySnippets = {
  accessible: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DsButtonComponent, DsIconComponent } from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-iconography-example',
  imports: [DsButtonComponent, DsIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="row">
      <ds-icon name="warning"></ds-icon>
      <span>Нет связи с объектом</span>
      <ds-icon name="lock" label="Доступ ограничен"></ds-icon>
      <button
        dsButton
        [tone]="settingsOpen() ? 'subtle' : 'ghost'"
        icon="settings"
        aria-label="Показать пояснение настроек"
        [attr.aria-expanded]="settingsOpen()"
        aria-controls="icon-settings-explanation"
        (click)="settingsOpen.set(!settingsOpen())"></button>
    </div>
    <p id="icon-settings-explanation" class="caption" role="status" [hidden]="!settingsOpen()">
      Кнопка настроек имеет собственное доступное имя; глиф внутри неё декоративный.
    </p>
  \`,
  styles: \`
    .row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--ds-gap-sm);
    }
    p {
      margin: var(--ds-gap-sm) 0 0;
      font: var(--ds-type-caption);
    }
  \`,
})
export class AccessibleIconActionComponent {
  protected readonly settingsOpen = signal(false);
}
`,
  },

  form: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DsFormFieldComponent,
  DsInputDirective,
  DsButtonComponent,
  DsPrefixDirective,
  DsIconComponent,
} from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-iconography-example',
  imports: [
    DsFormFieldComponent,
    DsInputDirective,
    DsButtonComponent,
    DsPrefixDirective,
    DsIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="field-demo">
      <ds-form-field label="Поиск объекта">
        <ds-icon dsPrefix name="search"></ds-icon>
        <input
          dsInput
          type="search"
          [value]="objectQuery()"
          (input)="objectQuery.set($any($event.target).value)" />
      </ds-form-field>
      <div class="field-actions">
        <button dsButton icon="add" (click)="objectCount.set(objectCount() + 1)">
          Добавить объект
        </button>
        <span role="status"
          >Объектов: {{ objectCount()
          }}{{ objectQuery() ? ' · Поиск: ' + objectQuery() : '' }}</span
        >
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
    }
  \`,
})
export class IconographyExampleComponent {
  protected readonly objectQuery = signal('');
  protected readonly objectCount = signal(1);
}
`,
  },
} satisfies Record<string, CodeSnippet>;
