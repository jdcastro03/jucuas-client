import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeEvidencesComponent } from './type-evidences.component';

describe('TypeEvidencesComponent', () => {
  let component: TypeEvidencesComponent;
  let fixture: ComponentFixture<TypeEvidencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeEvidencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeEvidencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
