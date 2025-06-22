import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private AuthService: AuthService, private route: Router) {}

  login() {
    if (
      this.username.trim().length === 0 ||
      this.password.trim().length === 0
    ) {
      alert('Username and password cannot be empty');
      return;
    }
    this.AuthService.login(this.username, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          localStorage.setItem('managerId', response.id.toString());
          localStorage.setItem('display_name', response.display_name);
          localStorage.setItem('phone', response.phone);

          alert('Login successful:' + response.username);
          this.route.navigate(['/admin']);
        }
      },
      error: (error) => {
        console.log(error);
        alert('Login failed: ' + error.error?.error || 'Unknown error');
      },
    });
  }
}
