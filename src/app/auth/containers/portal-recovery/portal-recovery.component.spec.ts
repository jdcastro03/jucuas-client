import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalRecoveryComponent } from './portal-recovery.component';

describe('PortalRecoveryComponent', () => {
  let component: PortalRecoveryComponent;
  let fixture: ComponentFixture<PortalRecoveryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortalRecoveryComponent]
    });
    fixture = TestBed.createComponent(PortalRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
