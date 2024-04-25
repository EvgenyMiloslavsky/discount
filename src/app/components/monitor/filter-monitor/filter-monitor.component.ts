import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-monitor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-monitor.component.html',
  styleUrls: ['./filter-monitor.component.scss']
})
export class FilterMonitorComponent implements OnInit{
  ngOnInit(): void {

    /*this.subscribers.push(
      this.filterState$.subscribe(
        filterState => {
          if (filterState) {
            const [name, filter] =filterState.filter.split(':');
            if(name === 'id') {
              this.searchIdControl.setValue(filter)
            }else if(name === 'subj') {
              this.searchSubjectControl.setValue(filter)
            }
          }
        }
      ))*/
  }

}
