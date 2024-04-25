import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterMonitorComponent } from './filter-monitor.component';

describe('FilterMonitorComponent', () => {
  let component: FilterMonitorComponent;
  let fixture: ComponentFixture<FilterMonitorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FilterMonitorComponent]
    });
    fixture = TestBed.createComponent(FilterMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
