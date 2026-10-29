import { Component, inject, signal} from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { LoginDto } from '../../models/login-dto';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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

  isPasswordVisible = signal<boolean>(false);
  email = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.update(value => !value);
  }

  protected onLogin(): void{
    this.isLoading.set(true);
    const loginDto: LoginDto = {
      email: this.email(),
      password: this.password()
    };

    this.authService.loginUser(loginDto).subscribe({
      next: (response) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('username', response.username);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
        this.router.navigateByUrl(returnUrl).then(() => {
          window.location.reload();
        });
      },
      error: (err) =>{
        this.isLoading.set(false);
        this.errorMessage.set(err.error || 'Hibás e-mail cím vagy jelszó.');
        console.error('Hiba a bejelentkezés során: ', err)
      }
    });
  }

  protected redirectToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
