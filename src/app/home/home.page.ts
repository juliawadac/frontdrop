import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth.service';
import { Estabelecimento, EstabelecimentoService } from '../services/estabelecimento.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class HomePage implements OnInit {

  nomeUsuario: string = 'Usuário';
  activeCategory: string = 'comida';
  selectedCategory: string = 'comida';

  // Lista principal que recebe todos os dados
  estabelecimentos: Estabelecimento[] = [];

  // ✅ Listas filtradas para cada categoria
  estabelecimentosComida: Estabelecimento[] = [];
  estabelecimentosMercado: Estabelecimento[] = [];
  estabelecimentosFarmacia: Estabelecimento[] = [];
  estabelecimentosConstrucao: Estabelecimento[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private estabelecimentoService: EstabelecimentoService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user: Usuario | null) => {
      if (user) {
        // O teu auth.service.ts não define 'sobrenome' no currentUser$, vamos usar apenas o nome
        this.nomeUsuario = user.nome; 
      } else {
        this.nomeUsuario = 'Usuário';
      }
    });
    
    this.carregarEstabelecimentos();
    this.selectedCategory = this.activeCategory;
  }

  carregarEstabelecimentos() {
    this.estabelecimentoService.getEstabelecimentos().subscribe(
      (data) => {
        this.estabelecimentos = data;
        // ✅ Chama a função de filtro assim que os dados chegam
        this.filtrarEstabelecimentos();
      },
      (error) => {
        console.error('Erro ao carregar estabelecimentos:', error);
      }
    );
  }

  // ✅ NOVA FUNÇÃO PARA FILTRAR OS ESTABELECIMENTOS
  filtrarEstabelecimentos() {
    this.estabelecimentosComida = this.estabelecimentos.filter(e => e.categoria_id === 1);
    this.estabelecimentosMercado = this.estabelecimentos.filter(e => e.categoria_id === 2);
    this.estabelecimentosFarmacia = this.estabelecimentos.filter(e => e.categoria_id === 3);
    this.estabelecimentosConstrucao = this.estabelecimentos.filter(e => e.categoria_id === 4);
  }

  // ... (resto das tuas funções: scrollTo, setActiveAndScroll, etc.)
  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  setActiveAndScroll(category: string) {
    this.activeCategory = category;
    this.selectedCategory = category; 
  }

  selectCategory(category: string) {
    this.setActiveAndScroll(category);
  }

  goToProfile() {
    console.log('Navegando para perfil');
    this.router.navigate(['/perfil']);
  }

  goToTab(tab: string) {
    switch (tab) {
      case 'home':
        this.router.navigate(['/home']);
        break;
      case 'search':
        console.log('Buscar - implementar rota futura');
        break;
      case 'orders':
        this.router.navigate(['/sacola']);
        break;
      case 'profile':
        this.goToProfile();
        break;
      default:
        console.log('Tab não configurada:', tab);
    }
  }

  goToEstablishment(id: number) {
    this.router.navigate(['/estabelecimento', id]);
  }
}