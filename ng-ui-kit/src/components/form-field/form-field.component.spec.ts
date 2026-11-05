import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DsFormFieldComponent } from './form-field.component';
import { DsInputDirective } from './input.directive';
import {
  DsErrorDirective,
  DsHintDirective,
  DsPrefixDirective,
  DsSuffixDirective,
} from './field-slots.directive';

@Component({
  imports: [
    DsFormFieldComponent,
    DsInputDirective,
    DsErrorDirective,
    DsHintDirective,
    DsPrefixDirective,
    DsSuffixDirective,
  ],
  template: `
    <span id="external-help">Внешнее пояснение</span>
    <ds-form-field
      [label]="label"
      [collapseEmptyLabel]="collapseLabel"
      [collapseEmptyMessages]="collapseMessages"
    >
      <span dsPrefix>от</span>
      <input
        dsInput
        [id]="id"
        [disabled]="disabled"
        [readOnly]="readOnly"
        [required]="required"
        [value]="value"
        (input)="value = $any($event.target).value"
        aria-describedby="external-help"
        aria-invalid="false"
        aria-label="Название"
      />
      <span dsSuffix>₽</span>
      @if (hint) {
        <div dsHint><span>Подсказка</span><span>10 / 100</span></div>
      }
      @if (error) {
        <span dsError>Ошибка приложения</span>
      }
    </ds-form-field>
  `,
})
class PlainHost {
  label = 'Название';
  id = 'native-field';
  disabled = false;
  readOnly = false;
  required = false;
  collapseLabel = false;
  collapseMessages = false;
  hint = true;
  error = false;
  value = 'Начальное значение';
}

@Component({
  imports: [DsFormFieldComponent, DsInputDirective, ReactiveFormsModule, FormsModule],
  template: `
    <ds-form-field label="Реактивный ввод">
      <input dsInput [formControl]="control" />
    </ds-form-field>
    <ds-form-field label="NgModel">
      <textarea
        dsInput
        [maxRows]="maxRows"
        [(ngModel)]="notes"
        [ngModelOptions]="{ standalone: true }"
      ></textarea>
    </ds-form-field>
  `,
})
class FormsHost {
  control = new FormControl('Начальное', { nonNullable: true, validators: [Validators.required] });
  notes = 'Примечание';
  maxRows = 8;
}

async function settle<T>(fixture: ComponentFixture<T>): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('DsFormFieldComponent with DsInputDirective', () => {
  let fixture: ComponentFixture<PlainHost>;
  let host: PlainHost;
  let input: HTMLInputElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(PlainHost);
    host = fixture.componentInstance;
    await settle(fixture);
    input = fixture.nativeElement.querySelector('input');
  });

  it('keeps native value/events and links a label to a supplied or generated ID', async () => {
    expect(input.value).toBe(host.value);
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe(input.id);
    input.value = 'Изменено';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(host.value).toBe('Изменено');
    host.id = '';
    await settle(fixture);
    expect(input.id).toMatch(/^ds-input-/);
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe(input.id);
  });

  it('renders prefix/control/suffix in order and describes the complete hint', () => {
    const shell: HTMLElement = fixture.nativeElement.querySelector('.ds-field-shell');
    expect(shell.children[0].textContent).toContain('от');
    expect(shell.children[1]).toBe(input);
    expect(shell.children[2].textContent).toContain('₽');
    const hint = fixture.nativeElement.querySelector('.ds-field-messages > div');
    expect(input.getAttribute('aria-describedby')?.split(' ')).toEqual(['external-help', hint.id]);
    expect(hint.textContent).toContain('10 / 100');
  });

  it('replaces the whole hint with error and restores ARIA after removal', async () => {
    host.error = true;
    await settle(fixture);
    expect(fixture.nativeElement.querySelector('[dsHint]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[dsError]').textContent).toContain('Ошибка');
    expect(fixture.nativeElement.querySelector('.ds-field-shell').dataset.dsField).toBe('error');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    host.error = false;
    await settle(fixture);
    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(fixture.nativeElement.querySelector('[dsHint]')).not.toBeNull();
    expect(input.getAttribute('aria-describedby')).toContain('external-help');
  });

  it('preserves external description updates while a hint/error is attached', async () => {
    input.setAttribute('aria-describedby', 'another-help');
    await settle(fixture);
    expect(input.getAttribute('aria-describedby')).toContain('another-help');
    host.hint = false;
    await settle(fixture);
    expect(input.getAttribute('aria-describedby')).toBe('another-help');
  });

  it('reflects native disabled, readonly and explicit required on the shell', async () => {
    host.disabled = true;
    host.required = true;
    await settle(fixture);
    const shell: HTMLElement = fixture.nativeElement.querySelector('.ds-field-shell');
    expect(input.disabled).toBeTrue();
    expect(shell.hasAttribute('data-ds-field-disabled')).toBeTrue();
    expect(fixture.nativeElement.querySelector('.ds-field-required')).not.toBeNull();
    expect(input.getAttribute('aria-required')).toBe('true');
    host.disabled = false;
    host.readOnly = true;
    await settle(fixture);
    expect(input.disabled).toBeFalse();
    expect(input.readOnly).toBeTrue();
    expect(shell.hasAttribute('data-ds-field-disabled')).toBeFalse();
    expect(shell.hasAttribute('data-ds-field-readonly')).toBeTrue();
  });

  it('reserves empty rows by default and collapses only empty rows on request', async () => {
    host.label = '';
    host.hint = false;
    await settle(fixture);
    expect(fixture.nativeElement.querySelector('.ds-field-label-row')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.ds-field-messages')).not.toBeNull();
    host.collapseLabel = true;
    host.collapseMessages = true;
    await settle(fixture);
    expect(fixture.nativeElement.querySelector('.ds-field-label-row')).toBeNull();
    expect(fixture.nativeElement.querySelector('.ds-field-messages')).toBeNull();
    host.label = 'Есть подпись';
    host.error = true;
    await settle(fixture);
    expect(fixture.nativeElement.querySelector('.ds-field-label-row')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.ds-field-messages')).not.toBeNull();
  });
});

