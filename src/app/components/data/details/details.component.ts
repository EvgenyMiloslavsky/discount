import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {getSelectedTrainee} from "../../../store/selectors";

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent implements OnInit, OnDestroy {

  subscription!: Subscription;

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
    subject: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private store: Store) {
  }

  ngOnInit() {
    this.subscription = this.store.select(getSelectedTrainee).subscribe(tr => {
      if (tr) {
        this.traineeForm.setValue({...tr});
      }else{
        this.traineeForm.setValue({
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
    })
  }

  onSubmit() {
    console.log(this.traineeForm.value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
