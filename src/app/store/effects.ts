import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {TraineeService} from "../services/trainee.service";
import {catchError, map, mergeMap, of} from "rxjs";
import {TraineesAction} from "./actions-types";
import {Trainee} from "../models/trainee";

@Injectable()
export class TraineeEffects {

  loadWeather$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TraineesAction.loadTrainees),
      mergeMap(() =>
        this.traineeService.fetchData().pipe(
          // tap(console.log),
          map((trainee: Trainee[]) => TraineesAction.loadTraineesSuccess({trainee})),
          catchError((error) =>
            of(TraineesAction.loadTraineesFailure({error: error.message}))
          )
        )
      )
    )
  );
  constructor(private actions$: Actions, private traineeService: TraineeService) {
  }
}
