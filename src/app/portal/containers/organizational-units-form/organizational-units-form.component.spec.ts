import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationalUnitsFormComponent } from './organizational-units-form.component';

describe('OrganizationalUnitsFormComponent', () => {
  let component: OrganizationalUnitsFormComponent;
  let fixture: ComponentFixture<OrganizationalUnitsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationalUnitsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationalUnitsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
