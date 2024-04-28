import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TableMonitorComponent} from "../table-monitor/table-monitor.component";
import {FilterMonitorComponent} from "../filter-monitor/filter-monitor.component";

@Component({
  selector: 'app-monitor-container',
  standalone: true,
  imports: [CommonModule, TableMonitorComponent, FilterMonitorComponent],
  templateUrl: './monitor-container.component.html',
  styleUrls: ['./monitor-container.component.scss']
})
export class MonitorContainerComponent {

}
