import {inject, Injectable} from '@angular/core';
import {environment} from '../environments/enviroment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Category} from '../model/category';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private url = environment.apiUrl
  private http: HttpClient = inject(HttpClient);
  private categoryList: Subject<Category[]> = new Subject<Category[]>();
  constructor() { }

  list(): Observable<any> {
    return this.http.get<Category[]>(this.url + "/categories");
  }
  listId(id: number): Observable<any>{
    return this.http.get<Category[]>(this.url + '/category/id/' + id);
  }
  listName(categoryName: string): Observable<any>{
    return this.http.get<Category[]>(this.url + '/category/name/' + categoryName);
  }
  insert(category: Category): Observable<any>{
    return this.http.post(this.url + '/category', category);
  }
  update(category: Category): Observable<any>{
    return this.http.put(this.url + '/category/update', category);
  }
  delete(id: number) {
    return this.http.delete(this.url + '/category/delete/' + id);
  }
  setList(newList: Category[]): void{
    this.categoryList.next(newList);
  }
  getList() : Observable<Category[]>{
    return this.categoryList.asObservable();
  }
}
