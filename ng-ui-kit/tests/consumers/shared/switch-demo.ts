import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DsSwitchComponent } from '@primasoftllc/design-system/angular';

@Component({
  selector: 'switch-demo',
  imports: [DsSwitchComponent, ReactiveFormsModule],
  template: `
    <ds-switch label="Треки" labelPosition="left" [(checked)]="tracks"></ds-switch>
    <output id="switch-tracks">{{ tracks }}</output>
    <ds-switch label="Уведомления" [formControl]="notifications"></ds-switch>
    <button id="switch-disable" (click)="notifications.disable()">Запретить</button>
  `,
})
export class SwitchDemo {
  tracks = false;
  readonly notifications = new FormControl(true, { nonNullable: true });
}
