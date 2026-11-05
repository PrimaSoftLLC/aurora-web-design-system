import type { CodeSnippet } from '../../../shared/code-block/code-snippet';

export const formFieldSnippets = {
  basic: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DsFormFieldComponent,
  DsInputDirective,
  DsHintDirective,
} from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-field-example',
  imports: [DsFormFieldComponent, DsInputDirective, DsHintDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <ds-form-field label="Название объекта">
      <input dsInput [value]="plainName()" (input)="onPlainInput($event)" autocomplete="off" />
      <span dsHint>Название в списке объектов</span>
    </ds-form-field>
    <p class="demo-status" role="status">Текущее значение: {{ plainName() }}</p>
  \`,
  styles: \`
    .demo-status {
      margin-top: 8px;
    }
  \`,
})
export class FieldExampleComponent {
  readonly plainName = signal('MAZ 5440');
  onPlainInput(event: Event): void {
    this.plainName.set((event.target as HTMLInputElement).value);
  }
}
`,
  },
  adornments: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import {
  DsFormFieldComponent,
  DsInputDirective,
  DsHintDirective,
  DsPrefixDirective,
  DsSuffixDirective,
  DsIconComponent,
  DsButtonComponent,
} from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-field-example',
  imports: [
    DsFormFieldComponent,
    DsInputDirective,
    DsHintDirective,
    DsPrefixDirective,
    DsSuffixDirective,
    DsIconComponent,
    DsButtonComponent,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="field-grid">
      <ds-form-field label="Максимальная скорость">
        <span dsPrefix>до</span>
        <input
          dsInput
          mono
          type="number"
          min="0"
          [formControl]="speed"
          aria-describedby="field-speed-unit"
        />
        <span dsSuffix id="field-speed-unit">км/ч</span>
        <span dsHint>Значение: {{ speed.value ?? 'не задано' }}</span>
      </ds-form-field>
      <ds-form-field label="Дата проверки">
        <input dsInput type="date" value="2026-11-02" />
      </ds-form-field>
      <ds-form-field label="Пароль">
        <ds-icon dsPrefix name="lock"></ds-icon>
        <input
          dsInput
          [type]="passwordVisible() ? 'text' : 'password'"
          value="example-password"
          autocomplete="off"
        />
        <button
          dsSuffix
          dsButton
          tone="ghost"
          size="sm"
          type="button"
          [icon]="passwordVisible() ? 'visibility_off' : 'visibility'"
          [attr.aria-label]="passwordVisible() ? 'Скрыть пароль' : 'Показать пароль'"
          [attr.aria-pressed]="passwordVisible()"
          (click)="passwordVisible.set(!passwordVisible())"
        ></button>
      </ds-form-field>
    </div>
  \`,
  styles: \`
    .field-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
      gap: 16px;
    }
  \`,
})
export class FieldExampleComponent {
  readonly speed = new FormControl<number | null>(90);
  readonly passwordVisible = signal(false);
}
`,
  },
  validation: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal, ElementRef, viewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DsFormFieldComponent,
  DsInputDirective,
  DsHintDirective,
  DsErrorDirective,
  DsButtonComponent,
} from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-field-example',
  imports: [
    DsFormFieldComponent,
    DsInputDirective,
    DsHintDirective,
    DsErrorDirective,
    DsButtonComponent,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <form class="field-form" [formGroup]="form" (ngSubmit)="save()" novalidate>
      <ds-form-field label="Название объекта">
        <input #validatedInput dsInput formControlName="name" autocomplete="off" />
        <span dsHint>Не менее трёх символов; обязательность задана Validators.required.</span>
        @if (showNameError()) {
          <span dsError>{{
            name.hasError('required')
              ? 'Обязательное поле.'
              : 'Введите не менее трёх символов.'
          }}</span>
        }
      </ds-form-field>
      <div class="row">
        <button dsButton type="submit">Сохранить</button>
        <button dsButton tone="secondary" type="button" (click)="reset()">Сбросить</button>
        <button
          dsButton
          tone="secondary"
          type="button"
          (click)="name.disabled ? name.enable() : name.disable()"
        >
          {{ name.disabled ? 'Включить поле' : 'Отключить поле' }}
        </button>
      </div>
      <p class="demo-status" role="status">{{ result() }}</p>
    </form>
  \`,
  styles: \`
    .field-form {
      max-width: 480px;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
    }
    .demo-status {
      margin-top: 8px;
    }
  \`,
})
export class FieldExampleComponent {
  readonly name = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });
  readonly form = new FormGroup({ name: this.name });
  readonly submitted = signal(false);
  readonly result = signal('Данные ещё не сохранялись.');
  private readonly validatedInput = viewChild<ElementRef<HTMLInputElement>>('validatedInput');
  showNameError(): boolean {
    return this.name.invalid && (this.name.touched || this.submitted());
  }
  save(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.result.set('Исправьте название объекта.');
      this.validatedInput()?.nativeElement.focus();
      return;
    }
    this.result.set('Сохранено: ' + this.name.value);
  }
  reset(): void {
    this.form.reset();
    this.submitted.set(false);
    this.result.set('Форма сброшена.');
  }
}
`,
  },
  states: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DsFormFieldComponent,
  DsInputDirective,
  DsHintDirective,
  DsButtonComponent,
} from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-field-example',
  imports: [DsFormFieldComponent, DsInputDirective, DsHintDirective, DsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="row" role="group" aria-label="Режим доступа">
      <button
        dsButton
        tone="secondary"
        type="button"
        [attr.aria-pressed]="access() === 'edit'"
        (click)="access.set('edit')"
      >
        Редактирование
      </button>
      <button
        dsButton
        tone="secondary"
        type="button"
        [attr.aria-pressed]="access() === 'readonly'"
        (click)="access.set('readonly')"
      >
        Только чтение
      </button>
      <button
        dsButton
        tone="secondary"
        type="button"
        [attr.aria-pressed]="access() === 'disabled'"
        (click)="access.set('disabled')"
      >
        Недоступно
      </button>
    </div>
    <ds-form-field label="Владелец">
      <input
        dsInput
        value="TransBel"
        [readOnly]="access() === 'readonly'"
        [disabled]="access() === 'disabled'"
      />
      <span dsHint>{{
        access() === 'disabled'
          ? 'Нужны права администратора.'
          : 'В readonly значение можно выделить и скопировать.'
      }}</span>
    </ds-form-field>
  \`,
  styles: \`
    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .row + ds-form-field {
      margin-top: 16px;
    }
  \`,
})
export class FieldExampleComponent {
  readonly access = signal<'edit' | 'readonly' | 'disabled'>('edit');
}
`,
  },
  textarea: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DsFormFieldComponent,
  DsInputDirective,
  DsHintDirective,
  DsErrorDirective,
  DsButtonComponent,
} from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-field-example',
  imports: [
    DsFormFieldComponent,
    DsInputDirective,
    DsHintDirective,
    DsErrorDirective,
    DsButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <ds-form-field label="Примечание">
      <textarea
        dsInput
        maxRows="8"
        rows="3"
        maxlength="300"
        required
        [value]="notes()"
        (input)="onNotesInput($event)"
      ></textarea>
      <div dsHint class="note-footer">
        <span>Комментарий для диспетчера</span>
        <span>{{ notes().length }} / 300</span>
      </div>
      @if (showNotesError()) {
        <span dsError>Пример ошибки: счётчик и подсказка сейчас скрыты.</span>
      }
    </ds-form-field>
    <button dsButton tone="secondary" type="button" (click)="showNotesError.set(!showNotesError())">
      {{ showNotesError() ? 'Убрать ошибку' : 'Показать ошибку' }}
    </button>
  \`,
  styles: \`
    .note-footer {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }
    ds-form-field + button {
      margin-top: 16px;
    }
  \`,
})
export class FieldExampleComponent {
  readonly notes = signal('Проверить датчик топлива перед рейсом.');
  readonly showNotesError = signal(false);
  onNotesInput(event: Event): void {
    this.notes.set((event.target as HTMLTextAreaElement).value);
  }
}
`,
  },
  spacing: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DsFormFieldComponent,
  DsInputDirective,
  DsHintDirective,
  DsButtonComponent,
} from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-field-example',
  imports: [DsFormFieldComponent, DsInputDirective, DsHintDirective, DsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="row">
      <button
        dsButton
        tone="secondary"
        type="button"
        [attr.aria-pressed]="collapseLabel()"
        (click)="collapseLabel.set(!collapseLabel())"
      >
        Схлопывать пустой label
      </button>
      <button
        dsButton
        tone="secondary"
        type="button"
        [attr.aria-pressed]="collapseMessages()"
        (click)="collapseMessages.set(!collapseMessages())"
      >
        Схлопывать пустые сообщения
      </button>
    </div>
    <div class="field-grid">
      <ds-form-field label="С подписью">
        <input dsInput value="Подпись и подсказка" />
        <span dsHint>Нижняя строка</span>
      </ds-form-field>
      <ds-form-field
        [collapseEmptyLabel]="collapseLabel()"
        [collapseEmptyMessages]="collapseMessages()"
      >
        <input dsInput aria-label="Поле без видимой подписи" placeholder="Пустые области" />
      </ds-form-field>
    </div>
  \`,
  styles: \`
    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .field-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
      gap: 16px;
      margin-top: 16px;
    }
  \`,
})
export class FieldExampleComponent {
  readonly collapseLabel = signal(false);
  readonly collapseMessages = signal(false);
}
`,
  },
  ngmodel: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DsFormFieldComponent,
  DsInputDirective,
  DsHintDirective,
  DsErrorDirective,
} from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-field-example',
  imports: [DsFormFieldComponent, DsInputDirective, DsHintDirective, DsErrorDirective, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <ds-form-field label="Компания">
      <input dsInput #company="ngModel" required [(ngModel)]="modelName" [ngModelOptions]="{ standalone: true }" />
      <span dsHint>Двусторонняя привязка через FormsModule</span>
      @if (company.touched && company.hasError('required')) {
        <span dsError>Обязательное поле.</span>
      }
    </ds-form-field>
    <p class="demo-status">Текущее значение: {{ modelName }}</p>
  \`,
  styles: \`
    .demo-status {
      margin-top: 8px;
    }
  \`,
})
export class FieldExampleComponent {
  modelName = 'TransBel';
}
`,
  },
} satisfies Record<string, CodeSnippet>;
