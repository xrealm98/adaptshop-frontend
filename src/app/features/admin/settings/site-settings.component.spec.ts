import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteSettingsComponent } from './site-settings.component';

describe('SiteSettingsComponent', () => {
  let component: SiteSettingsComponent;
  let fixture: ComponentFixture<SiteSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteSettingsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
