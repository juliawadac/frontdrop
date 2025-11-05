// src/app/services/pagamento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Declara a variável global do Stripe.js
declare var Stripe: any;

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {
  private apiUrl = 'http://localhost:3000/pedidos'; 
  
  // Chave PUBLICÁVEL (pk_test_...) - É seguro ficar no frontend
  private stripe = Stripe('pk_test_51SQ6jhDzToMjAy9JJXle5L4xbIJftD6ZqKKCOT0FcA6cO35QWe54mbnxuzxgqnUW0znJWXFDswx14fDJmmahiekn009Tjlw4iS');

  constructor(private http: HttpClient) { }

  /**
   * Chama o backend para criar a sessão de checkout no Stripe
   */
  criarSessaoCheckout(cartItems: any[], usuarioId: number, estabelecimentoId: number): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.apiUrl}/criar-checkout`, {
      cartItems,
      usuarioId,
      estabelecimentoId
    });
  }

  /**
   * Redireciona o usuário para a página de pagamento do Stripe
   */
  redirecionarParaCheckout(url: string) {
    window.location.href = url;
  }
}