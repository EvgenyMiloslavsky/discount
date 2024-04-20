import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-trainee-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './trainee-dialog.component.html',
  styleUrls: ['./trainee-dialog.component.scss']
})
export class TraineeDialogComponent {
  formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TraineeDialogComponent>,
    private formBuilder: FormBuilder) {

    this.formGroup = formBuilder.group({
      name: ['', Validators.required],
      // Add all other properties of a Trainee here as form controls
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveTrainee() {
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.value);
    }
  }
}
