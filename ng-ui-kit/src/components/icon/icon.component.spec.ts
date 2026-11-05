import { TestBed } from '@angular/core/testing';
import { DsIconComponent } from './icon.component';

describe('DsIconComponent', () => {
  it('switches between decorative and labelled modes without restricting glyph names', () => {
    const fixture = TestBed.createComponent(DsIconComponent);
    const icon: HTMLElement = fixture.nativeElement;
    fixture.componentRef.setInput('name', 'project_specific_glyph');
    fixture.detectChanges();
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.textContent?.trim()).toBe('project_specific_glyph');
    fixture.componentRef.setInput('label', '  Поиск  ');
    fixture.detectChanges();
    expect(icon.getAttribute('role')).toBe('img');
    expect(icon.getAttribute('aria-label')).toBe('Поиск');
    fixture.componentRef.setInput('label', '   ');
    fixture.componentRef.setInput('rotate', 90);
    fixture.componentRef.setInput('name', 'navigation');
    fixture.detectChanges();
    expect(icon.getAttribute('role')).toBeNull();
    expect(icon.style.transform).toBe('rotate(90deg)');
    expect(icon.getAttribute('data-ds-icon-nudge')).toBe('navigation');
  });
});
