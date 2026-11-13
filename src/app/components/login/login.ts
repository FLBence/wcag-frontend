import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { LoginDto } from '../../models/login-dto';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

/*
 * A felhasználói bejelentkezéshez kapcsolódó műveletek kezelése.
 *
 * A komponens kezeli a bejelentkezési adatokat, a hitelesítési folyamat eredményét, a felhasználói visszajelzéseket,
 * valamint a sikeres bejelentkezés utáni navigációt.
 */
@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private isPasswordVisible = signal(false);
  private email = signal('');
  private password = signal('');
  protected errorMessage = signal('');
  private isLoading = signal(false);

  /*
   * A felhasználó bejelentkeztetése a megadott adatok alapján.
   *
   * Meghívja az AuthService bejelentkezési metódusát,
   * siker esetén eltárolja a kapott felhasználói és hitelesítési
   * adatokat, majd elindítja a token időzítőjét és navigál.
   * Sikertelen bejelentkezés esetén megjeleníti a hibaüzenetet.
   */
  protected onLogin(): void {
    this.isLoading.set(true);
    const loginDto: LoginDto = {
      email: this.email(),
      password: this.password(),
    };

    this.authService
      .loginUser(loginDto)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('username', response.username);
          localStorage.setItem('token', response.token);
          this.authService.startTokenTimer();
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
          this.router.navigateByUrl(returnUrl).then(() => {
            window.location.reload();
          });
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error || 'Hibás e-mail cím vagy jelszó.');
          console.error('Hiba a bejelentkezés során: ', err);
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
   * Navigáció a regisztrációs oldalra.
   */
  protected redirectToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  /*
   * Navigáció a jelszómódosítási oldalra.
   */
  protected redirectToChangePassword(): void {
    this.router.navigate(['/auth/changepass']);
  }
}
