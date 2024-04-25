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

  private idDataSubject = new Subject<TraineeSubject[] | null>();
  traineesById$ = this.idDataSubject.asObservable();

  private subjectDataSubject = new Subject<TraineeSubject[] | null>();
  traineesBySubject$ = this.subjectDataSubject.asObservable();

  searchSubjectById(ids: string[] | null): void {
    let subjects: TraineeSubject[] = [];
    this.store.select(selectTraineeByOptions('id', ids)).subscribe(
      (trainees: Trainee[] | null) => {
        if (trainees && trainees.length) {
          subjects = this.getGradesOvertimeById(trainees, ids)
        }
      }
    );
    this.idDataSubject.next(subjects)
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
    const subjectGrades: {[key: string]: number[]} = {};
    // Create an object where each key is a subject name, and each value is an array of grades for that subject.
    trainees.forEach(trainee => {
      trainee.subjects.forEach(subject => {
        if (subjectNames.includes(subject.name)) {
          if (!subjectGrades[subject.name]) { // If this subject doesn't exist in the object yet, create it.
            subjectGrades[subject.name] = [];
          }
          // Push the grade into the grades array for that subject.
          subjectGrades[subject.name].push(+subject.grade);
        }
      });
    });

    // Create the final result array.
    return Object.entries(subjectGrades).map(([name, grades]) => {
      const averageGrade = grades.reduce((a, b) => a + b, 0) / grades.length; // Calculate the average grade.
      return {name, value: Math.round(averageGrade).toString()};
    });
  }

  getGradesOvertimeById(trainees: Trainee[], ids: string[] | null): TraineeSubject[] {
    // If ids is not provided or is null, return an empty array.
    if (!ids) {
      return [];
    }
    const results: TraineeSubject[] = [];
    ids.forEach(id => {
      // Filter the trainees array to only include trainees whose id is in the id array.
      let selectedTrainees = trainees.filter(trainee => trainee.id === id);

      selectedTrainees.forEach(trainee => {
        // Assume each subject has a grade, and the grade is a number.
        let totalScore = 0;
        let subjectCount = 0;
        trainee.subjects.forEach(subject => {
          totalScore += Number(subject.grade);
          subjectCount++;
        });
        let average = totalScore / subjectCount;

        // Push an object with the trainee's name and average score into the results array.
        results.push({name: trainee.name, value: Math.round(average).toString()});
      });
    });

    return results;
  }
/*  getSubjectsById(){
    const subjects: TraineeSubject[] = [];

  }*/

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
      return data[searchKey] ? data[searchKey].toString().toLowerCase()
        .includes(filter.toLowerCase()) : false;
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
