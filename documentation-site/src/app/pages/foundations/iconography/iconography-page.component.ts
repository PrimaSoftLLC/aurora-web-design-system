import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';
import { iconographySnippets } from './iconography-page.snippets';
import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  DsIconComponent,
  DsButtonComponent,
  DsFormFieldComponent,
  DsInputDirective,
  DsPrefixDirective,
  AuroraScopeDirective,
} from '@primasoftllc/design-system/angular';
import { iconDictionary, iconSizes } from '../../../data/iconography';
import { ArticleLayoutComponent } from '../../../shared/article-layout/article-layout.component';
import { ExampleBlockComponent } from '../../../shared/example-block/example-block.component';
import { SiteSettingsService } from '../../../site-settings.service';

@Component({
  selector: 'aurora-iconography-page',
  imports: [
    CodeBlockComponent,
    DsFormFieldComponent,
    DsInputDirective,
    DsPrefixDirective,
    AuroraScopeDirective,
    RouterLink,
    ArticleLayoutComponent,
    ExampleBlockComponent,
    DsIconComponent,
    DsButtonComponent,
  ],
  templateUrl: './iconography-page.component.html',
  styleUrl: './iconography-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconographyPageComponent {
  protected readonly settingsOpen = signal(false);
  protected readonly removedCorrectly = signal(false);
  protected readonly removedIncorrectly = signal(false);
  protected readonly objectQuery = signal('');
  protected readonly objectCount = signal(1);
  protected readonly dictionaryQuery = signal('');
  protected readonly icons = computed(() => {
    const query = this.dictionaryQuery().trim().toLocaleLowerCase('ru');
    return iconDictionary.filter((icon) =>
      (icon.name + ' ' + icon.label).toLocaleLowerCase('ru').includes(query),
    );
  });
  protected readonly sizes = iconSizes;
  protected readonly snippets = iconographySnippets;
  protected readonly settings = inject(SiteSettingsService);
}
