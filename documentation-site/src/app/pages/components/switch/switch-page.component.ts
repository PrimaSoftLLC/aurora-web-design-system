import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  AuroraScopeDirective,
  DsButtonComponent,
  DsSwitchComponent,
} from '@primasoftllc/design-system/angular';
import { ArticleLayoutComponent } from '../../../shared/article-layout/article-layout.component';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';
import { ExampleBlockComponent } from '../../../shared/example-block/example-block.component';
import { SiteSettingsService } from '../../../site-settings.service';
import { switchSnippets } from './switch-page.snippets';

@Component({
  selector: 'aurora-switch-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ArticleLayoutComponent,
    CodeBlockComponent,
    ExampleBlockComponent,
    AuroraScopeDirective,
    DsButtonComponent,
    DsSwitchComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './switch-page.component.html',
  styleUrl: './switch-page.component.scss',
})
export class SwitchPageComponent {
  protected readonly settings = inject(SiteSettingsService);
  protected readonly snippets = switchSnippets;
  showTracks = false;
  autoRefresh = true;
  readonly notifications = new FormControl(true, { nonNullable: true });

  reset(): void {
    this.notifications.reset({ value: true, disabled: false });
  }

  toggleDisabled(): void {
    if (this.notifications.disabled) this.notifications.enable();
    else this.notifications.disable();
  }
}
