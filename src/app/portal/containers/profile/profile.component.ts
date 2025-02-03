import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProfileService } from '../../services/profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PresentersService } from '../../services/presenters.service';
import { HttpHeaders } from '@angular/common/http';
import { ActivitiesService } from '../../services/activities.service';
import { AdminsService } from '../../services/admin.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css',
    '../../../app.component.css'
  ],
})
export class ProfileComponent implements OnInit {
  apiURL: string = environment.apiURL;
  data: any = {};
  _actividades: any;
  isPresenter: boolean = false;
  selectedGender!: any;
  editedFirstName!: string; editedLastName!: string;
  editedMail!: string;
  editedPhone!: string;

  editingGender!: boolean;
  editingName!: boolean;
  editingMail!: boolean;
  editingPhone!: boolean;

  rol: string = "No asignado";

  scs = ' modificado correctamente.'
  err = 'Error de conexion.'
  constructor(
    private profile: ProfileService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private presenters: PresentersService,
    private actividades: ActivitiesService,
    private users: AdminsService,
  ) { }

  ngOnInit(): void {
    this.getProfile();
    // this._actividades = this.actividades.activitiesByUser()
  }
  getProfile() {
    this.profile.myself().subscribe((result:any) => {
      this.data = result;
      if (result.groups[0].name=='presenter'){
        this.isPresenter=true;
      }
      this.data.g = this.gender(this.data.gender);
      if (this.data.phone == 'N') {this.data.phone = "Agrega un numero de telefono"; }
    });

  }
  editName() {
    // Restablecer la selección en el select de género si existe
    this.editingName = true;
    this.editedFirstName = this.data.first_name;
    this.editedLastName = this.data.last_name;
  }
  editPhone() {
    // Restablecer la selección en el select de género si existe
    this.editingPhone = true;
    this.editedPhone = this.data.phone;
    if (this.editedPhone == "Agrega un numero de telefono")
      this.editedPhone = "";
  }
  editMail() {
    // Restablecer la selección en el select de género si existe
    this.editingMail = true;
    this.editedMail = this.data.email;
  }
  editGender() {
    // Restablecer la selección en el select de género si existe
    if (this.selectedGender) {
      this.selectedGender.selectedIndex = -1;
    }

    this.editingGender = true;
    this.selectedGender = this.gender(this.data.gender);
  }


  saveName() {
    // Cerrar form
    this.editingName = false
    // Validar si esta igual
    if (this.data.first_name == this.editedFirstName && this.data.last_name == this.editedLastName) return;

    let headers: HttpHeaders = new HttpHeaders(this.getHeaders())
    this.data.first_name = this.editedFirstName; // Cambiar a tu variable de edición del primer nombre
    this.data.last_name = this.editedLastName; // Cambiar a tu variable de edición del apellido
    let data: any = {
      fn: this.data.first_name,
      ln: this.data.last_name
    }
    data.id = this.data.id;
    this.users.updateName(data, headers)
      .subscribe(
        (res:any) => { res.status === 'OK'? this.terminar("Nombre editado correctamente.") : this.fallar(res.message)}
      );
    //location.reload();
  }

  terminar(mensaje: string) {
    this.toastr.success(mensaje);
    setTimeout(function () { location.reload(); }, 1000);

  }
  fallar(mensaje: string) {
    this.toastr.error(mensaje);
    setTimeout(function () { location.reload(); }, 1000);
  }
  saveGender() {
    // Cerrar el formulario
    this.editingGender = false;

    // Imprimir en la consola los valores seleccionados

    // Verificar si el género seleccionado es igual al género actual
    if (this.data.g === this.selectedGender[0]) {
      return;
    }

    // Configurar las cabeceras HTTP
    const headers: HttpHeaders = new HttpHeaders(this.getHeaders());

    // Crear el objeto de datos a enviar
    const data: any = { "gender": this.selectedGender };
    let s = false;

    // Actualizar el género en this.data
    this.data.g = this.gender(this.selectedGender);

    // Almacenar una copia de this.data en _data
    const _data = this.data;

    // Verificar si el usuario pertenece al grupo 'presenter'
    data.id = this.data.id;
    this.users.updateGender(data, headers)
      .subscribe(
        (res:any) => { this.terminar("Género editado correctamente.")}
      );
  }


  saveMail() {
    // Cerrar form
    this.editingMail = false;
    //
    if (this.data.email == this.editedMail) return;
    let headers: HttpHeaders = new HttpHeaders(this.getHeaders())
    this.data.email = this.editedMail
    let data: any = { "email": this.data.email }, s = false;
    const _data = this.data;
    data.id = this.data.id;
    this.users.updateEmail(data, headers)
      .subscribe(
        (res:any) => { res.status === 'OK'? this.terminar("Correo editado correctamente.") : this.fallar(res.message)}
      );
  }
  savePhone() {
    this.editingPhone = false;
    if (this.data.g == this.editedPhone) return;
    let headers: HttpHeaders = new HttpHeaders(this.getHeaders())
    this.data.phone = this.editedPhone
    let data: any = { "phone": this.data.phone }
    const _data = this.data;
    let s: boolean = false;
    data.id = this.data.id;
    this.users.updatePhone(data, headers)
      .subscribe(
        (res:any) => { res.status === 'OK'? this.terminar("Teléfono editado correctamente.") : this.fallar(res.message)}
      );
  }

  // Aquí puedes realizar una solicitud HTTP para guardar los cambios en el servidor si es necesario



  // Parametros para edicion
  getCookie(name: string) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
  }
  getHeaders() {
    const csrfToken: any = this.getCookie('csrftoken');
    return {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    }
  }

  // No jalo el json feo :v, so I did this function
  gender(a: string) {
    switch (a) {
      case 'O': return 'Otro';
      case 'H': return 'Hombre';
      case 'M': return 'Mujer';
      default: return 'No asignado';
    }
  }
  roles(_: string) {
    switch (_) {
      case 'presenter': return this.genderize('Presentador')
      case 'reviewer': return this.genderize('Revisador')
      case 'admin': return this.genderize('Administrador')
      case 'representative': return 'Representante'
      // Quitarlo :v
      default: return ''
    }
  }
  genderize(_:string){if (this.data.gender=="M") return _+'a';return _;}
  onInputChange(event: any) {
    // Obtén el valor del campo de entrada
    let inputValue = event.target.value;

    // Elimina todos los caracteres que no sean números usando una expresión regular
    inputValue = inputValue.replace(/[^0-9]/g, '');

    // Limita la longitud a 10 dígitos
    if (inputValue.length > 10) {
      inputValue = inputValue.substring(0, 10);
    }

    // Asigna el valor limpio al modelo
    this.editedPhone = inputValue;
  }
  /*
    TODO:
    Implementar una tabla con la lista de constancias
    generadas para el propio perfil.

    Cambiar contraseña desde aqui mismo

    Cambiar datos propios (nombre completo, telefono)
  */
}
