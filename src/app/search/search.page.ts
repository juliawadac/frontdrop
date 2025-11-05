import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ActionSheetController, ActionSheetButton } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';

interface Product {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  categoria: string;
  estabelecimento: string;
  image?: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class SearchPage implements OnInit {
  
  searchTerm: string = '';
  selectedCategories: string[] = [];
  recentSearches: string[] = [];
  isSearching: boolean = false;
  
  categories: string[] = ['Comida', 'Mercado', 'Farmacia', 'Construção'];
  
  allProducts: Product[] = [
    // McDonald's
    { id: 1, nome: 'Big Mac', preco: 29.90, descricao: 'Dois hambúrgueres 100% carne bovina, queijo, molho especial', categoria: 'Comida', estabelecimento: 'McDonald\'s Marília' },
    { id: 2, nome: 'Quarterão com Queijo', preco: 30.70, descricao: 'Hambúrguer bovino mais grosso, queijo, cebola', categoria: 'Comida', estabelecimento: 'McDonald\'s Marília' },
    { id: 3, nome: 'McNuggets 10 unidades', preco: 17.01, descricao: '10 unidades de McNuggets acompanhadas de molhos', categoria: 'Comida', estabelecimento: 'McDonald\'s Marília' },
    { id: 4, nome: 'McFritas Média', preco: 9.22, descricao: 'Batata frita média', categoria: 'Comida', estabelecimento: 'McDonald\'s Marília' },
    { id: 5, nome: 'McFlurry Ovomaltine', preco: 12.50, descricao: 'Sobremesa McFlurry sabor Ovomaltine', categoria: 'Comida', estabelecimento: 'McDonald\'s Marília' },
    { id: 6, nome: 'Refrigerante Coca-Cola Lata 350ml', preco: 4.90, descricao: 'Refrigerante Coca-Cola lata 350ml', categoria: 'Mercado', estabelecimento: 'McDonald\'s Marília' },
    
    // Burger King
    { id: 7, nome: 'Whopper', preco: 25.90, descricao: 'Carne bovina, alface, tomate, picles, maionese', categoria: 'Comida', estabelecimento: 'Burger King Marília' },
    { id: 8, nome: 'Combo Whopper', preco: 39.97, descricao: 'Whopper + batata média + bebida', categoria: 'Comida', estabelecimento: 'Burger King Marília' },
    { id: 9, nome: 'Onion Rings', preco: 14.50, descricao: 'Porção de onion rings', categoria: 'Comida', estabelecimento: 'Burger King Marília' },
    
    // Subway
    { id: 10, nome: 'Sub 15cm - Frango Teriyaki', preco: 23.90, descricao: 'Sanduíche Subway 15cm Frango Teriyaki', categoria: 'Comida', estabelecimento: 'Subway Marília' },
    { id: 11, nome: 'Sub 15cm - BMT', preco: 24.90, descricao: 'BMT 15cm - presunto, salame, pepperoni', categoria: 'Comida', estabelecimento: 'Subway Marília' },
    
    // Mercado
    { id: 12, nome: 'Arroz Tipo 1 5kg', preco: 28.90, descricao: 'Pacote de arroz tipo 1 - 5kg', categoria: 'Mercado', estabelecimento: 'Supermercado Amigão' },
    { id: 13, nome: 'Feijão Carioca 1kg', preco: 9.50, descricao: 'Feijão carioca - 1kg', categoria: 'Mercado', estabelecimento: 'Supermercado Amigão' },
    { id: 14, nome: 'Óleo de Soja 900ml', preco: 8.90, descricao: 'Óleo de cozinha 900ml', categoria: 'Mercado', estabelecimento: 'Supermercado Amigão' },
    
    // Farmácia
    { id: 15, nome: 'Dipirona 500mg', preco: 6.50, descricao: 'Analgésico/antitérmico - caixa com 20', categoria: 'Farmacia', estabelecimento: 'Drogasil Marília' },
    { id: 16, nome: 'Paracetamol 500mg', preco: 7.90, descricao: 'Analgésico/antitérmico - caixa com 10', categoria: 'Farmacia', estabelecimento: 'Drogasil Marília' },
    
    // Construção
    { id: 17, nome: 'Cimento CP II 50kg', preco: 32.00, descricao: 'Saco de cimento 50kg', categoria: 'Construção', estabelecimento: 'Materiais de Construção' },
    { id: 18, nome: 'Tijolo Baiano', preco: 1.20, descricao: 'Tijolo baiano comum - por unidade', categoria: 'Construção', estabelecimento: 'Materiais de Construção' },
  ];
  
  filteredProducts: Product[] = [];

  constructor(
    private actionSheetController: ActionSheetController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRecentSearches();
  }

  onSearchChange() {
    this.isSearching = true;
    
    setTimeout(() => {
      this.filterProducts();
      this.isSearching = false;
    }, 300);
  }

  // NOVO: Salvar apenas quando a busca é finalizada (Enter ou blur)
  onSearchFinished() {
    if (this.searchTerm.trim()) {
      this.saveRecentSearch(this.searchTerm.trim());
    }
  }

  // ALTERAÇÃO PRINCIPAL: Filtrar e agrupar produtos por nome
  filterProducts() {
    let results = this.allProducts;
    
    // Filtrar por termo de busca
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      results = results.filter(product => 
        product.nome.toLowerCase().includes(term) ||
        product.descricao.toLowerCase().includes(term) ||
        product.estabelecimento.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por categorias selecionadas
    if (this.selectedCategories.length > 0) {
      results = results.filter(product => 
        this.selectedCategories.includes(product.categoria)
      );
    }
    
    // Agrupar produtos únicos por nome (remover duplicatas)
    const uniqueProducts = results.reduce((acc: Product[], current) => {
      const exists = acc.find(item => item.nome === current.nome);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);
    
    this.filteredProducts = uniqueProducts;
  }

  // NOVA FUNÇÃO: Obter todas as lojas que vendem um produto
  getEstablishmentsForProduct(productName: string): Product[] {
    return this.allProducts.filter(p => p.nome === productName);
  }

  async openCategoryFilter() {
    const buttons: ActionSheetButton[] = this.categories.map(category => ({
      text: category,
      icon: this.selectedCategories.includes(category) ? 'checkmark-circle' : 'radio-button-off',
      handler: () => {
        this.toggleCategory(category);
      }
    }));
  
    buttons.push({
      text: 'Cancelar',
      icon: 'close',
      role: 'cancel' // Agora o TypeScript reconhece 'role' como válido
    });
  
    const actionSheet = await this.actionSheetController.create({
      header: 'Filtrar por Categoria',
      buttons: buttons
    });
  
    await actionSheet.present();
  }

  toggleCategory(category: string) {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
    this.filterProducts();
  }

  removeCategory(category: string) {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
      this.filterProducts();
    }
  }

  clearAllCategories() {
    this.selectedCategories = [];
    this.filterProducts();
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredProducts = [];
  }

  saveRecentSearch(term: string) {
    if (!this.recentSearches.includes(term)) {
      this.recentSearches.unshift(term);
      if (this.recentSearches.length > 5) {
        this.recentSearches.pop();
      }
      localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    }
  }

  loadRecentSearches() {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      this.recentSearches = JSON.parse(saved);
    }
  }

  selectRecentSearch(term: string) {
    this.searchTerm = term;
    this.onSearchChange();
  }

  clearRecentSearches() {
    this.recentSearches = [];
    localStorage.removeItem('recentSearches');
  }

  viewProductDetail(product: Product) {
    console.log('Ver detalhes:', product);
  }

  // NOVA FUNÇÃO: Adicionar ao carrinho da loja específica
  addToCartFromStore(product: Product, event: Event) {
    event.stopPropagation();
    
    const carrinhoExistente = JSON.parse(localStorage.getItem('carrinho') || '[]');
    
    const itemCarrinho = {
      name: product.nome,
      store: product.estabelecimento,
      price: product.preco,
      image: product.image || '../../assets/placeholder-food.png',
      quantity: 1
    };

    const itemExistente = carrinhoExistente.findIndex(
      (item: any) => item.name === itemCarrinho.name && item.store === itemCarrinho.store
    );

    if (itemExistente !== -1) {
      carrinhoExistente[itemExistente].quantity += 1;
    } else {
      carrinhoExistente.push(itemCarrinho);
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinhoExistente));
    
    console.log('Produto adicionado ao carrinho:', product.nome);
    this.showToast(`${product.nome} de ${product.estabelecimento} adicionado!`);
  }

  private showToast(message: string) {
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
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 2000);
  }
}