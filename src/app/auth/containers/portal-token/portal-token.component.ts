import { Component, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup,Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { param } from 'jquery';
declare var $: any;
@Component({
  selector: 'app-portal-token',
  templateUrl: './portal-token.component.html',
  styleUrls: ['./portal-token.component.css']
})
export class PortalTokenComponent implements OnInit {
  // Numero random para el ejemplo del input
  rnd:string = '';
  // Parametros para la URL
  mail:string = '';
  token:string = '';
  token_valido:boolean = false;
  valid:boolean = false;
  passwd1: boolean = false;
  passwd2: boolean = false;

  constructor(
    private _recovery: AuthService,
    private route: ActivatedRoute,
    private toastr: ToastrService
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
      this.bloquearUI();
      this.rnd = Math.floor(Math.random() * 1000000).toString();



      // En 5 minutos perdiste el tiempo y tienes que enviar la peticion de nuevo
      setTimeout(function() {
        alert('No pusiste el codigo, redireccionando')
        window.location.href = "/";
      }, 300000);

      // Cargar los datos a las vars
      this.route.queryParams.subscribe(async (params) => {
        if (params['token']) this.token = params['token'];
        if (params['mail']) this.mail = params['mail'];
        if (!params['mail']) location.href = '/';
        if (params['mail'] && !params['token']) {
          const data: any = await this._recovery.verToken(params['mail']).toPromise();
          this.valid = data.status == 'OK';
        } else if (params['mail'] && params['token']) {
          const data: any = await this._recovery.validarToken(this.mail, this.token).toPromise();
          this.token_valido = data.status == 'OK';
        }
        console.log("form valido?\t", this.valid);
        console.log("token valido?\t", this.token_valido);
        if (this.token_valido) this.valid = true;
      });

      // Borrar parametros del url para que el usuario no sepa que onda
      const newUrl = window.location.pathname;

      // TODO:
      // Descomentar esta linea, quita los parametros de la URL
      // Comentarla para pruebas

      history.replaceState({}, '', newUrl);

      // location.href = '/'
      $.unblockUI();
  }
  // IDK que hace aqui, pero lo dejare por si acaso
  password_form = new FormGroup({
    passwd1: new FormControl('', [Validators.required]),
    passwd2: new FormControl('', [Validators.required]),
  });

  validar() {
    if (this.token=="" || this.token== undefined){
      // console.log('si');
      return this._recovery.verToken(this.mail)
    }
    // console.log('no')
    return this._recovery.validarToken(this.mail, this.token)}


  submitToken(){

    // URL BASE
    let url = '/auth/portal_recovery/token'
    // this.token =

    //URL COMPUESTA
    // Si al menos un parametro cumple: agregar el ? para el get
    if (this.token != '' || this.mail!='') url+='?'
    // Si hay token, meter el token a la url
    if (this.token != '') url+='token='+this.token
    // Si ambos parametros existen, agregar el &
    if (this.token != '' && this.mail!='') url+='&'
    // Si hay correo, meter el correo a la url
    if (this.mail !='') url+='mail='+this.mail
    // console.log(url)
    // Recargar con la url generada
    this.bloquearUI();
    location.href = url
    console.log("te deberia meter al login");
  }
  debug()
  {
    console.log(this.token);
    console.log(this.mail);

  }
  onInputChange(event: any) {
    const token = event.target.value;
    this.token = token
    // console.log(token);
    // Tu lógica para manejar el valor del input aquí
  }
  show_hide_password(password:String) {
    switch (password) {
      case '1':this.passwd1 = !this.passwd1;return;
      case '2':this.passwd2 = !this.passwd2;return;
    }
  }

  update_password(){
    this.bloquearUI();
    // console.log('a');
    let pwf = this.password_form.value,
    email = this.mail, token = this.token;
    if (pwf.passwd1 == pwf.passwd2 && pwf.passwd1!=''){
      const _post = {
        token:token,
        email:email,
        // Es la misma, so, no importa
        pass1: pwf.passwd1,
        pass2: pwf.passwd1
      }
      // console.log(_post);
      this._recovery.changePasswordToken(_post).subscribe((data : any) => {this.toastr.success(data.message);},
      (error) => {this.toastr.error('Error: '+ error.message);});;
      setTimeout(function() {location.href = "/";}, 3000);
    }
  }
}
