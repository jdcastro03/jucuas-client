import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalAttendeesFormComponent } from './total-attendees-form.component';

describe('TotalAttendeesFormComponent', () => {
  let component: TotalAttendeesFormComponent;
  let fixture: ComponentFixture<TotalAttendeesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalAttendeesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalAttendeesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
