import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";
import {getFilter, selectAllTrainees} from "../../../store/selectors";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {setTraineeId} from "../../../store/actions";
import {SearchService} from "../../../services/search.service";

export interface DataTable {
  id: string;
  name: string;
  date_joined: string;
  grade: string;
  subject: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule, MatPaginatorModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  subscribers: Subscription[] = [];
  selectedRow = {id: '', subject: ''};
  searchKey: string = '';
  searchValue: string = '';

  //-- Represents an Observable that emits an array of Trainee objects.
  displayedColumns: string[] = ['id', 'name', 'date', 'grade', 'subject'];
  dataSource: MatTableDataSource<DataTable> = new MatTableDataSource<DataTable>();

  constructor(
    private store: Store,
    private searchService: SearchService
    ) {
    this.subscribers.push(
      this.store.select(getFilter('dataFilter')).subscribe(fi => {
        if (fi && fi.filter !== '') {
          const [key, value] = fi.filter.split(':');
          this.searchKey = key;
          this.searchValue = value;
          if (this.searchValue) {
            this.filterPredicates();
              this.dataSource.filter = this.searchValue;
          } else {
            this.dataSource.filter = "";
          }
        } else {
          this.dataSource.filter = "";
        }
      }));

    this.subscribers.push(
      this.store.select(selectAllTrainees).subscribe(
        tr => {
          this.dataSource.data = tr.flatMap(trainee =>
            trainee.subjects.map(subject => (
              {
                id: trainee.id,
                name: trainee.name,
                date_joined: trainee.date_joined,
                grade: subject.grade,
                subject: subject.name
              }
            ))
          );
          // this.dataSource.filter = this.searchValue.trim().toLowerCase();
        }
      ));
  }

  ngOnInit(): void {
  }

  clickedRow(id: string, subject: string) {
    this.selectedRow = {id: id, subject: subject};
    this.store.dispatch(setTraineeId({selectedTraineesId: id, subject: subject}));
  }

  ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator;
  }

  filterPredicates() {
    switch (this.searchKey) {
      case 'id': {
        const customFilterPredicate = this.searchService.createIdFilterPredicate<any>(this.searchKey);
        this.dataSource.filterPredicate = (data, filter) => customFilterPredicate(data, filter);
      }
        break;
      case 'grade':
        if ((this.searchValue.replace(/\D/g, '')) === this.searchValue) {
          const customFilterPredicate = this.searchService.createIdFilterPredicate<any>(this.searchKey);
          this.dataSource.filterPredicate = (data, filter) => customFilterPredicate(data, filter);
        } else {
          const customGradeFilterPredicate = this.searchService.createGradeFilterPredicate<any>(this.searchKey);
          this.dataSource.filterPredicate = (data, filter) => customGradeFilterPredicate(data, filter);
        }
        break;
      case 'date':
        if (this.searchValue.includes("<") || this.searchValue.includes(">")) {
          console.log(this.searchValue)
          const customFilterPredicate = this.searchService.createDateFilterPredicate<any>(this.searchKey.concat('_joined'));
          this.dataSource.filterPredicate = (data, filter) => customFilterPredicate(data, filter);
        } else {
          const customFilterPredicate = this.searchService.createIdFilterPredicate<any>(this.searchKey.concat('_joined'));
          this.dataSource.filterPredicate = (data, filter) => customFilterPredicate(data, filter);
        }
        break;
    }
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(sub => sub.unsubscribe());
  }
}
