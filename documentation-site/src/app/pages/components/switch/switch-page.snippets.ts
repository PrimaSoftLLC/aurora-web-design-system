import type { CodeSnippet } from '../../../shared/code-block/code-snippet';

export const switchSnippets = {
  basic: {
    language: 'typescript',
    code: `import { Component } from '@angular/core';
import { DsSwitchComponent } from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-switch-example',
  imports: [DsSwitchComponent],
  template: \`<ds-switch label="Показывать треки" [(checked)]="showTracks"></ds-switch>
<ds-switch label="Автообновление" description="Обновлять список каждую минуту"
  labelPosition="left" [(checked)]="autoRefresh"></ds-switch>\`,
})
export class SwitchExampleComponent {
  showTracks = false;
  autoRefresh = true;
}`,
  },
  forms: {
    language: 'typescript',
    code: `import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DsSwitchComponent, DsButtonComponent } from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-switch-example',
  imports: [DsSwitchComponent, DsButtonComponent, ReactiveFormsModule],
  template: \`<ds-switch label="Уведомления" [formControl]="notifications"></ds-switch>
<button dsButton (click)="reset()">Сбросить</button>
<button dsButton (click)="toggleDisabled()">
  {{ notifications.disabled ? 'Разрешить' : 'Запретить' }}
</button>\`,
})
export class SwitchExampleComponent {
  readonly notifications = new FormControl(true, { nonNullable: true });

  reset(): void {
    this.notifications.reset({ value: true, disabled: false });
  }

  toggleDisabled(): void {
    if (this.notifications.disabled) this.notifications.enable();
    else this.notifications.disable();
  }
}`,
  },
  states: {
    language: 'typescript',
    code: `import { Component } from '@angular/core';
import { DsSwitchComponent } from '@primasoftllc/design-system/angular';

@Component({
  selector: 'app-switch-example',
  imports: [DsSwitchComponent],
  template: \`<ds-switch label="Включено" checked disabled></ds-switch>
<ds-switch label="Выключено" disabled></ds-switch>\`,
})
export class SwitchExampleComponent {

}`,
  },
} satisfies Record<string, CodeSnippet>;
