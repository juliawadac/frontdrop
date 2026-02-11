import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EstabelecimentoService, Estabelecimento, Produto } from '../services/estabelecimento.service';
import { HttpClientModule } from '@angular/common/http';
// ✅ 1. Importar o AuthService
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-estabelecimento',
  templateUrl: './estabelecimento.page.html',
  styleUrls: ['./estabelecimento.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, HttpClientModule]
})
export class EstabelecimentoPage implements OnInit, OnDestroy {
  estabelecimento: Estabelecimento | null = null;
  produtos: Produto[] = [];
  tempoEspera = 90;
  isLoading = true;
  estabelecimentoId: number = 1; 
  private subscription: Subscription = new Subscription();
  
  // ✅ 2. Variável para guardar o ID do utilizador
  private usuarioId: number | null = null; 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private estabelecimentoService: EstabelecimentoService,
    private authService: AuthService // ✅ 3. Injetar o AuthService
  ) {}

  // ✅ 4. CHAVE DINÂMICA idêntica à da Sacola
  get cartKey(): string {
    return this.usuarioId ? `carrinho_${this.usuarioId}` : 'carrinho_visitante';
  }

  ngOnInit() {
    // ✅ 5. Subscrever para saber quem está logado
    const authSub = this.authService.currentUser$.subscribe(user => {
      this.usuarioId = user?.id || null;
    });
    this.subscription.add(authSub);

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.estabelecimentoId = +idParam; 
      this.carregarEstabelecimento();
      this.carregarProdutos();
    } else {
      console.error('ID do estabelecimento não encontrado na rota!');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  carregarEstabelecimento() {
    const sub = this.estabelecimentoService.getEstabelecimentoById(this.estabelecimentoId).subscribe({
      next: (estabelecimento) => {
        this.estabelecimento = estabelecimento;
        this.tempoEspera = estabelecimento.tempo_de_espera || 90;
      },
      error: (error) => {
        console.error('Erro ao carregar estabelecimento:', error);
        this.estabelecimento = {
          id: this.estabelecimentoId,
          nome: "McDonald's",
          localizacao: "Av. Tiradentes, Fragata, Marília - SP",
          tempo_de_espera: 90
        };
      }
    });
    
    this.subscription.add(sub);
  }

  carregarProdutos() {
    const sub = this.estabelecimentoService.getProdutosPorEstabelecimento(this.estabelecimentoId).subscribe({
      next: (produtosDoBanco) => {
        this.produtos = produtosDoBanco.map(produto => ({
          ...produto,
          quantidade: 0 
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.produtos = [
          { id: 1, nome: 'Big Mac', descricao: 'Dois hambúrgueres...', preco: 24.90, quantidade: 0, categoria_id: 1 },
          { id: 2, nome: 'Quarter Pounder', descricao: 'Hambúrguer 100% bovino...', preco: 28.90, quantidade: 0, categoria_id: 1 },
          { id: 3, nome: 'McChicken', descricao: 'Frango empanado crocante...', preco: 19.90, quantidade: 0, categoria_id: 1 },
          { id: 4, nome: 'Batata Frita Média', descricao: 'Batatas douradas...', preco: 8.90, quantidade: 0, categoria_id: 1 },
          { id: 5, nome: 'McNuggets 10un', descricao: 'Frango empanado crocante...', preco: 16.90, quantidade: 0, categoria_id: 1 },
          { id: 6, nome: 'McFlurry Ovomaltine', descricao: 'Sorvete com Ovomaltine...', preco: 12.90, quantidade: 0, categoria_id: 1 }
        ];
        this.isLoading = false;
      }
    });
    
    this.subscription.add(sub);
  }

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

    // ✅ 6. Usamos a this.cartKey em vez da string fixa 'carrinho'
    const carrinhoExistente = JSON.parse(localStorage.getItem(this.cartKey) || '[]');
    const nomeEstabelecimento = this.estabelecimento?.nome || "McDonald's";
    
    const itemCarrinho = {
      name: produto.nome,
      store: nomeEstabelecimento,
      price: produto.preco,
      image: '../../assets/mcdonalds-food.png',
      quantity: produto.quantidade,
      estabelecimentoId: this.estabelecimentoId
    };

    const itemExistente = carrinhoExistente.findIndex(
      (item: any) => item.name === itemCarrinho.name && item.store === itemCarrinho.store
    );

    if (itemExistente !== -1) {
      carrinhoExistente[itemExistente].quantity += itemCarrinho.quantity;
    } else {
      carrinhoExistente.push(itemCarrinho);
    }

    // ✅ 7. Guardamos novamente com a this.cartKey correta
    localStorage.setItem(this.cartKey, JSON.stringify(carrinhoExistente));
    this.produtos[index].quantidade = 0;
    this.mostrarToastSucesso(`${produto.nome} adicionado à sacola!`);
  }

  irParaSacola() {
    this.router.navigate(['/sacola']);
  }

  goToTab(tab: string) {
    switch (tab) {
      case 'home':
        this.router.navigate(['/home']);
        break;
      case 'search':
        this.router.navigate(['/estabelecimentos']);
        break;
      case 'orders':
        this.irParaSacola();
        break;
      case 'profile':
        break;
    }
  }

  private mostrarToastSucesso(message: string) {
    const toast = document.createElement('div');
    toast.innerHTML = message;
    toast.style.cssText = `
      position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
      background: #28a745; color: white; padding: 12px 24px; border-radius: 25px;
      z-index: 10000; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 2000);
  }
}