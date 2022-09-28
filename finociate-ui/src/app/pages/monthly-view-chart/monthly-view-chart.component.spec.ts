import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyViewChartComponent } from './monthly-view-chart.component';

describe('MonthlyViewChartComponent', () => {
  let component: MonthlyViewChartComponent;
  let fixture: ComponentFixture<MonthlyViewChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyViewChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyViewChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
