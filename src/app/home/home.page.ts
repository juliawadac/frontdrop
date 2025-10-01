import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class HomePage implements OnInit {

  nomeUsuario: string = 'Usuário';
  activeCategory: string = 'comida'; // ADICIONADO: controla categoria ativa
  selectedCategory: string = 'comida'; // ADICIONADO: alias para compatibilidade com HTML

  constructor(
    private authService: AuthService,
    private router: Router // ADICIONADO: para navegação entre páginas
  ) {}

  ngOnInit() {
    // SEU CÓDIGO ORIGINAL - mantido exatamente como estava
    this.authService.currentUser$.subscribe((user: Usuario | null) => {
      if (user) {
        this.nomeUsuario = `${user.nome} ${user.sobrenome}`;
      } else {
        this.nomeUsuario = 'Usuário';
      }
    });

    // ADICIONADO: sincronizar as propriedades
    this.selectedCategory = this.activeCategory;

    // ADICIONADO: observação do scroll para melhorar UX
    this.observeScroll();
  }

  // SEU MÉTODO ORIGINAL - mantido exatamente como estava
  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ADICIONADO: método que combina ativação de categoria + seu scroll original
  setActiveAndScroll(category: string) {
    this.activeCategory = category;
    this.selectedCategory = category; // sincronizar ambas propriedades
    this.scrollTo(category); // usando seu método original
  }

  // ADICIONADO: alias para compatibilidade com HTML
  selectCategory(category: string) {
    this.setActiveAndScroll(category);
  }

  // ADICIONADO: navegação para perfil
  goToProfile() {
    console.log('Navegando para perfil');
    // Implementar navegação futura se necessário
  }

  // ADICIONADO: navegação para tabs do footer
  goToTab(tab: string) {
    console.log('Navegando para tab:', tab);
    
    try {
      switch (tab) {
        case 'home':
          // Já está na home
          break;
        case 'search':
          console.log('Buscar - implementar rota futura');
          break;
        case 'orders':
          console.log('Pedidos - implementar rota futura');
          break;
        case 'profile':
          console.log('Perfil - implementar rota futura');
          break;
        default:
          console.log('Tab não configurada:', tab);
      }
    } catch (error) {
      console.log('Erro na navegação de tab:', error);
    }
  }

  // ADICIONADO: navegação para estabelecimentos
  goToEstablishment(establishment: string) {
    console.log('Navegando para estabelecimento:', establishment);
    
    try {
      switch (establishment) {
        case 'mcdonalds':
          this.router.navigate(['/estabelecimento']);
          break;
        case 'pizzahut':
          console.log('Pizza Hut - implementar rota futura');
          break;
        case 'habibs':
          console.log('Habib\'s - implementar rota futura');
          break;
        default:
          console.log('Estabelecimento não configurado:', establishment);
      }
    } catch (error) {
      console.log('Erro na navegação:', error);
    }
  }

  // ADICIONADO: observador de scroll para atualizar categoria ativa
  private observeScroll() {
    if (typeof IntersectionObserver === 'undefined') return; // verificação de compatibilidade
    
    const sections = ['comida', 'mercado', 'farmacia', 'construcao'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target.id) {
            this.activeCategory = entry.target.id;
            this.selectedCategory = entry.target.id; // sincronizar ambas propriedades
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-50px 0px -50px 0px'
      }
    );

    // observar seções quando DOM estiver pronto
    setTimeout(() => {
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          observer.observe(element);
        }
      });
    }, 200);
  }
}