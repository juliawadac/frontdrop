import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DashboardService, Pedido, StatusPedido } from '../../../services/dashboard.service';
import { LojaService } from '../../../services/loja.service';
import { interval, Subscription } from 'rxjs';

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
    private alertCtrl: AlertController,
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

    const alert = await this.alertCtrl.create({
      header: labels[novoStatus],
      message: `Pedido #${pedido.id} — ${pedido.cliente_nome}`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: () => {
            // Tentamos atualizar o status...
            this.dashService.atualizarStatus(pedido.id, novoStatus).subscribe({
              next: () => {
                // Se der certo, recarrega a lista
                this.carregarPedidos(false);
              },
              error: async (err) => {
                // SE DER ERRO, VAMOS MOSTRAR NA TELA!
                console.error(err);
                const erroAlert = await this.alertCtrl.create({
                  header: 'Erro na Conexão 🕵️‍♂️',
                  message: `Código: ${err.status} \nDetalhe: ${err.message}`,
                  buttons: ['OK']
                });
                await erroAlert.present();
              }
            });
          }
        }
      ]
    });
    await alert.present();
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