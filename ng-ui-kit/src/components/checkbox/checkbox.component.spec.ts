import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsCheckboxComponent } from './checkbox.component';

describe('DsCheckboxComponent', () => {
  let fixture: ComponentFixture<DsCheckboxComponent>;
  let input: HTMLInputElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(DsCheckboxComponent);
    fixture.componentRef.setInput('label', 'Выбор');
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  for (const checked of [false, true]) {
    it('selects true from mixed state with checked=' + checked, () => {
      fixture.componentRef.setInput('checked', checked);
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      const values: boolean[] = [];
      const mixed: boolean[] = [];
      fixture.componentInstance.checkedChange.subscribe((value) => values.push(value));
      fixture.componentInstance.indeterminateChange.subscribe((value) => mixed.push(value));
      input.click();
      fixture.detectChanges();
      expect(input.checked).toBeTrue();
      expect(input.indeterminate).toBeFalse();
      expect(values).toEqual([true]);
      expect(mixed).toEqual([false]);
    });
  }

  it('keeps CVA writes silent and reports user changes and blur', () => {
    const component = fixture.componentInstance;
    const values: boolean[] = [];
    const outputs: boolean[] = [];
    const touched = jasmine.createSpy('onTouched');
    component.registerOnChange((value: boolean) => values.push(value));
    component.registerOnTouched(touched);
    component.checkedChange.subscribe((value) => outputs.push(value));
    for (const value of [true, false, null, 'true', undefined]) {
      component.writeValue(value);
      fixture.detectChanges();
      expect(input.checked).toBe(value === true);
    }
    expect(values).toEqual([]);
    expect(outputs).toEqual([]);
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();
    expect(input.checked).toBeFalse(); // Forms own the value once attached.
    input.click();
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(values).toEqual([true]);
    expect(outputs).toEqual([true]);
    expect(touched).toHaveBeenCalledTimes(1);
  });

  it('combines form/input disabled and retains external description IDs', () => {
    fixture.componentRef.setInput('description', 'Описание');
    fixture.componentRef.setInput('aria-describedby', 'external');
    fixture.detectChanges();
    expect(input.getAttribute('aria-describedby')).toMatch(
      /^external ds-checkbox-\d+-description$/,
    );
    fixture.componentInstance.setDisabledState(true);
    fixture.detectChanges();
    expect(input.disabled).toBeTrue();
    fixture.componentRef.setInput('disabled', true);
    fixture.componentInstance.setDisabledState(false);
    fixture.detectChanges();
    expect(input.disabled).toBeTrue();
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();
    expect(input.disabled).toBeFalse();
  });
});
