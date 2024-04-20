import {Action, ActionReducer} from "@ngrx/store";
import {traineeReducer, TraineeState,} from "./reducers";
import {TraineeEffects} from "./effects";

export interface AppState {
  trainee: TraineeState;
}

export interface AppStore {
  trainee: ActionReducer<TraineeState, Action>;
}

export const appStore: AppStore = {
  trainee: traineeReducer
}

export const appEffects = [TraineeEffects];
