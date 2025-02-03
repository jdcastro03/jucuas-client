import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

import { Location } from '@angular/common';

declare var $: any;
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  password_form = new FormGroup({
    actual_password: new FormControl('', [Validators.required]),
    passwd1: new FormControl('', [Validators.required]),
    passwd2: new FormControl('', [Validators.required]),
  });

  id: string = '0';
  apiURL: string = environment.apiURL;
  actual_password: boolean = false;
  passwd1: boolean = false;
  passwd2: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private location: Location,
  ) { }

  ngOnInit(): void {
  }

  show_hide_password(password:String) {
    switch (password) {
      case 'a':
        this.actual_password = !this.actual_password;
        break;
      case '1':
        this.passwd1 = !this.passwd1;
        break;
      case '2':
        this.passwd2 = !this.passwd2;
        break;
    }
  }

  change_password() {
    $.blockUI({
      message: '<i class="icon-spinner4 spinner"></i>',
      overlayCSS: {
        backgroundColor: '#1b2024',
        opacity: 0.8,
        zIndex: 1200,
        cursor: 'wait',
      },
      css: {
        border: 0,
        color: '#fff',
        padding: 0,
        zIndex: 1201,
        backgroundColor: 'transparent',
      },
    });

    if (
      (this.password_form.get('passwd1') as FormControl).value == (this.password_form.get('passwd2') as FormControl).value
    ) {
      this.auth.changePassword(this.password_form.value).subscribe(
        (res) => {
          // this.router.navigateByUrl('/portal/dashboard');
          this.location.back();
          this.toastr.success('Contraseña modificada correctamente');
          $.unblockUI();
        },
        (error) => {
          this.toastr.warning(error['error'].message);
          $.unblockUI();
        }
      );
    } else {
      this.toastr.warning('Las contraseñas no coinciden');
      $.unblockUI();
    }
  }

}
