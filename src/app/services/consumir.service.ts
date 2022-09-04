import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsumirService {

  url_api = 'https://www.datos.gov.co/resource/xdk5-pm3f.json'

  constructor(private http: HttpClient) { 
  }
  
  getCiudades(): Observable<any>{
    return this.http.get(`${this.url_api}`)
}

}
