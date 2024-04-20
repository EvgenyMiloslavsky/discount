import {Component, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";
import {getTraineeId} from "../../../store/selectors";
import {removeTrainee, setTraineeId} from "../../../store/actions";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {TraineeDialogComponent} from "../trainee-dialog/trainee-dialog.component";

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnDestroy {
  subscription!: Subscription;
  onDisable = true
  currentTraineeId = '';

  constructor(
    private store: Store,
    private dialog: MatDialog
  ) {
    this.subscription = store.select(getTraineeId).subscribe(tr => {
      if (tr) {
        this.currentTraineeId = tr;
        this.onDisable = false;
      } else {
        this.currentTraineeId = '';
        this.onDisable = true;
      }

    })
  }

  traineeRemove() {
    this.store.dispatch(removeTrainee({id: this.currentTraineeId}));
    this.store.dispatch(setTraineeId({selectedTraineesId: ''}));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openAddTraineeDialog(): void {
    const dialogRef = this.dialog.open(TraineeDialogComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result)
        console.log("Dialog was closed", result);
      // this.store.dispatch(new AddTrainee(result));
    });
  }
}
