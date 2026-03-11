import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-esqueci-senha',
  templateUrl: './esqueci-senha.page.html',
  styleUrls: ['./esqueci-senha.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
})
export class EsqueciSenhaPage {

  private apiUrl = 'http://localhost:3000/auth';

  // Controla qual etapa está visível: 'email' | 'codigo'
  etapa: 'email' | 'codigo' = 'email';

  // Etapa 1
  email = '';

  // Etapa 2
  codigo = '';
  novaSenha = '';
  confirmarSenha = '';
  showNovaSenha = false;
  showConfirmarSenha = false;

  isLoading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  // ETAPA 1: Envia o email para receber o código
  async enviarCodigo() {
    if (!this.email) {
      await this.showAlert('Atenção', 'Digite seu email para continuar.');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Enviando código...' });
    await loading.present();
    this.isLoading = true;

    this.http.post(`${this.apiUrl}/solicitar-recuperacao`, { email: this.email })
      .subscribe({
        next: async () => {
          await loading.dismiss();
          this.isLoading = false;
          this.etapa = 'codigo'; // Avança para a etapa 2
        },
        error: async (err) => {
          await loading.dismiss();
          this.isLoading = false;
          await this.showAlert('Erro', err.error?.error || 'Não foi possível enviar o código.');
        }
      });
  }

  // ETAPA 2: Valida o código e redefine a senha
  async redefinirSenha() {
    if (!this.codigo || !this.novaSenha || !this.confirmarSenha) {
      await this.showAlert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      await this.showAlert('Atenção', 'As senhas não coincidem.');
      return;
    }

    if (this.novaSenha.length < 6) {
      await this.showAlert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Redefinindo senha...' });
    await loading.present();
    this.isLoading = true;

    this.http.post(`${this.apiUrl}/redefinir-senha`, {
      email: this.email,
      codigo: this.codigo,
      novaSenha: this.novaSenha
    }).subscribe({
      next: async () => {
        await loading.dismiss();
        this.isLoading = false;
        const alert = await this.alertController.create({
          header: '✅ Sucesso!',
          message: 'Sua senha foi redefinida. Faça login com a nova senha.',
          buttons: [{
            text: 'Ir para Login',
            handler: () => this.router.navigate(['/login'])
          }]
        });
        await alert.present();
      },
      error: async (err) => {
        await loading.dismiss();
        this.isLoading = false;
        await this.showAlert('Erro', err.error?.error || 'Código inválido ou expirado.');
      }
    });
  }

  voltarParaEmail() {
    this.etapa = 'email';
    this.codigo = '';
    this.novaSenha = '';
    this.confirmarSenha = '';
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}