import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orderpage',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './orderpage.component.html',
  styleUrl: './orderpage.component.css',
})
export class OrderpageComponent {
  products: any[] = [];

  constructor(private authService: AuthService) {}

  Order: any = [];

  addOrder(Order: any) {
    this.Order.push(Order);
    console.log('Order added:', Order);
  }

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
  listOrderQuantities: { id: any; newQuantity: number }[] = [];

  sendOrdersWhatsApp() {
    if (this.Order.length === 0) {
      alert('No orders to send.');
      return;
    }
    let text = '';
    let totalPrice: number = 0;
    this.listOrderQuantities = [];

    for (let i = 0; i < this.Order.length; i++) {
      const item = this.Order[i];
      totalPrice += item.price * item.selectedQuantity;

      alert('item :' + item.price);
      const product = this.products.find((p) => p.id === item.id);
      const oldQuantity = product?.quantity || 0;
      const newQuantity = oldQuantity - item.selectedQuantity;

      this.listOrderQuantities.push({
        id: item.id,
        newQuantity: newQuantity,
      });

      text += `${i + 1}. ${item.title} - quantity : ${
        item.selectedQuantity
      }   - $ ${item.price * item.selectedQuantity}\n`;
    }
    text += `Total Price: $${totalPrice}\n`;
    alert(text);
    const whatsappMessage = encodeURIComponent(`Order :\n${text}`);
    const phoneNumber = '96170758757';

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

    window.open(whatsappUrl, '_blank');

    this.authService.updateQuantities(this.listOrderQuantities).subscribe({
      next: () => {
        alert('Quantities updated successfully');
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update quantities');
      },
    });

    this.clearOrders();
  }
  clearOrders() {
    this.Order = [];
    console.log('Orders cleared');
  }
}
