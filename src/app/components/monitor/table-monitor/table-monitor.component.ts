import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {DataTable} from "../../data/table/table.component";
import {MonitorService} from "../../../services/monitor.service";

@Component({
  selector: 'app-table-monitor',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './table-monitor.component.html',
  styleUrls: ['./table-monitor.component.scss']
})
export class TableMonitorComponent {
  dataSource: MatTableDataSource<DataTable> = new MatTableDataSource<DataTable>();

  displayedColumns: string[] = ['id', 'name', 'average', 'exams'];

  // dataSource = ELEMENT_DATA;

  constructor(private filterService: MonitorService) {
    this.filterService.filterData$.subscribe((filter: any) => {
      this.dataSource.data = filter
    })
  }


  setColor(row: any) {
    return row.average > '65' ? 'green-row' : 'red-row'
  }
}
