import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule]
})
export class PerfilPage implements OnInit {

  usuario: Usuario | null = null;
  nomeUsuario: string = 'Usuário';
  emailUsuario: string = 'usuario@email.com';

  opcoesPerfil = [
    {
      icone: 'person-outline',
      titulo: 'Meus Dados',
      subtitulo: 'Edite suas informações pessoais',
      rota: '/dados',
      classe: 'cor1'
    },
    {
      icone: 'location-outline',
      titulo: 'Meus Endereços',
      subtitulo: 'Gerencie seus endereços de entrega',
      rota: '/enderecos',
      classe: 'cor2'
    },
    {
      icone: 'receipt-outline',
      titulo: 'Meus Pedidos',
      subtitulo: 'Acompanhe seus pedidos',
      rota: '/pedidos',
      classe: 'cor3'
    },
    {
      icone: 'card-outline',
      titulo: 'Formas de Pagamento',
      subtitulo: 'Gerencie seus cartões e pagamentos',
      rota: '/pagamentos',
      classe: 'cor4'
    },
    {
      icone: 'help-circle-outline',
      titulo: 'Ajuda e Suporte',
      subtitulo: 'Tire suas dúvidas',
      rota: '/ajuda',
      classe: 'cor5'
    },
    {
      icone: 'settings-outline',
      titulo: 'Configurações',
      subtitulo: 'Preferências do aplicativo',
      rota: '/configuracoes',
      classe: 'cor6'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarDadosUsuario();
  }

  carregarDadosUsuario() {
    this.authService.currentUser$.subscribe((user: Usuario | null) => {
      if (user) {
        this.usuario = user;
        this.nomeUsuario = user.nome;
        this.emailUsuario = user.email;
      } else {
        this.nomeUsuario = 'Usuário';
        this.emailUsuario = 'usuario@email.com';
      }
    });
  }

  navegarPara(rota: string) {
    console.log('Navegando para:', rota);
    this.router.navigate([rota]);
  }

  editarFotoPerfil() {
    console.log('Editar foto de perfil');
    this.mostrarToast('Função em desenvolvimento');
  }

  sair() {
    console.log('Fazendo logout...');
    this.authService.logout();
    this.router.navigate(['/login']);
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
        // Já está na página de perfil
        break;
      default:
        console.log('Tab não configurada:', tab);
    }
  }

  private mostrarToast(message: string) {
    const toast = document.createElement('div');
    toast.innerHTML = message;
    toast.style.cssText = `
      position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
      background: #A86F4C; color: white; padding: 12px 24px; border-radius: 25px;
      z-index: 10000; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 2000);
  }
}