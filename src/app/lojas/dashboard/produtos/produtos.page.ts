import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
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
  isLoading = true;
  isSaving = false;
  modalAberto = false;
  editando = false;
  editandoId?: number;
  exibirSucesso = false; // Controla quando a tela de sucesso aparece

  categorias = [
    { id: 1, nome: '🍽️ Comida' },
    { id: 2, nome: '🛒 Mercado' },
    { id: 3, nome: '💊 Farmácia' },
    { id: 4, nome: '🏗️ Construção' }
  ];

  form: Produto = this.formVazio();

  constructor(
    private dashService: DashboardService, 
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() { 
    this.carregarProdutos(); 
  }

  carregarProdutos() {
    this.isLoading = true;
    this.dashService.listarProdutos().subscribe({
      next: (p) => { 
        this.produtos = p; 
        this.isLoading = false; 
      },
      error: (err) => {
        console.error('Erro ao listar produtos:', err);
        this.isLoading = false;
      }
    });
  }

  formVazio(): Produto {
    return {
      nome: '',
      preco: null as any,
      categoria_id: null as any,
      descricao: '',
      quantidade: 0
    };
  }

  abrirModal() {
    this.editando = false;
    this.exibirSucesso = false; // Garante que abra no formulário
    this.form = this.formVazio();
    this.modalAberto = true;
  }

  editarProduto(p: Produto) {
    this.editando = true;
    this.exibirSucesso = false; // Garante que abra no formulário
    this.editandoId = p.id;
    this.form = { ...p };
    this.modalAberto = true;
  }

  fecharModal() { 
    this.modalAberto = false;
    this.exibirSucesso = false; // Reseta o estado para a próxima vez
  }

  // Função disparada ao clicar no botão "Cadastrar mais produtos"
  cadastrarMais() {
    this.form = this.formVazio();
    this.exibirSucesso = false;
    this.editando = false;
  }

  async salvar() {
    // Validação básica
    if (!this.form.nome || !this.form.preco || !this.form.categoria_id) {
      const alert = await this.alertCtrl.create({
        header: 'Atenção',
        message: 'Preencha os campos obrigatórios (Nome, Preço e Categoria).',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    
    this.isSaving = true;

    // Garantir que os valores vão como números para o MySQL
    const dadosParaEnviar = {
      ...this.form,
      preco: Number(this.form.preco),
      quantidade: Number(this.form.quantidade) || 0
    };

    const req$ = this.editando && this.editandoId
      ? this.dashService.atualizarProduto(this.editandoId, dadosParaEnviar)
      : this.dashService.cadastrarProduto(dadosParaEnviar);

    req$.subscribe({
      next: async () => {
        this.isSaving = false;
        this.carregarProdutos(); // Atualiza a lista na base
        
        // Se for edição, apenas fecha o modal e avisa.
        if (this.editando) {
          this.fecharModal();
          const toast = await this.toastCtrl.create({
            message: 'Produto atualizado com sucesso!',
            duration: 3000,
            color: 'success',
            position: 'bottom'
          });
          await toast.present();
        } else {
          // Se for um produto novo, exibe a tela de sucesso com o botão!
          this.exibirSucesso = true;
        }
      },
      error: async (err) => {
        this.isSaving = false;
        console.error('Erro ao salvar:', err);
        const erroAlert = await this.alertCtrl.create({
          header: 'Erro no Servidor',
          message: `Não foi possível salvar. Detalhe: ${err.message}`,
          buttons: ['OK']
        });
        await erroAlert.present();
      }
    });
  }

  async confirmarDelete(p: Produto) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir?',
      message: `Deseja realmente apagar o produto <strong>${p.nome}</strong>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            this.deletarProduto(p.id!);
          }
        }
      ]
    });
    await alert.present();
  }

  deletarProduto(id: number) {
    this.isLoading = true;
    this.dashService.deletarProduto(id).subscribe({
      next: async () => {
        this.carregarProdutos();
        
        // Mensagem de sucesso ao excluir
        const toast = await this.toastCtrl.create({
          message: 'Produto apagado com sucesso.',
          duration: 3000,
          color: 'dark',
          position: 'bottom'
        });
        await toast.present();
      },
      error: async (err) => {
        this.isLoading = false;
        console.error(err);
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: 'Não foi possível excluir o produto.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }
}