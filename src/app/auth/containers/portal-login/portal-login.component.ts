import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-portal-login',
  templateUrl: './portal-login.component.html',
  styleUrls: ['./portal-login.component.css']
})
export class PortalLoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  login() {
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
    this.auth.login(this.loginForm.value).subscribe(
      (res) => {
        if (res['error']) {
          this.toastr.warning('Usuario o contraseña incorrectos.');
        } else {
          window.location.href = '/portal';
        }
        $.unblockUI();
      },
      (error) => {
        this.toastr.warning(error.error.message);
        $.unblockUI();
      }
    );
  }
}
