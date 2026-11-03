import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';
import { densitySnippets } from './density-page.snippets';
import {
  AuroraScopeDirective,
  DsFormFieldComponent,
  DsInputDirective,
  DsButtonComponent,
} from '@primasoftllc/design-system/angular';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleLayoutComponent } from '../../../shared/article-layout/article-layout.component';
import { ExampleBlockComponent } from '../../../shared/example-block/example-block.component';
import { SiteSettingsService } from '../../../site-settings.service';

@Component({
  selector: 'aurora-density-page',
  imports: [
    CodeBlockComponent,
    AuroraScopeDirective,
    DsFormFieldComponent,
    DsInputDirective,
    DsButtonComponent,
    RouterLink,
    ArticleLayoutComponent,
    ExampleBlockComponent,
  ],
  templateUrl: './density-page.component.html',
  styleUrl: './density-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DensityPageComponent {
  protected readonly snippets = densitySnippets;
  protected readonly settings = inject(SiteSettingsService);
}
