import { ComponentFixture, fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { CodeBlockComponent } from './code-block.component';

describe('CodeBlockComponent', () => {
  let fixture: ComponentFixture<CodeBlockComponent>;
  let clipboardDescriptor: PropertyDescriptor | undefined;

  beforeEach(() => {
    clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    fixture = TestBed.createComponent(CodeBlockComponent);
  });

  afterEach(() => {
    if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
    else Reflect.deleteProperty(navigator, 'clipboard');
  });

  it('renders source as text and switches to a closed disclosure with a file name', () => {
    fixture.componentRef.setInput('snippet', {
      code: '<script>alert(1)</script>',
      language: 'text',
    });
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('script')).toBeNull();
    expect(element.querySelector('code')?.textContent).toBe('<script>alert(1)</script>');
    expect(element.querySelector('details')).toBeNull();
    fixture.componentRef.setInput('collapsible', true);
    fixture.componentRef.setInput('snippet', {
      code: 'const a = 1;',
      language: 'typescript',
      fileName: 'demo.ts',
    });
    fixture.detectChanges();
    expect(element.querySelector('.language')?.textContent).toBe('demo.ts');
    expect(element.querySelector('details')?.open).toBeFalse();
  });

  it('copies the original source and releases its busy state', fakeAsync(() => {
    const text = '  first\n    second';
    const writeText = jasmine.createSpy('writeText').and.resolveTo();
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    fixture.componentRef.setInput('snippet', { code: text, language: 'text' });
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    element.querySelector('button')?.click();
    flushMicrotasks();
    fixture.detectChanges();
    expect(writeText).toHaveBeenCalledOnceWith(text);
    expect(element.querySelector('button')?.disabled).toBeFalse();
    expect(element.querySelector('[role="status"]')?.textContent).toBe('Скопировано');
  }));

  it('selects source for manual copying when clipboard is unavailable', fakeAsync(() => {
    const writeText = jasmine.createSpy('writeText').and.rejectWith(new Error('denied'));
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    fixture.componentRef.setInput('snippet', { code: 'manual source', language: 'text' });
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    element.querySelector('button')?.click();
    flushMicrotasks();
    fixture.detectChanges();
    expect(window.getSelection()?.toString()).toBe('manual source');
    expect(element.querySelector('[role="status"]')?.textContent).toContain('вручную');
  }));
});
