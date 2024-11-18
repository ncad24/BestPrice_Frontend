import {inject, Injectable} from '@angular/core';
import {environment} from '../environments/enviroment';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Supermarket} from '../model/supermarket';

@Injectable({
  providedIn: 'root'
})
export class SupermarketService {
  private url = environment.apiUrl
  private http: HttpClient = inject(HttpClient);
  private supermarketList: Subject<Supermarket[]> = new Subject<Supermarket[]>;
  constructor() { }

  list(): Observable<any> {
    return this.http.get<Supermarket[]>(this.url + "/supermarkets");
  }

  listId(id: number): Observable<any>{
    return this.http.get<Supermarket[]>(this.url + '/supermarket/id/' + id);
  }
  listName(supermarketName: string):Observable<any>{
    return this.http.get<Supermarket[]>(this.url + '/supermarket/name/' + supermarketName);
  }
  insert(supermarket: Supermarket): Observable<any>{
    return this.http.post(this.url + '/supermarket', supermarket);
  }
  update(supermarket: Supermarket): Observable<any>{
    return this.http.put(this.url + '/supermarket/update', supermarket);
  }
  delete(id: number) {
    return this.http.delete(this.url + '/supermarket/delete/' + id);
  }
  setList(newList: Supermarket[]): void{
    this.supermarketList.next(newList);
  }
  getList() : Observable<Supermarket[]>{
    return this.supermarketList.asObservable();
  }
  getSupermarketTotal(): Observable<any>{
    return this.http.get<Supermarket[]>(this.url+'/supermarket/counts')
  }
}
