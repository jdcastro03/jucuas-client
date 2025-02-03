import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeActivitiesFormComponent } from './type-activities-form.component';

describe('TypeActivitiesFormComponent', () => {
  let component: TypeActivitiesFormComponent;
  let fixture: ComponentFixture<TypeActivitiesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeActivitiesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeActivitiesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
