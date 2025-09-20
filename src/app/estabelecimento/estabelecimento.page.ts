import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

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
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class EstabelecimentoPage {
  tempoEspera = 90;
  
  produtos: Produto[] = [
    { 
      nome: 'Big Mac', 
      descricao: 'Dois hambúrgueres, alface, queijo, molho especial, cebola, picles em pão com gergelim', 
      preco: 24.90,
      quantidade: 0
    },
    { 
      nome: 'Quarter Pounder', 
      descricao: 'Hambúrguer de carne 100% bovina, queijo derretido, cebola, picles e ketchup', 
      preco: 28.90,
      quantidade: 0
    },
    { 
      nome: 'McChicken', 
      descricao: 'Frango empanado crocante, alface americana e maionese em pão com gergelim', 
      preco: 19.90,
      quantidade: 0
    },
    { 
      nome: 'Batata Frita Média', 
      descricao: 'Batatas fritas douradas e crocantes, temperadas na medida certa', 
      preco: 8.90,
      quantidade: 0
    },
    { 
      nome: 'McNuggets 10un', 
      descricao: 'Pedaços de frango empanados e fritos, acompanha molho a sua escolha', 
      preco: 16.90,
      quantidade: 0
    },
    { 
      nome: 'McFlurry Ovomaltine', 
      descricao: 'Sorvete de baunilha com cobertura de Ovomaltine crocante', 
      preco: 12.90,
      quantidade: 0
    }
  ];

  aumentarQuantidade(index: number) {
    this.produtos[index].quantidade++;
  }

  diminuirQuantidade(index: number) {
    if (this.produtos[index].quantidade > 0) {
      this.produtos[index].quantidade--;
    }
  }

  getTotalItens(): number {
    return this.produtos.reduce((total, produto) => total + produto.quantidade, 0);
  }

  getTotalPreco(): number {
    return this.produtos.reduce((total, produto) => total + (produto.preco * produto.quantidade), 0);
  }

  goToTab(tab: string) {
    console.log('Navegando para:', tab);
    // Aqui você implementaria a navegação
  }
}