import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// ✅ INTERFACE ATUALIZADA AQUI
export interface Estabelecimento {
  id: number;
  nome: string;
  localizacao: string;
  tempo_de_espera: number | null;
  logo_url?: string;   // ✅ Adicionado
  banner_url?: string; // ✅ Adicionado
}

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
  categoria_id: number;
  estabelecimento_id?: number; // Boa prática ter aqui também
}

@Injectable({
  providedIn: 'root'
})
export class EstabelecimentoService {
  private apiUrl = 'http://localhost:3000'; // URL correta do seu backend
  
  private estabelecimentosSubject = new BehaviorSubject<Estabelecimento[]>([]);
  public estabelecimentos$ = this.estabelecimentosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.carregarEstabelecimentos();
  }

  // Buscar todos os estabelecimentos
  getEstabelecimentos(): Observable<Estabelecimento[]> {
    return this.http.get<Estabelecimento[]>(`${this.apiUrl}/estabelecimentos`).pipe(
      tap(estabelecimentos => {
        this.estabelecimentosSubject.next(estabelecimentos);
      })
    );
  }

  // Buscar estabelecimento por ID
  getEstabelecimentoById(id: number): Observable<Estabelecimento> {
    return this.http.get<Estabelecimento>(`${this.apiUrl}/estabelecimentos/${id}`);
  }

  // Buscar produtos por estabelecimento
  getProdutosPorEstabelecimento(estabelecimentoId: number): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/produtos/estabelecimento/${estabelecimentoId}`);
  }

  private carregarEstabelecimentos(): void {
    this.getEstabelecimentos().subscribe();
  }

  // Método para recarregar estabelecimentos
  recarregarEstabelecimentos(): void {
    this.carregarEstabelecimentos();
  }
}