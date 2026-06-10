import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dados',
  templateUrl: './dados.page.html',
  styleUrls: ['./dados.page.scss'],
  standalone: false,
})
export class DadosPage implements OnInit {
  
  form = {
    nome: '',
    sobrenome: '',
    email: ''
  };

  isSaving = false;

  // Controle do Fluxo de Senha por E-mail
  exibirCamposSenha = false;
  isSendingCode = false;
  isConfirmingSenha = false;
  codigoVerificacao = '';
  novaSenha = '';

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.form = {
          nome: user.nome || '',
          sobrenome: user.sobrenome || '',
          email: user.email || ''
        };
      }
    });
  }

  async salvar() {
    if (!this.form.nome || !this.form.email) {
      this.mostrarToast('Nome e e-mail são obrigatórios!', 'danger');
      return;
    }

    this.isSaving = true;

    this.authService.atualizarUsuario(this.form).subscribe({
      next: () => {
        this.isSaving = false;
        this.mostrarToast('Dados pessoais salvos com sucesso!', 'success');
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        this.mostrarToast('Erro ao atualizar os dados.', 'danger');
      }
    });
  }

  alterarSenha() {
    this.isSendingCode = true;

    this.authService.solicitarCodigoSenha().subscribe({
      next: () => {
        this.isSendingCode = false;
        this.exibirCamposSenha = true;
        this.mostrarToast('Código de verificação enviado ao seu e-mail!', 'success');
      },
      error: (err) => {
        this.isSendingCode = false;
        console.error(err);
        this.mostrarToast('Falha ao enviar código de segurança.', 'danger');
      }
    });
  }

  confirmarSenha() {
    if (!this.codigoVerificacao || !this.novaSenha) {
      this.mostrarToast('Preencha o código do e-mail e a nova senha!', 'danger');
      return;
    }

    this.isConfirmingSenha = true;

    this.authService.confirmarNovaSenha(this.codigoVerificacao, this.novaSenha).subscribe({
      next: () => {
        this.isConfirmingSenha = false;
        this.exibirCamposSenha = false;
        this.codigoVerificacao = '';
        this.novaSenha = '';
        this.mostrarToast('Sua senha foi alterada com sucesso!', 'success');
      },
      error: (err) => {
        this.isConfirmingSenha = false;
        console.error(err);
        this.mostrarToast('Código inválido, expirado ou erro no servidor.', 'danger');
      }
    });
  }

  async mostrarToast(mensagem: string, cor: string) {
    const toast = await this.toastCtrl.create({
      message: mensagem,
      duration: 3500,
      color: cor,
      position: 'bottom'
    });
    toast.present();
  }
}