import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoriesService } from '../shared/services/categories.service';
import { EventsService } from '../shared/services/events.service';
import { Category } from '../shared/models/category.model';
import { VPEvent } from '../shared/models/event.model';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';


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
  s1: Subscription;

  categories: Category[] = [];
  events: VPEvent[] = [];

  chartData = [];

  calculateChartData(): void{
    this.chartData = [];
    this.categories.forEach((cat) => {
      const catEvent = this.events.filter((e) => e.category === cat.id && e.type === 'outcome');
      this.chartData.push({
        name: cat.name,
        value: catEvent.reduce((total, e) => {
          total += e.amount;
          return total;
        }, 0)
      });
    });
  }

  ngOnInit() {

    this.s1 = Observable.combineLatest(
      this.categoriesServices.getCategories(),
      this.eventsService.getEvents()
    ).subscribe((data: [Category[], VPEvent[]]) => {
      this.categories = data[0];
      this.events = data[1];

      this.isLoaded = true;
      
      this.calculateChartData();
      
    });

  }

  ngOnDestroy() {
    if(this.s1){
      this.s1.unsubscribe();
    }
  }

}
