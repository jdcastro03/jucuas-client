import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalTokenComponent } from './portal-token.component';

describe('PortalTokenComponent', () => {
  let component: PortalTokenComponent;
  let fixture: ComponentFixture<PortalTokenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortalTokenComponent]
    });
    fixture = TestBed.createComponent(PortalTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
