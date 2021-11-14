import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GetService {
  apiKey = environment.apiKey
  constructor(private http: HttpClient) { }

  headers= new HttpHeaders().set('X-CoinAPI-Key', this.apiKey)

  get(path: string) {
    return this.http.get<any>(path, {'headers': this.headers});
  }
}
