import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  effect,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsInputDirective } from './input.directive';
import {
  DsErrorDirective,
  DsHintDirective,
  DsPrefixDirective,
  DsSuffixDirective,
} from './field-slots.directive';

let nextFieldId = 0;

/** Layout and accessibility only; the application owns value, validation and error timing. */
@Component({
  selector: 'ds-form-field',
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Projected native controls need shared styling. Every rule is scoped to this field's own selectors.
  encapsulation: ViewEncapsulation.None,
  host: { 'data-ds-form-field': '' },
})
export class DsFormFieldComponent {
  readonly label = input<string>();
  readonly collapseEmptyLabel = input(false, { transform: booleanAttribute });
  readonly collapseEmptyMessages = input(false, { transform: booleanAttribute });
  private readonly controls = contentChildren(DsInputDirective, { descendants: true });
  protected readonly control = computed(() => this.controls()[0]);
  protected readonly hint = contentChild(DsHintDirective);
  protected readonly errors = contentChildren(DsErrorDirective);
  protected readonly prefix = contentChild(DsPrefixDirective);
  protected readonly suffix = contentChild(DsSuffixDirective);
  protected readonly hasLabel = computed(() => !!this.label()?.trim());
  protected readonly hasError = computed(() => this.errors().length > 0);
  protected readonly hasMessages = computed(() => this.hasError() || !!this.hint());
  protected readonly messageId = 'ds-field-message-' + nextFieldId++;

  constructor() {
    effect((onCleanup) => {
      if (this.controls().length > 1)
        throw new Error('ds-form-field supports one dsInput control.');
      const control = this.control();
      control?.connect(this.hasMessages() ? this.messageId : null, this.hasError());
      onCleanup(() => control?.connect(null, false));
    });
  }

  protected focusControl(event: MouseEvent): void {
    if (event.defaultPrevented) return;
    const target = event.target;
    if (
      target instanceof Element &&
      target.closest('button, a, input, textarea, select, [tabindex]')
    )
      return;
    this.control()?.focus();
  }
}
