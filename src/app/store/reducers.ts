import {Trainee} from "../models/trainee";
import {createReducer, on} from "@ngrx/store";
import {TraineesAction} from "./actions-types";

export interface TraineeState {
  trainees: Trainee[];
  loading: boolean;
  filter: string;
  error: string;
}

export const initialState: TraineeState = {
  trainees: [],
  loading: false,
  filter: '',
  error: ''
};

export const traineeReducer = createReducer(
  initialState,

  on(TraineesAction.loadTrainees, state => ({...state, loading: true})),

  on(TraineesAction.loadTraineesSuccess, (state, {trainee  }) => ({...state, ...trainee, loading: false, filter: ''})),

  on(TraineesAction.loadTraineesFailure, (state, {error}) => ({...state, error, loading: false})),

  // on(WeatherActions.setLocalizedName, (state, {localizedName}) => ({...state, LocalizedName: localizedName}))

  // on(WeatherActions.addWeather, (state, {weather}) => ({...state, weather: [...state.weather, weather]})),

  /*on(WeatherActions.updateWeather, (state, {weather}) => ({
    ...state,
    weather: state.TemperatureValue
  })),*/

  // on(WeatherActions.deleteWeather, (state, {id}) => ({...state, weather: state.weather.filter(t => t.id !== id)})),
);
