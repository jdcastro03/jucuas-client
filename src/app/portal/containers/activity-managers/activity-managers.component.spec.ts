import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityManagersComponent } from './activity-managers.component';

describe('ActivityManagersComponent', () => {
  let component: ActivityManagersComponent;
  let fixture: ComponentFixture<ActivityManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityManagersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
