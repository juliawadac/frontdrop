import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { DashboardService } from '../../../../../src/app/services/dashboard.service';
import { LojaService, Loja } from '../../../services/loja.service';

@Component({
  selector: 'app-perfil-loja',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class PerfilLojaPage implements OnInit {

  @ViewChild('fileLogo')   fileLogoRef!: ElementRef<HTMLInputElement>;
  @ViewChild('fileBanner') fileBannerRef!: ElementRef<HTMLInputElement>;

  form = {
    nome:            '',
    localizacao:     '',
    numero_endereco: '',
    bairro:          '',
    cidade:          ''
  };

  logoUrl       = '';
  bannerUrl     = '';
  emailLoja     = '';
  categoriaNome = '';
  isSaving      = false;

  private readonly categorias: Record<number, string> = {
    1: '🍽️ Comida',
    2: '🛒 Mercado',
    3: '💊 Farmácia',
    4: '🔨 Construção'
  };

  constructor(
    private dashService: DashboardService,
    private lojaService: LojaService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    // Sempre busca da API para garantir nome e dados atualizados
    this.lojaService.getLojaAtual().subscribe({
      next: (loja) => {
        this.lojaService.currentLojaSubject.next(loja);
        localStorage.setItem('currentLoja', JSON.stringify(loja));
        this.preencherForm(loja);
      },
      error: () => {
        // Fallback para localStorage se API falhar
        const loja = this.lojaService.currentLojaSubject.getValue();
        if (loja) this.preencherForm(loja);
      }
    });
  }

  private preencherForm(loja: Loja) {
    this.form.nome            = loja.nome        ?? '';
    this.form.localizacao     = loja.localizacao  ?? '';
    this.form.numero_endereco = loja.numero_endereco ?? '';
    this.form.bairro          = loja.bairro       ?? '';
    this.form.cidade          = loja.cidade       ?? '';
    // Só exibe imagem se for uma URL válida (não nula e não vazia)
    this.logoUrl   = (loja.logo_url   && loja.logo_url.startsWith('http'))   ? loja.logo_url   : '';
    this.bannerUrl = (loja.banner_url && loja.banner_url.startsWith('http')) ? loja.banner_url : '';
    this.emailLoja            = loja.email        ?? '';
    this.categoriaNome        = this.categorias[loja.categoria_id] ?? '';
  }

  trocarLogo()   { this.fileLogoRef.nativeElement.click(); }
  trocarBanner() { this.fileBannerRef.nativeElement.click(); }

  onLogoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { this.logoUrl = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  onBannerChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { this.bannerUrl = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  async salvarPerfil() {
    if (!this.form.nome.trim()) {
      const a = await this.alertCtrl.create({
        header: 'Atenção', message: 'O nome não pode estar vazio', buttons: ['OK']
      });
      await a.present();
      return;
    }

    this.isSaving = true;
    this.dashService.atualizarPerfil(this.form).subscribe({
      next: async (response: any) => {
        this.isSaving = false;
        // Usa o Resultado do servidor para garantir dados corretos
        const lojaAtualizada = response?.Resultado ?? {
          ...this.lojaService.currentLojaSubject.getValue(),
          ...this.form
        };
        this.lojaService.currentLojaSubject.next(lojaAtualizada);
        localStorage.setItem('currentLoja', JSON.stringify(lojaAtualizada));
        this.preencherForm(lojaAtualizada);
        const a = await this.alertCtrl.create({
          header: '✓ Salvo', message: 'Perfil atualizado com sucesso', buttons: ['OK']
        });
        await a.present();
      },
      error: async () => {
        this.isSaving = false;
        const a = await this.alertCtrl.create({
          header: 'Erro', message: 'Não foi possível salvar. Tente novamente.', buttons: ['OK']
        });
        await a.present();
      }
    });
  }

  sair() {
    this.lojaService.logout();
    this.router.navigateByUrl('/welcome');
  }
}