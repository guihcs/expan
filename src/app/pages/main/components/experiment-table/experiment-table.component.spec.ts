import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentTableComponent } from './experiment-table.component';

describe('ExperimentTableComponent', () => {
  let component: ExperimentTableComponent;
  let fixture: ComponentFixture<ExperimentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
