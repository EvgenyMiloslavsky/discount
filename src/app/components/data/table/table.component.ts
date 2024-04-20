import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Store} from "@ngrx/store";
import {Trainee} from "../../../models/trainee";
import {Subscription} from "rxjs";
import {selectAllTrainees} from "../../../store/selectors";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {setTraineeId} from "../../../store/actions";


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule, MatPaginatorModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  subscribers: Subscription[] = [];
  selectedRowId!: string;

  //-- Represents an Observable that emits an array of Trainee objects.
  dataSource!: MatTableDataSource<Trainee>;

  trainees!: Trainee[];
  displayedColumns: string[] = ['id', 'name', 'date', 'grade', 'subject'];

  constructor(private store: Store) {
    //-- Dispatch Trainee objects from store
    // this.store.dispatch(TraineesAction.loadTrainees());
  }

  ngOnInit(): void {
    this.subscribers.push(this.store.select(selectAllTrainees).subscribe(tr =>
          // this.trainees = tr
        {
          this.dataSource = new MatTableDataSource<Trainee>(tr);
          setTimeout(() =>
            this.dataSource.paginator = this.paginator, 0
          )
        }
      )
    )
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(sub => sub.unsubscribe());
  }

  clickedRow(id: string) {
    this.selectedRowId = id;
    this.store.dispatch(setTraineeId({selectedTraineesId: id}))
  }
}
