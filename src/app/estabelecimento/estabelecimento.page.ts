import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
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
  // Usamos 'any' temporariamente para aceitar os novos campos de mapa sem erro de interface
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
    private authService: AuthService 
  ) {}

  get cartKey(): string {
    return this.usuarioId ? `carrinho_${this.usuarioId}` : 'carrinho_visitante';
  }

  ngOnInit() {
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => this.usuarioId = user?.id || null)
    );

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.estabelecimentoId = +idParam; 
      this.carregarDados();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  carregarDados() {
    this.isLoading = true;
    this.estabelecimentoService.getEstabelecimentoById(this.estabelecimentoId).subscribe({
      next: (est) => {
        this.estabelecimento = est;
        
        // LOGICA DA IMAGEM: Se não vier do banco, ele procura na pasta assets pelo ID
        if (!this.estabelecimento.mapa_url) {
          this.estabelecimento.mapa_url = `assets/mapas/mapa-${this.estabelecimentoId}.png`;
        }
        
        // LOGICA DO LINK: Se não houver link, cria um link de busca automática no Google Maps
        if (!this.estabelecimento.google_maps_link) {
          const query = encodeURIComponent(this.estabelecimento.nome + " " + (this.estabelecimento.localizacao || ''));
          this.estabelecimento.google_maps_link = `https://www.google.com/maps/search/?api=1&query=${query}`;
        }

        this.carregarProdutos();
      },
      error: (err) => {
        console.error('Erro ao carregar:', err);
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

  // Função chamada pelo botão "Como Acessar"
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

  goToTab(tab: string) {
    this.router.navigate([`/${tab}`]);
  }
}