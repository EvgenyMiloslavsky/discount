import {createFeatureSelector, createSelector} from "@ngrx/store";
import {TraineeState} from "./reducers";

export const selectTraineeFeature = createFeatureSelector<TraineeState>('trainee');

// const feature = (state: AppState) => state.trainee;


export const selectTraineeState = createSelector(
  selectTraineeFeature,
  (state: TraineeState) => state
);

export const selectAllTrainees = createSelector(
  selectTraineeFeature,
  (state: TraineeState) => state.trainees
);

export const getLoadingState = createSelector(
  selectTraineeFeature,
  (state: TraineeState) => state.loading
)

export const getSelectedTrainee = createSelector(
  selectTraineeFeature,
  (state: TraineeState) => state.trainees.find(tr => {
    if (state && state.selectedTraineesId) {
      return tr.id === state.selectedTraineesId
    }else{
      return undefined;
    }
  })
)

export const getTraineeId = createSelector(
  selectTraineeFeature,
  (state: TraineeState) => state.selectedTraineesId
)
