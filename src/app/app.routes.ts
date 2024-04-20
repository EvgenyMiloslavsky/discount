import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/data/data-container/data-container.component')
      .then(m => m.DataContainerComponent)
  },
  {
    path: 'analysis',
    loadComponent: () => import('./components/analysis/analysis-container/analysis-container.component')
      .then(m => m.AnalysisContainerComponent)
  },
  {
    path: 'monitor',
    loadComponent: () => import('./components/monitor/monitor-container/monitor-container.component')
      .then(m => m.MonitorContainerComponent)
  }
];
