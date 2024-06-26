import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMonitorComponent } from './table-monitor.component';

describe('TableMonitorComponent', () => {
  let component: TableMonitorComponent;
  let fixture: ComponentFixture<TableMonitorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableMonitorComponent]
    });
    fixture = TestBed.createComponent(TableMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
