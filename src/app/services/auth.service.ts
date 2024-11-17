import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/enviroment';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = "http://localhost:8080/authenticate";
  private http: HttpClient = inject(HttpClient);
  private tokenKey = 'authToken';
  constructor() { }

  login(username: string, password: string): Observable<any>{
    console.log("2"+ username + password)
    return this.http.post(this.api, {username, password})
  }

  //Guardar el token en localStorage
  saveToken(token: string){
    console.log("3"+token)
    localStorage.setItem('authToken', token);
  }

  //Obtener el token del localStorage
  getToken(): string | null {
    console.log(localStorage.getItem('authToken'))
    return localStorage.getItem('authToken');
  }
  //Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    console.log("5"+ this.getToken())
    return this.getToken() !== null;
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role || null; // Asegúrate de que el token tiene un campo 'role'
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
}
