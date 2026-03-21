import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LojaService } from '../../services/loja.service';

@Component({
  selector: 'app-empresa-cadastro',
  templateUrl: './empresa-cadastro.page.html',
  styleUrls: ['./empresa-cadastro.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class EmpresaCadastroPage {

  etapa = 1;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  // Categorias espelhando a tabela `categorias` do banco
  categorias = [
    { id: 1, nome: '🍽️ Comida'      },
    { id: 2, nome: '🛒 Mercado'     },
    { id: 3, nome: '💊 Farmácia'    },
    { id: 4, nome: '🔨 Construção'  },
  ];

  form = {
    nome:            '',
    cnpj:            '',
    categoria_id:    null as number | null,
    localizacao:     '',
    numero_endereco: '',
    bairro:          '',
    cidade:          '',
    email:           '',
    senha:           '',
    confirmarSenha:  ''
  };

  constructor(
    private lojaService: LojaService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  // -------------------------------------------
  // Navegação entre etapas
  // -------------------------------------------

  async proximaEtapa() {
    if (this.etapa === 1 && !(await this.validarEtapa1())) return;
    if (this.etapa === 2 && !(await this.validarEtapa2())) return;
    this.etapa++;
  }

  etapaAnterior() {
    if (this.etapa > 1) this.etapa--;
  }

  // -------------------------------------------
  // Validações
  // -------------------------------------------

  private async validarEtapa1(): Promise<boolean> {
    if (!this.form.nome.trim()) {
      await this.showAlert('Atenção', 'Informe o nome da loja'); return false;
    }
    if (!this.cnpjValido(this.form.cnpj)) {
      await this.showAlert('Atenção', 'CNPJ inválido'); return false;
    }
    if (!this.form.categoria_id) {
      await this.showAlert('Atenção', 'Selecione a categoria'); return false;
    }
    return true;
  }

  private async validarEtapa2(): Promise<boolean> {
    if (!this.form.localizacao.trim()) {
      await this.showAlert('Atenção', 'Informe o endereço'); return false;
    }
    if (!this.form.numero_endereco.trim()) {
      await this.showAlert('Atenção', 'Informe o número'); return false;
    }
    return true;
  }

  private async validarEtapa3(): Promise<boolean> {
    if (!this.emailValido(this.form.email)) {
      await this.showAlert('Atenção', 'Informe um e-mail válido'); return false;
    }
    if (this.form.senha.length < 6) {
      await this.showAlert('Atenção', 'A senha deve ter no mínimo 6 caracteres'); return false;
    }
    if (this.form.senha !== this.form.confirmarSenha) {
      await this.showAlert('Atenção', 'As senhas não coincidem'); return false;
    }
    return true;
  }

  // -------------------------------------------
  // Cadastro final
  // -------------------------------------------

  async cadastrar() {
    if (!(await this.validarEtapa3())) return;

    const loading = await this.loadingController.create({ message: 'Cadastrando sua loja...' });
    await loading.present();
    this.isLoading = true;

    try {
      const { confirmarSenha, ...dadosLoja } = this.form;

      const response = await this.lojaService.cadastrar(dadosLoja as any).toPromise();
      await loading.dismiss();

      await this.showAlert('🎉 Sucesso!', 'Sua loja foi cadastrada e já está visível para os clientes!');
      this.router.navigateByUrl('/lojas/dashboard');

    } catch (error: any) {
      await loading.dismiss();
      const msg = error?.error?.erro || 'Erro ao cadastrar. Tente novamente.';
      await this.showAlert('Erro', msg);
    } finally {
      this.isLoading = false;
    }
  }

  // -------------------------------------------
  // Helpers
  // -------------------------------------------

  mascaraCnpj(event: any) {
    let v = event.target.value.replace(/\D/g, '').slice(0, 14);
    if (v.length > 12)      v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    else if (v.length > 8)  v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})/,          '$1.$2.$3/$4');
    else if (v.length > 5)  v = v.replace(/^(\d{2})(\d{3})(\d{3})/,                  '$1.$2.$3');
    else if (v.length > 2)  v = v.replace(/^(\d{2})(\d{3})/,                          '$1.$2');
    this.form.cnpj = v;
  }

  private cnpjValido(cnpj: string): boolean {
    return cnpj.replace(/\D/g, '').length === 14;
  }

  private emailValido(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  togglePassword()        { this.showPassword        = !this.showPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }

  voltar() { this.router.navigate(['/welcome']); }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}