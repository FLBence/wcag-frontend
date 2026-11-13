import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { RegisterDto } from '../../models/register-dto';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

/*
 * A felhasználói regisztrációhoz kapcsolódó műveletek kezelése.
 *
 * A komponens kezeli a regisztrációs adatokat, meghívja az AuthService regisztrációs metódusát, valamint megjeleníti
 * a művelet eredményéhez kapcsolódó visszajelzéseket.
 */
@Component({
  imports: [FormsModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  protected isPasswordVisible = signal(false);
  private username = signal('');
  private email = signal('');
  private password = signal('');
  protected errorMessage = signal('');
  protected successMessage = signal('');
  protected registered = signal(false);

  /*
   * A jelszó láthatóságának váltása.
   */
  togglePasswordVisibility(): void {
    this.isPasswordVisible.update((value) => !value);
  }

  /*
   * Új felhasználó regisztrálása a megadott adatok alapján.
   *
   * Összeállítja a regisztrációhoz szükséges adatokat, meghívja az AuthService regisztrációs metódusát,
   * majd kezeli a sikeres műveletet vagy az esetlegesen fellépő hibát.
   */
  onRegister(): void {
    const registerDto: RegisterDto = {
      username: this.username(),
      email: this.email(),
      password: this.password(),
    };

    this.authService.registerUser(registerDto).subscribe({
      next: (response) => {
        this.successMessage.set(response);
        this.registered.set(true);
        this.errorMessage.set('');
      },
      error: (err) => {
        const errorMsg =
          typeof err.error === 'string' ? err.error : 'Hiba történt a regisztráció során.';

        this.errorMessage.set(errorMsg);
        this.successMessage.set('');
        console.error('Regisztrációs hiba:', err);
      },
    });
  }

  /*
   * Navigáció a bejelentkezési oldalra.
   */
  protected redirectToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
