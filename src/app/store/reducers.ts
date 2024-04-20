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
  }))
  /*on(WeatherActions.updateWeather, (state, {weather}) => ({
    ...state,
    weather: state.TemperatureValue
  })),*/

  // on(WeatherActions.deleteWeather, (state, {id}) => ({...state, weather: state.weather.filter(t => t.id !== id)})),
);
