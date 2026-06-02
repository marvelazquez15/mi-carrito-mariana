import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/service/auth'; 
import { FormErrorService } from '@shared/services/form-error'; // 🌟 Inyectamos tu servicio global

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './registrar.html',
  styleUrl: './registrar.css'
})
export class Registrar {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private formErrorService = inject(FormErrorService); // 🌟 Inicializado igual que en tu login

  public errorMessage = signal<string | null>(null);

  
  public registerForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
    email: ['', [Validators.required, Validators.email]],
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password_confirm: ['', [Validators.required]]
  }, {
    validators: this.passwordMatchValidator
  });

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('password_confirm');
    return password && confirmPassword && password.value !== confirmPassword.value 
      ? { passwordMismatch: true } 
      : null;
  }

  protected onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const payload = this.registerForm.getRawValue();

    this.authService.register(payload).subscribe({
      next: (response) => {
        console.log('¡Registro exitoso!', response);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error de registro en el servidor:', err);
        this.errorMessage.set(err.error?.detail || 'El usuario o el correo electrónico ya existen.');
      }
    });
  }

  public isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(
      control && control.invalid && 
      (control.touched || control.dirty)
    );
  }

  public getFieldError(field: string): string | null {
    const control = this.registerForm.get(field);
    
    if (field === 'password_confirm' && this.registerForm.hasError('passwordMismatch')) {
      return 'Las contraseñas ingresadas no coinciden.';
    }

    return this.formErrorService.getFieldError(control);
  }
}