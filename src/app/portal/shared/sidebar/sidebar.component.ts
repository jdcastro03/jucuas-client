import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { User } from './sidebar.models';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  user: User = { username: '', first_name: '', last_name:'', origin_university:'', origin_organizational_unit:'', email: '', groups: [ { name: '' } ] }
  apiURL: string = environment.apiURL;
  rol: any;
  login: boolean = false;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    if (this.auth.isAuth()) {
      this.login = true;
      this.auth.currentUser().subscribe((res:any) => {
        this.user = res;
      });
    }
  }

}
