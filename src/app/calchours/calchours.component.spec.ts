import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalchoursComponent } from './calchours.component';

describe('CalchoursComponent', () => {
  let component: CalchoursComponent;
  let fixture: ComponentFixture<CalchoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalchoursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalchoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
