import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyselfComponent } from './profile.component';

describe('MyselfComponent', () => {
  let component: MyselfComponent;
  let fixture: ComponentFixture<MyselfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyselfComponent]
    });
    fixture = TestBed.createComponent(MyselfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
