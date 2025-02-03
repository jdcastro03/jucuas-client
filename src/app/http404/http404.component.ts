import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../portal/shared/navbar/navbar.component';
import { SidebarComponent } from '../portal/shared/sidebar/sidebar.component';
@Component({
  selector: 'app-http404',
  templateUrl: './http404.component.html',
  styleUrls: ['./http404.component.css',
    '../app.component.css'
],
})
export class Http404Component implements OnInit {

  constructor(private router: Router) { }
  year: number = new Date().getFullYear();
  tiempoRestante = 5;
  ngOnInit(): void {
    const interval = setInterval(() => {
      this.tiempoRestante--;

      if (this.tiempoRestante <= 0) {
        clearInterval(interval); // Detener el intervalo cuando el tiempo se agote
        this.router.navigate(['/']);
      }
    }, 1000); // Actualizar la variable cada 1000 milisegundos (1 segundo)
  }

}
