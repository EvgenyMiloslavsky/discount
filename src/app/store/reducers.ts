import {Trainee} from "../models/trainee";
import {createReducer, on} from "@ngrx/store";
import {TraineesAction} from "./actions-types";

export interface TraineeState {
  trainees: Trainee[];
  loading: boolean;
  filter: string;
  error: string;
  selectedTraineesId: string;
}

export const initialState: TraineeState = {
  trainees: [],
  loading: false,
  filter: '',
  error: '',
  selectedTraineesId: ''
};

export const traineeReducer = createReducer(
  initialState,

  on(TraineesAction.loadTrainees, state => ({...state, loading: true})),

  on(TraineesAction.loadTraineesSuccess, (state, {trainees}) => ({...state, trainees, loading: false})),

  on(TraineesAction.loadTraineesFailure, (state, {error}) => ({...state, error, loading: false})),

  on(TraineesAction.setTraineeId, (state, {selectedTraineesId}) => ({...state, selectedTraineesId})),

  on(TraineesAction.removeTrainee, (state, {id}) => ({
    ...state,
    trainees: state.trainees.filter(trainee => trainee.id !== id)
  })),
  on(TraineesAction.addTrainee, (state, {trainee}) => ({...state, trainees: [trainee, ...state.trainees]})),
  on(TraineesAction.setFilter, (state, {filter}) => ({...state, filter: filter})),
  on(TraineesAction.updateTrainee, (state, {trainee, id}) => ({
      ...state,  // spread the current state
      trainees: state.trainees.map(t => {  // create a new array by mapping over trainees in state
        if (t.id === id) {  // if the id of the trainee from state matches the id from the action
          return trainee;  // return the new trainee from action (effectively replacing the old)
        } else {
          return t; // if the id doesn't match, return the original trainee (unchanged)
        }
      })
    }),
  )
)
