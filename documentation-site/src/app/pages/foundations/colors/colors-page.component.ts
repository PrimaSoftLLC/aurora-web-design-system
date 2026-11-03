import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';
import { colorsSnippets } from './colors-page.snippets';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ElementRef,
  afterRenderEffect,
  signal,
  viewChild,
} from '@angular/core';
import {
  DsCheckboxComponent,
  AuroraScopeDirective,
  DsFormFieldComponent,
  DsInputDirective,
  DsButtonComponent,
} from '@primasoftllc/design-system/angular';
import { RouterLink } from '@angular/router';
import { neutralPalette } from '../../../data/reference-samples';
import { ArticleLayoutComponent } from '../../../shared/article-layout/article-layout.component';
import { ExampleBlockComponent } from '../../../shared/example-block/example-block.component';
import { SiteSettingsService } from '../../../site-settings.service';

@Component({
  selector: 'aurora-colors-page',
  imports: [
    CodeBlockComponent,
    DsButtonComponent,
    AuroraScopeDirective,
    DsFormFieldComponent,
    DsInputDirective,
    DsCheckboxComponent,
    RouterLink,
    ArticleLayoutComponent,
    ExampleBlockComponent,
  ],
  templateUrl: './colors-page.component.html',
  styleUrl: './colors-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NeutralColorsPageComponent {
  protected readonly selected = signal(false);
  // Demo feedback only; DsButton owns hover/pressed rendering and keyboard activation.
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
  protected readonly showTracks = signal(false);
  protected readonly neutralPalette = neutralPalette;
  protected readonly snippets = colorsSnippets;
  protected readonly settings = inject(SiteSettingsService);
  private readonly colorProbe = viewChild.required<ElementRef<HTMLElement>>('colorProbe');
  protected readonly contrastRows = signal<
    {
      token: string;
      cells: { background: string; label: string; passes: boolean }[];
    }[]
  >([]);

  constructor() {
    afterRenderEffect(() => {
      this.settings.theme();
      this.settings.appearance();
      this.settings.density();
      const probe = this.colorProbe().nativeElement;
      const luminance = (token: string) => {
        probe.style.color = `var(--ds-${token})`;
        const channels = getComputedStyle(probe)
          .color.match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number);
        const linear = channels.map((channel) => {
          const value = channel / 255;
          return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
      };
      this.contrastRows.set(
        ['fg-strong', 'fg', 'fg-muted', 'fg-subtle'].map((token) => ({
          token,
          cells: ['bg', 'surface', 'surface-raised'].map((background) => {
            const a = luminance(token),
              b = luminance(background);
            const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
            return {
              background,
              label: ratio.toFixed(2).replace('.', ',') + ':1',
              passes: ratio >= 4.5,
            };
          }),
        })),
      );
    });
  }
}
