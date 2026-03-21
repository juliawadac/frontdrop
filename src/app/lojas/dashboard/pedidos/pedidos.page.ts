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

    // Auto-refresh a cada 30 segundos
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
      message: `Pedido #${pedido.numero_pedido} — ${pedido.cliente_nome}`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: () => {
            this.dashService.atualizarStatus(pedido.id, novoStatus).subscribe({
              next: () => this.carregarPedidos(false),
              error: () => {}
            });
          }
        }
      ]
    });
    await alert.present();
  }

  abrirPedido(pedido: Pedido) {
    // Futuramente: abrir modal com detalhes
  }

  irPerfil() {
    this.router.navigate(['/lojas/dashboard/perfil']);
  }

  formatarHora(data: string): string {
    if (!data) return '';
    return new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}
