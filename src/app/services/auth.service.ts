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
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
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
    if (!token) return;

    this.http.get<Usuario>(`${this.API_URL}/me`, { headers: this.getAuthHeaders() })
      .subscribe({
        next: (usuario) => this.currentUserSubject.next(usuario),
        error: (err) => {
          console.error('Erro ao carregar usuário do token:', err);
          this.logout();
        }
      });
  }

  enviarCodigo(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/enviar-codigo`, { email });
  }

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, { email, senha })
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.currentUserSubject.next(response.Resultado);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  cadastrar(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.API_URL}/cadastrar`, usuario);
  }
}
