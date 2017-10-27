import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoriesService } from '../shared/services/categories.service';
import { EventsService } from '../shared/services/events.service';
import { Category } from '../shared/models/category.model';
import { VPEvent } from '../shared/models/event.model';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

@Component({
  selector: 'vp-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.sass']
})
export class HistoryPageComponent implements OnInit, OnDestroy {

  constructor(
    private categoriesServices: CategoriesService,
    private eventsService: EventsService
  ) { }
  
  isLoaded = false;
  isFilterVisible = false;
  s1: Subscription;

  categories: Category[] = [];
  events: VPEvent[] = [];
  filteredEvents: VPEvent[] = [];

  chartData = [];

  private setOriginalEvents() {
    this.filteredEvents = this.events.slice();
  }

  ngOnInit() {
    
    this.s1 = Observable.combineLatest(
      this.categoriesServices.getCategories(),
      this.eventsService.getEvents()
    ).subscribe((data: [Category[], VPEvent[]]) => {
      this.categories = data[0];
      this.events = data[1];
    
      this.setOriginalEvents();
      this.calculateChartData();
    
      this.isLoaded = true;
          
    });
  }


  calculateChartData(): void{
    this.chartData = [];
    this.categories.forEach((cat) => {
      const catEvent = this.filteredEvents.filter((e) => e.category === cat.id && e.type === 'outcome');
      this.chartData.push({
        name: cat.name,
        value: catEvent.reduce((total, e) => {
          total += e.amount;
          return total;
        }, 0)
      });
    });
  }

  

  private toggleFilterVisibility(dir: boolean) {
    this.isFilterVisible = dir;
  }

  openFilter() {
    this.toggleFilterVisibility(true);
  }
  onFilterApply(filterData){

    this.toggleFilterVisibility(false);
    this.setOriginalEvents();

    const startPeriod = moment().startOf(filterData.period).startOf('d');
    const endPeriod = moment().endOf(filterData.period).endOf('d');

    this.filteredEvents = this.filteredEvents
      .filter((e)  => {
        return filterData.types.indexOf(e.type) !== -1;
      })
      .filter((e) => {
        return filterData.categories.indexOf(e.category.toString()) !== -1;
      })
      .filter((e) => {
        const momentDate = moment(e.date, 'DD.MM.YYYY HH:mm:ss');
        return momentDate.isBetween(startPeriod, endPeriod);
      });

    this.calculateChartData();
    
  }
  onFilterCancel(){
    this.toggleFilterVisibility(false);
    this.setOriginalEvents();
    this.calculateChartData();
  }
  

  ngOnDestroy() {
    if(this.s1){
      this.s1.unsubscribe();
    }
  }

}
