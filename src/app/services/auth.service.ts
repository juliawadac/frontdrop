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

    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
      this.currentUserSubject.next(JSON.parse(usuarioSalvo));
    }

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

  cadastrar(usuario: any): Observable<any> {
    return this.http.post(`${this.API_URL}/cadastrar`, usuario);
  }

  atualizarUsuario(dados: any): Observable<any> {
    return this.http.put(`${this.API_URL}/`, dados, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => {
          const usuarioAtual = this.currentUserSubject.getValue();
          if (usuarioAtual) {
            const usuarioAtualizado = { 
              ...usuarioAtual, 
              ...dados
            };
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
            this.currentUserSubject.next(usuarioAtualizado);
          }
        })
      );
  }

  solicitarCodigoSenha(): Observable<any> {
    return this.http.post(`${this.API_URL}/senha/solicitar`, {}, { headers: this.getAuthHeaders() });
  }

  confirmarNovaSenha(codigo: string, novaSenha: string): Observable<any> {
    return this.http.put(`${this.API_URL}/senha/confirmar`, { codigo, novaSenha }, { headers: this.getAuthHeaders() });
  }

  listarEnderecos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/enderecos`, { headers: this.getAuthHeaders() });
  }

  cadastrarEndereco(dados: any): Observable<any> {
    return this.http.post(`${this.API_URL}/enderecos`, dados, { headers: this.getAuthHeaders() });
  }

  atualizarEndereco(id: number, dados: any): Observable<any> {
    return this.http.put(`${this.API_URL}/enderecos/${id}`, dados, { headers: this.getAuthHeaders() });
  }

  deletarEndereco(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/enderecos/${id}`, { headers: this.getAuthHeaders() });
  }

  listarPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/pedidos/usuario`, { headers: this.getAuthHeaders() });
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

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && token !== '';
  }
}