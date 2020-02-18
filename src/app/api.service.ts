import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  myMethod$: Observable<any>;
  apiKey = 'AIzaSyCxExpfB6LnZDTbFwP2BrRugoKe3WbLttQ';
  //'AIzaSyDetbzBsROiIxmxMDUmGQPjCzCC-t81jWI';


  pageToken: any;

  private SERVER_URL = 'https://www.googleapis.com/youtube/v3/search';
  myMethodSubject: any;


  constructor(private httpClient: HttpClient,
  ) { }


  getData(data): Observable<any> {


    this.pageToken = data;

    return this.httpClient.get(this.SERVER_URL
      + '?part=' + data.part
      + '&maxResults=' + data.maxResults
      + '&order=' + data.order
      + '&key=' + this.apiKey
      + '&pageToken=' + data.pageToken)

      .pipe(catchError(this.handleError));

  }
  private handleError(errorResponse: HttpErrorResponse) {


    return throwError(errorResponse);
  }
}

