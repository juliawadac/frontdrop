import { Component } from '@angular/core';
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
export class SacolaPage {
  // SEU ARRAY ORIGINAL - mantido e melhorado com interface
  cartItems: CartItem[] = [
    {
      name: 'Big Mac',
      store: 'McDonald\'s',
      price: 25.90,
      image: '../../assets/bigmac.png',
      quantity: 1
    },
    {
      name: 'Batata Frita Média',
      store: 'McDonald\'s',
      price: 8.90,
      image: '../../assets/batata.png',
      quantity: 2
    }
  ];

  // SEU GETTER ORIGINAL - mantido exatamente como estava
  get subtotal(): number {
    return this.cartItems.reduce((acc, item) => {
      const itemPrice = item.quantity ? item.price * item.quantity : item.price;
      return acc + itemPrice;
    }, 0);
  }

  // SEU MÉTODO ORIGINAL - mantido e melhorado
  removeItem(index: number) {
    // Adicionando flag para animação
    this.cartItems[index].removing = true;

    const itemElement = document.querySelectorAll('.cart-item-enhanced')[index];
    itemElement?.classList.add('removing');

    setTimeout(() => {
      this.cartItems.splice(index, 1);
      console.log('Item removido do carrinho');
    }, 300);
  }

  // MÉTODO ADICIONADO: controle de quantidade
  updateQuantity(index: number, change: number) {
    const item = this.cartItems[index];
    if (!item.quantity) item.quantity = 1;
    
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
      this.removeItem(index);
    } else {
      item.quantity = newQuantity;
      console.log(`Quantidade atualizada: ${item.name} = ${item.quantity}`);
    }
  }

  // MÉTODO ADICIONADO: finalizar pedido
  placeOrder() {
    if (this.cartItems.length === 0) {
      console.log('Carrinho vazio');
      return;
    }

    const orderSummary = {
      items: this.cartItems,
      subtotal: this.subtotal,
      deliveryFee: 4.99,
      total: this.subtotal + 4.99,
      timestamp: new Date()
    };

    console.log('Realizando pedido:', orderSummary);
    
    // Aqui você pode implementar a lógica de pagamento/envio
    // Por exemplo: chamar um service, navegar para tela de pagamento, etc.
    
    alert(`Pedido realizado! Total: R$ ${orderSummary.total.toFixed(2)}`);
  }

  // MÉTODO ADICIONADO: limpar carrinho
  clearCart() {
    this.cartItems = [];
    console.log('Carrinho limpo');
  }

  // MÉTODO ADICIONADO: adicionar item (para uso futuro)
  addItem(item: CartItem) {
    const existingItemIndex = this.cartItems.findIndex(
      cartItem => cartItem.name === item.name && cartItem.store === item.store
    );

    if (existingItemIndex !== -1) {
      // Se item já existe, aumenta quantidade
      const existingItem = this.cartItems[existingItemIndex];
      existingItem.quantity = (existingItem.quantity || 1) + (item.quantity || 1);
    } else {
      // Se é novo item, adiciona ao carrinho
      this.cartItems.push({ ...item });
    }

    console.log('Item adicionado ao carrinho:', item.name);
  }
}