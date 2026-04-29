import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { LojaService } from '../../services/loja.service';

@Component({
  selector: 'app-empresa-login',
  templateUrl: './empresa-login.page.html',
  styleUrls: ['./empresa-login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class EmpresaLoginPage {

  email       = '';
  senha       = '';
  isLoading   = false;
  showPassword = false;

  constructor(
    private lojaService: LojaService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  async login() {
    if (!this.email || !this.senha) {
      await this.showAlert('Atenção', 'Preencha e-mail e senha');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Entrando...' });
    await loading.present();
    this.isLoading = true;

    try {
      const response = await this.lojaService.login(this.email, this.senha).toPromise();

      await loading.dismiss();

      if (response?.token) {
        this.router.navigateByUrl('/lojas/dashboard');
      } else {
        await this.showAlert('Erro', 'Resposta inválida do servidor');
      }
    } catch (error: any) {
      await loading.dismiss();
      const msg = error?.error?.erro || 'Erro ao fazer login. Tente novamente.';
      await this.showAlert('Erro', msg);
    } finally {
      this.isLoading = false;
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  voltar() {
    this.router.navigate(['/welcome']);
  }

  irParaCadastro() {
    this.router.navigate(['/lojas/cadastro']);
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}