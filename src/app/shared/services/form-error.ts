import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms'

@Injectable({
  providedIn: 'root',
})
export class FormErrorService {

  public getFieldError(control:AbstractControl | null): string | null{
    if(!control?.errors){
      return null
    }

    if(control?.errors?.['required']){
      return 'Campo Obligatorio'
    }

    if(control?.errors?.['minlength']){
      return 'Minimo 6 caracteres'
    }

    if (control?.errors?.['incorrect']) {
      return 'Contraseña Incorrecta';
    }

    if (control?.errors?.['incorrect']) {
      return typeof control.errors['incorrect'] === 'string' 
    ? control.errors['incorrect'] 
    : 'Usuario Incorrecto';
}

    return null
  


  }

}
