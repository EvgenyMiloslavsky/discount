import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

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
