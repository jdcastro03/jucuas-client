import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeActivitiesComponent } from './type-activities.component';

describe('TypeActivitiesComponent', () => {
  let component: TypeActivitiesComponent;
  let fixture: ComponentFixture<TypeActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeActivitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
