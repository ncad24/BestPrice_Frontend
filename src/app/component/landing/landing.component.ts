import {Component, HostListener, inject, Renderer2} from '@angular/core';
import { Router } from '@angular/router';

import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {AuthService} from '../../services/auth.service';
import {MatCard, MatCardContent} from '@angular/material/card';
import {CommonModule} from '@angular/common';
interface Opinion {
  user: string;
  stars: string;
  text: string;
}
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbar,
    MatToolbarRow,
    MatIcon,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatCardContent,
    MatCard
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  router: Router = inject(Router);
  authService :AuthService = inject(AuthService);
  private renderer: Renderer2 = inject(Renderer2);

  opinions: Opinion[] = [
    { user: 'Ana R.', stars: '⭐⭐⭐⭐⭐', text: '¡Increíble experiencia! La aplicación es súper fácil de usar y me ha ayudado a organizar mis finanzas de manera efectiva. ¡La recomiendo a todos!' },
    { user: 'Carlos M.', stars: '⭐⭐⭐⭐', text: 'Me encanta la interfaz. Es intuitiva y permite un seguimiento rápido de mis gastos. Solo desearía que tuviera más opciones de personalización.' },
    { user: 'Laura T.', stars: '⭐⭐⭐⭐⭐', text: 'Desde que empecé a usar esta app, he logrado ahorrar más. Las alertas me mantienen al tanto de mis gastos. ¡Es un cambio de juego!' },
    { user: 'Juan S.', stars: '⭐⭐⭐', text: 'Buena aplicación, aunque me gustaría que tuviera más tutoriales para aprender a sacarle el máximo provecho. Aún así, cumple su función.' },
    { user: 'Patricia G.', stars: '⭐⭐⭐⭐⭐', text: 'La mejor app de finanzas que he probado. La sincronización con mi banco es rápida y sin complicaciones. ¡Estoy muy satisfecha!' },
    { user: 'Miguel A.', stars: '⭐⭐⭐⭐', text: 'Me ha ayudado a planificar mis gastos mensuales. La función de gráficos es muy útil para visualizar mis finanzas. Un buen producto en general.' },
  ];

  currentOpinionIndex: number = 0;
  currentOpinion: Opinion = this.opinions[this.currentOpinionIndex];

  teamMembers = [
    { photo:'/photo.jpg',name: 'Neera Aranguri', description: 'Desarrolladora líder con experiencia en aplicaciones web y diseño de interfaces intuitivas.' },
    { photo:'/photo.jpg',name: 'Gabriel Cajas', description: 'Especialista en bases de datos y optimización de consultas, asegurando el mejor rendimiento.' },
    { photo:'/photo.jpg',name: 'Gabriel Silva', description: 'Ingeniero de software apasionado por la inteligencia artificial y el aprendizaje automático.' },
    { photo:'/photo.jpg',name: 'Angel Ramon', description: 'Desarrollador frontend con un ojo para los detalles y la experiencia de usuario.' },
    { photo:'/photo.jpg',name: 'Valeria Caqui', description: 'Experta en marketing digital y comunicación, ayudando a conectar la marca con el público.' }
  ];

  currentIndex = 0;

  constructor() {
    this.cycleOpinions();
  }

  cycleOpinions() {
    setInterval(() => {
      this.currentOpinionIndex = (this.currentOpinionIndex + 1) % this.opinions.length;
      this.currentOpinion = this.opinions[this.currentOpinionIndex];
    }, 3000); // Cambia de opinión cada 3 segundos
  }

  nextMember() {
    this.currentIndex = (this.currentIndex + 1) % this.teamMembers.length;
  }

  prevMember() {
    this.currentIndex = (this.currentIndex - 1 + this.teamMembers.length) % this.teamMembers.length;
  }

  goToLogin() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
  goToLanding(){
    this.router.navigate(['']);
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const header = document.querySelector('header');
    if (header) {
      if (window.scrollY > 0) {
        this.renderer.addClass(header, 'abajo');
      } else {
        this.renderer.removeClass(header, 'abajo');
      }
    }
  }
}
