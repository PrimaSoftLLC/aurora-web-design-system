import { DsButtonComponent, AuroraScopeDirective } from '@primasoftllc/design-system/angular';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleLayoutComponent } from '../../../shared/article-layout/article-layout.component';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';
import { ExampleBlockComponent } from '../../../shared/example-block/example-block.component';
import { SiteSettingsService } from '../../../site-settings.service';
import { breakpointsSnippets } from './breakpoints-page.snippets';

@Component({
  selector: 'aurora-breakpoints-page',
  imports: [
    DsButtonComponent,
    AuroraScopeDirective,
    RouterLink,
    ArticleLayoutComponent,
    ExampleBlockComponent,
    CodeBlockComponent,
  ],
  templateUrl: './breakpoints-page.component.html',
  styleUrl: './breakpoints-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreakpointsPageComponent {
  protected readonly layout = signal<'narrow' | 'wide'>('narrow');
  protected readonly selected = signal('МАЗ 5440');
  protected readonly message = signal('');
  protected readonly objects = ['МАЗ 5440', 'Volvo FH16'];
  protected selectObject(name: string): void {
    this.selected.set(name);
    this.message.set('');
  }
  protected readonly snippets = breakpointsSnippets;
  protected readonly settings = inject(SiteSettingsService);
}
