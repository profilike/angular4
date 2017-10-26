import { Component, OnInit, Input } from '@angular/core';
import { Category } from '../../shared/models/category.model';
import { VPEvent } from '../../shared/models/event.model';

@Component({
  selector: 'vp-history-events',
  templateUrl: './history-events.component.html',
  styleUrls: ['./history-events.component.sass']
})
export class HistoryEventsComponent implements OnInit {

  @Input() categories: Category[] = [];
  @Input() events: VPEvent[] = [];
  searchValue = '';
  searchPlaceholder = 'Сума';
  searchField = 'amount';

  constructor() { }

  ngOnInit() {
    this.events.forEach((e) => {
      e.catName = this.categories.find(c => c.id === e.category).name;
    });
  }

  getEventClass(e: VPEvent) {
    return {
      'label': true,
      'label-danger' : e.type === 'outcome',
      'label-success' : e.type === 'income'
    }
  }
  changeCriteria(field: string) {
    const namesMap = {
      amount: 'Сумма',
      date: 'Дата',
      category: 'Категория',
      type: 'Тип'
    };
    this.searchPlaceholder = namesMap[field];
    this.searchField = field;
  }

}
