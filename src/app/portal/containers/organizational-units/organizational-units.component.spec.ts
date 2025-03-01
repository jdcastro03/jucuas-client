import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationalUnitsComponent } from './organizational-units.component';

describe('OrganizationalUnitsComponent', () => {
  let component: OrganizationalUnitsComponent;
  let fixture: ComponentFixture<OrganizationalUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationalUnitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationalUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
