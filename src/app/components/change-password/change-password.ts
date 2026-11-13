import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { LoginDto } from '../../models/login-dto';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

/*
 * Jelszómódosításhoz kapcsolódó felhasználói műveletek kezelése.
 *
 * A komponens fogadja a jelszómódosításhoz szükséges adatokat, kezeli a művelet eredményét és a kapcsolódó visszajelzéseket,
 * valamint sikeres módosítás után lehetőséget biztosít a bejelentkezési oldalra történő navigációra.
 */
@Component({
  imports: [FormsModule],
  selector: 'app-change-password',
  styleUrl: './change-password.css',
  templateUrl: './change-password.html',
})
export class ChangePassword {
  private authService = inject(AuthService);
  private router = inject(Router);

  private isLoading = signal(false);
  private email = signal('');
  private password = signal('');
  protected errorMessage = signal('');
  protected successMessage = signal('');
  private isPasswordVisible = signal(false);
  protected changed = signal(false);

  /*
   * A felhasználó jelszavának módosítása.
   *
   * Összeállítja a szükséges adatokat, meghívja az AuthService jelszómódosító metódusát, majd kezeli a sikeres műveletet
   * vagy az esetlegesen fellépő hibát.
   */
  protected changePassword(): void {
    this.isLoading.set(true);

    const loginDto: LoginDto = {
      email: this.email(),
      password: this.password(),
    };

    this.authService.changePassword(loginDto).subscribe({
      next: (response) => {
        this.successMessage.set(response);
        this.errorMessage.set('');
        this.changed.set(true);
      },
      error: (err) => {
        const errorMsg = 'Hiba történt a jelszó megváltoztatása során.';
        console.error(err);

        this.errorMessage.set(errorMsg);
        this.successMessage.set('');
        console.error('Hiba történt a jelszó megváltoztatása során:', err);
      },
    });
  }

  /*
   * A jelszó láthatóságának váltása.
   */
  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.update((value) => !value);
  }

  /*
   * Navigáció a bejelentkezési oldalra.
   */
  protected redirectToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
