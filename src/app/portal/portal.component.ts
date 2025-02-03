import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css'],
})
export class PortalComponent implements OnInit {
  year: number = new Date().getFullYear();
  user: any = { username: '', email: '', groups: { name: '' } };
  apiURL: string = environment.apiURL;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.auth.isAuth()) {
      this.auth.currentUser().subscribe((res: any) => {
        this.user = res;
        localStorage['group'] = res.groups[0].name;
        localStorage.setItem('isGlobal', res.global_reviewer);
      });
    }
  }
}
