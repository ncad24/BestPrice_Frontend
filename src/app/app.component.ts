import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NavbarComponent} from './component/navbar/navbar.component';
import {MatSidenav, MatSidenavContainer} from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NavbarComponent, MatSidenavContainer, MatSidenav],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bestpricefrontend';
}
