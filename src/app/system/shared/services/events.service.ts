import { BaseApi } from '../../../shared/core/base-api';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { VPEvent } from '../models/event.model';

@Injectable()
export class EventsService extends BaseApi{
    constructor(public http: Http) {
        super(http);
    }

    addEvent(event: VPEvent): Observable<VPEvent> {
        return this.post('events', event);
    }

    getEvents(): Observable<VPEvent[]> {
        return this.get('events');
    }

}