import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // Removido LoadingController e AlertController daqui
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service'; // Injetado seu serviço global
import Swal from 'sweetalert2'; // Importado para controle do Loading nativo

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
})
export class CadastroPage {
  // SUAS PROPRIEDADES ORIGINAIS - mantidas exatamente iguais
  nome = '';
  sobrenome = '';
  email = '';
  senha = '';
  endereco = '';
  numero_endereco = '';
  codigoInserido = '';
  isLoading = false;
  etapaVerificacao = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService // Substituiu os controladores do Ionic
  ) { }

  // ✅ MÉTODO ATUALIZADO: Processo de cadastro final com SweetAlert
  async cadastrar() {
    // 1. Validações iniciais usando o AlertService
    if (!this.nome || !this.sobrenome || !this.email || !this.senha) {
      this.alertService.mostrarErro('Preencha todos os campos obrigatórios!');
      return;
    }

    if (!this.codigoInserido || this.codigoInserido.length !== 6) {
      this.alertService.mostrarErro('Por favor, insira o código de 6 dígitos enviado para o seu e-mail.');
      return;
    }

    Swal.fire({
      title: 'Finalizando cadastro...',
      text: 'Por favor, aguarde enquanto criamos seu perfil.',
      allowOutsideClick: false,
      showConfirmButton: false,
      iconColor: '#99521c',
      heightAuto: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.isLoading = true;

    const dadosDoCadastro: any = {
      nome: this.nome.trim(),
      sobrenome: this.sobrenome.trim(),
      email: this.email.trim().toLowerCase(),
      senha: this.senha,
      endereco: this.endereco.trim(),
      numero_endereco: String(this.numero_endereco).trim(),
      codigo: this.codigoInserido
    };

    try {
      const response = await this.authService.cadastrar(dadosDoCadastro).toPromise();

      // 3. Fecha o Loading assim que recebe a resposta
      Swal.close(); 

      if (response?.Mensagem) {
        // Alerta de sucesso em formato Toast (não trava a navegação)
        this.alertService.mostrarToastSucesso('Cadastro realizado com sucesso!');
        this.router.navigateByUrl('/login');
      } else {
        this.alertService.mostrarErro('Resposta inválida do servidor');
      }
    } catch (error: any) {
      // Fecha o Loading se der ruim
      Swal.close(); 
      this.alertService.mostrarErro(error.error?.error || 'Erro ao cadastrar. Verifique o código.');
    } finally {
      this.isLoading = false;
    }
  }

  async solicitarCodigo() {
    if (!this.nome || !this.email || !this.senha) {
      this.alertService.mostrarErro('Preencha os campos obrigatórios primeiro!');
      return;
    }

    Swal.fire({
      title: 'Enviando código...',
      text: 'Verifique a sua caixa de entrada em instantes.',
      allowOutsideClick: false,
      showConfirmButton: false,
      iconColor: '#99521c',
      heightAuto: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.enviarCodigo(this.email).subscribe({
      next: async () => {
        Swal.close(); // Fecha o indicador de carregamento
        this.etapaVerificacao = true; // Libera os campos de verificação no HTML
        this.alertService.mostrarToastSucesso('Código enviado! Verifique o e-mail.');
      },
      error: async (err) => {
        Swal.close(); // Fecha o indicador de carregamento
        this.alertService.mostrarErro('Falha ao enviar e-mail. Tente novamente.');
      }
    });
  }

  // SEUS MÉTODOS AUXILIARES - mantidos intactos para garantir o funcionamento do seu HTML
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  irParaLogin() {
    this.router.navigateByUrl('/login');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  validateName(name: string): boolean {
    return name.trim().length >= 2;
  }

  validateAddress(): boolean {
    return this.endereco.trim().length >= 5;
  }

  clearAllFields() {
    this.nome = '';
    this.sobrenome = '';
    this.email = '';
    this.senha = '';
    this.endereco = '';
    this.numero_endereco = '';
    this.showPassword = false;
  }

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