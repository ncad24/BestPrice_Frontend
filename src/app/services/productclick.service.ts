import {inject, Injectable} from '@angular/core';
import {environment} from '../environments/enviroment';
import {HttpClient} from '@angular/common/http';
import {Productclick} from '../model/productclick';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductclickService {
  private url = environment.apiUrl
  private http: HttpClient = inject(HttpClient);
  private productClickList: Subject<Productclick[]> = new Subject<Productclick[]>();
  constructor() { }

  list(): Observable<any>{
    return this.http.get<Productclick[]>(this.url + '/products/click');
  }

  listId(id:number): Observable<any>{
    return this.http.get<Productclick[]>(this.url + '/product/click/' + id);
  }

  listTopId(): Observable<any>{
    return this.http.get<Productclick[]>(this.url + '/product/click/findTop');
  }

  insert(productName: string): Observable<any> {
    const endpoint = `${this.url}/productClick/${productName}`;
    return this.http.post(`${this.url}/productClick/${productName}`, {});
  }

  incrementClick(id: number): Observable<any> {
    return this.http.put<void>(`${this.url}/productClick?id=${id}`, null);
  }

}
