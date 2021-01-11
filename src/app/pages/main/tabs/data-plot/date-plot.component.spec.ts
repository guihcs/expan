import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePlotComponent } from './date-plot.component';

describe('DatePlotComponent', () => {
  let component: DatePlotComponent;
  let fixture: ComponentFixture<DatePlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatePlotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
