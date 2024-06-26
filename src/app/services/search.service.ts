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

  private idDataSubject = new Subject<any[] | null>();
  traineesById$ = this.idDataSubject.asObservable();

  private subjectDataSubject = new Subject<TraineeSubject[] | null>();
  traineesBySubject$ = this.subjectDataSubject.asObservable();

  searchSubjectById(ids: string[] | null): void {
    let subjectsForTwoChart: any[] = [];
    this.store.select(selectTraineeByOptions('id', ids)).subscribe(
      (trainees: Trainee[] | null) => {
        if (trainees && trainees.length) {
          subjectsForTwoChart.push(this.getGradesOvertimeById(trainees, ids));
          subjectsForTwoChart.push(this.getAverageByStudents(trainees, ids));
        }
      }
    );
    this.idDataSubject.next(subjectsForTwoChart)
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
    const subjectGrades: { [key: string]: number[] } = {};
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
          if (subject.time_over)
            totalScore += Number(subject.time_over);
          subjectCount++;
        });
        let average = totalScore / subjectCount;

        // Push an object with the trainee's name and average score into the results array.
        results.push({name: trainee.name, value: Math.round(average).toString()});
      });
    });

    return results;
  }

  getAverageByStudents(trainees: Trainee[], ids: string[] | null): TraineeSubject[] {
    if (!ids) {
      return [];
    }

    const results: TraineeSubject[] = [];

    ids.forEach(id => {
      const selectedTrainees = trainees.filter(trainee => trainee.id === id);

      selectedTrainees.forEach(trainee => {
        let totalScore = 0;
        let subjectCount = 0;

        trainee.subjects.forEach(subject => {
          totalScore += Number(subject.grade);
          subjectCount++;
        });

        const average = totalScore / subjectCount;

        results.push({name: trainee.name, value: Math.round(average).toString()});
      });
    });

    return results;
  }

  getPrefix(str: string): string {
    if (str) {
      let match = str.match(/^(id|grade|date)/i);
      if (match) {
        return match[0].toLowerCase();
      }
      return str;
    } else {
      return '';
    }
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
    const match = input.match(/(>\d*|<\d*|\d+)/g);
    if (match) {
      return match.join(' ');
    }
    return '';
  }

  extractRangeDateFromString(input: string): string | null {
    const operators = ['<', '>'];
    for (let op of operators){
      if (input.includes(`date${op}`)){
        return op;
      }
    }

    if (!input.includes('<') && !input.includes('>')) {
      const match = input.match(/(\d{2}\/\d{2}\/\d{4})|(\d{2}\/\d{2}\/\d{2})|(\d+\/)|(\d+)/g);
      if (match) {
        return match.join('');
      } else {
        const numberMatch = input.match(/\d+/);
        return numberMatch ? numberMatch[0] : '';
      }
    } else {
      const filter = input.split(':')[1];
      if (filter && (filter.startsWith('>') || filter.startsWith('<'))) {
        const stringWithoutSpaces = filter.replace(/\s+/g, '');
        if (stringWithoutSpaces[11] === '>' || stringWithoutSpaces[11] === '<') {
/*          const firstValue = stringWithoutSpaces.substring(0, 11);
          const secondValue = stringWithoutSpaces.substring(11);*/
          // If you don't want to return anything, you can either remove the return
          // statement or return a different value per your needs.
        }
      }
    }
    return input.split(':')[1];
  }

  parseDate(input: string): Date | false {
    // Check if the string matches the format ##/##/####
    const regexPattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regexPattern.test(input)) {
      return false;
    }

    // Parse the string to a date
    const date = new Date(input);

    // Check if the date is invalid (Invalid dates are represented as "Invalid Date" in JavaScript, which is a NaN time)
    if (isNaN(date.getTime())) {
      return false;
    }

    // The string is in the correct format and can be interpreted as a valid date
    return date;
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
    return (data: T, filter: string): boolean => {
      let lower: number = -Infinity;
      let upper: number = Infinity;

      const rangeMatch = filter.match(/^\s*>(\d{2}\/\d{2}\/\d{4})\s+<(\d{2}\/\d{2}\/\d{4})\s*$/);
      const singleMatch = filter.match(/(\>|<)(\d{2}\/\d{2}\/\d{4})\s*$/);

      if (rangeMatch) {
        lower = Date.parse(rangeMatch[1].split('/').reverse().join('-'));
        upper = Date.parse(rangeMatch[2].split('/').reverse().join('-'));

        if (lower > upper) {
          [lower, upper] = [upper, lower];
        }
      } else if (singleMatch) {
        if (singleMatch[1] === ">") {
          lower = Date.parse(singleMatch[2].split('/').reverse().join('-'));
        } else if (singleMatch[1] === "<") {
          upper = Date.parse(singleMatch[2].split('/').reverse().join('-'));
        }
      }

      const value = Date.parse((data[searchKey as keyof T] as unknown as string).split('/').reverse().join('-'));
      return value >= lower && value <= upper;
    };
  }}
