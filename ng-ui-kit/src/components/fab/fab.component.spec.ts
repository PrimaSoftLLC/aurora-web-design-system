import { TestBed } from '@angular/core/testing';
import { DsFabComponent } from './fab.component';

describe('DsFabComponent', () => {
  it('preserves native focusability and restores ARIA after loading', () => {
    const fixture = TestBed.createComponent(DsFabComponent);
    const button: HTMLButtonElement = fixture.nativeElement;
    fixture.componentRef.setInput('label', 'Создать');
    fixture.componentRef.setInput('aria-busy', 'false');
    fixture.componentRef.setInput('aria-disabled', 'false');
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.disabled).toBeFalse();
    expect(button.querySelector('ds-spinner')).not.toBeNull();
    expect(button.querySelector('ds-spinner')?.closest('[aria-hidden="true"]')).not.toBeNull();
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
    expect(button.getAttribute('aria-busy')).toBe('false');
    expect(button.getAttribute('aria-disabled')).toBe('false');
    expect(button.querySelector('ds-spinner')).toBeNull();
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(button.disabled).toBeTrue();
  });
});
