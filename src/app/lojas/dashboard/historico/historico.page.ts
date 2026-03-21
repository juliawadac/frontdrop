import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DashboardService, Pedido, StatusPedido } from '../../../services/dashboard.service';
import { LojaService } from '../../../services/loja.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class HistoricoPage implements OnInit {

  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  filtroAtivo: StatusPedido | null = null;
  isLoading = true;
  nomeLoja = '';
  logoUrl  = '';

  constructor(
    private dashService: DashboardService,
    private lojaService: LojaService
  ) {}

  ngOnInit() {
    const loja = this.lojaService.currentLojaSubject.getValue();
    this.nomeLoja = loja?.nome ?? 'Minha Loja';
    this.logoUrl  = loja?.logo_url ?? '';
    this.carregarHistorico();
  }

  carregarHistorico() {
    this.isLoading = true;
    this.dashService.listarPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos.filter(p =>
          ['Entregue', 'Cancelado'].includes(p.status)
        );
        this.aplicarFiltro();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  filtrar(status: StatusPedido | null) {
    this.filtroAtivo = status;
    this.aplicarFiltro();
  }

  private aplicarFiltro() {
    this.pedidosFiltrados = this.filtroAtivo
      ? this.pedidos.filter(p => p.status === this.filtroAtivo)
      : [...this.pedidos];
  }

  formatarData(data: string): string {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  }
}
