import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true,
})
export class NavbarComponent {
  displayName: string = '';

  ngOnInit() {
    this.displayName = localStorage.getItem('display_name') || 'Guest';
  }
  logout() {
    localStorage.clear();
    alert('You have been logged out.');
  }
}
