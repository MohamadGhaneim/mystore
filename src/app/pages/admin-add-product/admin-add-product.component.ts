import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-add-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-add-product.component.html',
  styleUrls: ['./admin-add-product.component.css'],
  standalone: true,
})
export class AdminAddProductComponent {
  selectedFile: File | null = null;
  product = {
    id: 0,
    title: '',
    price: 0,
    quantity: 0,
    imageUrl: '',
  };

  products: any[] = [];

  constructor(private AuthService: AuthService) {}

  ngOnInit() {
    this.displayproducts();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.product.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submit() {
    if (
      !this.product.title.trim() ||
      this.product.price <= 0 ||
      this.product.quantity <= 0 ||
      !this.selectedFile
    ) {
      alert('All fields are required and must be valid.');
      return;
    }
    const id = localStorage.getItem('managerId');
    if (!id) {
      throw new Error('Manager ID not found in local storage. Please log in.');
    }
    const formData = new FormData();
    formData.append('managerid', id!);
    formData.append('id', this.product.id.toString());
    formData.append('title', this.product.title);
    formData.append('price', this.product.price.toString());
    formData.append('quantity', this.product.quantity.toString());
    formData.append('image', this.selectedFile!);

    this.AuthService.add_products(formData).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Product added successfully');
          this.products.push({
            title: this.product.title,
            price: this.product.price,
            quantity: this.product.quantity,
            imageUrl: response.image_url,
          });
          this.product = {
            id: 0,
            title: '',
            price: 0,
            quantity: 0,
            imageUrl: '',
          };
        } else {
          alert('Failed to add product: ' + response.message);
        }
      },
      error: (error) => {
        console.error(error);
        alert(
          'Error adding product: ' + error.error?.message || 'Unknown error'
        );
      },
    });
  }

  displayproducts() {
    this.AuthService.get_products().subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.products;
          //alert(response.products[0].image_url);
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

  editProduct(product: any) {
    alert('Editing product: ' + product.title);
    //alert('price ' + product.price.toString() + ' quantity ' + product.quantity.toString());
    const formData = new FormData();
    formData.append('id', product.id);
    formData.append('title', product.title);
    formData.append('price', product.price.toString());
    formData.append('quantity', product.quantity.toString());
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    if (
      !product.title ||
      !product.price ||
      product.price <= 0 ||
      !product.quantity ||
      product.quantity <= 0
    ) {
      alert('All fields are required and must be valid.');
      return;
    }
    //alert(product.title);
    this.AuthService.update_product(formData).subscribe({
      next: (res) => {
        alert('Updated successfully');
        this.product = {
          id: 0,
          title: '',
          price: 0,
          quantity: 0,
          imageUrl: '',
        };
        this.displayproducts();
      },
      error: (err) => alert('Error updating'),
    });
  }

  deleteProduct(id: number) {
    alert(id);
    this.AuthService.delete_product(id).subscribe({
      next: (res) => {
        alert('Product deleted successfully');
        this.displayproducts();
      },
      error: (err) => {
        console.error(err);
        alert(
          'Error deleting product: ' + err.error?.message || 'Unknown error'
        );
      },
    });
  }
  selectProduct(product: any) {
    this.product.id = product.id;
    this.product.title = product.title;
    this.product.price = product.price;
    this.product.quantity = product.quantity;
    this.selectedFile = null; // Reset selected file
  }
}
