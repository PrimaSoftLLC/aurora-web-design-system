import type { CodeSnippet } from '../../../shared/code-block/code-snippet';

export const colorsSnippets = {
  interaction: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DsButtonComponent } from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-colors-example',
  imports: [DsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="interaction-buttons">
      <button
        dsButton
        [tone]="selected() ? 'subtle' : 'secondary'"
        [attr.aria-pressed]="selected()"
        [icon]="selected() ? 'check' : undefined"
        [style.background-color]="selected() ? 'var(--ds-surface-selected)' : null"
        (click)="selected.set(!selected())"
        (focus)="focused.set(true)"
        (blur)="blur()"
        (pointerenter)="enter($event)"
        (pointerleave)="leave()"
        (pointerdown)="phase.set('Нажатие')"
        (pointerup)="release($event)"
        (pointercancel)="leave()"
        (keydown)="keyDown($event)"
        (keyup)="keyUp($event)">
        МАЗ 5440
      </button>
      <button dsButton disabled>Недоступный объект</button>
    </div>
    <p class="interaction-status" id="interaction-status" role="status">
      {{ selected() ? 'Выбран' : 'Не выбран' }} · {{ phase()
      }}{{ focused() ? ' · Фокус с клавиатуры или указателя' : '' }}
    </p>
  \`,
  styles: \`
    .interaction-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin: 20px 0;
    }
    .interaction-status {
      font: var(--ds-type-body-strong);
      margin-bottom: 12px;
    }
  \`,
})
export class SelectionAndFocusComponent {
  protected readonly selected = signal(false);
  protected readonly phase = signal('Обычное');
  protected readonly focused = signal(false);
  protected enter(event: PointerEvent): void {
    if (event.pointerType === 'mouse') this.phase.set('Наведение');
  }
  protected release(event: PointerEvent): void {
    this.phase.set(event.pointerType === 'mouse' ? 'Наведение' : 'Обычное');
  }
  protected leave(): void {
    this.phase.set('Обычное');
  }
  protected blur(): void {
    this.focused.set(false);
    this.leave();
  }
  protected keyDown(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') this.phase.set('Нажатие');
  }
  protected keyUp(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') this.leave();
  }
}
`,
  },
} satisfies Record<string, CodeSnippet>;
