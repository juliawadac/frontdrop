import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth.service';
import { Estabelecimento, EstabelecimentoService } from '../services/estabelecimento.service';
import { Subscription } from 'rxjs';
import { ProfileService } from '../services/profile.service';

// Interface para o 'state' que esperamos receber
interface NavigationState {
  showToast: boolean;
  message: string;
  color: 'success' | 'warning' | 'danger';
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class HomePage implements OnInit, OnDestroy {

  nomeUsuario: string = 'Usuário';
  activeCategory: string = 'comida';
  selectedCategory: string = 'comida';
  profilePhoto: string | null = null;

  // Listas
  estabelecimentos: Estabelecimento[] = [];
  estabelecimentosComida: Estabelecimento[] = [];
  estabelecimentosMercado: Estabelecimento[] = [];
  estabelecimentosFarmacia: Estabelecimento[] = [];
  estabelecimentosConstrucao: Estabelecimento[] = [];

  private estabSub: Subscription | undefined;
  
  // ✅ 1. Variável para guardar o state lido no construtor
  private toastState: NavigationState | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private estabelecimentoService: EstabelecimentoService,
    private toastController: ToastController,
    private profileService: ProfileService
  ) {
    // ✅ 2. CORREÇÃO: Ler o state da navegação AQUI (no construtor)
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as NavigationState;

    if (state && state.showToast) {
      this.toastState = state;
      // Limpa o state do histórico do navegador para não aparecer de novo
      this.router.navigate([], { replaceUrl: true, state: {} });
    }
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe((user: Usuario | null) => {
      this.nomeUsuario = user?.nome || 'Usuário';
    });
    
    // Inscreve-se no observable do serviço (como corrigimos antes)
    this.estabSub = this.estabelecimentoService.estabelecimentos$.subscribe(
      (data) => {
        this.estabelecimentos = data;
        this.filtrarEstabelecimentos();
      },
      (error) => {
        console.error('Erro ao carregar estabelecimentos:', error);
      }
    );
    
    this.selectedCategory = this.activeCategory;
    this.profileService.photo$.subscribe(photo => {
      this.profilePhoto = photo;
    });
  }

  // ✅ 3. Mostrar o Toast no 'ionViewWillEnter'
  ionViewWillEnter() {
    // Se o construtor capturou um toast, mostramos agora
    if (this.toastState) {
      this.showToast(this.toastState.message, this.toastState.color);
      // Reseta a variável para não mostrar de novo
      this.toastState = null;
    }
  }

  ngOnDestroy() {
    if (this.estabSub) {
      this.estabSub.unsubscribe();
    }
  }

  // ✅ 4. REMOVEMOS a função 'checkNavigationState'
  // (pois a lógica agora está no constructor e no ionViewWillEnter)

  // Função para mostrar o Toast (notificação)
  private async showToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top',
      icon: color === 'success' ? 'checkmark-circle-outline' : 'alert-circle-outline'
    });
    await toast.present(); // Garantir que o toast seja apresentado
  }

  // (O restante das suas funções permanece igual)
  filtrarEstabelecimentos() {
    this.estabelecimentosComida = this.estabelecimentos.filter(e => e.categoria_id === 1);
    this.estabelecimentosMercado = this.estabelecimentos.filter(e => e.categoria_id === 2);
    this.estabelecimentosFarmacia = this.estabelecimentos.filter(e => e.categoria_id === 3);
    this.estabelecimentosConstrucao = this.estabelecimentos.filter(e => e.categoria_id === 4);
  }

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
        this.router.navigate(['/search']);
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