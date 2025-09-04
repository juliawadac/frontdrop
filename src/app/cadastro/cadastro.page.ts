import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, Usuario } from '../services/auth.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
})
export class CadastroPage {
  nome = '';
  sobrenome = '';
  email = '';
  senha = '';
  endereco = '';
  numero_endereco = ''; // 👈 corrigido aqui
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  async cadastrar() {
    if (!this.nome || !this.sobrenome || !this.email || !this.senha) {
      await this.showAlert('Atenção', 'Preencha todos os campos obrigatórios (nome, sobrenome, email e senha)!');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      await this.showAlert('Atenção', 'Por favor, digite um email válido');
      return;
    }

    if (this.senha.length < 6) {
      await this.showAlert('Atenção', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Cadastrando usuário...',
      duration: 10000
    });
    await loading.present();

    this.isLoading = true;

    const dadosDoCadastro: Usuario = {
      nome: this.nome.trim(),
      sobrenome: this.sobrenome.trim(),
      email: this.email.trim().toLowerCase(),
      senha: this.senha,
      endereco: this.endereco.trim(),
      numero_endereco: this.numero_endereco.trim(), // 👈 corrigido aqui
    };

    try {
      const response = await this.authService.cadastrar(dadosDoCadastro).toPromise();
      
      if (response?.Mensagem) {
        await loading.dismiss();
        await this.showAlert('Sucesso', 'Cadastro realizado com sucesso!');
        this.router.navigateByUrl('/login');
      } else {
        await loading.dismiss();
        await this.showAlert('Erro', 'Resposta inválida do servidor');
      }
    } catch (error: any) {
      await loading.dismiss();
      await this.showAlert('Erro', error.message || 'Erro ao cadastrar. Tente novamente.');
    } finally {
      this.isLoading = false;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  irParaLogin() {
    this.router.navigateByUrl('/login');
  }
}
