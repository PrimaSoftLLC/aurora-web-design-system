import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DsButtonComponent, DsSwitchComponent } from '@primasoftllc/design-system/angular';
import { RouterLink } from '@angular/router';
import { ArticleLayoutComponent } from '../../../shared/article-layout/article-layout.component';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';
import { ExampleBlockComponent } from '../../../shared/example-block/example-block.component';
import { SiteSettingsService } from '../../../site-settings.service';
import { layoutSnippets } from './layout-page.snippets';

@Component({
  selector: 'aurora-layout-page',
  imports: [
    RouterLink,
    ArticleLayoutComponent,
    ExampleBlockComponent,
    CodeBlockComponent,
    DsButtonComponent,
    DsSwitchComponent,
  ],
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutPageComponent {
  protected readonly showGuides = signal(false);
  protected readonly snippets = layoutSnippets;
  protected readonly settings = inject(SiteSettingsService);
}
