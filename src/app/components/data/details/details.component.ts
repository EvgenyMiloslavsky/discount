import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {catchError, distinctUntilChanged, map, Subscription, tap, throwError} from "rxjs";
import {Store} from "@ngrx/store";
import {getSelectedTrainee} from "../../../store/selectors";
import {Trainee} from "../../../models/trainee";
import {TraineeService} from "../../../services/trainee.service";
import {updateTrainee} from "../../../store/actions";

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent implements OnInit, OnDestroy {

  subscribers: Subscription[] = [];
  currentTrainee: Trainee = null;

  traineeForm = this.fb.group({
    id: ['', Validators.required],
    name: ['', Validators.required],
    grade: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    date_joined: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    zip: ['', Validators.required],
    subject: ['', Validators.required],
  }, {updateOn: "change"});

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private traineeService: TraineeService) {

    this.subscribers.push(
      this.traineeForm.valueChanges.pipe(
      tap(() => {
        console.log("ValueChanges")
      }),
      map(() => {
        debugger
        if (this.currentTrainee) {
          const formValue = this.traineeForm.value;
          const isEqual = Object.keys(formValue).some(key =>
            formValue[key].toString() === this.currentTrainee[key].toString());
          console.log(isEqual, formValue, this.currentTrainee);
          return isEqual
        } else {
          return false;
        }
      }),
      distinctUntilChanged(),
    ).subscribe(res => {
      this.traineeService.onViewButton(res)
    }));

    this.subscribers.push(
      this.traineeService.onUpdateButtonClicked$.subscribe(() => {
      this.updateTrainee();
    }));
  }

  ngOnInit() {
    this.subscribers.push(
      this.store.select(getSelectedTrainee).pipe(
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    ).subscribe(tr => {

      console.log("Change trainee")
      if (tr) {
        // this.traineeForm.setValue({...tr});
        this.currentTrainee = {...tr};
        console.log("===>",this.currentTrainee, this.currentTrainee);
      } else {
        this.traineeForm.reset({
          id: '',
          name: '',
          grade: '',
          email: '',
          date_joined: '',
          address: '',
          city: '',
          country: '',
          zip: '',
          subject: ''
        });
      }
    }))
  }

  updateTrainee() {
    if (this.traineeForm.valid) {
      const newTrainee = {...this.traineeForm.value as Trainee};
      this.store.dispatch(updateTrainee({trainee: newTrainee, id: this.traineeForm.value.id}));
      this.traineeService.onViewButton(false);
      this.currentTrainee = newTrainee;
      this.traineeForm.setValue(null);
      // this.traineeForm.setValue(newTrainee);
    } else {
      this.traineeForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(sub => sub.unsubscribe());
  }
}
