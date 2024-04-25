import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {Trainee} from "../models/trainee";
import {selectTraineeByOptions} from "../store/selectors";
import {Store} from "@ngrx/store";
import {AppState} from "../store/store";

export interface TraineeSubject {
  name: string,
  value: string
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private store: Store<AppState>) {
  }

  private idDataSubject = new Subject<Trainee[] | null>();
  traineesById$ = this.idDataSubject.asObservable();

  private subjectDataSubject = new Subject<TraineeSubject[] | null>();
  traineesBySubject$ = this.subjectDataSubject.asObservable();

  setTraineesById(data: Trainee[] | null): void {
    this.idDataSubject.next(data);
  }

  searchSubjectBySubjectName(names: string[] | null): void {
    let subjects: TraineeSubject[] = [];
    this.store.select(selectTraineeByOptions('subject', names)).subscribe(
      (trainees: Trainee[] | null) => {
        if (trainees && trainees.length) {
          subjects = this.getSubjectsByName(trainees, names)
        }
      }
    );
    this.subjectDataSubject.next(subjects);
  }

  getSubjectsByName(trainees: Trainee[], subjectNames: string[]): TraineeSubject[] {
    const subjects: TraineeSubject[] = [];

    trainees.forEach(trainee => {
      trainee.subjects.forEach(subject => {
        if (subjectNames.includes(subject.name)) {
          subjects.push({name: `${trainee.name} ${subject.name}`, value: subject.grade});
        }
      });
    });

    return subjects;
  }

  getPrefix(str: string): string {
    let match = str.match(/^(id|grade|date)/i);
    if (match) {
      return match[0].toLowerCase();
    }
    return str;
  }

  extractNumberFromString(input: string): string {
    const regex = /id\s*:?\.?\:?\s*(\d+)/i;
    const match = input.match(regex);
    if (match && match[1]) {
      return match[1];
    } else {
      return '';
    }
  }

  extractRangeFromString(input: string): string {
    const match = input.match(/(<|>)(\d+)/g);
    if (match) {
      return match.join(' ');
    } else {
      const numberMatch = input.match(/\d+/);
      return numberMatch ? numberMatch[0] : '';
    }
  }

  extractRangeDateFromString(input: string): string {
    const match = input.match(/(\d{1,2}\/\d{1,2}(\/\d{2,4})?)|(\d+)/g);
    if (match) {
      return match.join(' ');
    } else {
      const numberMatch = input.match(/\d+/);
      return numberMatch ? numberMatch[0] : '';
    }
  }

  createIdFilterPredicate<T>(searchKey: keyof T): (data: T, filter: string) => boolean {
    return (data: T, filter: string) => {
      return data[searchKey] ? data[searchKey].toString().toLowerCase().includes(filter.toLowerCase()) : false;
    };
  }

  createGradeFilterPredicate<T>(searchKey: keyof T): (data: T, filter: string) => boolean {
    return (data: T, filter: string) => {
      let lower = -Infinity, upper = Infinity;
      const lowerMatch = filter.match(/>(\d+)/);
      if (lowerMatch) {
        lower = Number(lowerMatch[1]);
      }
      const upperMatch = filter.match(/<(\d+)/);
      if (upperMatch) {
        upper = Number(upperMatch[1]);
      }
      const grade = Number(data[searchKey as keyof T]);
      return grade > lower && grade < upper;
    }
  }

  createDateFilterPredicate<T>(searchKey: keyof T): (data: T, filter: string) => boolean {
    return (data: T, filter: string) => {
      const value = String(data[searchKey]);
      return value.startsWith(filter);
    };
  }
}
