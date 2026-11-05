import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

export type DsSwitchLabelPosition = 'left' | 'right';

let nextSwitchId = 0;

@Component({
  selector: 'ds-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DsSwitchComponent), multi: true },
  ],
  host: {
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[attr.aria-describedby]': 'null',
  },
})
export class DsSwitchComponent implements ControlValueAccessor {
  readonly checked = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly label = input<string>();
  readonly description = input<string>();
  readonly labelPosition = input<DsSwitchLabelPosition>('right');
  readonly ariaLabel = input<string>(undefined, { alias: 'aria-label' });
  readonly ariaLabelledBy = input<string>(undefined, { alias: 'aria-labelledby' });
  readonly ariaDescribedBy = input<string>(undefined, { alias: 'aria-describedby' });
  readonly checkedChange = output<boolean>();

  protected readonly currentChecked = signal(false);
  private readonly formAttached = signal(false);
  private readonly formDisabled = signal(false);
  private readonly nativeControl = viewChild<ElementRef<HTMLInputElement>>('control');
  protected readonly nativeId = 'ds-switch-' + nextSwitchId++;
  protected readonly labelId = this.nativeId + '-label';
  protected readonly descriptionId = this.nativeId + '-description';
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly labelledBy = computed(
    () => this.ariaLabelledBy() || (!this.ariaLabel() && this.label() ? this.labelId : null),
  );
  protected readonly describedBy = computed(
    () => [this.ariaDescribedBy(), this.description() ? this.descriptionId : null]
      .filter(Boolean).join(' ') || null,
  );

  private onChange: (value: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      if (!this.formAttached()) this.currentChecked.set(this.checked());
    });
  }

  writeValue(value: unknown): void {
    this.formAttached.set(true);
    const checked = value === true;
    this.currentChecked.set(checked);
    // A form can reset synchronously after native activation, before Angular updates bindings.
    const control = this.nativeControl()?.nativeElement;
    if (control) control.checked = checked;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  protected change(event: Event): void {
    const control = event.target as HTMLInputElement;
    if (this.isDisabled()) {
      control.checked = this.currentChecked();
      return;
    }
    const checked = control.checked;
    this.currentChecked.set(checked);
    this.onChange(checked);
    this.checkedChange.emit(checked);
  }
}
