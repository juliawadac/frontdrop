import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { DashboardService, Produto } from '../../../services/dashboard.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.page.html',
  styleUrls: ['./produtos.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ProdutosPage implements OnInit {

  produtos: Produto[] = [];
  isLoading  = true;
  isSaving   = false;
  modalAberto = false;
  editando   = false;
  editandoId?: number;

  categorias = [
    { id: 1, nome: '🍽️ Comida'     },
    { id: 2, nome: '🛒 Mercado'    },
    { id: 3, nome: '💊 Farmácia'   },
    { id: 4, nome: '🔨 Construção' },
  ];

  form: Produto = this.formVazio();

  constructor(
    private dashService: DashboardService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() { this.carregarProdutos(); }

  carregarProdutos() {
    this.isLoading = true;
    this.dashService.listarProdutos().subscribe({
      next: (p) => { this.produtos = p; this.isLoading = false; },
      error: ()  => { this.isLoading = false; }
    });
  }

  abrirModal() {
    this.editando   = false;
    this.editandoId = undefined;
    this.form       = this.formVazio();
    this.modalAberto = true;
  }

  editarProduto(p: Produto) {
    this.editando   = true;
    this.editandoId = p.id;
    this.form       = { ...p };
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.form        = this.formVazio();
  }

  async salvar() {
    if (!this.form.nome || !this.form.preco || !this.form.categoria_id) {
      const a = await this.alertCtrl.create({
        header: 'Atenção',
        message: 'Preencha nome, preço e categoria',
        buttons: ['OK']
      });
      await a.present();
      return;
    }

    this.isSaving = true;

    const req$ = this.editando && this.editandoId
      ? this.dashService.atualizarProduto(this.editandoId, this.form)
      : this.dashService.cadastrarProduto(this.form);

    req$.subscribe({
      next: async () => {
        this.isSaving = false;
        this.fecharModal();
        this.carregarProdutos();
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

  async confirmarDelete(p: Produto) {
    const alert = await this.alertCtrl.create({
      header: 'Remover produto',
      message: `Deseja remover "${p.nome}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Remover',
          handler: () => {
            this.dashService.deletarProduto(p.id!).subscribe({
              next: () => this.carregarProdutos()
            });
          }
        }
      ]
    });
    await alert.present();
  }

  private formVazio(): Produto {
    return { nome: '', preco: 0, descricao: '', quantidade: 0, categoria_id: 0 };
  }
}
