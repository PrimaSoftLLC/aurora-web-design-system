import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';
import { contentSnippets } from './content-page.snippets';
import { DsButtonComponent, AuroraScopeDirective } from '@primasoftllc/design-system/angular';
import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleLayoutComponent } from '../../../shared/article-layout/article-layout.component';
import { ExampleBlockComponent } from '../../../shared/example-block/example-block.component';
import { SiteSettingsService } from '../../../site-settings.service';

@Component({
  selector: 'aurora-content-page',
  imports: [
    CodeBlockComponent,
    DsButtonComponent,
    AuroraScopeDirective,
    RouterLink,
    ArticleLayoutComponent,
    ExampleBlockComponent,
  ],
  templateUrl: './content-page.component.html',
  styleUrl: './content-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageComponent {
  protected readonly mode = signal<'empty' | 'search' | 'error'>('search');
  protected readonly situations = [
    { id: 'empty', label: 'Нет объектов' },
    { id: 'search', label: 'Ничего не найдено' },
    { id: 'error', label: 'Ошибка' },
  ] as const;
  protected readonly messages = {
    empty: ['Нет данных', 'Объектов пока нет', 'Добавьте первый объект, чтобы начать мониторинг.'],
    search: ['Нет данных', 'Объекты не найдены', 'Измените запрос или сбросьте фильтры.'],
    error: ['Произошла ошибка', 'Не удалось загрузить объекты', 'Повторите попытку.'],
  } as const;
  protected readonly example = computed(() => this.messages[this.mode()]);
  protected readonly snippets = contentSnippets;
  protected readonly settings = inject(SiteSettingsService);
}
