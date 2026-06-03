import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule]
})
export class PerfilPage implements OnInit {

  private readonly API_URL = 'http://localhost:3000/usuarios';

  secaoAtiva: string = 'menu';
  carregando: boolean = false;

  nomeUsuario: string = 'Usuário';
  emailUsuario: string = 'usuario@email.com';
  profilePhoto: string | null = null;

  enderecos: any[] = [];
  cartoes: any[] = [];
  pedidos: any[] = [];

  dadosForm: any = { nome: '', sobrenome: '', email: '', endereco: '', numero: '' };
  novoEndereco: any = { titulo: '', endereco: '', numero: '', bairro: '', cidade: '', complemento: '' };
  novoCartao: any = { titular: '', numero_cartao: '', validade: '', cvv: '', bandeira: 'Visa' };
  configuracoes: any = { notificacoes: true, emails: true, modoEscuro: false };

  opcoesPerfil = [
    { icone: 'person-outline',       titulo: 'Meus Dados',           subtitulo: 'Edite suas informações pessoais',      rota: 'dados',          classe: 'cor1' },
    { icone: 'location-outline',     titulo: 'Meus Endereços',       subtitulo: 'Gerencie seus endereços de entrega',    rota: 'enderecos',      classe: 'cor2' },
    { icone: 'card-outline',         titulo: 'Formas de Pagamento',   subtitulo: 'Gerencie seus cartões de crédito',     rota: 'pagamentos',     classe: 'cor4' },
    { icone: 'settings-outline',     titulo: 'Configurações',        subtitulo: 'Preferências do aplicativo e alertas',  rota: 'configuracoes',  classe: 'cor6' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.restaurarCacheLocal();
    this.carregarDadosDoBanco();
  }

  ionViewWillEnter() {
    this.carregarDadosDoBanco();
  }

  // Coleta o token de todas as formas possíveis para evitar cabeçalho vazio
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('usuario_token') || 
                  localStorage.getItem('user_token'); // Fallback extra
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private restaurarCacheLocal() {
    try {
      this.secaoAtiva = localStorage.getItem('drop_perfil_secao') || 'menu';

      const cacheUser = localStorage.getItem('drop_cache_user');
      const cacheEnderecos = localStorage.getItem('drop_cache_enderecos');
      const cacheCartoes = localStorage.getItem('drop_cache_cartoes');
      const cacheConfig = localStorage.getItem('drop_cache_config');

      if (cacheUser) {
        const dados = JSON.parse(cacheUser);
        this.nomeUsuario = `${dados.nome} ${dados.sobrenome || ''}`.trim();
        this.emailUsuario = dados.email;
        this.profilePhoto = dados.foto_perfil || null;
        Object.assign(this.dadosForm, dados);
      }
      if (cacheEnderecos) this.enderecos = JSON.parse(cacheEnderecos);
      if (cacheCartoes) this.cartoes = JSON.parse(cacheCartoes);
      if (cacheConfig) Object.assign(this.configuracoes, JSON.parse(cacheConfig));
    } catch (e) {
      console.warn('Erro ao ler cache:', e);
    }
  }

  carregarDadosDoBanco() {
    const headers = this.getHeaders();

    // REMOVIDO O DESLOGAMENTO AUTOMÁTICO AGRESSIVO:
    // Agora o sistema avisa o erro no console em vez de chutar você da sessão instantaneamente.

    // 1. Dados do Perfil
    this.http.get(`${this.API_URL}/me`, { headers }).subscribe({
      next: (res: any) => {
        const dadosUser = res?.Resultado || res;
        if (dadosUser) {
          this.nomeUsuario = `${dadosUser.nome} ${dadosUser.sobrenome || ''}`.trim();
          this.emailUsuario = dadosUser.email;
          this.profilePhoto = dadosUser.foto_perfil || null;

          this.dadosForm.nome = dadosUser.nome || '';
          this.dadosForm.sobrenome = dadosUser.sobrenome || '';
          this.dadosForm.email = dadosUser.email || '';
          this.dadosForm.endereco = dadosUser.endereco || '';
          this.dadosForm.numero = dadosUser.numero_endereco || '';
          
          localStorage.setItem('drop_cache_user', JSON.stringify(dadosUser));
        }
      },
      error: (err) => {
        console.error('🚨 [ERRO BACKEND] Falha na rota /me:', err);
        this.mostrarToast('Não foi possível sincronizar os dados do perfil.');
      }
    });

    // 2. Endereços
    this.http.get(`${this.API_URL}/perfil/enderecos`, { headers }).subscribe({
      next: (res: any) => {
        this.enderecos = res || [];
        localStorage.setItem('drop_cache_enderecos', JSON.stringify(this.enderecos));
      },
      error: (err) => console.error('🚨 [ERRO BACKEND] Falha em /enderecos:', err)
    });

    // 3. Cartões
    this.http.get(`${this.API_URL}/perfil/cartoes`, { headers }).subscribe({
      next: (res: any) => {
        this.cartoes = res || [];
        localStorage.setItem('drop_cache_cartoes', JSON.stringify(this.cartoes));
      },
      error: (err) => console.error('🚨 [ERRO BACKEND] Falha em /cartoes:', err)
    });

    // 4. Configurações
    this.http.get(`${this.API_URL}/perfil/configuracoes`, { headers }).subscribe({
      next: (res: any) => {
        if (res) {
          this.configuracoes.notificacoes = res.notificacoes === 1 || res.notificacoes === true;
          this.configuracoes.emails = res.emails === 1 || res.emails === true;
          this.configuracoes.modoEscuro = res.modo_escuro === 1 || res.modo_escuro === true;
          localStorage.setItem('drop_cache_config', JSON.stringify(this.configuracoes));
        }
      },
      error: (err) => console.error('🚨 [ERRO BACKEND] Falha em /configuracoes:', err)
    });
  }

  navegarPara(rota: string) {
    this.secaoAtiva = rota;
    localStorage.setItem('drop_perfil_secao', rota);
  }

  voltarAoMenu() {
    this.secaoAtiva = 'menu';
    localStorage.setItem('drop_perfil_secao', 'menu');
  }

  salvarDados() {
    this.http.put(`${this.API_URL}`, this.dadosForm, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.mostrarToast('Dados atualizados com sucesso!');
        this.carregarDadosDoBanco();
        this.voltarAoMenu();
      },
      error: () => this.mostrarToast('Erro ao atualizar dados.')
    });
  }

  adicionarEndereco() {
    if (!this.novoEndereco.titulo || !this.novoEndereco.endereco || !this.novoEndereco.numero) {
      this.mostrarToast('Preencha os campos obrigatórios!');
      return;
    }
    this.http.post(`${this.API_URL}/perfil/enderecos`, this.novoEndereco, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.mostrarToast('Endereço adicionado!');
        this.novoEndereco = { titulo: '', endereco: '', numero: '', bairro: '', cidade: '', complemento: '' };
        this.carregarDadosDoBanco();
      }
    });
  }

  removerEndereco(id: number, event: Event) {
    event.stopPropagation();
    this.http.delete(`${this.API_URL}/perfil/enderecos/${id}`, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.mostrarToast('Endereço removido!');
        this.carregarDadosDoBanco();
      }
    });
  }

  alternarPadraoEndereco(id: number) {
    this.http.put(`${this.API_URL}/perfil/enderecos/${id}/padrao`, {}, { headers: this.getHeaders() }).subscribe({
      next: () => this.carregarDadosDoBanco()
    });
  }

  adicionarCartao() {
    if (!this.novoCartao.titular || !this.novoCartao.numero_cartao || !this.novoCartao.validade || !this.novoCartao.cvv) {
      this.mostrarToast('Preencha todos os campos!');
      return;
    }
    this.http.post(`${this.API_URL}/perfil/cartoes`, this.novoCartao, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.mostrarToast('Cartão adicionado!');
        this.novoCartao = { titular: '', numero_cartao: '', validade: '', cvv: '', bandeira: 'Visa' };
        this.carregarDadosDoBanco();
      }
    });
  }

  removerCartao(id: number, event: Event) {
    event.stopPropagation();
    this.http.delete(`${this.API_URL}/perfil/cartoes/${id}`, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.mostrarToast('Cartão removido!');
        this.carregarDadosDoBanco();
      }
    });
  }

  alternarPadraoCartao(id: number) {
    this.http.put(`${this.API_URL}/perfil/cartoes/${id}/padrao`, {}, { headers: this.getHeaders() }).subscribe({
      next: () => this.carregarDadosDoBanco()
    });
  }

  salvarConfiguracoes() {
    const payload = {
      notificacoes: this.configuracoes.notificacoes ? 1 : 0,
      emails: this.configuracoes.emails ? 1 : 0,
      modo_escuro: this.configuracoes.modoEscuro ? 1 : 0
    };
    this.http.put(`${this.API_URL}/perfil/configuracoes`, payload, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.mostrarToast('Configurações salvas!');
        localStorage.setItem('drop_cache_config', JSON.stringify(this.configuracoes));
      }
    });
  }

  salvarTudoNoCelular() {
    this.salvarConfiguracoes();
  }

  editarFotoPerfil() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        this.http.put(`${this.API_URL}/perfil/foto`, { foto: base64 }, { headers: this.getHeaders() }).subscribe({
          next: () => {
            this.profilePhoto = base64;
            this.mostrarToast('Foto atualizada!');
          }
        });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  sair() {
    this.authService.logout();
    localStorage.clear(); // Limpa tudo ao deslogar voluntariamente
    this.router.navigate(['/login']);
  }

  private async mostrarToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'dark',
      position: 'bottom'
    });
    await toast.present();
  }
}