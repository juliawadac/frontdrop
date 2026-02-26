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
  codigoInserido = '';
  isLoading = false;
  etapaVerificacao = false;

  // PROPRIEDADE ADICIONADA: controle de visibilidade da senha
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  // SEU MÉTODO ORIGINAL - mantido exatamente como estava
  async cadastrar() {
    // 1. Mantenha as suas validações iniciais (nome, email, etc.)
    if (!this.nome || !this.sobrenome || !this.email || !this.senha) {
      await this.showAlert('Atenção', 'Preencha todos os campos obrigatórios!');
      return;
    }

    // 2. ADICIONE: Validação para garantir que o utilizador digitou o código de 6 dígitos
    if (!this.codigoInserido || this.codigoInserido.length !== 6) {
      await this.showAlert('Atenção', 'Por favor, insira o código de 6 dígitos enviado para o seu e-mail.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Finalizando cadastro...',
    });
    await loading.present();

    this.isLoading = true;

    // 3. ALTERE: Inclua a propriedade 'codigo' no objeto enviado ao back-end
    const dadosDoCadastro: any = {
      nome: this.nome.trim(),
      sobrenome: this.sobrenome.trim(),
      email: this.email.trim().toLowerCase(),
      senha: this.senha,
      endereco: this.endereco.trim(),
      numero_endereco: String(this.numero_endereco).trim(),
      codigo: this.codigoInserido // <--- O servidor vai usar isto para confirmar o e-mail
    };

    try {
      // 4. O authService enviará os dados e o servidor só salvará se o código estiver correto
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
      // 5. Exibe a mensagem de erro vinda do back-end (ex: "Código inválido ou expirado")
      await this.showAlert('Erro', error.error?.error || 'Erro ao cadastrar. Verifique o código.');
    } finally {
      this.isLoading = false;
    }
  }

  async solicitarCodigo() {
    // 1. Valida se os campos básicos estão preenchidos
    if (!this.nome || !this.email || !this.senha) {
      await this.showAlert('Atenção', 'Preencha os campos obrigatórios primeiro!');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Enviando código para seu e-mail...'
    });
    await loading.present();

    // 2. Chama o serviço para enviar o e-mail (usando o método que você adicionou no AuthService)
    this.authService.enviarCodigo(this.email).subscribe({
      next: async () => {
        await loading.dismiss();
        this.etapaVerificacao = true; // Libera a tela para digitar o código
        await this.showAlert('Sucesso', 'Código enviado! Verifique sua caixa de entrada.');
      },
      error: async (err) => {
        await loading.dismiss();
        await this.showAlert('Erro', 'Falha ao enviar e-mail. Tente novamente.');
      }
    });
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