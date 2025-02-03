import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentersModalComponent } from './presenters-modal.component';

describe('PresentersModalComponent', () => {
  let component: PresentersModalComponent;
  let fixture: ComponentFixture<PresentersModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PresentersModalComponent]
    });
    fixture = TestBed.createComponent(PresentersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
