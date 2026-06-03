import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // <-- AlertController removido
import { Router } from '@angular/router';
import { DashboardService, Pedido, StatusPedido } from '../../../services/dashboard.service';
import { LojaService } from '../../../services/loja.service';
import { interval, Subscription } from 'rxjs';
import { AlertService } from '../../../services/alert.service'; // <-- Seu serviço importado
import Swal from 'sweetalert2'; // <-- SweetAlert importado para a caixa de confirmação

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class PedidosPage implements OnInit, OnDestroy {

  pedidos: Pedido[] = [];
  isLoading = true;
  nomeLoja  = '';
  logoUrl   = '';

  private refreshSub?: Subscription;

  constructor(
    private dashService: DashboardService,
    private lojaService: LojaService,
    private alertService: AlertService, // <-- Serviço injetado no lugar do antigo alertCtrl
    private router: Router
  ) {}

  ngOnInit() {
    const loja = this.lojaService.currentLojaSubject.getValue();
    this.nomeLoja = loja?.nome ?? 'Minha Loja';
    this.logoUrl  = loja?.logo_url ?? '';

    this.carregarPedidos();

    // Auto-refresh a cada 30 segundos, caso a conexão em tempo real falhe
    this.refreshSub = interval(30000).subscribe(() => this.carregarPedidos(false));
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  carregarPedidos(showLoader = true) {
    if (showLoader) this.isLoading = true;

    this.dashService.listarPedidos().subscribe({
      next: (pedidos) => {
        // Filtra só os ativos (exclui Entregue e Cancelado)
        this.pedidos = pedidos.filter(p =>
          ['Pendente', 'Preparo', 'Entregando'].includes(p.status)
        );
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  getPorStatus(status: StatusPedido): Pedido[] {
    return this.pedidos.filter(p => p.status === status);
  }

  contagemPorStatus(status: StatusPedido): number {
    return this.getPorStatus(status).length;
  }

  async mudarStatus(pedido: Pedido, novoStatus: StatusPedido, event: Event) {
    event.stopPropagation();

    const labels: Record<string, string> = {
      Preparo:    'Aceitar pedido?',
      Entregando: 'Marcar como saiu para entrega?',
      Entregue:   'Confirmar entrega?',
      Cancelado:  'Recusar este pedido?'
    };

    // Modal de Confirmação usando o SweetAlert2 lindão
    const confirmacao = await Swal.fire({
      title: labels[novoStatus],
      text: `Pedido #${pedido.id} — ${pedido.cliente_nome}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#99521c', // Cor padrão do seu app
      cancelButtonColor: '#e74c3c',  // Vermelho para cancelar
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true, // Coloca o botão de confirmar na direita
      background: '#ffffff',
      color: '#2c1810',
      heightAuto: false,
      customClass: {
        popup: 'swal-border-radius' // Aplica as bordas arredondadas modernas
      }
    });

    // Se o usuário clicar em "Confirmar"
    if (confirmacao.isConfirmed) {
      this.dashService.atualizarStatus(pedido.id, novoStatus).subscribe({
        next: () => {
          // Se der certo, recarrega a lista e solta o Toast de sucesso
          this.carregarPedidos(false);
          this.alertService.mostrarToastSucesso('Status atualizado com sucesso!');
        },
        error: (err) => {
          // SE DER ERRO, usa o AlertService para exibir o erro chique
          console.error(err);
          this.alertService.mostrarErro(`Falha na Conexão: ${err.message}`);
        }
      });
    }
  }

  abrirPedido(pedido: Pedido) {
    // Futuramente: abrir um modal com mais detalhes do pedido
  }

  irPerfil() {
    this.router.navigate(['/lojas/dashboard/perfil']);
  }

  formatarHora(data: string): string {
    if (!data) return '';
    return new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}