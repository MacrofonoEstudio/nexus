import { Injectable } from '@angular/core';
import { Response, Jsonp } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { GEvent } from './+group-events/gevent';
import { GAbout } from './+group-events/gabout';
import { environment } from './environment';

@Injectable()
export class GroupEventsService {
  groupName: string = 'GDG-Kansas-City';

  constructor(private jsonp: Jsonp) {}

  // TODO get groupName from router
  private meetupUrl = 'https://api.meetup.com/' + this.groupName + '/events' +
                       '?photo-host=public&page=20&sig_id=12889940&key=' + environment.meetupKey +
                       '&sig=af9ff02c67f7b43d1cce0156799398f43842bc56&callback=JSONP_CALLBACK';

  private aboutUrl = 'https://api.meetup.com/2/groups?key=' + environment.meetupKey +
                    '&offset=0&format=json&group_urlname=' + this.groupName +
                    '&photo-host=public&page=20&radius=25.0&fields=sponsors&order=id&desc=false' +
                    '&sig_id=12889940&sig=ece277cfc4be272311affb8a8ef00f812181d88a&callback=JSONP_CALLBACK';

 getEvents(): Observable<GEvent[]> {
    return this.jsonp.get(this.meetupUrl)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getAbout(): Observable<GAbout[]> {
    return this.jsonp.get(this.aboutUrl)
    .map(this.extractResults)
    .catch(this.handleError);
  }

  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Response status: ' + res.status);
    }
    let body = res.json();
    console.log(body);
    return body.data || {};

  }

  private extractResults(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Response status: ' + res.status);
    }
    let body = res.json();
    console.log(body);
    return body.results || {};

  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg = error.message || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
