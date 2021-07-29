import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPlotComponent } from './data-plot.component';

describe('DatePlotComponent', () => {
  let component: DataPlotComponent;
  let fixture: ComponentFixture<DataPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataPlotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
