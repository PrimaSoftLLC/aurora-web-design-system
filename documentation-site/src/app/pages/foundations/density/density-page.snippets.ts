import type { CodeSnippet } from '../../../shared/code-block/code-snippet';

export const densitySnippets = {
  form: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  DsFormFieldComponent,
  DsInputDirective,
  DsButtonComponent,
  AuroraScopeDirective,
} from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-density-example',
  imports: [DsFormFieldComponent, DsInputDirective, DsButtonComponent, AuroraScopeDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div auroraScope density="compact">
      <form class="field-demo" (submit)="$event.preventDefault()">
        <ds-form-field label="Поиск объекта">
          <input dsInput name="object" />
        </ds-form-field>
        <div><button dsButton type="reset" tone="secondary">Сбросить</button></div>
      </form>
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
export class DensityExampleComponent {}
`,
  },
} satisfies Record<string, CodeSnippet>;
