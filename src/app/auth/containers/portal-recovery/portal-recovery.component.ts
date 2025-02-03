import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
@Component({
  selector: 'app-portal-recovery',
  templateUrl: './portal-recovery.component.html',
  styleUrls: ['./portal-recovery.component.css']
})
export class PortalRecoveryComponent implements OnInit{

  constructor(
    private _recovery: AuthService,
    private _toastr: ToastrService,
    ){}
    bloquearUI(){
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
    }
    ngOnInit(): void {
      this.bloquearUI()
      $.unblockUI();
    }
  recoveryForm = new FormGroup({
    email: new FormControl('', Validators.required),
  });
  recovery_password() {
    this.bloquearUI();
    // Inserta la lógica para recuperar la contraseña aquí
    this._recovery.recoveryPassword({"email": this.recoveryForm.value.email}).subscribe(
      (response:any) => {
        if (response.status != "ok" && response.status != "OK"){
          this._toastr.error(response.message);
        }
        else{
          this._toastr.success("Se envió un correo con 6 dígitos para confirmar tu identidad");
        }
        // Aqui se debe redireccionar al coso ese para pedir los 6 digitos
        setTimeout(() => {location.href = "/auth/portal_recovery/token?mail="+this.recoveryForm.value.email;}, 2000);
      },
      (error:any) => {
        this._toastr.error("Error con tu solicitud");
        // Aqui mamaste y vas pal login, digo lobby :v
        setTimeout(() => {location.reload();}, 2000);
      }
    );
  }
}
