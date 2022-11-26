import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { MessageService } from './message.service';

export interface IContentItem {
  Title: string;
  Text: string;
  Layout:
    | 'Text_above_img_below'
    | 'Text_below_img_above'
    | 'Text_left_img_right'
    | 'Text_right_img_left';
  Wrap_in_shadow_box: boolean;
  Page_for_display:
    | 'Landing_page'
    | 'Members_page'
    | 'Team_page'
    | 'ESNcard_page'
    | 'Incomings_page';
  Order_on_page: number;
  Image: {
    id: string;
    width: number;
    height: number;
    description: string;
  };
}

@Injectable()
export class ContentService {
  private url =
    environment.DIRECTUS_URL_W +
    'Content' +
    environment.DIRECTUS_SECTION_FILTER +
    environment.SECTION_NAME +
    '&fields=Title,Text,Image.*,Page_for_display,Order_on_page,Layout,Wrap_in_shadow_box' +
    '&sort=Order_on_page' +
    '&filter[Page_for_display]=';
  private fullUrl?: string;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  fetchPageContent(page: string): Observable<IContentItem[]> {
    this.fullUrl = this.url + page;
    return this.http.get<IContentItem[]>(this.fullUrl).pipe(
      shareReplay(1),
      tap((_) => this.log('fetched content')),
      catchError(this.handleError<IContentItem[]>('fetchContentList'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  private log(message: string) {
    this.messageService.add(`ContentService: ${message}`);
  }
}
