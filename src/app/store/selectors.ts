import {createFeatureSelector, createSelector} from "@ngrx/store";
import {TraineeState} from "./reducers";

export const selectTraineeFeature = createFeatureSelector<TraineeState>('trainee');


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
    } else {
      return undefined;
    }
  })
)

export const getTraineeId = createSelector(
  selectTraineeFeature,
  (state: TraineeState) => state.selectedTraineesId
)

export const getFilter = createSelector(
  selectTraineeFeature,
  (state: TraineeState) => state.filter
)

// Parameterized selector
export const selectTraineeByOptions = (parameter: string, filterOptions: string[]) => createSelector(
  selectTraineeFeature,
  (state: TraineeState) => {
    if (filterOptions.length === 0) {
      return null;
    } else if (parameter === 'id') {
      const res = state.trainees.filter(trainee =>
        filterOptions.includes(trainee[parameter]));
      return res.length !== 0 ? res : null;
    } else if (parameter === 'subject') {
      const res = state.trainees.filter(trainee =>
        trainee.subjects.some(subject => filterOptions.includes(subject.name))
      );
      return res.length !== 0 ? res : null;
    } else {
      return null;
    }
  }
);
