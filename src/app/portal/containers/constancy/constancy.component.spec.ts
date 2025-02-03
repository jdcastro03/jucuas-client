import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstancyComponent } from './constancy.component';

describe('ConstancyComponent', () => {
  let component: ConstancyComponent;
  let fixture: ComponentFixture<ConstancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstancyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
