import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidencesFormComponent } from './evidences-form.component';

describe('EvidencesFormComponent', () => {
  let component: EvidencesFormComponent;
  let fixture: ComponentFixture<EvidencesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvidencesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidencesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
