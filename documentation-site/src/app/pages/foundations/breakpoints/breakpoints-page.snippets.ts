import type { CodeSnippet } from '../../../shared/code-block/code-snippet';

export const breakpointsSnippets = {
  interactive: {
    language: 'typescript',
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DsButtonComponent } from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-breakpoints-example',
  imports: [DsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="layout-options" role="group" aria-label="Компоновка примера">
      <button
        dsButton
        [tone]="layout() === 'narrow' ? 'subtle' : 'secondary'"
        [attr.aria-pressed]="layout() === 'narrow'"
        (click)="layout.set('narrow')">
        Одна колонка
      </button>
      <button
        dsButton
        [tone]="layout() === 'wide' ? 'subtle' : 'secondary'"
        [attr.aria-pressed]="layout() === 'wide'"
        (click)="layout.set('wide')">
        Две колонки
      </button>
    </div>
    <div class="scene" id="responsive-example" [attr.data-layout]="layout()">
      <div class="workspace" [attr.data-layout]="layout()">
        <div class="object-list">
          <h3>Объекты</h3>
          <div role="group" aria-label="Выбор объекта">
            @for (name of objects; track name) {
              <button
                dsButton
                fullWidth
                [tone]="selected() === name ? 'subtle' : 'secondary'"
                [attr.aria-pressed]="selected() === name"
                (click)="selectObject(name)">
                {{ name }}
              </button>
            }
          </div>
        </div>
        <div class="object-details">
          <h3>{{ selected() }}</h3>
          <p>
            {{ selected() === 'МАЗ 5440' ? 'Маршрут Минск — Брест.' : 'Маршрут Минск — Гродно.' }}
          </p>
          <div>
            <button
              dsButton
              tone="secondary"
              (click)="message.set('Данные ' + selected() + ' обновлены.')">
              Обновить
            </button>
          </div>
          <p role="status" class="caption">{{ message() || 'Последнее сообщение — 14:32' }}</p>
        </div>
      </div>
    </div>
  \`,
  styleUrl: './layout-example.css',
})
export class ResponsiveLayoutComponent {
  protected readonly layout = signal<'narrow' | 'wide'>('narrow');
  protected readonly selected = signal('МАЗ 5440');
  protected readonly message = signal('');
  protected readonly objects = ['МАЗ 5440', 'Volvo FH16'];
  protected selectObject(name: string): void {
    this.selected.set(name);
    this.message.set('');
  }
}
`,
  },

  workspace: {
    language: 'css',
    fileName: 'workspace.css',
    code: `@import '@primasoftllc/design-system/styles.css';

.workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--ds-gap-md);
}

.object-list,
.object-details {
  min-width: 0;
  overflow-wrap: anywhere;
}

@media (min-width: 960px) {
  .workspace {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
`,
  },
  interactiveLayoutStyles: {
    language: 'css',
    fileName: 'layout-example.css',
    code: `.layout-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.scene {
  container-type: inline-size;
  padding: 24px;
  background: var(--ds-bg);
  color: var(--ds-fg);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
}
.scene[data-layout='narrow'] {
  max-width: 390px;
  box-sizing: border-box;
}
.workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--ds-gap-md);
}
.workspace[data-layout='wide'] {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
@container (max-width: 279px) {
  .workspace[data-layout='wide'] {
    grid-template-columns: minmax(0, 1fr);
  }
}
.object-list,
.object-details {
  box-sizing: border-box;
  min-width: 0;
  overflow-wrap: anywhere;
  padding: var(--ds-pad-md);
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
}
.object-list > div {
  display: grid;
  gap: var(--ds-gap-sm);
}
.object-details {
  display: grid;
  align-content: start;
  gap: var(--ds-gap-md);
}
.object-list h3,
.object-details h3 {
  font: var(--ds-type-section);
  color: var(--ds-fg-strong);
  margin: 0 0 12px;
}
.object-details h3,
.object-details p {
  margin: 0;
}
.object-details p {
  font: var(--ds-type-body);
}
.object-details .caption {
  font: var(--ds-type-caption);
  color: var(--ds-fg-muted);
}
@media (max-width: 640px) {
  .scene {
    padding: 16px;
  }
}
`,
  },
} satisfies Record<string, CodeSnippet>;
