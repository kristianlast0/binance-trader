import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';

@Injectable({ providedIn: 'root' })

export class ApiService {

  private server: string = environment.api;
  private headers: HttpHeaders = new HttpHeaders({
    'Accept': 'application/json',
  });

  constructor(private http: HttpClient) {}

  get(endpoint: string, data: any = null) {
    if(data != null) data = this.getParams(data);
    return this.http.get(this.server+endpoint, { headers: this.headers, params: data });
  }

  post(endpoint: string, data: any) {
    return this.http.post(this.server+endpoint, data, { headers: this.headers });
  }

  put(endpoint: string, data: any) {
    return this.http.put(this.server+endpoint, data, { headers: this.headers });
  }

  delete(endpoint: string) {
    return this.http.delete(this.server+endpoint, { headers: this.headers });
  }

  getRaw(endpoint: string) {
    return this.http.get(endpoint, { headers: this.headers });
  }

  upload(endpoint: string, data: FormData) {
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': 'Bearer '+localStorage.getItem('token'),
      'Accept': 'application/json',
    });
    return this.http.post(this.server+endpoint, data, { headers, reportProgress: true, observe: 'events' });
  }

  private getParams(data: any) {
    let params: HttpParams = new HttpParams();
    if (data == undefined) return params;
    for (const key of Object.keys(data)) {
      if (data[key] !== undefined) {
        if (data[key] instanceof Array) data[key].forEach((item: any) => {
          if (item instanceof Object && item.id) item = item.id;
          params = params.append(`${key.toString()}[]`, item ?? "");
        });
        else {
          if (data[key] instanceof Object && data[key].id) data[key] = data[key].id;
          params = params.append(key.toString(), data[key] ?? "");
        }
      }
    }
    return params;
  }

}