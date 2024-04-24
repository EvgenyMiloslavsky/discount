import { ComponentFixture, TestBed } from '@angular/core/testing';

import {TraineeDialogComponent } from './trainee-dialog.component';

describe('AddTraineeDialogComponent', () => {
  let component: TraineeDialogComponent;
  let fixture: ComponentFixture<TraineeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TraineeDialogComponent]
    });
    fixture = TestBed.createComponent(TraineeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
