import { Feedback } from './../shared/feedback';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
    // tslint:disable-next-line:align
    private processHTTPMsgService: ProcessHTTPMsgService) { }

    getfeedbacks(): Observable<Feedback[]>{
      return this.http.get<Feedback[]>(baseURL + 'feedback')
    .pipe(catchError(this.processHTTPMsgService.handleError));

  }

  submitFeedback(feedback: Feedback): Observable<any> {

    const headers = { 'content-type': 'application/json'} ;
    const body=JSON.stringify(feedback);
    console.log("body=",body);
    return this.http.post(baseURL + 'feedback', body, {'headers':headers})
    .pipe(catchError(this.processHTTPMsgService.handleError));

  }

}
