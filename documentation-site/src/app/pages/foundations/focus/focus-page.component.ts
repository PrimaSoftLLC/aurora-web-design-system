import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';
import { focusSnippets } from './focus-page.snippets';
import {
  AuroraScopeDirective,
  DsFormFieldComponent,
  DsInputDirective,
  DsButtonComponent,
  DsCheckboxComponent,
} from '@primasoftllc/design-system/angular';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleLayoutComponent } from '../../../shared/article-layout/article-layout.component';
import { ExampleBlockComponent } from '../../../shared/example-block/example-block.component';
import { SiteSettingsService } from '../../../site-settings.service';

@Component({
  selector: 'aurora-focus-page',
  imports: [
    CodeBlockComponent,
    AuroraScopeDirective,
    DsFormFieldComponent,
    DsInputDirective,
    DsButtonComponent,
    DsCheckboxComponent,
    RouterLink,
    ArticleLayoutComponent,
    ExampleBlockComponent,
  ],
  templateUrl: './focus-page.component.html',
  styleUrl: './focus-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FocusPageComponent {
  protected readonly name = signal('МАЗ 5440');
  protected readonly checked = signal(false);
  protected readonly message = signal('Изменения ещё не сохранены.');
  protected reset(): void {
    this.name.set('МАЗ 5440');
    this.checked.set(false);
    this.message.set('Изменения отменены.');
  }
  protected readonly snippets = focusSnippets;
  protected readonly settings = inject(SiteSettingsService);
}
