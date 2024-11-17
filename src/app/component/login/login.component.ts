import {Component, inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {jwtDecode} from 'jwt-decode';
import {UserApp} from '../../model/user-app';
import {UserAppService} from '../../services/user-app.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: string = '';

  newUser: UserApp = new UserApp();
  selectedImage?: File;

  registerError: string = '';

  showRegisterForm: boolean = false;

  authService :AuthService = inject(AuthService);
  userAppService: UserAppService = inject(UserAppService);
  router: Router = inject(Router);
  constructor() {}

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        if (response.jwt) {
          console.log('Response:', response.jwt);
          this.authService.saveToken(response.jwt);

          // Decodificar el token para obtener el rol del usuario
          const decodedToken: any = jwtDecode(response.jwt);
          const userRole = decodedToken.role; // Obtiene el rol del claim

          // Guardar username en localStorage
          localStorage.setItem('username', this.username);

          // Redirigir según el rol
          if (userRole === 'ROLE_ADMIN') {
            this.router.navigate(['admin/dashboard']);
          } else if (userRole === 'ROLE_USER') {
            this.router.navigate(['/home']);
          }
        } else {
          this.loginError = 'Credenciales incorrectas. Inténtalo de nuevo.';
        }
      },
      error: (err) => {
        this.loginError = 'Error de autenticación. Inténtalo de nuevo.';
      }
    });
  }

  onRegister() {
    this.userAppService.register(this.newUser, this.selectedImage).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.registerError = 'El nombre de usuario o correo ya existe';
        } else {
          this.registerError = 'Error en el registro. Inténtalo de nuevo.';
        }
      }
    });
  }

  onImageSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }

  toggleForms() {
    this.showRegisterForm = !this.showRegisterForm;
    const formWrapper = document.querySelector('.form-wrapper');
    if (this.showRegisterForm) {
      formWrapper?.classList.add('show-register');
    } else {
      formWrapper?.classList.remove('show-register');
    }
  }

  goToLanding(){
    this.router.navigate(['']);
  }

  goToRegister(){
    this.router.navigate(['register']);
  }
}
