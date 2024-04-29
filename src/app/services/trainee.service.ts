import {Injectable} from '@angular/core';
import {delay, Observable, Subject} from "rxjs";
import {Trainee} from "../models/trainee";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TraineeService {
  private dataSubject = new Subject<boolean>();
  viewButton$ = this.dataSubject.asObservable();

  private onUpdateButtonClicked = new Subject<void>();
  onUpdateButtonClicked$ = this.onUpdateButtonClicked.asObservable();

  constructor(private http: HttpClient) {
  }

  fetchData(): Observable<Trainee[] | any> {
    const url = `http://localhost:3000/trainees`;
    return (this.http.get(url).pipe(delay(3000)));
  }

  onViewButton(data: boolean) {
    this.dataSubject.next(data);
  }

  onUpdateButton() {
    this.onUpdateButtonClicked.next()
  }

}
