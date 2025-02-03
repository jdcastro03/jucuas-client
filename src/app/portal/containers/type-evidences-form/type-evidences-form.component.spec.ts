import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeEvidencesFormComponent } from './type-evidences-form.component';

describe('TypeEvidencesFormComponent', () => {
  let component: TypeEvidencesFormComponent;
  let fixture: ComponentFixture<TypeEvidencesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeEvidencesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeEvidencesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
