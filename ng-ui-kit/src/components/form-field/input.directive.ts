import {
  DoCheck,
  booleanAttribute,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  numberAttribute,
  computed,
  signal,
} from '@angular/core';
import { NgControl, Validators } from '@angular/forms';
import type { Subscription } from 'rxjs';

let nextInputId = 0;

/** Native value accessors own value/Forms. This directive coordinates presentation with the field. */
@Directive({
  selector: 'input[dsInput], textarea[dsInput]',
  host: {
    'data-ds-input': '',
    '[attr.id]': 'controlId()',
    '[attr.aria-required]': 'required() ? "true" : null',
    '[attr.data-ds-input-mono]': 'mono() ? "" : null',
    '[style.max-height]': 'maximumHeight()',
  },
})
export class DsInputDirective implements DoCheck {
  readonly id = input<string>();
  readonly mono = input(false, { transform: booleanAttribute });
  /** Maximum visible textarea lines during native resizing; zero leaves height unrestricted. */
  readonly maxRows = input(0, { transform: numberAttribute });
  private readonly element =
    inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(ElementRef).nativeElement;
  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly generatedId = 'ds-input-' + nextInputId++;
  /** @internal The field reads actual native states; no duplicate disabled/readOnly inputs. */
  readonly controlId = computed(() => this.id() || this.generatedId);
  /** @internal */
  readonly disabled = signal(false);
  /** @internal */
  readonly readOnly = signal(false);
  /** @internal */
  readonly required = signal(false);
  /** @internal */
  readonly multiline = this.element.tagName === 'TEXTAREA';
  protected readonly maximumHeight = computed(() => {
    const rows = this.maxRows();
    return this.multiline && Number.isFinite(rows) && rows > 0
      ? `calc(${Math.max(1, Math.floor(rows))} * 1lh)`
      : null;
  });
  private descriptionId: string | null = null;
  private ownedDescriptionId: string | null = null;
  private invalid = false;
  private externalInvalid: string | null = null;
  private appliedInvalid: string | null | undefined;
  private statusSubscription: Subscription | undefined;
  private observedControl = this.ngControl?.control;

  constructor() {
    const observer = new MutationObserver(() => this.refresh());
    observer.observe(this.element, {
      attributes: true,
      attributeFilter: ['disabled', 'readonly', 'required', 'aria-describedby', 'aria-invalid'],
    });
    inject(DestroyRef).onDestroy(() => {
      observer.disconnect();
      this.statusSubscription?.unsubscribe();
    });
  }

  // Native properties and CVA writes do not pass through directive inputs.
  // DoCheck is shared by supported Angular 19/20; the render callback API differs between them.
  ngDoCheck(): void {
    const control = this.ngControl?.control;
    if (control !== this.observedControl || (!this.statusSubscription && control)) {
      this.statusSubscription?.unsubscribe();
      this.observedControl = control;
      this.statusSubscription = control?.statusChanges.subscribe(() => this.refresh());
    }
    this.refresh();
  }

  /** @internal Called only by the containing field; external ARIA references are preserved. */
  connect(descriptionId: string | null, invalid: boolean): void {
    this.descriptionId = descriptionId;
    this.invalid = invalid;
    this.refresh();
  }

  /** @internal */
  focus(): void {
    if (!this.element.matches(':disabled')) this.element.focus();
  }

  private refresh(): void {
    this.disabled.set(this.element.matches(':disabled'));
    this.readOnly.set(this.element.readOnly);
    this.required.set(
      this.element.required || !!this.ngControl?.control?.hasValidator(Validators.required),
    );

    const currentIds = (this.element.getAttribute('aria-describedby') || '')
      .split(/\s+/)
      .filter(Boolean);
    const ids = currentIds.filter((id) => id !== this.ownedDescriptionId);
    if (this.descriptionId) ids.push(this.descriptionId);
    this.setAttribute('aria-describedby', [...new Set(ids)].join(' ') || null);
    this.ownedDescriptionId = this.descriptionId;

    const currentInvalid = this.element.getAttribute('aria-invalid');
    if (currentInvalid !== this.appliedInvalid) this.externalInvalid = currentInvalid;
    const nextInvalid = this.invalid ? 'true' : this.externalInvalid;
    this.setAttribute('aria-invalid', nextInvalid);
    this.appliedInvalid = nextInvalid;
  }

  private setAttribute(name: string, value: string | null): void {
    if (this.element.getAttribute(name) === value) return;
    if (value === null) this.element.removeAttribute(name);
    else this.element.setAttribute(name, value);
  }
}
