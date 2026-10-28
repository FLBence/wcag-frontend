import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { RegisterDto } from '../../models/register-dto';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {

  private authService = inject(AuthService);

  isPasswordVisible = signal<boolean>(false);
  username = signal('');
  email = signal('');
  password = signal('');

  errorMessage = signal('');
  successMessage = signal('');

  togglePasswordVisibility(): void {
    this.isPasswordVisible.update(value => !value);
  }

onRegister(): void {
  const registerDto: RegisterDto = {
    username: this.username(),
    email: this.email(),
    password: this.password()
  };

  this.authService.registerUser(registerDto).subscribe({
    next: (response) => {
      this.successMessage.set(response);
      this.errorMessage.set('');
    },
    error: (err) => {
      const errorMsg = typeof err.error === 'string' ? err.error : 'Hiba történt a regisztráció során.';
      
      this.errorMessage.set(errorMsg);
      this.successMessage.set('');
      console.error('Regisztrációs hiba:', err);
    }
  });
}


}
