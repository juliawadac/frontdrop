import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-enderecos',
  templateUrl: './enderecos.page.html',
  styleUrls: ['./enderecos.page.scss'],
  standalone: false,
})
export class EnderecosPage implements OnInit {

  enderecos: any[] = [];
  isLoading = true;
  modalAberto = false;
  editando = false;
  idEnderecoEditando?: number;

  form = {
    titulo: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: ''
  };

  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.carregarEnderecos();
  }

  carregarEnderecos() {
    this.isLoading = true;
    this.authService.listarEnderecos().subscribe({
      next: (dados) => {
        this.enderecos = dados;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.mostrarToast('Erro ao carregar endereços.', 'danger');
      }
    });
  }

  resetForm() {
    this.form = { titulo: '', rua: '', numero: '', bairro: '', cidade: '' };
  }

  abrirModalNovo() {
    this.editando = false;
    this.resetForm();
    this.modalAberto = true;
  }

  abrirModalEditar(end: any) {
    this.editando = true;
    this.idEnderecoEditando = end.id;
    this.form = { ...end };
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
  }

  salvar() {
    if (!this.form.titulo || !this.form.rua || !this.form.numero) {
      this.mostrarToast('Preencha os campos obrigatórios!', 'danger');
      return;
    }

    const requisicao$ = this.editando && this.idEnderecoEditando
      ? this.authService.atualizarEndereco(this.idEnderecoEditando, this.form)
      : this.authService.cadastrarEndereco(this.form);

    requisicao$.subscribe({
      next: () => {
        this.fecharModal();
        this.carregarEnderecos();
        this.mostrarToast(this.editando ? 'Endereço atualizado!' : 'Endereço cadastrado!', 'success');
      },
      error: (err) => {
        console.error(err);
        this.mostrarToast('Erro ao salvar endereço.', 'danger');
      }
    });
  }

  async confirmarExclusao(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir Endereço',
      message: 'Tem certeza que deseja apagar este endereço?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            this.authService.deletarEndereco(id).subscribe({
              next: () => {
                this.carregarEnderecos();
                this.mostrarToast('Endereço removido.', 'success');
              },
              error: (err) => {
                console.error(err);
                this.mostrarToast('Erro ao excluir endereço.', 'danger');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async mostrarToast(msg: string, cor: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2500, color: cor, position: 'bottom' });
    toast.present();
  }
}