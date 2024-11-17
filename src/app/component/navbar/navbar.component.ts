import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatButton, MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatList, MatListItem, MatNavList} from '@angular/material/list';
import {MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';
import {Router, RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbar,
    MatToolbarRow,
    RouterLink,
    MatButton,
    MatButtonModule,
    MatListItem,
    MatSidenavContent,
    MatSidenavContainer,
    MatNavList,
    MatIcon,
    MatIconButton,
    MatSidenav,
    MatSidenavModule,
    RouterOutlet,
    MatList
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  opened=false;
  router: Router = inject(Router);

  logout() {
    console.log('Cerrando sesión...');
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
