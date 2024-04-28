import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {selectAllTrainees} from "../store/selectors";
import {BehaviorSubject, Observable, Subject, Subscription} from "rxjs";
import {Trainee} from "../models/trainee";

export interface ServiceData {
  id: string;
  name: string;
  average: string;
  exam: string;
}

@Injectable({
  providedIn: 'root'
})
export class MonitorService {
  subscribers: Subscription[] = [];
  filteredData: any[] = [];

  private filterDataSubject = new Subject<ServiceData[]>();
  filterData$ = this.filterDataSubject.asObservable();

  private nameFilterSubject = new BehaviorSubject<string[] | null>(null);
  private idFilterSubject = new BehaviorSubject<string[] | null>(null);

  /*private checkboxPassStatus = new BehaviorSubject<boolean>(false);
  checkboxPassStatus$ = this.checkboxPassStatus.asObservable();

  private checkboxFailStatus = new BehaviorSubject<boolean>(false);
  checkboxFailStatus$ = this.checkboxFailStatus.asObservable();*/

  checkboxPassStatus = true;
  checkboxFailStatus = true;

  nameFilterChange$: Observable<string[] | null> = this.nameFilterSubject.asObservable();
  descriptionFilterChange$: Observable<string[] | null> = this.idFilterSubject.asObservable();

  data: Trainee[]

  constructor(
    private store: Store,
  ) {
    this.subscribers.push(
      this.store.select(selectAllTrainees).subscribe(
        tr => {
          this.data = tr
          this.applyFilters();
        }
      ));
  }

  getData() {
    /*this.filterDataSubject.next([{
      id: '798797',
      name: 'Name',
      average: '67',
      exam: '4'
    } ] )*/
  }


  setIdFilter(id: any) {
    const idArr = this.splitter(id);
    this.idFilterSubject.next(idArr)
    this.applyFilters();
  }

  setNameFilter(name: string) {
    const nameArray = this.splitter(name);
    this.nameFilterSubject.next(nameArray);
    this.applyFilters();
  }

  setCheckboxPassStatus(status: boolean) {
    this.checkboxPassStatus = status;
    console.log(this.checkboxPassStatus);
    this.applyFilters()
  }

  setCheckboxFailStatus(status: boolean) {
    this.checkboxFailStatus = status;
    console.log(this.checkboxFailStatus);
    this.applyFilters();
  }

  splitter(str: string): string[] {
    const arr = str.split(/[\s,]+/);
    return arr.map((item: string) => item.toLowerCase());
  }

  private applyFilters(): void {
    const filterName = this.nameFilterSubject.value;
    const filterId = this.idFilterSubject.value;


    const filteredData = this.data.filter(item => {
      let filterByName = filterName && filterName.length > 0 && filterName.includes(item.name.toLowerCase());
      let filterById = filterId && filterId.length > 0 && filterId.includes(item.id);

      return filterByName || filterById;
    });

    let transformedData = this.transformData(filteredData);


    transformedData = transformedData.filter(item => {
      debugger
      if (this.checkboxPassStatus && +item.average >= 65) {
        return true
      }
      return this.checkboxFailStatus && +item.average < 65;

    })

    console.log("Filter", this.filteredData);
    this.filterDataSubject.next(transformedData)
  }

  transformData(trainees: Trainee[]) {
    let transformedData: ServiceData[] = trainees.map(item => {
      let sumGrades = 0;
      let examSum = item.subjects.length;
      item.subjects.forEach(subject => {
        sumGrades += Number(subject.grade);
      });

      let averageGrade = (item.subjects.length > 0) ? sumGrades / item.subjects.length : 0;

      return {
        id: item.id,
        name: item.name,
        average: Math.round(averageGrade).toString(),
        exam: Math.round(examSum).toString()
      };
    });
    return transformedData
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(sub => sub.unsubscribe());
  }
}
