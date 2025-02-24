import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';
import { PresentersService } from 'src/app/portal/services/presenters.service';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent {
  password_form: FormGroup;
  isSubmitting = false;  // Variable para controlar si se está enviando la solicitud

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,  // Recibe los datos del diálogo
    private toastr: ToastrService,
    private authService: AuthService,
    private presenterService: PresentersService // Inyecta el servicio de autenticación
  ) {
    // Inicializa el formulario con validación
    this.password_form = new FormGroup({
      passwd1: new FormControl('', [Validators.required]),
      passwd2: new FormControl('', [Validators.required]),
      notify: new FormControl(false)  // Checkbox para notificar
    });
  }

  // Lógica para cerrar el diálogo sin hacer nada
  onNoClick(): void {
    this.dialogRef.close();  // Simplemente cierra el diálogo sin hacer nada más
  }

  // Método para cambiar la contraseña
  change_password() {
    if (this.password_form.invalid) {
      this.toastr.warning('Por favor, complete el formulario correctamente.');
      return;
    }

    const newPassword = this.password_form.get('passwd1')?.value;
    const confirmPassword = this.password_form.get('passwd2')?.value;
    const notifyUser = this.password_form.get('notify')?.value; // Estado del checkbox

    if (newPassword !== confirmPassword) {
      this.toastr.warning('Las contraseñas no coinciden.');
      return;
    }

    const userId = this.data.userId;  // Recibe el ID del usuario desde el componente principal

    // Deshabilitar el botón "Guardar" mientras se procesa la solicitud
    this.isSubmitting = true;

    // Llamar al servicio para cambiar la contraseña
    this.presenterService.changePasswordWithNotification(userId, newPassword, confirmPassword, notifyUser)
      .subscribe(
        (response: any) => {
          this.isSubmitting = false;  // Volver a habilitar el botón después de recibir la respuesta
          if (response.status === 'OK') {
            this.toastr.success('Contraseña cambiada con éxito.');
            if (response.email_sent) {
              this.toastr.info('Se ha enviado un correo al usuario con la nueva contraseña.');
            }
            this.dialogRef.close();  // Cierra el diálogo después de cambiar la contraseña
          } else {
            this.toastr.error('Error al cambiar la contraseña.');
          }
        },
        (error) => {
          this.isSubmitting = false;  // Habilitar el botón de nuevo si ocurre un error
          this.toastr.error('Error al cambiar la contraseña.');
          console.error('Error:', error);
        }
      );
  }
}
