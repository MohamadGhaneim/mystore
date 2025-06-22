import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  products: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.displayProducts();
  }

  displayProducts() {
    this.authService.get_products().subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.products;
        } else {
          alert('Failed to fetch products: ' + response.message);
        }
      },
      error: (error) => {
        console.error(error);
        alert(
          'Error fetching products: ' + error.error?.message || 'Unknown error'
        );
      },
    });
  }
}
