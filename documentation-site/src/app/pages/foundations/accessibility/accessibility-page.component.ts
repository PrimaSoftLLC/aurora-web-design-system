import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';
import { accessibilitySnippets } from './accessibility-page.snippets';
import {
  AuroraScopeDirective,
  DsFormFieldComponent,
  DsInputDirective,
  DsButtonComponent,
  DsErrorDirective,
} from '@primasoftllc/design-system/angular';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleLayoutComponent } from '../../../shared/article-layout/article-layout.component';
import { ExampleBlockComponent } from '../../../shared/example-block/example-block.component';
import { SiteSettingsService } from '../../../site-settings.service';

@Component({
  selector: 'aurora-accessibility-page',
  imports: [
    DsErrorDirective,
    CodeBlockComponent,
    AuroraScopeDirective,
    DsFormFieldComponent,
    DsInputDirective,
    DsButtonComponent,
    RouterLink,
    ArticleLayoutComponent,
    ExampleBlockComponent,
  ],
  templateUrl: './accessibility-page.component.html',
  styleUrl: './accessibility-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessibilityPageComponent {
  protected readonly name = signal('МАЗ 5440');
  protected readonly message = signal('');
  protected readonly touched = signal(false);

  protected save(event: Event): void {
    event.preventDefault();
    this.touched.set(true);
    if (!this.name().trim()) {
      this.message.set('Заполните обязательное поле.');
      return;
    }
    this.message.set('Название «' + this.name().trim() + '» сохранено в примере.');
  }
  protected readonly snippets = accessibilitySnippets;
  protected readonly settings = inject(SiteSettingsService);
}
