import { Injectable } from '@angular/core';
import { VerifyUniqueUserDataType } from '../models/verify-unique-user-data-parameter.model';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { PresentersService } from './presenters.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class VerifyDataService {
  constructor(
    private presenters: PresentersService,
    private toastr: ToastrService
  ) {}

  verifyDataValidator(name: VerifyUniqueUserDataType, len: number, type: any) {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
      if (control.value.length >= len) {
        return new Promise((resolve) => {
          this.presenters
            .verifyUniqueUserData(name, control.value, type)
            .subscribe((res) => {
              if (res === '1') {
                switch (name) {
                  case 'curp': {
                    resolve({ curpError: 'La curp ya existe.' });
                    this.toastr.error(
                      'La curp ya se encuentra registrada en plataforma'
                    );
                    break;
                  }
                  case 'phone': {
                    resolve({ curpError: 'El telefono ya existe.' });
                    this.toastr.error(
                      'El telefono ya se encuentra registrado en plataforma'
                    );
                    break;
                  }
                  case 'email': {
                    resolve({ curpError: 'El email ya existe.' });
                    this.toastr.error(
                      'El email ya se encuentra registrado en plataforma'
                    );
                    break;
                  }
                  case 'username': {
                    resolve({ curpError: 'El usuario ya existe.' });
                    this.toastr.error(
                      'El usuario ya se encuentra registrado en plataforma'
                    );
                    break;
                  }
                }
              } else {
                resolve(null);
              }
            });
        });
      }

      return new Promise((r) => r(null));
    };
  }
}
