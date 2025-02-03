import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversitiesFormComponent } from './universities-form.component';

describe('UniversitiesFormComponent', () => {
  let component: UniversitiesFormComponent;
  let fixture: ComponentFixture<UniversitiesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversitiesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversitiesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
