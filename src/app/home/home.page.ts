import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth.service';
import { Estabelecimento, EstabelecimentoService } from '../services/estabelecimento.service'; // 1. IMPORTAR

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

  // 2. CRIAR LISTA PARA ARMAZENAR OS DADOS
  estabelecimentos: Estabelecimento[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private estabelecimentoService: EstabelecimentoService // 3. INJETAR O SERVIÇO
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user: Usuario | null) => {
      if (user) {
        this.nomeUsuario = `${user.nome} ${user.sobrenome}`;
      } else {
        this.nomeUsuario = 'Usuário';
      }
    });
    
    // 4. CHAMAR O MÉTODO PARA CARREGAR OS DADOS
    this.carregarEstabelecimentos();

    this.selectedCategory = this.activeCategory;
    this.observeScroll();
  }

  // 5. CRIAR O MÉTODO QUE BUSCA OS DADOS
  carregarEstabelecimentos() {
    this.estabelecimentoService.getEstabelecimentos().subscribe(
      (data) => {
        this.estabelecimentos = data;
        console.log('Estabelecimentos carregados:', this.estabelecimentos);
      },
      (error) => {
        console.error('Erro ao carregar estabelecimentos:', error);
      }
    );
  }

  // SEUS MÉTODOS ORIGINAIS (mantidos)
  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  setActiveAndScroll(category: string) {
    this.activeCategory = category;
    this.selectedCategory = category;
    this.scrollTo(category);
  }

  selectCategory(category: string) {
    this.setActiveAndScroll(category);
  }

  goToProfile() {
    console.log('Navegando para perfil');
  }

  goToTab(tab: string) {
    console.log('Navegando para tab:', tab);
    // Lógica de navegação
  }

  goToEstablishment(id: number) { // Modificado para receber o ID
    console.log('Navegando para estabelecimento com ID:', id);
    // A URL ficará /estabelecimento/1, /estabelecimento/2, etc.
    this.router.navigate(['/estabelecimento', id]);
  }
  
  private observeScroll() {
    // ... seu código original
  }
}