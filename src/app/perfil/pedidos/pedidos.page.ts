import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: false,
})
export class PedidosPage implements OnInit {

  pedidos: any[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.carregarPedidos();
  }

  ionViewWillEnter() {
    this.carregarPedidos();
  }

  carregarPedidos() {
    this.isLoading = true;
    this.authService.listarPedidos().subscribe({
      next: (dados) => {
        this.pedidos = dados.map(pedido => ({
          ...pedido,
          listaItens: pedido.itens ? pedido.itens.split(' | ') : []
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.mostrarToast('Erro ao carregar seu histórico de pedidos.');
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Pendente': return 'status-pendente';
      case 'Preparo': return 'status-preparo';
      case 'Entregando': return 'status-entregando';
      case 'Entregue': return 'status-entregue';
      case 'Cancelado': return 'status-cancelado';
      default: return 'status-padrao';
    }
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      color: 'danger',
      position: 'bottom'
    });
    toast.present();
  }
}