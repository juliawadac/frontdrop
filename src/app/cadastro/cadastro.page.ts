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
  // SUAS PROPRIEDADES ORIGINAIS - mantidas exatamente
  nome = '';
  sobrenome = '';
  email = '';
  senha = '';
  endereco = '';
  numero_endereco = ''; 
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
      numero_endereco: String(this.numero_endereco).trim(), // Convertendo para string antes do trim
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

  // SEU MÉTODO ORIGINAL - mantido
  irParaLogin() {
    this.router.navigateByUrl('/login');
  }

  // MÉTODO ADICIONADO: toggle para mostrar/esconder senha
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // MÉTODO ADICIONADO: validações adicionais para melhor UX
  validateName(name: string): boolean {
    return name.trim().length >= 2;
  }

  validateAddress(): boolean {
    return this.endereco.trim().length >= 5;
  }

  // MÉTODO ADICIONADO: limpar todos os campos
  clearAllFields() {
    this.nome = '';
    this.sobrenome = '';
    this.email = '';
    this.senha = '';
    this.endereco = '';
    this.numero_endereco = ''; // Garantindo que seja string vazia
    this.showPassword = false;
  }

  // MÉTODO ADICIONADO: validação em tempo real
  isFormValid(): boolean {
    return !!(
      this.nome.trim() && 
      this.sobrenome.trim() && 
      this.email.trim() && 
      this.senha.length >= 6 &&
      this.isValidEmail(this.email)
    );
  }
}