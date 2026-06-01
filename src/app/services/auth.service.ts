import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface Usuario {
  id?: number;
  nome: string;
  sobrenome: string;
  email: string;
  senha?: string;
  endereco?: string;
  numero_endereco?: string;
}

export interface LoginResponse {
  Mensagem: string;
  Resultado: Usuario;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/usuarios';

  public currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUsuarioFromToken();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private loadUsuarioFromToken(): void {
    const token = this.getToken();
    if (!token) {
      this.currentUserSubject.next(null);
      return;
    }

    // Carrega instantaneamente para não cair no F5
    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
      this.currentUserSubject.next(JSON.parse(usuarioSalvo));
    }

    // Atualiza em segundo plano
    this.http.get<Usuario>(`${this.API_URL}/me`, { headers: this.getAuthHeaders() })
      .subscribe({
        next: (usuario) => {
          localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
          this.currentUserSubject.next(usuario);
        },
        error: (err) => {
          console.error('Erro ao carregar usuário do token:', err);
          this.logout();
        }
      });
  }

  enviarCodigo(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/enviar-codigo`, { email });
  }

  // ✅ FUNÇÃO QUE TINHA SUMIDO: CADASTRAR
  cadastrar(usuario: any): Observable<any> {
    return this.http.post(`${this.API_URL}/cadastrar`, usuario);
  }

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, { email, senha })
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('usuarioLogado', JSON.stringify(response.Resultado));
            this.currentUserSubject.next(response.Resultado);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioLogado');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ FUNÇÃO QUE TINHA SUMIDO: ISLOGGEDIN (Usada pelo seu AuthGuard)
  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && token !== '';
  }
}