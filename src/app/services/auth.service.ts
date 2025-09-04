import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Usuario {
    nome: string;
    sobrenome: string;
    email: string;
    senha: string;
    endereco: string;
    numero_endereco: string;  
  }

export interface LoginResponse {
  Mensagem: string;
  Resultado: Usuario[];
  token: string;
}

export interface CadastroResponse {
  Mensagem: string;
  Resultado: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/usuarios';
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verifica se há token salvo ao inicializar o serviço
    this.checkToken();
  }

  private checkToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // Aqui você poderia decodificar o JWT para obter os dados do usuário
      // Por simplicidade, vamos apenas marcar como logado
      this.currentUserSubject.next({ nome: '',
        sobrenome: '',
        email: '',
        senha: '',
        endereco: '',
        numero_endereco: '' });
    }
  }

  cadastrar(usuario: Usuario): Observable<CadastroResponse> {
    return this.http.post<CadastroResponse>(`${this.API_URL}/cadastrar`, usuario);
  }

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, { email, senha })
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            if (response.Resultado && response.Resultado.length > 0) {
              this.currentUserSubject.next(response.Resultado[0]);
            }
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Método para atualizar usuário (protegido)
  atualizarUsuario(usuario: Partial<Usuario>): Observable<any> {
    return this.http.put(`${this.API_URL}/`, usuario, {
      headers: this.getAuthHeaders()
    });
  }
}