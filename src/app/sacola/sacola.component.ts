import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { PagamentoService } from '../services/pagamento.service';
import { AuthService } from '../services/auth.service';

interface CartItem {
  name: string;
  store: string;
  price: number;
  image: string;
  quantity?: number;
  removing?: boolean;
  estabelecimentoId?: number;
}

@Component({
  selector: 'app-sacola',
  templateUrl: './sacola.component.html',
  styleUrls: ['./sacola.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class SacolaPage implements OnInit {
  cartItems: CartItem[] = [];
  private usuarioId: number | null = null;

  constructor(
    private pagamentoService: PagamentoService,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user && user.id) {
        this.usuarioId = user.id;
      } else {
        this.usuarioId = null;
      }
    });
  }

  ionViewWillEnter() {
    this.loadCartFromStorage();
    this.checkPaymentStatus();
  }

  private loadCartFromStorage() {
    const savedCart = localStorage.getItem('carrinho');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
    }
  }

  private saveCartToStorage() {
    localStorage.setItem('carrinho', JSON.stringify(this.cartItems));
  }

  get subtotal(): number {
    return this.cartItems.reduce((acc, item) => {
      const itemTotal = item.price * (item.quantity || 0);
      return acc + itemTotal;
    }, 0);
  }

  // ✅ 1. FUNÇÃO 'addItem' CORRIGIDA (para ser imutável)
  addItem(item: CartItem) {
    const existingItemIndex = this.cartItems.findIndex(
      cartItem => cartItem.name === item.name && cartItem.store === item.store
    );

    if (existingItemIndex !== -1) {
      // Cria um NOVO array usando .map
      this.cartItems = this.cartItems.map((cartItem, index) => {
        if (index === existingItemIndex) {
          // Retorna um NOVO objeto para o item atualizado
          return {
            ...cartItem,
            quantity: (cartItem.quantity || 0) + (item.quantity || 1)
          };
        }
        return cartItem; // Retorna os outros itens como estão
      });
    } else {
      // Cria um NOVO array usando spread operator (...)
      this.cartItems = [
        ...this.cartItems, 
        { ...item, quantity: item.quantity || 1 }
      ];
    }

    this.saveCartToStorage();
  }

  // ✅ 2. FUNÇÃO 'updateQuantity' CORRIGIDA (para ser imutável)
  updateQuantity(index: number, change: number) {
    const item = this.cartItems[index];
    if (!item) return; // Checagem de segurança

    const newQuantity = (item.quantity || 0) + change;

    if (newQuantity <= 0) {
      // Deixa a função removeItem (que também foi corrigida) fazer o trabalho
      this.removeItem(index);
    } else {
      // Cria um NOVO array usando .map
      this.cartItems = this.cartItems.map((cartItem, i) => {
        if (i === index) {
          // Retorna um NOVO objeto para o item atualizado
          return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
      });
      
      this.saveCartToStorage();
    }
  }

  // ✅ 3. FUNÇÃO 'removeItem' CORRIGIDA (para ser imutável)
  removeItem(index: number) {
    // Cria um NOVO array usando .filter
    this.cartItems = this.cartItems.filter((_, i) => i !== index);
    this.saveCartToStorage();
  }

  clearCart() {
    this.cartItems = [];
    localStorage.removeItem('carrinho');
  }

  async placeOrder() {
    if (this.cartItems.length === 0) {
      this.showAlert('Carrinho vazio!', 'Adicione itens antes de continuar.');
      return;
    }

    if (!this.usuarioId) {
      this.showAlert('Não autenticado', 'Você precisa fazer login para realizar um pedido.');
      return;
    }

    const primeiroId = this.cartItems[0].estabelecimentoId;
    if (!primeiroId) {
       this.showAlert('Erro no Pedido', 'Não foi possível identificar a loja. Tente adicionar os itens novamente.');
       return;
    }

    const todosDaMesmaLoja = this.cartItems.every(item => item.estabelecimentoId === primeiroId);
    if (!todosDaMesmaLoja) {
      this.showAlert('Múltiplas Lojas', 'Seu carrinho contém itens de lojas diferentes. Por favor, faça um pedido por loja.');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Abrindo pagamento...' });
    await loading.present();

    try {
      this.pagamentoService.criarSessaoCheckout(this.cartItems, this.usuarioId!, primeiroId)
        .subscribe({
          next: (session) => {
            loading.dismiss();
            this.pagamentoService.redirecionarParaCheckout(session.url);
          },
          error: (err) => {
            loading.dismiss();
            this.showAlert('Erro no Servidor', `Não foi possível iniciar o pagamento: ${err.message}`);
          }
        });
      
    } catch (error: any) {
      loading.dismiss();
      this.showAlert('Erro', error.message || 'Erro desconhecido ao tentar pagar');
    }
  }
  
  private checkPaymentStatus() {
    const params = this.route.snapshot.queryParamMap;
    const pagamentoStatus = params.get('pagamento');

    if (pagamentoStatus === 'sucesso') {
      this.clearCart(); 
      this.router.navigate(['/home'], { 
        replaceUrl: true, 
        state: { 
          showToast: true, 
          message: 'Pedido realizado com sucesso!', 
          color: 'success'
        }
      });
    } else if (pagamentoStatus === 'cancelado') {
      this.showToast('O pagamento foi cancelado.', 'warning');
      this.router.navigate([], { replaceUrl: true, queryParams: {} });
    }
  }

  private async showToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top',
      icon: color === 'success' ? 'checkmark-circle' : 'alert-circle'
    });
    toast.present();
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}