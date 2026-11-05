import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DsErrorDirective,
  DsFormFieldComponent,
  DsHintDirective,
  DsInputDirective,
  DsPrefixDirective,
  DsSuffixDirective,
} from '@primasoftllc/design-system/angular';

/** Compiled against the installed tarball in both supported Angular consumers. */
@Component({
  selector: 'form-field-demo',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DsFormFieldComponent,
    DsInputDirective,
    DsPrefixDirective,
    DsSuffixDirective,
    DsHintDirective,
    DsErrorDirective,
  ],
  templateUrl: './form-field-demo.html',
  styleUrl: './form-field-demo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldDemo {
  readonly plain = signal('МАЗ 5440');
  readonly inputEvents = signal(0);
  readonly readOnly = signal(false);
  readonly speed = new FormControl<number | null>(42, Validators.required);
  notes = 'Проверить датчик';

  reset(): void {
    this.readOnly.set(false);
    this.speed.enable();
    this.speed.reset(42);
  }
}
