import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityManagersFormComponent } from './activity-managers-form.component';

describe('ActivityManagersFormComponent', () => {
  let component: ActivityManagersFormComponent;
  let fixture: ComponentFixture<ActivityManagersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityManagersFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityManagersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
