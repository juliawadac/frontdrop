import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LojaService } from './loja.service';

export interface Produto {
  id?: number;
  nome: string;
  preco: number;
  descricao?: string;
  quantidade: number;
  categoria_id: number;
  categoria_nome?: string;
  estabelecimento_id?: number;
}

export interface Pedido {
  id: number;
  numero_pedido: string;
  valor_total: number;
  cliente_nome: string;
  cliente_sobrenome: string;
  status: 'Pendente' | 'Preparo' | 'Entregando' | 'Entregue' | 'Cancelado';
  criado_em: string;
  itens: string;
}

export type StatusPedido = 'Pendente' | 'Preparo' | 'Entregando' | 'Entregue' | 'Cancelado';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private readonly BASE = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private lojaService: LojaService
  ) {}

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.lojaService.getToken()}`
    });
  }

  private get lojaId(): number {
    return this.lojaService.currentLojaSubject.getValue()?.id ?? 0;
  }

  // PRODUTOS
  listarProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.BASE}/produtos/estabelecimento/${this.lojaId}`);
  }

  cadastrarProduto(produto: Produto): Observable<any> {
    return this.http.post(`${this.BASE}/produtos`, produto, { headers: this.headers });
  }

  atualizarProduto(id: number, produto: Produto): Observable<any> {
    return this.http.put(`${this.BASE}/produtos/${id}`, produto, { headers: this.headers });
  }

  deletarProduto(id: number): Observable<any> {
    return this.http.delete(`${this.BASE}/produtos/${id}`, { headers: this.headers });
  }

  // PEDIDOS
  listarPedidos(status?: StatusPedido): Observable<Pedido[]> {
    const params = status ? `?status=${status}` : '';
    return this.http.get<Pedido[]>(
      `${this.BASE}/pedidos/loja/${this.lojaId}${params}`,
      { headers: this.headers }
    );
  }

  atualizarStatus(pedidoId: number, status: StatusPedido): Observable<any> {
    return this.http.patch(
      `${this.BASE}/pedidos/${pedidoId}/status`,
      { status },
      { headers: this.headers }
    );
  }

  // PERFIL
  atualizarPerfil(dados: { nome?: string; localizacao?: string; numero_endereco?: string; bairro?: string; cidade?: string }): Observable<any> {
    return this.http.put(
      `${this.BASE}/lojas/${this.lojaId}`,
      dados,
      { headers: this.headers }
    );
  }
}