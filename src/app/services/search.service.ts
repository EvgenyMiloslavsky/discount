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
    return "";
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
    return match ? match.join(' ') : '';
  }


}
