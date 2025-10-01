import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Produto {
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
}

@Component({
  selector: 'app-estabelecimento',
  templateUrl: './estabelecimento.page.html',
  styleUrls: ['./estabelecimento.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class EstabelecimentoPage {
  tempoEspera = 90;

  produtos: Produto[] = [
    { nome: 'Big Mac', descricao: 'Dois hambúrgueres...', preco: 24.90, quantidade: 0 },
    { nome: 'Quarter Pounder', descricao: 'Hambúrguer 100% bovino...', preco: 28.90, quantidade: 0 },
    { nome: 'McChicken', descricao: 'Frango empanado crocante...', preco: 19.90, quantidade: 0 },
    { nome: 'Batata Frita Média', descricao: 'Batatas douradas...', preco: 8.90, quantidade: 0 },
    { nome: 'McNuggets 10un', descricao: 'Frango empanado crocante...', preco: 16.90, quantidade: 0 },
    { nome: 'McFlurry Ovomaltine', descricao: 'Sorvete com Ovomaltine...', preco: 12.90, quantidade: 0 }
  ];

  constructor(private router: Router) {}

  aumentarQuantidade(index: number) {
    this.produtos[index].quantidade++;
    const el = document.getElementById(`produto-${index}`);
  if (el) {
    el.classList.add("animar-aumentar");
    setTimeout(() => el.classList.remove("animar-aumentar"), 300);
  }
  }

  diminuirQuantidade(index: number) {
  if (this.produtos[index].quantidade > 0) {
    this.produtos[index].quantidade--;

    // adiciona classe de animação "diminuiu"
    const el = document.getElementById(`produto-${index}`);
    if (el) {
      el.classList.add("animar-diminuir");
      setTimeout(() => el.classList.remove("animar-diminuir"), 300);
    }
  }
}

  adicionarAoCarrinho(index: number) {
    const produto = this.produtos[index];

    if (produto.quantidade === 0) return;

    const carrinhoExistente = JSON.parse(localStorage.getItem('carrinho') || '[]');

    const itemCarrinho = {
      name: produto.nome,
      store: 'McDonald\'s',
      price: produto.preco,
      image: '../../assets/mcdonalds-food.png',
      quantity: produto.quantidade
    };

    const itemExistente = carrinhoExistente.findIndex(
      (item: any) => item.name === itemCarrinho.name && item.store === itemCarrinho.store
    );

    if (itemExistente !== -1) {
      carrinhoExistente[itemExistente].quantity += itemCarrinho.quantity;
    } else {
      carrinhoExistente.push(itemCarrinho);
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinhoExistente));

    // reset quantidade
    this.produtos[index].quantidade = 0;

    // feedback
    this.mostrarToastSucesso(`${produto.nome} adicionado à sacola!`);
  }

  irParaSacola() {
    this.router.navigate(['/sacola']);
  }

  goToTab(tab: string) {
    switch (tab) {
      case 'home': this.router.navigate(['/home']); break;
      case 'search': break;
      case 'orders': this.irParaSacola(); break;
      case 'profile': break;
    }
  }

  private mostrarToastSucesso(message: string) {
    const toast = document.createElement('div');
    toast.innerHTML = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: #28a745;
      color: white;
      padding: 12px 24px;
      border-radius: 25px;
      z-index: 10000;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      document.body.removeChild(toast);
    }, 2000);
  }
}
