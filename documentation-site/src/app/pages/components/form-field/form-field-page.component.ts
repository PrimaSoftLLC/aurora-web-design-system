import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AuroraScopeDirective,
  DsButtonComponent,
  DsErrorDirective,
  DsFormFieldComponent,
  DsHintDirective,
  DsIconComponent,
  DsInputDirective,
  DsPrefixDirective,
  DsSuffixDirective,
} from '@primasoftllc/design-system/angular';
import { ArticleLayoutComponent } from '../../../shared/article-layout/article-layout.component';
import { ExampleBlockComponent } from '../../../shared/example-block/example-block.component';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';
import { SiteSettingsService } from '../../../site-settings.service';
import { formFieldSnippets } from './form-field-page.snippets';

@Component({
  selector: 'aurora-form-field-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AuroraScopeDirective,
    DsButtonComponent,
    DsFormFieldComponent,
    DsInputDirective,
    DsPrefixDirective,
    DsSuffixDirective,
    DsHintDirective,
    DsErrorDirective,
    DsIconComponent,
    ArticleLayoutComponent,
    ExampleBlockComponent,
    CodeBlockComponent,
  ],
  templateUrl: './form-field-page.component.html',
  styleUrl: './form-field-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldPageComponent {
  protected readonly settings = inject(SiteSettingsService);
  protected readonly snippets = formFieldSnippets;
  protected readonly plainName = signal('MAZ 5440');
  protected readonly speed = new FormControl<number | null>(90);
  protected readonly passwordVisible = signal(false);
  protected readonly access = signal<'edit' | 'readonly' | 'disabled'>('edit');
  protected readonly name = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });
  protected readonly form = new FormGroup({ name: this.name });
  protected readonly submitted = signal(false);
  protected readonly result = signal('Данные ещё не сохранялись.');
  protected readonly notes = signal('Проверить датчик топлива перед рейсом.');
  protected readonly showNotesError = signal(false);
  protected readonly collapseLabel = signal(false);
  protected readonly collapseMessages = signal(false);
  protected modelName = 'TransBel';
  private readonly validatedInput = viewChild<ElementRef<HTMLInputElement>>('validatedInput');

  protected onPlainInput(event: Event): void {
    this.plainName.set((event.target as HTMLInputElement).value);
  }
  protected onNotesInput(event: Event): void {
    this.notes.set((event.target as HTMLTextAreaElement).value);
  }
  protected showNameError(): boolean {
    return this.name.invalid && (this.name.touched || this.submitted());
  }
  protected save(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.result.set('Исправьте название объекта.');
      this.validatedInput()?.nativeElement.focus();
      return;
    }
    this.result.set('Сохранено: ' + this.name.value);
  }
  protected reset(): void {
    this.form.reset();
    this.submitted.set(false);
    this.result.set('Форма сброшена.');
  }
}
