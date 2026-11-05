import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DsSpinnerComponent } from './spinner.component';

describe('DsSpinnerComponent', () => {
  for (const [size, expected] of [
    [0, 20],
    [-1, 20],
    [Infinity, 20],
    [NaN, 20],
    [1, 1],
    [48, 48],
  ]) {
    it('normalizes size ' + size, () => {
      const fixture = TestBed.createComponent(DsSpinnerComponent);
      fixture.componentRef.setInput('label', 'Загрузка');
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();
      const spinner: HTMLElement = fixture.nativeElement;
      const ring = spinner.querySelector<HTMLElement>('[data-ds-spinner-ring]');
      expect(spinner.style.width).toBe(expected + 'px');
      expect(ring?.style.borderWidth).toBe(
        Math.min(expected / 2, Math.max(2, Math.round(expected / 9))) + 'px',
      );
    });
  }

  it('restarts waiting only on delay changes and cancels the timer on destroy', fakeAsync(() => {
    const fixture = TestBed.createComponent(DsSpinnerComponent);
    const spinner: HTMLElement = fixture.nativeElement;
    const ring = () => spinner.querySelector('[data-ds-spinner-ring]');
    fixture.componentRef.setInput('label', 'Загрузка');
    fixture.componentRef.setInput('delay', 100);
    fixture.detectChanges();
    expect(ring()).toBeNull();
    expect(spinner.getAttribute('role')).toBeNull();
    tick(50);
    fixture.componentRef.setInput('size', 32);
    fixture.componentRef.setInput('tone', 'muted');
    fixture.componentRef.setInput('label', 'Обновление');
    fixture.detectChanges();
    tick(50);
    fixture.detectChanges();
    expect(ring()).not.toBeNull();
    expect(spinner.getAttribute('aria-label')).toBe('Обновление');
    fixture.componentRef.setInput('delay', 200);
    fixture.detectChanges();
    tick(100);
    fixture.componentRef.setInput('delay', 300);
    fixture.detectChanges();
    tick(200);
    fixture.detectChanges();
    expect(ring()).toBeNull();
    tick(100);
    fixture.detectChanges();
    expect(ring()).not.toBeNull();
    const clearTimer = spyOn(window, 'clearTimeout').and.callThrough();
    fixture.componentRef.setInput('delay', 400);
    fixture.detectChanges();
    clearTimer.calls.reset();
    fixture.destroy();
    expect(clearTimer).toHaveBeenCalled();
    tick(400);
  }));

  for (const delay of [0, -1, Infinity, NaN]) {
    it('shows immediately for invalid/zero delay ' + delay, () => {
      const fixture = TestBed.createComponent(DsSpinnerComponent);
      fixture.componentRef.setInput('label', 'Загрузка');
      fixture.componentRef.setInput('delay', delay);
      fixture.detectChanges();
      const spinner: HTMLElement = fixture.nativeElement;
      expect(spinner.getAttribute('role')).toBe('status');
      expect(spinner.querySelector('[data-ds-spinner-ring]')).not.toBeNull();
    });
  }
});
