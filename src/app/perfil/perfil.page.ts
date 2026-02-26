import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ActionSheetController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';

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
  profilePhoto: string | null = null;

  opcoesPerfil = [
    { icone: 'person-outline',       titulo: 'Meus Dados',           subtitulo: 'Edite suas informações pessoais',      rota: '/dados',          classe: 'cor1' },
    { icone: 'location-outline',     titulo: 'Meus Endereços',       subtitulo: 'Gerencie seus endereços de entrega',   rota: '/enderecos',      classe: 'cor2' },
    { icone: 'receipt-outline',      titulo: 'Meus Pedidos',         subtitulo: 'Acompanhe seus pedidos',               rota: '/pedidos',        classe: 'cor3' },
    { icone: 'card-outline',         titulo: 'Formas de Pagamento',  subtitulo: 'Gerencie seus cartões e pagamentos',   rota: '/pagamentos',     classe: 'cor4' },
    { icone: 'help-circle-outline',  titulo: 'Ajuda e Suporte',      subtitulo: 'Tire suas dúvidas',                    rota: '/ajuda',          classe: 'cor5' },
    { icone: 'settings-outline',     titulo: 'Configurações',        subtitulo: 'Preferências do aplicativo',           rota: '/configuracoes',  classe: 'cor6' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.carregarDadosUsuario();
    // Assina o observable para sempre ter a foto mais recente
    this.profileService.photo$.subscribe(photo => {
      this.profilePhoto = photo;
    });
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

  /** Abre o seletor de foto ao clicar no avatar */
  async editarFotoPerfil() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Foto de Perfil',
      buttons: [
        {
          text: 'Escolher da Galeria',
          icon: 'image-outline',
          handler: () => this.abrirGaleria()
        },
        {
          text: 'Remover Foto',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => {
            this.profileService.clearPhoto();
            this.mostrarToast('Foto removida');
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  /** Abre input file para selecionar imagem da galeria */
  private abrirGaleria() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        this.profileService.setPhoto(base64);
        this.mostrarToast('Foto atualizada com sucesso!');
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  navegarPara(rota: string) {
    this.router.navigate([rota]);
  }

  sair() {
    this.authService.logout();
    this.router.navigate(['/login']);
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
    setTimeout(() => document.body.removeChild(toast), 2500);
  }
}