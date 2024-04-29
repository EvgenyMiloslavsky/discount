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
  (state: TraineeState) => {
    const trainee = state.trainees.find(tr => tr.id === state.selectedTrainee.id);
    if(trainee){
      return {trainee: trainee, subject: state.selectedTrainee.subject};
    }else{
      return null
    }
  }
)

export const getTrainee = createSelector(
  selectTraineeFeature,
  (state: TraineeState) => state.selectedTrainee
)

export const getFilter = (filterType: string) => createSelector(
  selectTraineeFeature,
  (state: TraineeState) => {
    return state.filters.find(fi => fi.name === filterType)
  }
)

// Parameterized selector
export const selectTraineeByOptions = (parameter: string, filterOptions: string[]) => createSelector(
  selectTraineeFeature,
  (state: TraineeState) => {
    if (filterOptions.length === 0) {
      return null;
    } else if (parameter === 'id') {
      const res = state.trainees.filter(trainee =>
        filterOptions.includes(trainee['id']));
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
