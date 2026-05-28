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

  voltar() {
    window.history.back();
  }

  getSecaoProdutos() {
    if (!this.estabelecimento) return { titulo: 'PRODUTOS', icone: 'basket-outline' };

    const nome = (this.estabelecimento.nome || '').toLowerCase();
    const cat = (this.estabelecimento.categoria_nome || this.estabelecimento.categoria || '').toLowerCase();

    if (cat.includes('farmácia') || cat.includes('drogaria') || cat.includes('saúde') || nome.includes('farma') || nome.includes('drogaria')) {
      return { titulo: 'MEDICAMENTOS', icone: 'medkit-outline' };
    }
    if (cat.includes('construção') || cat.includes('material') || cat.includes('ferragem') || nome.includes('constru') || nome.includes('ferrag')) {
      return { titulo: 'MATERIAIS', icone: 'hammer-outline' };
    }
    if (cat.includes('mercado') || cat.includes('supermercado') || cat.includes('mercearia') || cat.includes('conveniência') || nome.includes('mercado') || nome.includes('super')) {
      return { titulo: 'PRODUTOS', icone: 'cart-outline' };
    }
    if (cat.includes('pet') || cat.includes('veterinária') || nome.includes('pet')) {
      return { titulo: 'PET SHOP', icone: 'paw-outline' };
    }
    if (cat.includes('roupa') || cat.includes('moda') || cat.includes('vestuário') || nome.includes('modas') || nome.includes('store')) {
      return { titulo: 'VESTUÁRIO', icone: 'shirt-outline' };
    }
    if (cat.includes('restaurante') || cat.includes('lanchonete') || cat.includes('pizzaria') || cat.includes('comida') || cat.includes('lanche') || nome.includes('lanche') || nome.includes('pizza') || nome.includes('burger')) {
      return { titulo: 'CARDÁPIO', icone: 'restaurant-outline' };
    }
    return { titulo: 'PRODUTOS', icone: 'basket-outline' };
  }

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

      // Só monta o google_maps_link se não vier do banco
      if (!this.estabelecimento.google_maps_link) {
        const query = encodeURIComponent(
          this.estabelecimento.nome + ' ' + (this.estabelecimento.localizacao || '')
        );
        this.estabelecimento.google_maps_link = `https://www.google.com/maps/search/?api=1&query=${query}`;
      }

      // NÃO sobrescreve mapa_url — usa o que veio do banco
      // Se vier null/undefined, o template já trata com ng-template #semMapa

      this.carregarProdutos();
    },
    error: (err) => {
      console.error('Erro ao carregar estabelecimento:', err);
      this.isLoading = false;
    }
  });
}

// Chamado se a imagem do mapa falhar ao carregar
onMapaError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';

  // Mostra o endereço textual como fallback
  const container = img.closest('.map-container');
  if (container) {
    container.innerHTML = `
      <div class="map-placeholder">
        <ion-icon name="map-outline"></ion-icon>
        <p>${this.estabelecimento?.localizacao || 'Localização não disponível'}</p>
      </div>
    `;
  }
}

  carregarProdutos() {
    this.estabelecimentoService.getProdutosPorEstabelecimento(this.estabelecimentoId).subscribe({
      next: (prod) => {
        this.produtos = prod.map(p => ({ ...p, quantity: 0 }));
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  abrirMapa() {
    if (this.estabelecimento?.google_maps_link) {
      window.open(this.estabelecimento.google_maps_link, '_system');
    }
  }

private normalizeImageUrl(rawUrl?: string): string {
  if (!rawUrl) return '';

  let normalized = rawUrl.trim();
  if (!normalized) return '';

  // Se por acaso ainda vier com "public/" ou "images/" do banco, limpa para não duplicar
  normalized = normalized.replace(/^public\//, '')
                         .replace(/^images\//, '')
                         .replace(/^\/+/, '');

  // Se o banco trouxer um link completo da internet (ex: maps), retorna ele direto sem mexer
  if (/^(https?:\/\/|data:)/.test(normalized)) {
    return normalized;
  }

  // Garante a extensão .png se não houver
  if (!/\.[a-zA-Z0-9]{2,4}$/.test(normalized)) {
    normalized += '.png';
  }

  // Monta o caminho apontando para a sua pasta local de assets do front
  return `assets/images/${normalized}`;
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