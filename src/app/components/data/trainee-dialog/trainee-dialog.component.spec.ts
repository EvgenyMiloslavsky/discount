import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTraineeDialogComponent } from './trainee-dialog.component';

describe('AddTraineeDialogComponent', () => {
  let component: AddTraineeDialogComponent;
  let fixture: ComponentFixture<AddTraineeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddTraineeDialogComponent]
    });
    fixture = TestBed.createComponent(AddTraineeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
