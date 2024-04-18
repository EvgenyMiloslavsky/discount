import {Injectable} from '@angular/core';
import {delay, Observable} from "rxjs";
import {Trainee} from "../models/trainee";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TraineeService {

  constructor(private http: HttpClient) {
  }

  fetchData(): Observable<Trainee[] | any> {
    const url = `http://localhost:3000/trainees`;
    return (this.http.get(url).pipe(delay(3000)));
  }

}
