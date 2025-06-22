import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() id!: string;
  @Input() title!: string;
  @Input() imageUrl!: string;
  @Input() price!: number;
  @Input() quantity: number = 1;
  @Output() add = new EventEmitter<any>();

  selectedQuantity: number = 1;

  addToCart() {
    //alert('Product added to cart: ' + this.price);
    if (this.selectedQuantity > 0 && this.selectedQuantity <= this.quantity) {
      this.add.emit({
        id: this.id,
        title: this.title,
        price: this.price,
        oldQuantity: this.quantity,
        selectedQuantity: this.selectedQuantity,
      });
    }
  }
}
