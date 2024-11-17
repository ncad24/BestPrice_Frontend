import {inject, Injectable} from '@angular/core';
import {environment} from '../environments/enviroment';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Brand} from '../model/brand';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private url = environment.apiUrl
  private http: HttpClient = inject(HttpClient);
  private brandList: Subject<Brand[]> = new Subject<Brand[]>;
  constructor() { }

  list(): Observable<any> {
    return this.http.get<Brand[]>(this.url + "/brands");
  }

  listId(id: number): Observable<any>{
    return this.http.get<Brand[]>(this.url + '/brand/id/' + id);
  }
  listName(brandName: string): Observable<any>{
    return this.http.get<Brand[]>(this.url + '/brand/name/' + brandName);
  }
  insert(category: Brand): Observable<any>{
    return this.http.post(this.url + '/brand', category);
  }
  update(category: Brand): Observable<any>{
    return this.http.put(this.url + '/brand/update', category);
  }
  delete(id: number) {
    return this.http.delete(this.url + '/brand/delete' + id);
  }
  setList(newList: Brand[]): void{
    this.brandList.next(newList);
  }
  getList() : Observable<Brand[]>{
    return this.brandList.asObservable();
  }
  getTotalBrands(): Observable<any>{
    return this.http.get<Brand[]>(this.url+"/brand/counts")
  }
}
