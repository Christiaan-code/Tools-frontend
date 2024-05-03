import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerButtonComponent } from './power-button.component';

describe('PowerButtonComponent', () => {
  let component: PowerButtonComponent;
  let fixture: ComponentFixture<PowerButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PowerButtonComponent]
    });
    fixture = TestBed.createComponent(PowerButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
