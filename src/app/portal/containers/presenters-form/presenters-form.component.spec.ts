import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentersFormComponent } from './presenters-form.component';

describe('PresentersFormComponent', () => {
  let component: PresentersFormComponent;
  let fixture: ComponentFixture<PresentersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentersFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
