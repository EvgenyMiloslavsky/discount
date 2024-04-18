import {Action, ActionReducer} from "@ngrx/store";
import {traineeReducer, TraineeState,} from "./reducers";
// import {WeatherEffects} from "./effects";
import {Trainee} from "../models/trainee";
import {TraineeEffects} from "./effects";

export interface AppState {
  trainees: Trainee[];
}

export interface AppStore {
  trainees: ActionReducer<TraineeState, Action>;
}

export const appStore: AppStore = {
  trainees: traineeReducer
}

export const appEffects = [TraineeEffects];
