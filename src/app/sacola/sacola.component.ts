import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface CartItem {
  name: string;
  store: string;
  price: number;
  image: string;
  quantity?: number;
  removing?: boolean;
}

@Component({
  selector: 'app-sacola',
  templateUrl: './sacola.component.html',
  styleUrls: ['./sacola.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class SacolaPage implements OnInit {
  cartItems: CartItem[] = [];

  ngOnInit() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage() {
    const savedCart = localStorage.getItem('carrinho');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
    }
  }

  private saveCartToStorage() {
    localStorage.setItem('carrinho', JSON.stringify(this.cartItems));
  }

  get subtotal(): number {
    return this.cartItems.reduce((acc, item) => {
      const itemPrice = item.quantity ? item.price * item.quantity : item.price;
      return acc + itemPrice;
    }, 0);
  }

  addItem(item: CartItem) {
    const existingItemIndex = this.cartItems.findIndex(
      cartItem => cartItem.name === item.name && cartItem.store === item.store
    );

    if (existingItemIndex !== -1) {
      this.cartItems[existingItemIndex].quantity! += item.quantity || 1;
    } else {
      this.cartItems.push({ ...item });
    }

    this.saveCartToStorage();
  }

  updateQuantity(index: number, change: number) {
    const item = this.cartItems[index];
    if (!item.quantity) item.quantity = 1;

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      this.removeItem(index);
    } else {
      item.quantity = newQuantity;
      this.saveCartToStorage();
    }
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    this.saveCartToStorage();
  }

  clearCart() {
    this.cartItems = [];
    localStorage.removeItem('carrinho');
  }

  placeOrder() {
    if (this.cartItems.length === 0) {
      alert('Carrinho vazio!');
      return;
    }

    const orderSummary = {
      items: this.cartItems,
      subtotal: this.subtotal,
      deliveryFee: 4.99,
      total: this.subtotal + 4.99,
      timestamp: new Date()
    };

    console.log('Pedido realizado:', orderSummary);
    this.clearCart();
    alert(`Pedido realizado! Total: R$ ${orderSummary.total.toFixed(2)}`);
  }
}
