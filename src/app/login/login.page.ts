import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
})
export class LoginPage {
  // SUAS PROPRIEDADES ORIGINAIS - mantidas
  email = '';
  senha = '';
  isLoading = false;

  // PROPRIEDADE ADICIONADA: controle de visibilidade da senha
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  // SEU MÉTODO ORIGINAL - mantido exatamente como estava
  async login() {
    if (!this.email || !this.senha) {
      await this.showAlert('Atenção', 'Por favor, preencha email e senha');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      await this.showAlert('Atenção', 'Por favor, digite um email válido');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Fazendo login...',
      duration: 10000 // timeout de 10 segundos
    });
    await loading.present();

    this.isLoading = true;

    try {
      const response = await this.authService.login(this.email, this.senha).toPromise();
      
      if (response?.token) {
        await loading.dismiss();
        await this.showAlert('Sucesso', 'Login realizado com sucesso!');
        this.router.navigateByUrl('/home');
      } else {
        await loading.dismiss();
        await this.showAlert('Erro', 'Resposta inválida do servidor');
      }
    } catch (error: any) {
      await loading.dismiss();
      await this.showAlert('Erro', error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      this.isLoading = false;
    }
  }

  // SEU MÉTODO ORIGINAL - mantido
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // SEU MÉTODO ORIGINAL - mantido
  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // MÉTODO ADICIONADO: toggle para mostrar/esconder senha
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // MÉTODO ADICIONADO: limpar campos (para uso futuro)
  clearFields() {
    this.email = '';
    this.senha = '';
    this.showPassword = false;
  }
}