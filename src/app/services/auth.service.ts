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
  // NOVOS CAMPOS DO BANCO DE DADOS INTEGRADOS:
  telefone?: string;
  cpf?: string;
  data_nascimento?: string;
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

    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
      this.currentUserSubject.next(JSON.parse(usuarioSalvo));
    }
  }

  enviarCodigo(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/enviar-codigo`, { email });
  }

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

  // ✅ NOVA FUNÇÃO: Atualiza os dados do usuário direto no MySQL via requisição PUT/HTTP
  atualizarPerfil(id: number, dados: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, dados, { headers: this.getAuthHeaders() });
  }

  // ✅ NOVA FUNÇÃO: Atualiza a sessão ativa na memória e o cache local para atualizar o cabeçalho
  atualizarSessaoLocal(usuarioAtualizado: Usuario): void {
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
    this.currentUserSubject.next(usuarioAtualizado);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('perfil_enderecos');
    localStorage.removeItem('perfil_cartoes');
    localStorage.removeItem('perfil_configuracoes');
    localStorage.removeItem('perfil_foto');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getUsuario(): Usuario | null {
    return this.currentUserSubject.value;
  }
}