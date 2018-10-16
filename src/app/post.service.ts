import { Injectable } from '@angular/core';

import { Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient} from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postsUrl = 'http://localhost:4300/getPosts';
  private postByIdUrl = 'http://localhost:4300/getPost';
  private headers: Headers;
  private options: RequestOptions;
  
  constructor(
    private http: HttpClient) { 
      this.headers = new Headers();
      this.headers.append('Content-Type', 'application/json');
      this.headers.append('Accept', 'application/json');
      this.headers.append('Access-Control-Allow-Headers', 'Content-Type, X-XSRF-TOKEN');
      this.headers.append('Access-Control-Allow-Origin', '*');
      this.options = new RequestOptions({ headers: this.headers });
    }

  getPosts (): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl)
      .pipe(
        catchError(this.handleError('getPosts', []))
      );
  }

  getPost (id: number): Observable<Post> {
    const url = `${this.postByIdUrl}/${id}`;
    return this.http.get<Post>(url)
      .pipe(
        catchError(this.handleError<Post>(`getPost id=${id}`))
      );
  }
  
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); 
      return of(result as T);
    };
  }
}
