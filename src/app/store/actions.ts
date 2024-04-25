import {createAction, props} from "@ngrx/store";
import {Trainee} from "../models/trainee";

export const loadTrainees = createAction('[Trainee] Load Trainee');
export const loadTraineesSuccess = createAction('[Trainee] Load Trainee Success', props<{ trainees: Trainee[] }>());
export const loadTraineesFailure = createAction('[Trainee] Load Trainee Failure', props<{ error: string }>());
export const setTraineeId = createAction('[Current Trainee Id] Set Trainee Id', props<{ selectedTraineesId: string  }>());
export const removeTrainee = createAction('[Trainee] Remove Trainee', props<{ id: string }>());
export const addTrainee = createAction('[Trainee] Add Trainee', props<{ trainee: Trainee }>());
export const setFilter = createAction('[Filter] Set Filter', props<{ name: string, filter: string }>());
export const updateTrainee = createAction('[Trainee] Update Trainee', props<{ trainee: Trainee, id: string }>());
export const getTrainee = createAction('[Trainee] Get Trainees by Id or Subject', props<{ parameter: string }>());
