import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface Loja {
  id?: number;
  nome: string;
  cnpj: string;
  email: string;
  senha?: string;
  categoria_id: number;        // 1=Comida, 2=Mercado, 3=Farmácia, 4=Construção
  categoria_nome?: string;
  localizacao: string;
  numero_endereco: string;
  bairro?: string;
  cidade?: string;
  tempo_de_espera?: number;
  logo_url?: string;
  banner_url?: string;
  latitude?: number;
  longitude?: number;
  ativo?: number;
  criado_em?: string;
}

export interface LojaLoginResponse {
  Mensagem: string;
  Resultado: Loja;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LojaService {

  private readonly API_URL   = 'http://localhost:3000/lojas';
  private readonly TOKEN_KEY = 'loja_token';
  private readonly LOJA_KEY  = 'currentLoja';

  public currentLojaSubject = new BehaviorSubject<Loja | null>(null);
  public currentLoja$ = this.currentLojaSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadLojaFromStorage();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private loadLojaFromStorage(): void {
    const loja = localStorage.getItem(this.LOJA_KEY);
    if (loja) {
      this.currentLojaSubject.next(JSON.parse(loja));
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLojaLogada(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.LOJA_KEY);
    this.currentLojaSubject.next(null);
  }

  cadastrar(loja: Loja): Observable<LojaLoginResponse> {
    return this.http.post<LojaLoginResponse>(`${this.API_URL}/cadastrar`, loja)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem(this.TOKEN_KEY, response.token);
            localStorage.setItem(this.LOJA_KEY, JSON.stringify(response.Resultado));
            this.currentLojaSubject.next(response.Resultado);
          }
        })
      );
  }

  login(email: string, senha: string): Observable<LojaLoginResponse> {
    return this.http.post<LojaLoginResponse>(`${this.API_URL}/login`, { email, senha })
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem(this.TOKEN_KEY, response.token);
            localStorage.setItem(this.LOJA_KEY, JSON.stringify(response.Resultado));
            this.currentLojaSubject.next(response.Resultado);
          }
        })
      );
  }

  listarLojas(): Observable<{ lojas: Loja[] }> {
    return this.http.get<{ lojas: Loja[] }>(this.API_URL);
  }

  getLojaAtual(): Observable<Loja> {
    return this.http.get<Loja>(`${this.API_URL}/me`, { headers: this.getAuthHeaders() });
  }
}