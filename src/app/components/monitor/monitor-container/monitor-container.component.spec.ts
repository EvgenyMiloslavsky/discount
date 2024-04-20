import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorContainerComponent } from './monitor-container.component';

describe('MonitorContainerComponent', () => {
  let component: MonitorContainerComponent;
  let fixture: ComponentFixture<MonitorContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MonitorContainerComponent]
    });
    fixture = TestBed.createComponent(MonitorContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
