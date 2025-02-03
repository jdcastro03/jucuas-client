import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewersFormComponent } from './reviewers-form.component';

describe('ReviewersFormComponent', () => {
  let component: ReviewersFormComponent;
  let fixture: ComponentFixture<ReviewersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewersFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
