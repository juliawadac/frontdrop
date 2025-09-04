import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sacola',
  templateUrl: './sacola.component.html',
  styleUrls: ['./sacola.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class SacolaPage {
  cartItems = [
    {
      name: 'produto',
      store: 'loja',
      price: 0.00,
      image: ''
    },
  ];

  // Getter para calcular subtotal automaticamente
  get subtotal(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price, 0);
  }

  removeItem(index: number) {
    const itemElement = document.querySelectorAll('.cart-item')[index];
    itemElement?.classList.add('removing');

    setTimeout(() => {
      this.cartItems.splice(index, 1);
    }, 300);
  }
}
