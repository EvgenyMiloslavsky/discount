import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged, tap} from "rxjs";
import {MonitorService} from "../../../services/monitor.service";

@Component({
  selector: 'app-filter-monitor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './filter-monitor.component.html',
  styleUrls: ['./filter-monitor.component.scss']
})
export class FilterMonitorComponent implements OnInit {
  idControl: FormControl = new FormControl();
  nameControl: FormControl = new FormControl();

  constructor(private monitorService: MonitorService) {
  }

  ngOnInit(): void {
    this.idControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(id => {
          return this.monitorService.setIdFilter(id)
        }
      )
    ).subscribe(()=>{});

    this.nameControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(name =>
        this.monitorService.setNameFilter(name)
      )
    ).subscribe();
  }

  onPassed(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.monitorService.setCheckboxPassStatus(isChecked)
  }

  onFailed(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.monitorService.setCheckboxFailStatus(isChecked)
  }
}
