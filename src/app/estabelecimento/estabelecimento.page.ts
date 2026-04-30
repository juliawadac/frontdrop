import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EstabelecimentoService, Estabelecimento, Produto } from '../services/estabelecimento.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-estabelecimento',
  templateUrl: './estabelecimento.page.html',
  styleUrls: ['./estabelecimento.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, HttpClientModule]
})
export class EstabelecimentoPage implements OnInit, OnDestroy {
  estabelecimento: any = null;
  produtos: Produto[] = [];
  isLoading = true;
  estabelecimentoId: number = 1; 
  private subscription: Subscription = new Subscription();
  private usuarioId: number | null = null; 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private estabelecimentoService: EstabelecimentoService,
    private authService: AuthService,
    private navCtrl: NavController // Injetado para o botão de voltar
  ) {}

  get cartKey(): string {
    return this.usuarioId ? `carrinho_${this.usuarioId}` : 'carrinho_visitante';
  }

  ngOnInit() {
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => this.usuarioId = user?.id || null)
    );

    // ⚠️ MUDANÇA GERAL APLICADA AQUI: O componente agora "escuta" ativamente a troca de lojas.
    // Qualquer loja (nova ou antiga) clicada no app forçará a página a atualizar e carregar as regras.
    this.subscription.add(
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.estabelecimentoId = +idParam; 
          this.carregarDados();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  carregarDados() {
    this.isLoading = true;
    this.estabelecimentoService.getEstabelecimentoById(this.estabelecimentoId).subscribe({
      next: (est) => {
        this.estabelecimento = est;
        
        if (!this.estabelecimento.mapa_url) {
          this.estabelecimento.mapa_url = `assets/mapas/mapa-${this.estabelecimentoId}.png`;
        }
        
        if (!this.estabelecimento.google_maps_link) {
          const query = encodeURIComponent(this.estabelecimento.nome + " " + (this.estabelecimento.localizacao || ''));
          this.estabelecimento.google_maps_link = `http://googleusercontent.com/maps.google.com/?q=${query}`;
        }

        this.carregarProdutos();
      },
      error: (err) => {
        console.error('Erro ao carregar estabelecimento:', err);
        this.isLoading = false;
      }
    });
  }

  carregarProdutos() {
    this.estabelecimentoService.getProdutosPorEstabelecimento(this.estabelecimentoId).subscribe({
      next: (prod) => {
        this.produtos = prod.map(p => ({ ...p, quantidade: 0 }));
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  // ⚠️ MUDANÇA GERAL: Regras universais de Categoria
  getSecaoProdutos() {
    if (!this.estabelecimento) return { titulo: 'PRODUTOS', icone: 'basket-outline' };

    const nome = (this.estabelecimento.nome || '').toLowerCase();
    const cat = (this.estabelecimento.categoria_nome || this.estabelecimento.categoria || '').toLowerCase();
    
    // Farmácia / Drogaria
    if (cat.includes('farmácia') || cat.includes('drogaria') || cat.includes('saúde') || nome.includes('farma') || nome.includes('drogaria')) {
      return { titulo: 'MEDICAMENTOS', icone: 'medkit-outline' };
    }
    // Casa e Construção
    if (cat.includes('construção') || cat.includes('material') || cat.includes('ferragem') || nome.includes('constru') || nome.includes('ferrag')) {
      return { titulo: 'MATERIAIS', icone: 'hammer-outline' };
    }
    // Supermercado / Conveniência
    if (cat.includes('mercado') || cat.includes('supermercado') || cat.includes('mercearia') || cat.includes('conveniência') || nome.includes('mercado') || nome.includes('super')) {
      return { titulo: 'PRODUTOS', icone: 'cart-outline' };
    }
    // Petshop
    if (cat.includes('pet') || cat.includes('veterinária') || nome.includes('pet')) {
      return { titulo: 'PET SHOP', icone: 'paw-outline' };
    }
    // Roupas e Moda
    if (cat.includes('roupa') || cat.includes('moda') || cat.includes('vestuário') || nome.includes('modas') || nome.includes('store')) {
      return { titulo: 'VESTUÁRIO', icone: 'shirt-outline' };
    }
    // Lanchonetes e Restaurantes
    if (cat.includes('restaurante') || cat.includes('lanchonete') || cat.includes('pizzaria') || cat.includes('comida') || cat.includes('lanche') || nome.includes('lanche') || nome.includes('pizza') || nome.includes('burger')) {
      return { titulo: 'CARDÁPIO', icone: 'restaurant-outline' };
    }
    
    // PADRÃO GLOBAL: Se a loja for antiga e não tiver categoria definida, ou for um negócio genérico, 
    // ele exibe PRODUTOS ao invés de exibir Cardápio.
    return { titulo: 'PRODUTOS', icone: 'basket-outline' };
  }

  voltar() {
    this.navCtrl.back(); // Volta intuitivamente para a aba que estava antes
  }

  abrirMapa() {
    if (this.estabelecimento?.google_maps_link) {
      window.open(this.estabelecimento.google_maps_link, '_system');
    }
  }

  aumentarQuantidade(i: number) { this.produtos[i].quantidade++; }
  
  diminuirQuantidade(i: number) { 
    if (this.produtos[i].quantidade > 0) this.produtos[i].quantidade--; 
  }

  adicionarAoCarrinho(index: number) {
    const produto = this.produtos[index];
    const carrinho = JSON.parse(localStorage.getItem(this.cartKey) || '[]');
    
    const item = {
      name: produto.nome,
      store: this.estabelecimento.nome,
      price: produto.preco,
      quantity: produto.quantidade,
      estabelecimentoId: this.estabelecimentoId
    };

    const idx = carrinho.findIndex((c: any) => c.name === item.name && c.store === item.store);
    if (idx !== -1) carrinho[idx].quantity += item.quantity;
    else carrinho.push(item);

    localStorage.setItem(this.cartKey, JSON.stringify(carrinho));
    this.produtos[index].quantidade = 0;
  }
}