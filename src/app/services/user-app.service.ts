import {inject, Injectable} from '@angular/core';
import {environment} from '../environments/enviroment';
import {HttpClient} from '@angular/common/http';
import {UserApp} from '../model/user-app';
import {Observable, Subject} from 'rxjs';
import {UserList} from '../model/user-list';
import {SupermarketProductPricesDto} from '../model/supermarket-product-prices-dto';
import {ProductPerUserDto} from '../model/product-per-user-dto';
import {PricesByProductSupermarket} from '../model/prices-by-product-supermarket';

@Injectable({
  providedIn: 'root'
})
export class UserAppService {
  private url = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  private userList: Subject<UserApp[]> = new Subject<UserApp[]>();

  constructor() {}

  list(): Observable<UserApp[]> {
    return this.http.get<UserApp[]>(this.url + '/users');
  }

  private createFormData(userApp: UserApp, image?: File): FormData {
    const formData = new FormData();
    // esto es necesario? pense que la verdad que yo tmpc pense que era necesario
    formData.append('names', userApp.names.toString());
    formData.append('surnames', userApp.surnames.toString());
    formData.append('phoneNumber', userApp.phoneNumber.toString());
    formData.append('email', userApp.email.toString());
    formData.append('gender', userApp.gender.toString());
    formData.append('username', userApp.username.toString());
    formData.append('password', userApp.password.toString());
    if (image) {
      formData.append('image', image);
    }
    return formData;
  }

  register(userApp: UserApp, image?: File): Observable<UserApp> {
    const formData = this.createFormData(userApp, image);
    console.log(formData);
    return this.http.post<UserApp>(this.url + '/user', formData);
  }

  update(userApp: UserApp, image?: File): Observable<UserApp> {
    const formData = this.createFormData(userApp, image);
    return this.http.put<UserApp>(this.url + '/user/update', formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.url + '/user/delete'+id);
  }

  getUserByUsername(username: string): Observable<UserApp> {
    return this.http.get<UserApp>(`${this.url}/user/username/${username}`);
  }

  setList(newList: UserApp[]): void {
    this.userList.next(newList);
  }

  getList(): Observable<UserApp[]> {
    return this.userList.asObservable();
  }
  getUserLists(): Observable<UserList[]> {
    return this.http.get<UserList[]>(`${this.url}/userlists`);
  }

  // Registrar una nueva lista de usuarios
  registerUserList(userList: UserList): Observable<UserList> {
    return this.http.post<UserList>(`${this.url}/userlist`, userList);
  }

  // Actualizar una lista de usuarios existente
  updateUserList(userList: UserList): Observable<UserList> {
    return this.http.put<UserList>(`${this.url}/userlist`, userList);
  }

  // Eliminar una lista de usuarios por ID
  deleteUserList(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/userlist/delete/${id}`);
  }

  // Buscar una lista de usuarios por ID
  getUserListById(id: number): Observable<UserList[]> {
    return this.http.get<UserList[]>(`${this.url}/userlist/find/${id}`);
  }

  // Asignar un producto a una lista
  assignProductToList(userListId: number, productId: number): Observable<void> {
    return this.http.post<void>(`${this.url}/product/list/${userListId}/${productId}`, {});
  }

  // Eliminar un producto de una lista
  removeProductFromList(userListId: number, productId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/product/list/delete/${userListId}/${productId}`);
  }

  getProductsFromList(userListId: number): Observable<ProductPerUserDto[]> {
    return this.http.get<ProductPerUserDto[]>(`${this.url}/product/list/findproducts/${userListId}`);
  }

  getSumListProduct(userListId: number): Observable<PricesByProductSupermarket[]> {
    return this.http.get<PricesByProductSupermarket[]>(`${this.url}/product/list/sumlist/${userListId}`);
  }

  getTotalUser(): Observable<any>{
    return this.http.get<UserApp[]>(this.url + '/user/count');
  }
}
