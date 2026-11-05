import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DsSwitchComponent } from './switch.component';

@Component({
  imports: [DsSwitchComponent, ReactiveFormsModule],
  template: `
    <p id="help">Внешнее пояснение</p>
    <ds-switch label="Треки" description="На карте" labelPosition="left"
      aria-describedby="help" [(checked)]="checked"></ds-switch>
    <ds-switch aria-label="Уведомления" [formControl]="control"
      (checkedChange)="changes.push($event)"></ds-switch>
  `,
})
class SwitchHost {
  checked = false;
  readonly control = new FormControl(true, { nonNullable: true });
  readonly changes: boolean[] = [];
}

describe('DsSwitchComponent', () => {
  it('links label and descriptions and updates a two-way binding', () => {
    const fixture = TestBed.createComponent(SwitchHost);
    fixture.detectChanges();
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    const control = label.control as HTMLInputElement;
    expect(label.classList.contains('label-left')).toBeTrue();
    expect(control.getAttribute('role')).toBe('switch');
    expect(control.getAttribute('aria-labelledby')).toBe(label.querySelector('.label')!.id);
    expect(control.getAttribute('aria-describedby')).toBe('help ' + label.querySelector('.description')!.id);
    label.querySelector<HTMLElement>('.description')!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.checked).toBeTrue();
    fixture.componentInstance.checked = false;
    fixture.detectChanges();
    expect(control.checked).toBeFalse();
  });

  it('uses the form value, tracks blur, resets and honours disabled', () => {
    const fixture = TestBed.createComponent(SwitchHost);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const control: HTMLInputElement = fixture.nativeElement.querySelector('[aria-label="Уведомления"]');
    expect(control.checked).toBeTrue();
    expect(host.changes).toEqual([]);
    control.click();
    control.dispatchEvent(new Event('blur'));
    expect(host.control.value).toBeFalse();
    expect(host.control.touched).toBeTrue();
    expect(host.changes).toEqual([false]);
    host.control.reset({ value: true, disabled: true });
    fixture.detectChanges();
    expect(control.checked).toBeTrue();
    expect(control.disabled).toBeTrue();
    control.click();
    expect(host.changes).toEqual([false]);
  });
});
