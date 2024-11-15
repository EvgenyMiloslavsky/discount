import {Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {catchError, distinctUntilChanged, Subscription, throwError} from "rxjs";
import {Store} from "@ngrx/store";
import {Trainee} from "../../../models/trainee";
import {TraineeService} from "../../../services/trainee.service";
import {updateTrainee} from "../../../store/actions";
import {getSelectedTrainee} from "../../../store/selectors";

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent implements OnDestroy {

  subscribers: Subscription[] = [];
  originalTrainee: Trainee;
  currentTraineeSubject: string;
  initialTraineeSubject: string;
  currentTrainee: any = null;

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
        distinctUntilChanged(),
      ).subscribe(res => {
        this.currentTraineeSubject = res.subject;
        const isFormValueChange = this.isFormValueChange();
        this.traineeService.onViewButton(isFormValueChange)
      }));

    this.subscribers.push(
      this.traineeService.onUpdateButtonClicked$.subscribe(() => {
        this.updateTrainee();
      }));

    this.subscribers.push(
      this.store.select(getSelectedTrainee).pipe(
        catchError(err => {
          console.error(err);
          return throwError(err);
        })
      ).subscribe(tr => {
        if (tr && tr.subject !== null) {
          this.initialTraineeSubject = tr.subject;
          this.originalTrainee = tr.trainee;
          this.currentTraineeSubject = tr.subject;
          // this.traineeForm.setValue({...tr});
          const trainee = tr.trainee;
          const subj = trainee.subjects
            .find(sb => sb.name === tr.subject);
          if(subj){
          const grade = subj.grade;
            const subjectName = this.currentTraineeSubject;
            this.currentTrainee = {
              id: trainee.id,
              name: trainee.name,
              grade: grade,
              email: trainee.email,
              date_joined: trainee.date_joined,
              address: trainee.address,
              city: trainee.city,
              country: trainee.country,
              zip: trainee.zip,
              subject: subjectName
            };
            this.traineeForm.setValue(this.currentTrainee)}

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
      let {id, name, grade, email, date_joined, address, city, country, zip, subject} = this.traineeForm.value;
      const subjects = [...this.originalTrainee.subjects];
      const removeOldSubject = subjects.filter(s => s.name !== this.initialTraineeSubject);
      const newSubj = [...removeOldSubject, {name: subject, grade: grade}]
      const newTrainee: Trainee = {id, name, email, date_joined, address, city, country, zip, subjects: newSubj};
      this.store.dispatch(updateTrainee({trainee: newTrainee, id: this.originalTrainee.id}));
      // this.store.dispatch(setTraineeId({selectedTraineesId: '', subject: ''}))
      this.traineeService.onViewButton(false);
      this.originalTrainee = newTrainee;
      // this.traineeForm.reset();
    } else {
      this.traineeForm.markAllAsTouched();
    }
  }

  isFormValueChange(): boolean {
    if (this.currentTrainee && this.traineeForm.valid) {
      const formValue = this.traineeForm.value;
      return Object.keys(formValue).some(key =>
        formValue[key].toString() !== this.currentTrainee[key].toString());
    } else {
      return false;
    }
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(sub => sub.unsubscribe());
  }
}
