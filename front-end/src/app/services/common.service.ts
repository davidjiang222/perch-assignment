import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private _http: HttpClient) {}

  getWithoutToken(url: string): Observable<any> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get(BASE_URL + url, { headers: header });
  }

  postWithoutToken(url: string, data: any): Observable<any> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post(BASE_URL + url, data, { headers: header });
  }

  putWithoutToken(url: string, data: any): Observable<any> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.put(BASE_URL + url, data, { headers: header });
  }

  deleteWithoutToken(url: string): Observable<any> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.delete(BASE_URL + url, { headers: header });
  }
}
