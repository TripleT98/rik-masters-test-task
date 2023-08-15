import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService{

  constructor(
    protected http: HttpClient
  ){

  }

  get$<T = any>(path: string, responseType?: 'arraybuffer' | 'blob' | 'json' | 'text'): Observable<T> {
    return this.http.get<T>(path, { responseType: responseType as any });
  }

}
