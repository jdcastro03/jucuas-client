import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepresentativesFormComponent } from './representatives-form.component';

describe('RepresentativesFormComponent', () => {
  let component: RepresentativesFormComponent;
  let fixture: ComponentFixture<RepresentativesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepresentativesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepresentativesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
