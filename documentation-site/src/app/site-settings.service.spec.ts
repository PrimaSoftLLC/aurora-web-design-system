import { TestBed } from '@angular/core/testing';
import { SiteSettingsService } from './site-settings.service';

describe('SiteSettingsService', () => {
  it('reflects demonstration settings in query parameters', () => {
    const settings = TestBed.inject(SiteSettingsService);
    expect(settings.queryParams()).toEqual({
      theme: 'DEFAULT',
      appearance: 'light',
      density: 'cozy',
    });
    settings.theme.set('RED2');
    settings.appearance.set('dark');
    settings.density.set('compact');
    expect(settings.queryParams()).toEqual({
      theme: 'RED2',
      appearance: 'dark',
      density: 'compact',
    });
  });
});
