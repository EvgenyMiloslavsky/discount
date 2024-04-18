import {createAction, props} from "@ngrx/store";
import {Trainee} from "../models/trainee";

export const loadTrainees = createAction('[Trainee] Load Trainee');
export const loadTraineesSuccess = createAction('[Trainee] Load Trainee Success', props<{ trainee: Trainee[] }>());
export const loadTraineesFailure = createAction('[Trainee] Load Trainee Failure', props<{ error: string }>());
