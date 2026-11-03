import type { CodeSnippet } from '../../../shared/code-block/code-snippet';

export const buttonSnippets = {
  template: {
    language: 'html',
    code: `<button dsButton>Выполнить действие</button>
`,
  },
  component: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DsButtonComponent } from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-button-example',
  imports: [DsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <button dsButton (click)="clicks.set(clicks() + 1)">Выполнить действие</button>
    <p role="status">Нажатий: {{ clicks() }}</p>
  \`,
})
export class ButtonExampleComponent {
  readonly clicks = signal(0);
}
`,
  },
  tones: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DsButtonComponent, type DsButtonTone } from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-button-tones',
  imports: [DsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    @for (tone of tones; track tone) {
      <span [style.background]="tone === 'inverse' ? 'var(--ds-surface-inverse)' : null"
        style="display: inline-flex; padding: 8px; border-radius: var(--ds-radius-sm)">
        <button dsButton [tone]="tone" (click)="selectedTone.set(tone)">{{ tone }}</button>
      </span>
    }
    <p role="status">Нажата кнопка: {{ selectedTone() }}</p>
  \`,
})
export class ButtonTonesComponent {
  readonly tones: readonly DsButtonTone[] = [
    'primary', 'secondary', 'subtle', 'ghost', 'danger', 'accent', 'inverse',
  ];
  readonly selectedTone = signal<DsButtonTone>('primary');
}
`,
  },
  sizes: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DsButtonComponent, type DsButtonSize } from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-button-sizes',
  imports: [DsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    @for (size of sizes; track size) {
      <button dsButton [size]="size" (click)="selectedSize.set(size)">Размер {{ size }}</button>
    }
    <p role="status">Нажат размер: {{ selectedSize() }}</p>
  \`,
})
export class ButtonSizesComponent {
  readonly sizes: readonly DsButtonSize[] = ['sm', 'md', 'lg'];
  readonly selectedSize = signal<DsButtonSize>('md');
}
`,
  },
  icons: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DsButtonComponent } from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-button-icons',
  imports: [DsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <button dsButton icon="add" (click)="added.set(added() + 1)">Добавить запись</button>
    <button dsButton tone="secondary" iconRight="arrow_forward"
      (click)="added.set(added() + 1)">Продолжить</button>
    <button dsButton icon="add" size="sm" aria-label="Добавить запись: sm"
      (click)="added.set(added() + 1)"></button>
    <button dsButton icon="add" aria-label="Добавить запись: md"
      (click)="added.set(added() + 1)"></button>
    <button dsButton icon="add" size="lg" aria-label="Добавить запись: lg"
      (click)="added.set(added() + 1)"></button>
    <p role="status">Действий выполнено: {{ added() }}</p>
  \`,
})
export class ButtonIconsComponent {
  readonly added = signal(0);
}
`,
  },
  disabled: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DsButtonComponent } from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-button-disabled',
  imports: [DsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <button dsButton [disabled]="locked()" (click)="performed.set(performed() + 1)">Выполнить</button>
    <button dsButton tone="secondary" (click)="locked.set(!locked())">
      {{ locked() ? 'Разрешить действие' : 'Отключить действие' }}
    </button>
    <p>{{ locked() ? 'Действие временно недоступно. Разрешите действие, чтобы попробовать.' : 'Действие доступно.' }}</p>
    <p role="status">Выполнено: {{ performed() }}</p>
  \`,
})
export class ButtonDisabledComponent {
  readonly locked = signal(true);
  readonly performed = signal(0);
}
`,
  },
  loading: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DsButtonComponent } from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-button-loading',
  imports: [DsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <button dsButton icon="save" [loading]="saving()" (click)="save()">Сохранить изменения</button>
    <p role="status">{{ message() }}</p>
  \`,
})
export class ButtonLoadingComponent {
  readonly saving = signal(false);
  readonly message = signal('');

  async save(): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    this.message.set('Сохраняем изменения…');
    try {
      // В приложении здесь вызов сервиса вместо демонстрационной задержки.
      await new Promise<void>((resolve) => setTimeout(resolve, 800));
      this.message.set('Изменения сохранены.');
    } catch {
      this.message.set('Не удалось сохранить изменения. Попробуйте ещё раз.');
    } finally {
      this.saving.set(false);
    }
  }
}
`,
  },
  layout: {
    language: 'html',
    code: `<div style="width: 100%; max-width: 320px">
  <button dsButton fullWidth tone="secondary">Действие на всю ширину</button>
</div>
<div style="width: 100%; max-width: 320px; margin-top: 16px">
  <button dsButton fullWidth icon="save" iconRight="arrow_forward">
    ОченьДлинноеНазваниеДействияБезПробеловКотороеНужноПеренестиПолностью
  </button>
</div>
`,
  },
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
  selector: 'app-button-example',
  imports: [DsButtonComponent, DsFormFieldComponent, DsInputDirective, DsErrorDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <form novalidate (submit)="submit($event)" (reset)="reset()">
      <ds-form-field class="form-field" label="Название объекта">
        <input
          dsInput
          id="button-object-name"
          name="objectName"
          value="Новый объект"
          (input)="formName.set($any($event.target).value)"
          (blur)="formTouched.set(true)"
          required />
        @if (formTouched() && !formName().trim()) {
          <span dsError>Обязательное поле.</span>
        }
      </ds-form-field>
      <div class="row">
        <button dsButton type="submit" name="action" value="save">Отправить</button>
        <button dsButton type="reset" tone="secondary">Сбросить</button>
        <button
          dsButton
          tone="ghost"
          (click)="formMessage.set('Обычное действие: форма не отправлена.')">
          Обычное действие
        </button>
      </div>
    </form>
    <p role="status">{{ formMessage() }}</p>
  \`,
  styles: \`
    .form-field {
      max-width: 320px;
      margin-bottom: 16px;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
    }
    p {
      margin: var(--ds-gap-sm) 0 0;
    }
  \`,
})
export class ButtonFormComponent {
  protected readonly formMessage = signal('Форма ещё не отправлялась.');
  protected readonly formName = signal('Новый объект');
  protected readonly formTouched = signal(false);
  protected submit(event: Event) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const name = String(data.get('objectName') ?? '');
    this.formName.set(name);
    this.formTouched.set(true);
    if (!name.trim()) {
      this.formMessage.set('Заполните обязательное поле.');
      form.querySelector<HTMLInputElement>('[name="objectName"]')?.focus();
      return;
    }
    this.formMessage.set(\`Отправлено: \${name}\`);
  }
  protected reset() {
    this.formName.set('Новый объект');
    this.formTouched.set(false);
    this.formMessage.set('Форма сброшена.');
  }
}
`,
  },
} satisfies Record<string, CodeSnippet>;