describe('DsInputDirective with native Angular value accessors', () => {
  it('supports Reactive Forms, validators, disable/enable, reset and touched', async () => {
    const fixture = TestBed.createComponent(FormsHost);
    await settle(fixture);
    const control = fixture.componentInstance.control;
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const directive = fixture.debugElement.query(By.css('input')).injector.get(DsInputDirective);
    expect(directive.required()).toBeTrue();
    expect(input.getAttribute('aria-required')).toBe('true');
    control.setValue('Программно');
    await settle(fixture);
    expect(input.value).toBe('Программно');
    input.value = 'Пользователь';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur'));
    expect(control.value).toBe('Пользователь');
    expect(control.touched).toBeTrue();
    control.disable();
    await settle(fixture);
    expect(input.disabled).toBeTrue();
    expect(directive.disabled()).toBeTrue();
    control.enable();
    control.reset();
    control.clearValidators();
    control.updateValueAndValidity();
    await settle(fixture);
    expect(input.value).toBe('Начальное');
    expect(input.disabled).toBeFalse();
    expect(directive.required()).toBeFalse();
  });

  it('limits native textarea resizing in lines and removes the limit when disabled', async () => {
    const fixture = TestBed.createComponent(FormsHost);
    await settle(fixture);
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(textarea.style.maxHeight).toContain('8lh');
    fixture.componentInstance.maxRows = 0;
    await settle(fixture);
    expect(textarea.style.maxHeight).toBe('');
  });

  it('supports textarea with ngModel without a custom CVA', async () => {
    const fixture = TestBed.createComponent(FormsHost);
    await settle(fixture);
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(textarea.value).toBe('Примечание');
    textarea.value = 'Новая заметка';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);
    expect(fixture.componentInstance.notes).toBe('Новая заметка');
  });
});

@Component({
  imports: [DsFormFieldComponent, DsInputDirective, ReactiveFormsModule],
  template:
    '<ds-form-field label="Число"><input dsInput type="number" [formControl]="control"></ds-form-field>',
})
class NumberHost {
  control = new FormControl<number | null>(42);
}

describe('DsInputDirective with number input', () => {
  it('retains Angular number/null conversion without replacing the native accessor', async () => {
    const fixture = TestBed.createComponent(NumberHost);
    await settle(fixture);
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = '12.5';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(fixture.componentInstance.control.value).toBe(12.5);
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(fixture.componentInstance.control.value).toBeNull();
  });
});
